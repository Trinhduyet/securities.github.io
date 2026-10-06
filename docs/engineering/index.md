# Core Securities Engineering

Engineering trong chứng khoán không bắt đầu bằng việc chia service. Nó bắt đầu bằng việc biết **system boundary nào đang bảo vệ business fact nào**.

Nếu chưa rõ OMS, Gateway, Market Data, Post-trade và VSDC nằm ở đâu, đọc trước:

→ **[System Map — Brokerage Platform Architecture](../resources/system-map.html)**

## Business domain và engineering concern là hai taxonomy khác nhau

~~~text
BUSINESS
Securities / Derivatives / Bonds / Funds
Realtime / Conditional Orders / Rewards / Workflow

ENGINEERING
Risk
→ OMS
→ FIX Session
→ Exchange Gateway
→ Trade Capture
→ Clearing / Settlement
→ Ledger / Reconciliation
→ Event Delivery
→ HA / DR
→ Performance / Operations
~~~

Không map 1:1 giữa domain và microservice.

## Mental model production

~~~text
Correct Domain Model
        ↓
Explicit State Machine
        ↓
Transactional Invariants
        ↓
Durable Identity + Idempotency
        ↓
Recovery / Replay
        ↓
Reconciliation
        ↓
HA / DR / Operations
~~~

## Mental-model docs

- [Từ backend developer đến core securities engineer](./core-securities-engineering.html)
- [Reliability, ledger, idempotency và reconciliation](./reliability-and-ledgers.html)

## Production Track

1. [OMS Internals & State Machine](../lectures/13-oms-internals-state-machine/)
2. [FIX 4.4 Session Recovery](../lectures/14-fix44-session-recovery/)
3. [Exchange Gateway & KRX Connectivity](../lectures/15-exchange-gateway-krx-connectivity/)
4. [Trade Capture & Booking](../lectures/16-trade-capture-booking/)
5. [Clearing, Netting & Settlement](../lectures/17-clearing-netting-settlement/)
6. [Ledger, Accounting & Projections](../lectures/18-ledger-accounting-projections/)
7. [Event Delivery Semantics](../lectures/19-event-driven-delivery-semantics/)
8. [HA / DR / BCP / Observability](../lectures/20-ha-dr-bcp-observability/)
9. [Security / Compliance / Audit](../lectures/21-security-compliance-audit/)
10. [Performance / Capacity / Latency](../lectures/22-performance-capacity-latency/)
11. [Production Runbook & Incidents](../lectures/23-production-runbook-incident-operations/)
12. [Architecture Boundaries & DDD](../lectures/24-architecture-boundaries-ddd-modular-monolith-microservices/)

## Definition of Done cho một thiết kế core

Thiết kế cần chỉ rõ:

- authority của Order, Trade, Cash, Position, Obligation;
- transaction boundary;
- valid state transitions;
- idempotency/business identity;
- timeout và unknown-outcome policy;
- retry/backpressure policy;
- replay/recovery source;
- reconciliation source và break handling;
- HA ownership/fencing;
- business metrics và audit trail;
- degraded mode;
- capacity behavior trong burst và recovery.

## Tự kiểm tra

- [Competency Matrix](../resources/competency-matrix.html)
- [50 Failure Scenarios](../resources/failure-scenarios.html)
- [Review Checklist](../resources/checklist.html)
- [Project 05 — Production Game Day](../projects/project-05-brokerage-production-game-day.html)
