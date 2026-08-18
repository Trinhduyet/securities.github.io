---
title: "Case Study — VPS SmartOne / HomeTrade"
description: "Dùng các chức năng công khai của VPS SmartOne/HomeTrade để học order lifecycle, buying power, securities availability, pending settlement và account operations."
---

# Case Study — VPS SmartOne / HomeTrade

<div class="lesson-meta">
  <span><strong>Nền tảng</strong> VPS SmartOne / HomeTrade</span>
  <span><strong>Góc nhìn</strong> Order State + Buying Power + Pending Assets</span>
  <span><strong>Nguyên tắc</strong> Public capability → reference backend model</span>
</div>

Tài liệu công khai của VPS rất hữu ích cho người học core chứng khoán vì nó mô tả trực tiếp những khái niệm người dùng thường thấy: **đặt/hủy lệnh, trạng thái lệnh, sức mua, chứng khoán khả dụng, tiền chờ nhận về, chứng khoán chờ nhận/gửi đi, danh mục và chuyển tiền**.

## 1. Feature inventory công khai

```text
Trading
├── Đặt lệnh Mua
├── Đặt lệnh Bán
├── Hủy lệnh
├── HSX / HNX / UPCOM
├── Đặt lệnh từ bảng giá
└── Đặt lệnh từ danh mục

Market Data
├── Bảng giá trực tuyến
├── Giá tham chiếu / trần / sàn
├── 3 giá mua/bán tốt nhất
├── High / Low / Average
└── Thông tin trong phiên

Account / Portfolio
├── Sức mua
├── Tiền có thể giao dịch
├── Tiền chờ nhận về
├── CK khả dụng
├── CK chờ nhận về
├── CK chờ gửi đi
├── Giá trị thị trường
└── Lãi/Lỗ dự kiến

Cash Operations
├── Chuyển giữa các loại tài khoản
├── Chuyển ngân hàng đăng ký trước
├── Chuyển nội bộ VPS
└── Chuyển ngân hàng cùng tên
```

## 2. Đặt BUY — UI cho thấy ngay buying power

Hướng dẫn public của VPS cho biết khi nhập mã chứng khoán, UI có thể hiển thị thông tin thị trường và tổng số tiền có thể giao dịch.

Ví dụ:

```text
FPT
Best Ask = 120.000
Buying Power = 250.000.000
```

User nhập:

```text
BUY 1.000 FPT @ 120.000
```

Reference calculation:

```text
Order Value = 120.000.000
+ Fee/Risk Buffer
-----------------
Required Buying Power
```

Nếu hợp lệ, backend không chỉ "trừ balance" mà thường cần giữ resource:

```text
Before
AvailableBuyingPower = 250m

Reserve ≈ 120m + buffer

After
AvailableBuyingPower ≈ 130m - buffer
ReservedBuyingPower  ≈ 120m + buffer
```

## 3. Đặt SELL — “CK khả dụng” quan trọng hơn Total Position

VPS mô tả UI khi bán có thể hiển thị số dư chứng khoán khả dụng.

Đây là một business concept quan trọng:

```text
Total Position
≠ Securities Available to Sell
```

Ví dụ:

```text
Total FPT          = 2.000
Reserved for Sell  =   500
Blocked            =   100
--------------------------
Available to Sell  = 1.400
```

Nếu user đặt:

```text
SELL 1.500
```

thì phải reject dù `1.500 <= Total 2.000`.

Invariant đúng là:

```text
SellQty <= SellableQty
```

## 4. Trạng thái lệnh — business lifecycle không phải boolean

Tài liệu VPS giúp nhìn rõ lifecycle theo wording người dùng. Mental model có thể là:

```text
Broker nhận request
       ↓
Internal processing
       ↓
Market working
       ↓
Partial Fill
       ↓
Full Fill / Cancel / Reject
```

Không nên model:

```csharp
bool IsSuccess;
```

Một reference state machine có thể là:

```text
CREATED
→ VALIDATING
→ PENDING_NEW
→ NEW
→ PARTIALLY_FILLED
→ FILLED
```

Nhánh khác:

```text
VALIDATING → REJECTED
NEW → PENDING_CANCEL → CANCELLED
PARTIALLY_FILLED → PENDING_CANCEL → CANCELLED_WITH_FILL
```

Tên production có thể khác; business distinction mới là thứ quan trọng.

## 5. Partial Fill — một order có nhiều executions

Ví dụ:

```text
OrderQty = 1.000 FPT
```

Market trả:

```text
E01 = 300 @ 119.900
E02 = 200 @ 120.000
```

OMS:

```text
CumQty    = 500
LeavesQty = 500
Status    = PARTIALLY_FILLED
```

Không được tạo hai `Order` mới chỉ vì có hai fills.

Mental model:

```text
Order 1
├── Execution E01
└── Execution E02
```

## 6. Tiền chờ nhận về — ví dụ settlement state

Tài liệu public VPS có phần danh mục tiền đầu tư hiển thị cả tiền hiện tại có thể giao dịch và tiền chờ nhận về sau khi bán chứng khoán.

Đây là bằng chứng UI rất tốt để học:

```text
Cash Available
≠ Pending Sale Receivable
```

