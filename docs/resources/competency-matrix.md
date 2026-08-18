# Competency Matrix — Từ Finance-aware Backend đến Core Securities Engineer

Dùng matrix này để tự kiểm tra kiến thức. Đừng đánh dấu “biết” chỉ vì đã đọc thuật ngữ; mức cao yêu cầu bạn giải thích failure scenario và thiết kế recovery.

## Level 0 — Backend Fundamentals

Bạn cần vững:

```text
HTTP/API
SQL/transaction/isolation
concurrency
async programming
caching
messaging
observability
testing
security basics
```

Chưa cần microservices phức tạp.

## Level 1 — Economics & Finance Literacy

Bạn giải thích được:

- cung/cầu và price discovery;
- lãi suất, inflation, monetary/fiscal policy;
- time value of money;
- risk/return;
- equity/bond/fund/derivative khác nhau;
- financial statements/valuation cơ bản;
- portfolio diversification;
- fundamental vs technical analysis.

**Evidence:** có thể nối macro event → business/valuation impact → market behavior mà không biến correlation thành certainty.

## Level 2 — Securities Domain Literacy

Bạn phân biệt rõ:

```text
Account
Cash
Buying Power
Position
Sellable Qty
Order
Execution
Trade
Clearing
Settlement
Corporate Action
```

**Evidence:** tự vẽ end-to-end BUY/SELL lifecycle và giải thích mỗi state.

## Level 3 — Trading Core Engineer

Bạn thiết kế được:

- order state machine;
- reservation;
- partial fill;
- cancel/replace race;
- duplicate execution;
- unknown submit outcome;
- risk controls;
- trade booking.

**Evidence:** failure-injection tests không phá invariant.

## Level 4 — Market Connectivity Engineer

Bạn hiểu:

- FIX application/session distinction;
- sequence number;
- resend/gap fill;
- business dedup;
- persistent session store;
- active/standby/fencing;
- venue adapter/ACL;
- certification mindset.

**Evidence:** gateway restart/failover không double-send/double-book và có reconciliation.

## Level 5 — Post-Trade Engineer

Bạn giải thích/thiết kế:

```text
Trade Capture
Clearing
Netting
Obligation
Settlement
Cash/Securities Legs
VSDC/Depository boundary
Bank boundary
EOD
Reconciliation
```

**Evidence:** xử lý được settlement break bằng evidence + workflow, không sửa DB tùy ý.

## Level 6 — Financial Data Integrity

Bạn thiết kế được:

- append-only/controlled ledger history;
- idempotent posting;
- projections;
- reversal/correction;
- effective-dated rule;
- rebuild;
- cash/securities reconciliation.

**Evidence:** chọn một balance và trace ngược đến business source/external evidence.

## Level 7 — Distributed Reliability

Bạn xử lý:

```text
at-least-once delivery
outbox/inbox
out-of-order
schema evolution
replay
DLQ/parking lot
unknown outcome
idempotency
```

**Evidence:** kill process ở mọi boundary vẫn converge đúng sau recovery.

## Level 8 — Production/Operations

Bạn có thể:

- design HA/DR/BCP;
- define RTO/RPO;
- run failover;
- use fencing;
- design business SLO;
- write runbook;
- execute game day;
- perform postmortem;
- handle privileged repair safely.

**Evidence:** recovery kết thúc bằng reconciliation, không chỉ health check xanh.

## Level 9 — Securities Architecture Lead

Bạn đưa ra quyết định có trade-off về:

```text
Modular Monolith vs Microservices
Consistency boundary
Data ownership
CQRS
Event-driven integration
External adapters
Team/scale boundaries
Security zones
Capacity model
```

và có thể nói **tại sao không cần** một pattern khi nó không giải quyết failure mode nào.

## 8 Domain Matrix

| Domain | Business concepts cần chắc | Engineering concepts |
|---|---|---|
| Securities | order/trade/cash/position | OMS, reservation, trade booking |
| Derivatives | position/P&L/margin | realtime risk, liquidation |
| Bonds | coupon/yield/maturity | cashflow schedule, entitlement |
| Funds | NAV/subscription/redemption | cutoff, pricing, settlement |
| Realtime Analytics | tick/bar/indicator | stream ordering, stale/replay |
| Conditional Orders | trigger/order generation | atomic trigger, idempotency |
| Rewards | earn/redeem/expire | ledger, rule version |
| Workflow | task/approval/SLA | state machine, SoD, audit |

## Interview/Design Self-Test

Bạn nên trả lời được mà không cần tra ngay:

1. Timeout submit order có phải failed không?
2. Vì sao Order != Trade?
3. CumQty/LeavesQty update khi partial fill + cancel race thế nào?
4. MsgSeqNum khác ExecId ra sao?
5. Process FIX restart cần restore gì?
6. Clearing khác Settlement?
7. Balance khác Buying Power?
8. Position khác Sellable Quantity?
9. Duplicate TradeBooked chặn ở đâu?
10. Crash sau DB commit trước publish xử lý thế nào?
11. Reconciliation key là gì?
12. DR site lên xanh nhưng external/internal lệch thì có mở trading không?
13. Khi nào modular monolith tốt hơn microservices?
14. Market data stale ảnh hưởng conditional order/risk thế nào?
15. Manual cash adjustment phải audit gì?

Nếu câu trả lời luôn quay về **business identity → state → invariant → durable transaction → recovery → reconciliation**, bạn đã hình thành đúng mental model.