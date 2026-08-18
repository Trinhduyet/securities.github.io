---
title: "Bài 24 — Architecture Boundaries, DDD, Modular Monolith & Microservices"
description: "Consistency boundaries, bounded contexts, modular monolith vs microservices, data ownership and architecture decision-making."
---

# Bài 24 — Architecture Boundaries: sau khi hiểu nghiệp vụ, mới quyết định chia service

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Chọn architecture từ invariant, ownership và failure boundary</span></div>

Sau 23 bài, đây mới là lúc hỏi: **nên chia service thế nào?** Nếu hỏi sớm hơn, bạn dễ tạo distributed system phức tạp nhưng sai consistency.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- bounded context vs entity/service;
- consistency boundary;
- modular monolith trade-offs;
- microservices trade-offs;
- data ownership;
- event-driven integration vs synchronous transaction;
- ADR và architecture evolution.
</div>

## 1. Bắt đầu từ Invariant

Đừng bắt đầu bằng danh từ:

```text
OrderService
CashService
PositionService
RiskService
TradeService
```

Hỏi:

```text
state nào phải atomic?
entity nào cùng lifecycle?
ai là authority?
scale profile có thực sự khác?
team ownership ra sao?
failure isolation có giá trị gì?
```

## 2. Consistency Boundary

Pre-trade BUY có thể cần:

```text
check buying power
+ reserve cash
+ create order
```

Nếu tách services sớm, invariant local thành distributed saga.

## 3. Bounded Context

Bounded context là boundary của model/language/authority, không đồng nghĩa một microservice bắt buộc.

Ví dụ:

```text
Trading Core
Post Trade
Reference Data
Market Data
Risk
Reconciliation
```

## 4. Modular Monolith

Ưu điểm:

```text
local transactions
simpler deployment
lower ops complexity
easier refactor boundaries early
```

Nhược điểm:

```text
shared runtime blast radius
careless module coupling
independent scaling harder
team ownership can blur
```

## 5. Microservices

Ưu điểm khi boundary đúng:

```text
independent deploy/scale
failure isolation
team autonomy
technology specialization
```

Chi phí:

```text
network failure
message delivery
observability
schema/versioning
sagas/reconciliation
ops overhead
```

## 6. Data Ownership

Một fact nên có clear authority.

```text
Order state → OMS/Trading
Instrument rules → Security Master
Cash ledger → Ledger authority
Venue session → Gateway
Settlement result → Post Trade external evidence
```

## 7. Shared Database

Shared DB không luôn xấu; uncontrolled cross-module writes mới nguy hiểm.

Modular monolith có thể shared physical DB nhưng logical ownership/schema boundaries strict.

## 8. Database per Service

Không phải mục tiêu tự thân. Nếu business transaction bắt buộc atomic nhưng bạn tách DB chỉ vì pattern, complexity tăng mạnh.

## 9. Sync vs Async Integration

### Synchronous
Phù hợp khi caller cần immediate decision và dependency nằm trên critical transaction path.

### Async
Phù hợp fan-out, eventual integration, decoupling, replay.

Không “event-driven mọi thứ”.

## 10. CQRS

CQRS hữu ích khi read/write models có nhu cầu rất khác, nhưng không bắt buộc mọi domain.

## 11. Event Sourcing

Ledger/audit history không tự động đồng nghĩa full Event Sourcing.

Chọn khi benefits justify modeling/operational cost.

## 12. Redis/Kafka/SQL

Technology follows workload:

```text
SQL → transactional authoritative state
Kafka/log → durable fan-out/replay stream
Redis → cache/hot ephemeral state when safe
Analytical store → history/aggregates
```

Đừng biến Redis thành money source of truth chỉ vì nhanh.

## 13. Failure Boundaries

Tách component khi independent failure/recovery thật sự có giá trị.

Exchange gateway là candidate tốt vì protocol/network/session profile khác OMS core.

## 14. Scale Boundaries

Market data có throughput profile khác workflow approval. Đó là scale signal thực.

## 15. Team Boundaries

Conway's Law có tác động, nhưng team map cũng nên reflect domain ownership chứ không ép domain theo org chart tạm thời.

## 16. ADR

Architecture Decision Record nên ghi:

```text
Context
Decision
Alternatives
Trade-offs
Consequences
Revisit triggers
```

## 17. Evolution Strategy

Một path hợp lý:

```text
well-modularized monolith
→ measure coupling/scale/team constraints
→ extract boundary có evidence
```

không phải universal rule nhưng thường ít rủi ro hơn premature microservices.

## 18. Review Questions

```text
Invariant ở đâu?
Transaction boundary ở đâu?
Source of truth ai?
Timeout semantics?
Duplicate handling?
Recovery?
Reconciliation?
Ownership/fencing?
SLO?
```

## 19. Common mistakes

- service per entity;
- microservices trước domain model;
- shared events không version;
- dual write;
- distributed transaction không cần thiết;
- Kafka làm database;
- CQRS/Event Sourcing theo trend;
- diagram có nhiều box nhưng không có invariant.

<div class="key-takeaway"><strong>Takeaway</strong>Architecture tốt không phải nhiều service nhất. Nó là boundary giúp **bảo vệ invariant, làm failure recoverable và ownership rõ ràng** với complexity nhỏ nhất cần thiết.</div>

## Checklist

- [ ] Bounded contexts rõ.
- [ ] Consistency boundaries rõ.
- [ ] Data authority rõ.
- [ ] Sync/async intentional.
- [ ] Distributed failure accounted.
- [ ] Tech choices workload-driven.
- [ ] ADR/revisit triggers.

## Bài tập cuối track

1. Vẽ brokerage context map.
2. Chọn modular monolith hay microservices cho OMS + cash reservation và viết ADR.
3. Xác định 3 boundaries đáng extract đầu tiên và evidence cần có.
4. Review lại toàn bộ 24 bài bằng checklist: `Invariant → Failure → Recovery → Reconciliation → Architecture`.

## Tiếp theo

Hoàn thành [8 Core Domains](../../domains/), [Engineering](../../engineering/) và [Projects](../../projects/) để biến kiến thức thành design/implementation evidence.