# Bài 04 — Thị trường chứng khoán: từ instrument đến market infrastructure

“Chứng khoán” không chỉ là cổ phiếu. Một brokerage platform thường phải xử lý nhiều instrument có lifecycle rất khác nhau.

## 1. Các nhóm instrument

### Equity
Quyền sở hữu một phần doanh nghiệp.

### Bond
Khoản nợ với cash-flow/coupon/maturity.

### Derivative
Giá trị phụ thuộc underlying; trọng tâm là position, margin và mark-to-market.

### Fund Certificate
Đại diện phần sở hữu trong quỹ; thường có subscription/redemption và NAV.

### Structured / Warrant products
Có payoff và risk phức tạp hơn.

## 2. Primary vs Secondary Market

```text
Primary Market
Issuer → Investor
Capital formation

Secondary Market
Investor ↔ Investor
Liquidity + Price Discovery
```

Một engineer cần tách issuance workflow khỏi exchange trading workflow.

## 3. Thành phần thị trường

Ở mức mental model:

```text
Investor
   ↓
Broker / Securities Company
   ↓
Exchange / Trading System
   ↓
Clearing & Depository Infrastructure
   ↓
Settlement Bank / Custodian
```

Các vai trò khác gồm regulator, issuer, fund manager, custodian, market maker, data vendor.

## 4. Account Model

Một account không chỉ có `Balance`.

```text
Customer
└── TradingAccount
    ├── Cash
    │   ├── Available
    │   ├── Reserved
    │   ├── Pending
    │   └── Settled
    ├── Securities
    │   ├── Total
    │   ├── Sellable
    │   ├── PendingReceive
    │   └── ReservedSell
    ├── Orders
    ├── Trades
    └── Positions
```

## 5. Order khác Trade

Đây là distinction bắt buộc.

```text
Order: ý định mua/bán
Execution: một phần order được khớp
Trade: giao dịch đã hình thành từ execution
Settlement: chuyển giao money + securities sau trade
```

Một order có thể:

```text
BUY 10,000 FPT
  ├── Fill 2,000
  ├── Fill 3,000
  └── Fill 5,000
```

## 6. Market Data

Các lớp dữ liệu:

- reference/security master;
- quote/bid/ask;
- order book depth;
- trade/tick;
- OHLCV;
- corporate action;
- index;
- market status/session.

Không nên dùng cùng một data model cho tất cả.

## 7. Corporate Actions

Sở hữu chứng khoán tạo quyền/nghĩa vụ theo record date và rule cụ thể:

```text
Dividend
Stock Dividend
Rights Issue
Bonus Share
Split / Reverse Split
Tender / Redemption
```

Corporate action ảnh hưởng position, cost basis, cash, entitlement và reporting.

## 8. Pre-trade / Trade / Post-trade

```text
PRE-TRADE
Account → Buying Power → Risk → Reservation

TRADE
Order → Exchange → Matching → Execution

POST-TRADE
Trade Booking → Clearing → Settlement → Reconciliation
```

Nếu kiến trúc chỉ có `OrderService`, `PortfolioService`, `PaymentService`, rất có thể domain boundary chưa phản ánh market lifecycle.

## 9. Invariants cơ bản

```text
SellQty <= SellableQty
RequiredCash <= BuyingPower
ExecutionQty <= LeavesQty
CumQty + LeavesQty = OrderQty
Trade không được book hai lần
Ledger phải cân bằng theo rule kế toán nội bộ
```

## Checklist

- Primary vs secondary market?
- Equity/bond/derivative/fund khác nhau về lifecycle nào?
- Order, execution, trade, settlement khác nhau ra sao?
- Available, reserved, pending, settled dùng khi nào?
- Corporate action ảnh hưởng hệ thống nào?

## Bài tập

Vẽ lifecycle “Khách nộp 500 triệu → đặt BUY → partial fill → cancel phần còn lại → T+ settlement → nhận dividend sau record date”. Liệt kê state thay đổi ở cash, order, trade, position và ledger.