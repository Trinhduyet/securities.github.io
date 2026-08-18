# Bài 16 — Trade Capture & Booking: từ Execution sang business transaction

Một `ExecutionReport` báo fill chưa tự động đồng nghĩa mọi downstream state đã đúng. Broker cần một lớp **trade capture / trade booking** biến execution hợp lệ từ venue thành business transaction bền vững, có identity, fee/tax effect, position/cash effect và post-trade handoff.

## 1. Order, Execution và Trade

```text
Order
  ├── Execution #1
  ├── Execution #2
  └── Execution #3

Execution accepted
      ↓
Trade Booking
      ↓
Internal Trade
```

Một order có thể sinh nhiều executions/trades. Không update một dòng order rồi coi đó là toàn bộ trade history.

## 2. Execution identity

Một inbound fill cần stable identity theo venue contract:

```text
Venue
ExecId / TradeId
VenueOrderId
Symbol/Instrument
Side
LastQty
LastPx
TradeTime
BusinessDate
```

Business constraint điển hình:

```text
UNIQUE(Venue, ExecId)
```

hoặc key khác theo specification. Mục tiêu là duplicate/replay không double-book.

## 3. Booking transaction

Một local transaction hợp lý có thể bao gồm:

```text
insert inbox/dedup marker
insert execution/trade
update order CumQty/LeavesQty
consume reservation
write ledger/business entries
insert outbox events
```

khi các mutation này cùng bảo vệ một invariant và cùng database boundary.

## 4. Crash matrix

Hãy phân tích từng điểm:

```text
A. receive execution
B. insert trade
C. update order
D. write ledger
E. commit DB
F. publish TradeBooked
```

### Crash trước E

Local transaction rollback → inbound message phải có khả năng redeliver/recover.

### Crash sau E trước F

Nếu publish trực tiếp, downstream có thể không bao giờ biết trade. Transactional outbox xử lý lỗ hổng này.

### Duplicate sau restart

Inbox/business uniqueness bảo đảm trade effect không chạy lần hai.

## 5. Position effect

BUY fill:

```text
Pending/Trade Position +Qty
Cash obligation         -Amount
```

SELL fill:

```text
Pending sell/position effect -Qty
Cash receivable               +Amount
```

Tên state cụ thể phụ thuộc accounting/settlement model; điều quan trọng là phân biệt **trade-date effect** và **settled effect**.

## 6. Fee & Tax

Fee/tax engine phải reproducible:

```text
TradeId
RuleVersion
EffectiveDate
InputAmount/Qty
CalculatedFee
CalculatedTax
Currency
Reason/Category
```

Nếu rule thay đổi sau này, trade lịch sử vẫn giải thích được.

## 7. Average Price và P&L

Đừng để mỗi consumer tự tính average cost khác nhau. Xác định rõ source/algorithm cho:

```text
Average Cost
Realized P&L
Unrealized P&L
Position Lots nếu cần
Corporate-action adjustments
```

Trading P&L, accounting P&L và tax cost basis có thể khác semantics; document rõ thay vì gọi chung `AvgPrice`.

## 8. Bust / Correction / Amendment

Production market có thể có correction/bust/adjustment flow tùy venue. Không xóa trade cũ rồi insert lại silently.

Mental model:

```text
Original Trade
    ↓
Correction / Reversal reference
    ↓
Adjustment entries
    ↓
Recalculate projections
    ↓
Reconcile
```

History phải giữ được cả original và correction evidence.

## 9. Trade date vs settlement date

Trade booking tạo nghĩa vụ từ ngày giao dịch; settlement diễn ra theo cycle/rule của instrument/market.

```text
TradeDate
  ↓
Trade booked
  ↓
Clearing obligation
  ↓
SettlementDate
  ↓
Cash/Securities finality
```

Không dùng `tradeDate + 2 calendar days` generic; settlement calendar là domain data.

## 10. Downstream events

Trade booked có thể fan-out tới:

```text
Post-trade
Ledger/Accounting
Portfolio
Risk
Customer Notification
Rewards
Reporting
Analytics
```

Event contract nên stable và chứa business identity, không ép downstream parse raw FIX.

## 11. Reconciliation

```text
Venue Executions
      ↕
Internal Trades
```

So theo stable identity + quantity/price/business date. Nếu venue có trade mà internal không có, đó là break severity cao vì position/cash có thể sai.

## 12. Observability

```text
execution receive lag
booking latency
booking failures
inbox duplicate hits
trade correction count
outbox backlog
venue-vs-internal trade breaks
unbooked execution age
```

## Failure lab

1. Duplicate cùng `ExecId` 10 lần.
2. Crash sau DB commit trước publish.
3. Out-of-order fills.
4. Fill làm CumQty vượt OrderQty do upstream bug.
5. Fee service unavailable nếu fee tính ngoài boundary.
6. Trade correction sau EOD.

Với case 4, core phải **reject/quarantine invariant violation** thay vì ép số cho khớp.

## Definition of Done

- [ ] Execution identity/dedup rõ.
- [ ] Trade là entity/business transaction riêng order.
- [ ] Booking transaction bảo vệ order + trade + resource effect.
- [ ] Outbox đóng dual-write hole.
- [ ] Fee/tax có rule version.
- [ ] Correction/reversal không xóa lịch sử.
- [ ] Trade-date và settled state được tách.
- [ ] Reconciliation venue ↔ internal trades.

## Bài tập

Mô phỏng một BUY order nhận 3 partial fills, trong đó fill thứ hai bị redeliver 5 lần và process crash sau commit của fill thứ ba. Chứng minh final CumQty, trade count, reservation, position và downstream `TradeBooked` đều đúng.