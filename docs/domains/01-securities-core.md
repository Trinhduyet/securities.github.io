# Domain 01 — Core giao dịch chứng khoán

Core chứng khoán là nơi giữ các invariant quan trọng nhất của brokerage business.

## Bounded capabilities

```text
Customer / Account
Cash & Buying Power
Securities & Sellable Quantity
Order Management
Trade Booking
Reservation
Fees / Tax
Portfolio / Position
Post-trade handoff
Ledger / Accounting integration
```

## Luồng BUY

```text
SubmitOrder
  ↓
Validate Account / Session / Instrument
  ↓
Check BuyingPower
  ↓
Reserve Cash
  ↓
Create Order
  ↓
Route to Venue
  ↓
Execution(s)
  ↓
Consume Reservation
  ↓
Book Trade
  ↓
Pending Settlement
  ↓
Settled Position / Cash
```

## Luồng SELL

Khác BUY ở resource reservation:

```text
SellQty <= SellableQty
      ↓
Reserve Securities
```

Không được dựa chỉ vào `TotalPosition`, vì một phần có thể pending, reserved hoặc không sellable theo rule.

## Cash Model

Không dùng duy nhất:

```text
Account.Balance
```

Tối thiểu phải phân biệt mental state:

```text
Available
Reserved
PendingReceivable
PendingPayable
Settled
```

Tên field production có thể khác, nhưng ý nghĩa phải rõ và reconcile được.

## Order aggregate

Order sở hữu state machine và quantity invariant; execution là entity/event riêng.

```text
Order
├── identities
├── side/type/price/qty
├── cumQty/leavesQty
├── venue state
└── lifecycle timestamps
```

## Trade booking

Một execution hợp lệ tạo business effect **đúng một lần**.

Dedup key có thể dựa vào venue + ExecID hoặc identity theo contract của venue.

```text
UNIQUE(Venue, ExecId)
```

Không nên dùng timestamp làm dedup identity.

## Fees và Tax

Fee engine phải versioned theo:

- instrument/market;
- customer/account segment;
- effective date;
- campaign/contract;
- buy/sell side nếu rule khác nhau.

Không hard-code percentage rải rác trong order code.

## Corporate actions

Position core phải nhận effects từ:

```text
Cash Dividend
Stock Dividend
Rights
Split
Bonus
Transfer
```

và giữ audit trail.

## Invariants

```text
RequiredCash <= BuyingPower
SellQty <= SellableQty
CumQty <= OrderQty
Reserved resource không âm
Execution business effect exactly once
Position/Cash reconcile được từ ledger/source events
```

## Kiến trúc

Một modular monolith với transaction boundary rõ thường tốt hơn microservices chia quá sớm.

Tách service khi có lý do thật:

- scale profile khác;
- team ownership khác;
- fault isolation;
- independent release;
- external gateway boundary.

## Failure modes

- double-submit;
- timeout unknown state;
- partial fill + cancel race;
- duplicate execution;
- stale buying power;
- reservation leak;
- EOD reconciliation mismatch.

## Metrics

```text
order_accept_latency
venue_ack_latency
reject_rate
unknown_order_count
reservation_age
trade_dedup_count
reconciliation_break_count
```

## Câu hỏi review kiến trúc

1. Source of truth của order state là gì?
2. Nếu venue event đến duplicate/out-of-order thì sao?
3. Cash reservation và order commit có atomic không?
4. Nếu trade book thành công nhưng downstream portfolio update fail thì recover thế nào?
5. Có rebuild position từ ledger/event history được không?