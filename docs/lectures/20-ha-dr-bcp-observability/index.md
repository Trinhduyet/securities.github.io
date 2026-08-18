---
title: "Bài 20 — HA, DR, BCP & Observability"
description: "Availability, RTO/RPO, stateful failover, fencing, disaster recovery, business readiness và observability."
---

# Bài 20 — HA / DR / BCP: hai pod có phải high availability?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Thiết kế recovery theo business state, không chỉ infrastructure uptime</span></div>

Một app có 10 replicas vẫn có thể không HA nếu tất cả dùng một database single point hoặc hai replicas cùng tranh ownership stateful session.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- HA vs DR vs BCP;
- RTO/RPO;
- stateful failover/fencing;
- business readiness;
- reconciliation after failover;
- business observability.
</div>

## 1. HA

Mục tiêu giảm downtime trong expected failures.

```text
process crash
node failure
network path failure
component failover
```

## 2. DR

Disaster Recovery xử lý site/region/data-center-scale failures và severe corruption scenarios.

## 3. BCP

Business Continuity bao gồm people/process/manual procedures, không chỉ technology.

## 4. RTO

```text
RTO = target time to restore service
```

## 5. RPO

```text
RPO = acceptable data loss window
```

Financial core có thể cần rất thấp nhưng exact requirement tùy system/risk classification.

## 6. Stateless vs Stateful Failover

Stateless API dễ scale/failover hơn FIX session, ledger writer hoặc partition owner.

Stateful components cần ownership transfer.

## 7. Fencing

Leader election nói ai mới là leader; fencing ngăn old leader tiếp tục mutate external/internal state.

## 8. Data Replication

Replication strategy phải xem:

```text
consistency
lag
failover mode
write ownership
corruption propagation
backup independence
```

## 9. Recovery != Green Dashboard

Sau failover:

```text
service up
≠ session recovered
≠ pending orders resolved
≠ ledger correct
≠ external state reconciled
```

## 10. Recovery Procedure

```text
establish ownership
restore durable state
recover sessions
replay pending messages
resolve unknown outcomes
reconcile external
enable business traffic
```

## 11. DR Drill

Runbook không test = hypothesis.

Game day cần objective evidence, timelines, gaps và follow-up actions.

## 12. Observability Layers

```text
Infrastructure
Application
Protocol
Business State
Financial Integrity
```

## 13. Business Metrics

```text
unknown orders
pending settlements
open recon breaks
FIX gaps
market data stale symbols
ledger imbalance
margin calc lag
outbox lag
```

## 14. SLO

Latency SLO nên theo percentile và business path, ví dụ submit-to-ack, không chỉ HTTP handler time.

## 15. Common mistakes

- replicas = HA;
- DR backup chưa restore test;
- failover không fencing;
- app up thì mở traffic ngay;
- monitor CPU nhưng không monitor unknown orders;
- no reconciliation after DR.

<div class="key-takeaway"><strong>Takeaway</strong>Recovery thành công khi **business state hội tụ đúng**, không phải khi Kubernetes pod xanh.</div>

## Checklist

- [ ] RTO/RPO.
- [ ] Stateful ownership/fencing.
- [ ] Restore tested.
- [ ] Recovery procedure.
- [ ] Reconciliation after failover.
- [ ] Business observability.

## Bài tập

1. Thiết kế DR cho OMS + FIX Gateway.
2. Fail primary DB and document recovery.
3. Build business readiness checklist.
4. Run game-day scenario split brain.

## Đọc tiếp

[Bài 21 — Security, Compliance & Audit](../21-security-compliance-audit/).