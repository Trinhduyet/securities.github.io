# Domain 04 — Core chứng chỉ quỹ

Fund core thường không giống exchange order matching. Với open-ended fund, trọng tâm là **subscription, redemption, switching, cut-off, NAV và unit allocation**.

## Core concepts

```text
Fund
Share Class / Fund Certificate
NAV
NAV per Unit
Subscription
Redemption
Switching
Cut-off Time
Valuation Date
Settlement Date
Fee
Unit Holding
```

## Subscription

Ví dụ:

```text
Customer invests = 100,000,000
Subscription fee = 1%
Net amount       = 99,000,000
NAV/unit         = 20,000
Allocated units  = 4,950
```

Thực tế rule rounding/fee/NAV date phụ thuộc fund terms.

## Cut-off là domain rule

```text
Cut-off = 14:30

Request 13:00 → valuation cycle D
Request 15:00 → valuation cycle tiếp theo
```

Điểm cần hiểu:

```text
ReceivedAt ≠ AcceptedAt ≠ ValuationDate ≠ SettlementDate
```

Nếu chỉ có `CreatedAt`, model thiếu nghiệp vụ.

## Redemption

```text
Redemption Request
   ↓
Validate Sellable Units
   ↓
Reserve Units
   ↓
Determine Applicable NAV
   ↓
Calculate Gross Amount
   ↓
Fee / Tax
   ↓
Settlement Receivable
   ↓
Cash Paid
```

## Switching

Switch có thể được model như coordinated redemption + subscription nhưng phải tuân product rules và atomic/business consistency mong muốn.

## NAV

NAV pipeline thường cần:

```text
Portfolio Assets
+ Receivables
- Liabilities
= Net Assets
        ↓
/ Outstanding Units
        ↓
NAV per Unit
```

NAV là data có valuation timestamp/version; correction sau công bố cần audit.

## Order state

Khác exchange trading:

```text
RECEIVED
→ VALIDATED
→ ACCEPTED
→ WAITING_NAV
→ PRICED
→ ALLOCATED / REDEEMED
→ SETTLED
```

## Invariants

- redemption qty <= eligible units;
- một request chỉ được priced một lần cho một valuation version;
- NAV correction không silently overwrite historical result;
- cut-off dùng business calendar/timezone chính xác;
- allocation + cash settlement reconcile được với transfer agent/fund administrator.

## Architecture

Fund core có throughput thấp hơn market data/order gateway nhưng nhiều workflow dài ngày. Ưu tiên:

```text
Auditability
Effective-dated configuration
Scheduler/calendar correctness
Idempotent batch processing
Reconciliation
```

thay vì tối ưu microsecond latency.

## Câu hỏi design

Nếu NAV của ngày D được sửa sau khi 10,000 subscription đã được priced, hệ thống cần những object/version nào để biết request nào bị ảnh hưởng và tính adjustment ra sao?