Ví dụ:

```text
Settled/Available Cash   50m
Pending Sale Receivable 120m
```

Tổng economic assets có thể lớn hơn 50m, nhưng 120m còn phụ thuộc settlement lifecycle.

Reference model:

```text
CashAccount
├── SettledCash
├── AvailableCash
├── ReservedCash
├── PendingReceivable
└── PendingPayable
```

## 7. Chứng khoán chờ nhận về / gửi đi

VPS public guide mô tả cả chứng khoán chờ nhận và gửi đi trong các ngày gần đây.

Ví dụ BUY đã khớp:

```text
Trade FPT +500
```

nhưng trước settlement:

```text
PendingReceiveQty = 500
```

Sau settlement:

```text
PendingReceiveQty -= 500
SettledQty        += 500
```

SELL tương tự có thể tạo pending delivery effect.

Bài học:

```text
Trade Booking
→ Pending Settlement
→ Settlement Result
→ Position State Transition
```

## 8. Danh mục và P&L dự kiến

VPS public guide mô tả giá trị thị trường và lãi/lỗ dự kiến.

Ví dụ:

```text
Holding = 1.000 FPT
Cost = 100.000
Current Price = 110.000
```

Reference unrealized P&L:

```text
Market Value = 110m
Cost Value   = 100m
Unrealized   = +10m
```

Nhưng UI P&L phụ thuộc:

```text
price source
cost basis
fees/taxes
corporate-action adjustment
rounding
```

Do đó backend nên có versioned/deterministic calculation rules.

## 9. Chuyển tiền — workflow có risk và idempotency

VPS công khai nhiều loại chuyển tiền: giữa các tài khoản hỗ trợ giao dịch, tới ngân hàng đăng ký, nội bộ và ngân hàng cùng tên.

Reference flow:

```text
User Submit Transfer
      ↓
Authenticate / Authorize
      ↓
Validate Beneficiary
      ↓
Check Available Cash
      ↓
Reserve / Debit
      ↓
Payment/Bank Integration
      ↓
Result
      ↓
Ledger + History
```

### Timeout case

```text
Broker gửi bank transfer
→ bank thực hiện thành công
→ response timeout
```

Không được:

```text
timeout = failed
→ retry tạo transfer thứ hai
```

Cần business identity + status inquiry/reconciliation.

## 10. Multi-account / sub-account mental model

Public guide nhắc các loại account/sub-account trong một số cash transfer và buying-power contexts.

Reference model:

```text
Customer
  └── BrokerageAccount
       ├── SubAccount A
       │    ├── Cash
       │    └── Positions
       └── SubAccount B
            ├── Credit / Margin rules
            ├── Cash
            └── Positions
```

Không nên suy luận rằng internal VPS schema đúng như vậy; đây là reference model để giải thích vì sao một customer có thể thấy nhiều account contexts.

## 11. Bảng giá và Đặt lệnh trên cùng màn hình

Đây là UX phổ biến nhưng backend là hai workload rất khác:

```text
Market Data
- read-heavy
- fan-out
- sequence-sensitive
- high throughput

Trading
- write-heavy theo command
- authorization/risk
- strong business invariants
- audit/recovery
```

Đừng vì UI đặt cạnh nhau mà gộp MarketData + OMS thành cùng consistency model.

## 12. Suggested reference API

```http
GET  /market/quotes/{symbol}
GET  /accounts/{id}/buying-power
GET  /accounts/{id}/positions
GET  /accounts/{id}/cash

POST /orders
POST /orders/{id}/cancel
GET  /orders

POST /cash-transfers
GET  /cash-transfers/{id}
```

Đây là reference design, không phải API công khai của VPS.

## 13. Example DB / projections

```text
orders
executions
trades
cash_reservations
security_reservations
cash_ledger
position_ledger
cash_projection
position_projection
settlement_receivables
settlement_deliverables
transfer_requests
```

## 14. Failure scenarios

1. Hai browser tab submit cùng một BUY.
2. Buying power check cùng lúc hai order và cả hai cùng pass.
3. SELL reservation bị leak sau order reject.
4. Partial fill tới đúng lúc cancel.
5. Duplicate execution cộng vị thế hai lần.
6. Pending receivable chuyển sang settled hai lần.
7. Transfer sang ngân hàng timeout sau khi bank đã nhận.
8. P&L dùng market price đã stale.
9. Position projection lệch ledger.
10. Market UI vẫn xanh nhưng trading gateway disconnected.

## 15. Những gì VPS SmartOne giúp ta học

```text
Sức mua
→ derived risk/cash state

CK khả dụng
→ sellable != total position

Tiền chờ về
→ settlement receivable

CK chờ nhận/gửi
→ pending securities settlement

Trạng thái lệnh
→ explicit order state machine

Danh mục / P&L
→ projections

Chuyển tiền
→ external payment workflow + reconciliation
```

## 16. Nguồn chính thức

- https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide

## Bài tập

Thiết kế transaction boundary cho hai request chạy đồng thời:

```text
Order A requires 150m
Order B requires 150m
Buying Power hiện tại = 200m
```

Chứng minh vì sao cả hai không được cùng reserve thành công.