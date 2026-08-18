# Bài 18 — Ledger, Accounting & Projections: đừng xây financial core quanh một field Balance

Trong hệ thống tài chính, một con số hiện tại chưa đủ. Bạn cần trả lời:

> Tại sao balance/position lại có giá trị này, business event nào tạo ra nó, nếu projection hỏng có dựng lại được không, và external statement có reconcile được không?

Đó là lý do phải phân biệt **ledger/history** với **projection/current state**.

## 1. Sai lầm phổ biến

```text
Account
- Balance
- UpdatedAt
```

Mỗi workflow tự:

```sql
UPDATE accounts SET balance = balance + @delta
```

Sau vài tháng, không ai trả lời chắc được delta nào đến từ trade, fee, settlement, reversal hay manual fix.

## 2. Business entries

Mental model:

```text
Business Transaction
        ↓
Ledger Entries
        ↓
Projection
        ↓
Available Cash / Settled Cash / Position / P&L
```

Ví dụ cash effects:

```text
Deposit
Order Reservation
Reservation Release
Trade Payable
Trade Receivable
Fee
Tax
Settlement
Dividend
Withdrawal
Adjustment/Reversal
```

## 3. Ledger identity

Một entry cần trace được:

```text
EntryId
TransactionId
AccountId
LedgerAccount / Bucket
Amount or Quantity
Currency / Instrument
Direction
BusinessDate
ValueDate
SourceType
SourceId
RuleVersion
CreatedAt
ReversalOf nếu có
```

Tên/model production tùy accounting design, nhưng **source identity + immutable audit** là điểm cốt lõi.

## 4. Single-entry vs double-entry

Không phải mọi subsystem buộc phải full general-ledger, nhưng với money/accounting core, double-entry giúp encode invariant:

```text
sum(debits) = sum(credits)
```

Ví dụ reservation có thể là reclassification giữa bucket `Available` và `Reserved`, thay vì làm tổng tài sản biến mất.

## 5. Cash buckets

Một model brokerage có thể phân biệt:

```text
Available
Reserved
Pending Receivable
Pending Payable
Settled
Blocked
```

Bucket names tùy firm, nhưng semantics phải rõ. Không cộng/trừ một `Balance` rồi suy luận ngược.

## 6. Securities ledger

Tương tự cho quantity:

```text
Settled Position
Pending Buy
Pending Sell
Reserved for Sell Order
Blocked/Pledged
Corporate Action Receivable
```

`TotalPosition`, `SellableQty`, `AvailableToPledge` là projection/rule output khác nhau.

## 7. Projection

Projection phục vụ query nhanh:

```text
Ledger Entries
    ↓
Position Projector
Cash Projector
PnL Projector
Portfolio Projector
    ↓
Read Models
```

Nếu projection corrupt, hệ thống tốt có cách rebuild từ source history hoặc ít nhất reconcile/repair có kiểm soát.

## 8. Idempotent posting

Nếu `TradeId=T100` được deliver hai lần:

```text
PostingKey = TradeBooked:T100
```

Lần hai phải trở thành no-op/conflict có kiểm soát, không tạo thêm entries.

Constraint business key thường mạnh hơn check bằng timestamp.

## 9. Reversal, không xóa lịch sử

Sai:

```sql
DELETE FROM ledger_entries WHERE entry_id = ...
```

hoặc sửa amount của entry cũ để “cho đúng”.

Tốt hơn:

```text
Original Entry
     ↓
Reversal Entry references original
     ↓
Corrected Entry
```

Audit nhìn thấy toàn bộ chuỗi.

## 10. Effective-dated rule

Fee, tax, interest, margin rate, corporate-action ratio có thể thay đổi.

Posting cần lưu rule/version đủ để reproduce:

```text
Source event + RuleVersion + Inputs
→ deterministic calculated entries
```

## 11. Transaction boundary

Nếu trade booking và ledger posting cùng bảo vệ một invariant critical, cân nhắc cùng local transaction hoặc mô hình ownership khác bảo đảm consistency.

Nếu tách async:

```text
Trade DB committed
→ event
→ Ledger posts later
```

thì phải chấp nhận/thiết kế trạng thái tạm thời, idempotency, lag SLO và reconciliation. Không gọi đó là “eventual consistency” rồi bỏ qua nghĩa vụ vận hành.

## 12. Snapshots

Với history lớn, snapshot có thể tăng tốc rebuild:

```text
Snapshot at sequence N
+ entries N+1..
→ current projection
```

Snapshot là optimization, không nên trở thành nguồn history duy nhất nếu audit/rebuild cần entries trước đó.

## 13. Reconciliation

```text
Internal Cash Ledger     ↔ Bank/Settlement statement
Internal Securities      ↔ Depository/Custodian
Internal Trade Entries   ↔ Trade evidence
Internal Fees/Taxes      ↔ Accounting/reporting controls
```

Reconciliation break phải tạo workflow, không sửa balance trực tiếp.

## 14. Ledger invariants

Ví dụ:

```text
No duplicate PostingKey
No impossible negative bucket ngoài policy
Balanced transaction nếu dùng double-entry
Every adjustment has reason + actor/source
Every projection version traceable to source sequence
```

## 15. Observability

```text
posting latency
posting duplicate count
unbalanced transactions
projection lag
rebuild duration
reconciliation breaks
manual adjustments
reversals/corrections
negative-bucket violations
```

## Failure lab

- duplicate `TradeBooked`;
- crash giữa các entries của cùng transaction;
- projection consumer đi chậm 30 phút;
- manual correction nhập sai;
- historical fee rule bị overwrite;
- bank statement có payment mà internal ledger thiếu.

Mỗi case phải có control/recovery.

## Definition of Done

- [ ] History/business entries tách current projection.
- [ ] Posting có stable idempotency key.
- [ ] Adjustment dùng reversal/correction có audit.
- [ ] Rule version lưu đủ để reproduce.
- [ ] Ledger transaction atomic theo invariant.
- [ ] Projection có lag/rebuild strategy.
- [ ] Reconciliation với external evidence.
- [ ] Manual adjustment có maker/checker/audit khi policy yêu cầu.

## Bài tập

Thiết kế cash + securities ledger cho một BUY order: reserve 100m, partial fill 40m, cancel remainder, settle trade và thu fee. Viết các entries/projections sao cho ở mỗi bước bạn giải thích được `Available`, `Reserved`, `PendingPayable`, `SettledPosition`.