# Từ “backend developer biết finance” đến “engineer hiểu core securities”

Một backend developer có thể biết REST, SQL, Kafka, Redis, Docker và Kubernetes nhưng vẫn chưa đủ để thiết kế trading core. Khoảng cách nằm ở **business invariants + market lifecycle + failure semantics**.

## Level 1 — CRUD Backend

Bạn nghĩ theo:

```text
Controller
Service
Repository
Database
```

Hữu ích, nhưng chưa đủ.

## Level 2 — Finance-aware Backend

Bạn hiểu:

```text
Account
Portfolio
Order
Trade
PnL
NAV
Bond
Margin
```

Nhưng vẫn có thể thiết kế sai nếu chưa hiểu lifecycle.

## Level 3 — Core Securities Engineer

Bạn bắt đầu hỏi:

```text
Source of Truth là gì?
Invariant nào không được phá?
State transition nào hợp lệ?
Timeout nghĩa là gì?
Duplicate/out-of-order xử lý ra sao?
Có rebuild/reconcile được không?
External venue/depository khác internal state thế nào?
```

## 1. Học State Machine trước Microservices

Order, conditional order, settlement, workflow đều là state machine.

Ví dụ order:

```text
NEW → PARTIALLY_FILLED → FILLED
  ↘ PENDING_CANCEL → CANCELLED
```

Architecture phải bảo vệ transition, không chỉ route request.

## 2. Học Ledger trước “Balance Service”

```text
Transactions / Entries
        ↓
Projection
        ↓
Balance / Position / PnL
```

Ledger/history cho phép audit, replay và reconciliation tốt hơn overwrite state đơn thuần.

Không có nghĩa mọi hệ thống phải full Event Sourcing; chỉ cần phân biệt **history of business effects** với **current projection**.

## 3. Học Unknown Outcome

Trong monolith local transaction:

```text
Exception → rollback
```

Trong distributed trading:

```text
Timeout → UNKNOWN
```

Provider/venue có thể đã commit.

Đây là lý do cần:

- idempotency;
- stable identifiers;
- status query/recovery;
- reconciliation.

## 4. At-least-once Delivery vs Exactly-once Business Effect

Hệ thống message thường delivery at-least-once.

Mục tiêu thực tế:

```text
Event may arrive many times
        ↓
Business effect applied once
```

Ví dụ duplicate `ExecutionReport` không được double position.

## 5. Consistency Boundary

Không chia service theo danh từ tùy tiện.

Hỏi:

> Những state nào cần thay đổi atomically để giữ invariant?

Ví dụ `Order + CashReservation` có thể cần cùng transactional boundary ở một thiết kế.

Tách thành `OrderService` và `CashService` quá sớm khiến invariant thành distributed saga không cần thiết.

## 6. External Adapter / Anti-Corruption Layer

Core không nên biết tag FIX hay file format VSDC.

```text
Domain
  ↓
Port / Interface
  ↓
Venue Adapter
  ↓
FIX / Proprietary Protocol
```

Adapter dịch external semantics sang internal canonical model.

## 7. Reconciliation là Architecture Feature

Không coi reconciliation là script cuối ngày do Operations tự xử.

```text
Internal State
     ↕ compare
External Authoritative State
     ↓
Break Detection
     ↓
Auto Repair / Manual Workflow
```

Thiết kế từ đầu:

- reconciliation key;
- tolerance;
- break classification;
- rerun/replay;
- ownership/escalation.

## 8. Time là Domain

Trading có:

```text
Market Session
Trade Date
Business Date
Settlement Date
Record Date
Payment Date
Expiry
Cut-off
```

Không dùng `DateTime.Now` khắp code.

Cần timezone, holiday calendar, effective date và testable clock.

## 9. Data Versioning

Finance có rất nhiều config thay đổi theo thời gian:

```text
Fee schedule
Tax rule
Margin parameter
Instrument terms
Trading rule
Calendar
NAV
Corporate action
```

Nếu overwrite config cũ, historical calculation không reproduce được.

## 10. Reliability Patterns cần biết

```text
Idempotency Key
Inbox / Dedup
Transactional Outbox
Optimistic Concurrency
Pessimistic Locking khi phù hợp
Retry + Backoff + Jitter
Circuit Breaker
Dead-letter / Parking Lot
Replay
Snapshot
Reconciliation
```

Không dùng pattern theo checklist; mỗi pattern phải gắn failure mode cụ thể.

## 11. Observability theo Business State

Không chỉ CPU/RAM/HTTP 500.

```text
orders_stuck_pending_new
orders_unknown
unmatched_execs
reservation_leaks
settlement_breaks
fix_sequence_gap
stale_market_feed
margin_breach_without_action
workflow_sla_breach
```

Business metric thường phát hiện lỗi nhanh hơn infrastructure metric.

## 12. Lộ trình năng lực

```text
Economics
→ Finance
→ Securities Products
→ Market Microstructure
→ Trading Lifecycle
→ FIX / Exchange Connectivity
→ Clearing / Settlement
→ Ledger / Reconciliation
→ 8 Domain Systems
→ Reliability / HA / DR
→ Architecture Trade-offs
```

## Definition of Done cho một Core Securities Engineer

Bạn có thể nhận một câu như:

> “Xây chức năng đặt lệnh và xử lý khớp”

và tự phân rã thành:

- business states;
- invariant;
- data model;
- external protocol;
- race conditions;
- failure/recovery;
- reconciliation;
- observability;
- audit/security.

Đó là khác biệt giữa biết framework và hiểu hệ thống tài chính.