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

## Hai bài chính

- [Từ backend developer đến core securities engineer](./core-securities-engineering.md)
- [Reliability, ledger, idempotency và reconciliation](./reliability-and-ledgers.md)

## Definition of Done cho một thiết kế core

Một architecture diagram chưa đủ. Thiết kế cần chỉ rõ:

- ownership của Order, Trade, Cash, Position, Obligation;
- transaction boundary;
- idempotency key/business identity;
- retry policy và unknown-outcome policy;
- replay/recovery source;
- reconciliation source và break handling;
- HA ownership/fencing;
- business metrics và audit trail.
