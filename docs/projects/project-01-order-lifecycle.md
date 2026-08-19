# Project 01 — Xây mô phỏng Order Lifecycle

Mục tiêu project không phải build matching engine cấp exchange. Mục tiêu là chứng minh bạn hiểu **order state, reservation, partial fill, cancel race, duplicate execution và unknown outcome**.

## Bài toán

Xây service mô phỏng broker OMS cho equity.

API tối thiểu:

```text
POST /orders
POST /orders/{id}/cancel
GET  /orders/{id}
POST /simulator/executions
POST /simulator/rejects
```

## Domain Model

```text
TradingAccount
CashBalance
CashReservation
Order
Execution
Trade
```

Order:

```text
OrderId
ClientOrderId
AccountId
Symbol
Side
Price
OrderQty
CumQty
LeavesQty
Status
Version
```

Execution:

```text
ExecId
OrderId
LastQty
LastPx
ExecutedAt
```

## Invariants bắt buộc

```text
RequiredCash <= AvailableBuyingPower
OrderQty = CumQty + LeavesQty + CancelledQty   (working orders; CancelledQty=0 nếu chưa cancel)
CumQty <= OrderQty
Reservation không âm
ExecId không apply business effect hai lần
Cancelled order không nhận new fill trừ race event đã hợp lệ theo simulator sequence
```

Sau cancel terminal: `LeavesQty = 0`; `CumQty + CancelledQty = OrderQty` — **không** dùng `CumQty + LeavesQty = OrderQty` cho mọi state.

## Scenario 1 — Happy path

```text
Available Cash = 500m
BUY 1,000 @ 100,000
→ reserve ~100m + fee buffer
→ NEW
→ FILLED 1,000
→ trade booked
→ reservation consumed/released
```

Viết assertion cho từng state.

## Scenario 2 — Partial Fill

```text
BUY 10,000
fill 2,000
fill 3,000
```

Expected:

```text
CumQty    = 5,000
LeavesQty = 5,000
Status    = PARTIALLY_FILLED
```

Reservation còn lại phải tương ứng phần working order theo policy bạn định nghĩa.

## Scenario 3 — Cancel Race

Sequence:

```text
NEW
→ PARTIAL_FILL 2,000
→ CANCEL_REQUESTED
→ FILL 3,000
→ CANCEL_ACCEPTED
```

Final:

```text
CumQty = 5,000
Cancelled remainder = 5,000
```

Chứng minh state transition của bạn không mất fill đến trong lúc cancel pending.

## Scenario 4 — Duplicate Execution

Gửi cùng:

```text
ExecId = EX-001
Qty    = 1,000
```

hai lần.

Expected:

```text
Trade count = 1
Position effect = +1,000, không phải +2,000
```

## Scenario 5 — Unknown Submit

Simulator nhận order nhưng cố tình timeout trước ACK.

OMS phải chuyển sang trạng thái/flow cho phép recovery, thay vì tự coi `REJECTED`.

Thiết kế một endpoint simulator để query bằng `ClientOrderId` và resolve outcome.

## Persistence

Bắt đầu bằng relational DB.

Transaction boundary đề xuất:

```text
Order mutation
+ Reservation mutation
+ Inbox/Dedup record khi xử lý execution
+ Outbox event nếu cần
```

trong cùng local transaction khi chúng cùng bảo vệ invariant.

## Không được làm

- không dùng `Task.Delay` để giả vờ consistency;
- không retry submit mà thiếu idempotency;
- không lưu duy nhất `Balance`;
- không merge Order và Trade thành một table chỉ vì project nhỏ;
- không bỏ race-condition tests.

## Definition of Done

- [ ] State machine có test.
- [ ] Partial fill có test.
- [ ] Cancel race có test.
- [ ] Duplicate execution có test.
- [ ] Unknown submit có recovery flow.
- [ ] Reservation không leak sau terminal state.
- [ ] Có audit/event log đủ debug lifecycle.
- [ ] Metrics cho stuck/unknown orders.

## Câu hỏi review

1. Nếu process crash sau khi DB commit nhưng trước publish `TradeBooked`, downstream biết bằng cách nào?
2. Nếu duplicate event tới sau restart thì dedup state còn không?
3. Nếu order fill đủ 100% đúng lúc cancel accepted tới, event ordering được xử lý thế nào?
4. Source of truth của order quantities là gì?