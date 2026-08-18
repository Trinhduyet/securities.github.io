# 8 Core Domains của một công ty chứng khoán

Tám domain dưới đây không phải tám CRUD module. Mỗi domain có **business lifecycle, invariant, ledger/state, risk và failure mode** riêng.

| Domain | Trọng tâm nghiệp vụ | Trọng tâm engineering |
|---|---|---|
| Securities Core | Order, execution, trade, cash/position | OMS, reservation, idempotency |
| Derivatives | Position, P&L, margin | real-time risk, liquidation |
| Bonds | Coupon, yield, maturity | cash-flow schedule, entitlement |
| Funds | Subscription/redemption, NAV | cut-off, pricing date, settlement |
| Realtime Analytics | Tick, candle, indicator | streaming, ordering, watermark |
| Conditional Orders | trigger → generated order | atomic trigger, dedup, race |
| Rewards | earn/redeem/expire | ledger, rules, campaign version |
| Enterprise Workflow | approval/SLA/audit | state machine, escalation, SoD |

## Cách học

Với mỗi domain, luôn hỏi theo cùng một khung:

1. Source of truth là gì?
2. Entity nào có lifecycle dài?
3. Invariant nào không được vi phạm?
4. External dependency nào có thể trả về outcome không xác định?
5. Reconciliation với nguồn bên ngoài thực hiện thế nào?
6. Audit cần tái dựng được điều gì?

Đi tiếp từ [Core giao dịch chứng khoán](./01-securities-core.md).
