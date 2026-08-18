---
title: "Bài 22 — Performance, Capacity & Latency"
description: "Latency percentiles, throughput, capacity planning, overload protection, queues, contention và recovery capacity."
---

# Bài 22 — Performance & Capacity: nhanh trong benchmark có đủ cho ngày thị trường biến động mạnh?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Thiết kế performance theo end-to-end business path và overload</span></div>

Trading system thường hỏng không phải ở average load mà ở **burst + dependency slowdown + retry storm**.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- throughput vs latency;
- p50/p95/p99;
- queueing/backpressure;
- capacity headroom;
- hot partitions/contention;
- overload/degraded mode và recovery capacity.
</div>

## 1. Throughput

```text
orders/sec
messages/sec
trades/sec
market events/sec
```

Không nói hết latency.

## 2. Latency Percentiles

Average che tail latency.

```text
p50
p95
p99
p99.9
```

Financial user experience thường bị tail ảnh hưởng mạnh.

## 3. End-to-End Latency

```text
Client submit
→ API
→ risk
→ reservation
→ OMS
→ gateway
→ venue ack
```

Đo từng hop + correlation ID.

## 4. Little's Law Mental Model

```text
L = λW
```

Queue length phụ thuộc arrival rate và time-in-system. Khi service chậm, backlog có thể bùng nổ dù arrival rate không tăng.

## 5. Bounded Queue

Unbounded queue = memory outage delayed.

Need:

```text
max depth
TTL
priority
reject/degrade
metrics
```

## 6. Backpressure

Producer phải biết downstream saturation ở boundary phù hợp.

## 7. Retry Storm

Dependency slow → timeout → clients retry → more load → dependency slower.

Use bounded retry + backoff + jitter + admission control.

## 8. Hot Key / Hot Partition

Một symbol/account/session hot có thể bottleneck shard.

Partition strategy cần real traffic distribution.

## 9. Lock Contention

Atomic invariants có thể tạo contention. Optimize bằng scope nhỏ, partitioned ownership, batching phù hợp — không bỏ invariant để lấy speed.

## 10. Capacity Headroom

Plan peak plus failure mode:

```text
normal peak
+ one node down
+ replay/recovery traffic
+ external slowdown
```

## 11. Recovery Capacity

Sau outage, system vừa nhận live traffic vừa replay backlog. Nếu capacity chỉ đủ live traffic, never catch up.

## 12. Load Shedding

Không mọi request equal.

Có thể ưu tiên:

```text
order cancel > analytics query
risk controls > reports
session heartbeat > noncritical batch
```

Policy business-aware.

## 13. Caching

Cache phù hợp read-heavy/reference/query path, nhưng critical state cần consistency semantics rõ.

## 14. Benchmarking

Benchmark phải gần production:

```text
data size
concurrency
network
DB
serialization
GC
failure injection
burst shape
```

## 15. Common mistakes

- optimize average only;
- unbounded queues;
- retries amplify outage;
- benchmark toy dataset;
- read cache stale dùng cho critical limits;
- no catch-up capacity.

<div class="key-takeaway"><strong>Takeaway</strong>Performance production = **tail latency + bounded overload + enough recovery capacity**, không chỉ requests/sec.</div>

## Checklist

- [ ] End-to-end latency.
- [ ] Percentiles.
- [ ] Bounded queues.
- [ ] Retry controls.
- [ ] Capacity headroom.
- [ ] Hot partition analysis.
- [ ] Catch-up capacity.

## Bài tập

1. Load-test OMS with burst 10x.
2. Simulate venue latency + retries.
3. Measure p99 submit-to-ack.
4. Calculate recovery time for 1M backlog.

## Đọc tiếp

[Bài 23 — Production Runbook & Incidents](../23-production-runbook-incident-operations/).