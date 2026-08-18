# Bài 23 — Production Runbook & Incident Operations: khi market đang mở, ai làm gì?

Một architecture chỉ hoàn chỉnh khi đội vận hành biết phải làm gì lúc dependency chậm, gateway disconnect, sequence gap, market data stale, reconciliation break hoặc ledger violation xảy ra **trong phiên giao dịch**.

## 1. Incident không bắt đầu từ stack trace

Triệu chứng business có thể là:

```text
order không ACK
cancel bị treo
portfolio chậm cập nhật
conditional order không trigger
market data đứng giá
trade external có nhưng internal thiếu
cash/position lệch
```

Runbook phải bắt đầu từ business symptom rồi drill-down technical layer.

## 2. Severity

Ví dụ framework:

```text
SEV-1: correctness/money/trading continuity risk đang xảy ra
SEV-2: partial degradation/redundancy lost, workaround tồn tại
SEV-3: noncritical degradation/capacity warning
```

Severity phải dựa customer/business impact, không dựa service name.

## 3. Golden incident questions

1. Market/venue đang live không?
2. New orders có đang đi ra ngoài không?
3. Executions có đang vào đầy đủ theo sequence không?
4. Có unknown outcomes không?
5. Có risk/ledger invariant nào bị phá không?
6. Có cần stop new order nhưng vẫn allow cancel không?
7. External authoritative source đang nói gì?
8. Khi recover, replay/reconciliation nào bắt buộc?

## 4. Runbook: gateway disconnect

```text
Detect disconnect
→ mark route NOT READY
→ stop/redirect new submissions theo policy
→ retain durable outbound state
→ reconnect
→ recover sequence/session
→ query/reconcile unknown orders
→ verify working orders
→ enable route
```

Không tự mở routing ngay khi socket connected.

## 5. Runbook: market data stale

```text
stale threshold breached
→ mark feed/book STALE
→ notify risk/conditional/UI consumers
→ fallback/stop-trigger theo policy
→ resync snapshot+incremental
→ verify sequence
→ mark LIVE
```

Không để conditional order trigger từ giá cũ mà không có policy.

## 6. Runbook: duplicate execution storm

Expected control:

```text
business uniqueness/inbox blocks double effect
```

Operations kiểm tra:

- dedup rate tăng bao nhiêu;
- sequence recovery đang diễn ra?
- có ExecId collision thật hay replay bình thường?
- trade count/position có invariant violation không?

Không disable dedup để “cho message chạy qua”.

## 7. Runbook: reconciliation break critical

```text
External Trade exists
Internal Trade missing
```

Các bước:

1. freeze automatic repair nếu nguyên nhân chưa rõ;
2. retrieve raw external evidence;
3. verify mapping/identity;
4. check inbox/message store/DB transaction;
5. controlled replay hoặc adjustment;
6. recompare;
7. document root cause;
8. add permanent detector/test.

## 8. Kill switch

Cần predefined scope:

```text
account
symbol
market
product
new-buy only
all-new-orders
conditional orders
```

Kill switch phải authorization mạnh, audit, propagation status và cách rollback rõ.

## 9. Manual data fix

`UPDATE production_table ...` trực tiếp là last-resort cực nguy hiểm.

Tốt hơn có controlled operation:

```text
Repair Command
Reason
Evidence
Maker/Checker
Expected invariant
Dry-run diff
Execute
Audit
Reconcile
```

## 10. Communication

Incident commander cần một timeline duy nhất:

```text
T0 detected
T1 route disabled
T2 venue confirmed connectivity issue
T3 session recovered
T4 reconciliation completed
T5 trading reopened
```

Technical teams, operations, risk, customer support cần cùng business status, không mỗi nơi một interpretation.

## 11. Pre-market checklist

```text
reference/security master current
trading calendar/session correct
certificates not near expiry
FIX/venue session ready
market data live
risk limits loaded
ledger/database healthy
outbox/inbox backlog normal
DR standby healthy
critical reconciliations previous day closed
```

## 12. Post-market checklist

```text
no critical unknown orders
trade recon complete
session/message archives complete
EOD dependency graph progressed
cash/securities reconciliation
open breaks assigned
manual adjustments reviewed
next-day reference/calendar ready
```

## 13. Game Day

Thực hành định kỳ:

- kill one gateway node;
- drop packet/connection;
- inject sequence gap;
- duplicate 10,000 execution messages;
- delay market feed;
- make DB replica unavailable;
- fill outbox backlog;
- fail settlement external dependency.

Game day phải có invariant assertions, không chỉ “service recovered”.

## 14. Postmortem

Không dừng ở “human error”. Tìm missing control:

```text
specification gap
missing validation
missing observability
unsafe default
manual step
insufficient fencing
no idempotency
no reconciliation
bad rollout
capacity assumption
```

Action item phải giảm xác suất/làm nhỏ blast radius/làm nhanh detection hoặc recovery.

## Definition of Done

- [ ] Critical symptoms có runbook.
- [ ] Degraded mode/kill switch explicit.
- [ ] Manual repairs được kiểm soát/audit.
- [ ] Pre/post-market checklist tồn tại.
- [ ] Game day cover session, data, DB, backlog.
- [ ] Incident timeline dùng business status.
- [ ] Recovery luôn kết thúc bằng reconciliation khi cần.
- [ ] Postmortem tạo permanent control/test.

## Bài tập

Viết runbook cho sự cố 09:15: gateway mất kết nối 40 giây, 300 order đang `PENDING_NEW`, venue sau đó báo 120 order đã accepted. Trình bày cách stop routing, recover sequence, resolve 180/120 unknown outcomes, reconcile working orders và reopen market route.