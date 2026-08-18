# Domain 03 — Core giao dịch trái phiếu

Bond core xoay quanh **cash-flow schedule, yield, accrued interest, settlement và lifecycle tới maturity**.

## Bond master

```text
Issuer
BondId / ISIN-like identifier
Currency
FaceValue
IssueDate
MaturityDate
CouponType
CouponRate
CouponFrequency
DayCountConvention
BusinessCalendar
RedemptionRule
```

Không đủ nếu chỉ lưu `couponRate` và `maturityDate`.

## Cash-flow schedule

```text
Bond
  ↓
Schedule Generator
  ├── Coupon #1
  ├── Coupon #2
  ├── ...
  └── Final Coupon + Principal
```

Schedule phải version/audit được nếu terms thay đổi hoặc instrument có special clauses.

## Price và Yield

Bond price là present value của expected cash flows theo discount/yield assumptions.

Quan hệ cơ bản:

```text
Yield ↑ → Price ↓
Yield ↓ → Price ↑
```

## Clean vs Dirty Price

```text
Dirty Price = Clean Price + Accrued Interest
```

Nếu UI, API và settlement dùng các price convention khác nhau mà không encode rõ, bug rất khó phát hiện.

## Accrued Interest

Cần:

- last coupon date;
- next coupon date;
- day-count convention;
- settlement date;
- coupon amount.

Đừng tự viết `days / 365` cho mọi bond.

## Duration và Interest-rate Risk

Duration/modified duration giúp ước lượng sensitivity của bond price trước biến động yield.

Risk engine có thể cần:

```text
DV01 / PV01
Duration
Convexity
Yield Curve Scenarios
Issuer Exposure
Credit Rating / Internal Rating
```

## Lifecycle

```text
Issue
 ↓
Trading / Transfer
 ↓
Coupon Entitlement
 ↓
Coupon Payment
 ↓
...
 ↓
Maturity / Redemption
```

Ngoài ra có thể có early redemption, put/call, default/restructuring tùy product.

## Settlement

Bond market có thể có settlement convention khác equity; luôn dựa trên quy chế/product/venue hiện hành.

Data model phải tách:

```text
TradeDate
SettlementDate
RecordDate
PaymentDate
MaturityDate
```

## Ledger

Các effect:

```text
Purchase Principal
Accrued Interest
Coupon Receivable
Coupon Cash
Redemption Principal
Fee / Tax
```

## Invariants

- cash-flow schedule deterministic với terms/version;
- accrued interest theo đúng convention;
- entitlement không double-pay;
- maturity/redemption idempotent;
- holding reconcile được với depository/custodian.

## Câu hỏi design

Nếu bond terms được sửa sau khi hệ thống đã tạo 5 năm cash-flow schedule, bạn overwrite schedule hay version schedule? Trong hệ thống tài chính có audit, câu trả lời thường nghiêng về version/effective-dated data.