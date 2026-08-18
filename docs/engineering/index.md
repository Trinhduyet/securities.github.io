# Core Securities Engineering

Engineering trong chứng khoán không bắt đầu bằng việc chia service. Nó bắt đầu bằng việc bảo vệ **business invariants trong điều kiện distributed failure**.

```text
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
```

## Hai tài liệu mental-model

- [Từ backend developer đến core securities engineer](./core-securities-engineering.md)
- [Reliability, ledger, idempotency và reconciliation](./reliability-and-ledgers.md)

## Production Track

Sau hai bài trên, đọc tiếp Bài 13–24 để đi vào implementation/operations:

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

Một architecture diagram chưa đủ. Thiết kế cần chỉ rõ:

- ownership của Order, Trade, Cash, Position, Obligation;
- transaction boundary;
- idempotency key/business identity;
- retry policy và unknown-outcome policy;
- replay/recovery source;
- reconciliation source và break handling;
- HA ownership/fencing;
- business metrics và audit trail;
- degraded mode/runbook khi market đang mở;
- capacity behavior trong burst và recovery.

## Cách tự kiểm tra

Nếu muốn biết mình mới “đọc hiểu” hay đã “thiết kế được”, dùng:

- [Competency Matrix](../resources/competency-matrix.md)
- [50 Failure Scenarios](../resources/failure-scenarios.md)
- [Review Checklist](../resources/checklist.md)
- [Project 05 — Production Game Day](../projects/project-05-brokerage-production-game-day.md)

Điểm cuối của lộ trình không phải biết nhiều pattern, mà là có thể nhìn một failure mode và trả lời ngay:

```text
Business identity nào?
State/invariant nào?
Transaction boundary ở đâu?
Unknown/duplicate/out-of-order xử lý thế nào?
Recovery source là gì?
Reconcile với external evidence nào?
Ai vận hành khi automated recovery không đủ?
```