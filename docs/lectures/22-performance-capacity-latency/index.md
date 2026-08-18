# Bài 22 — Performance, Capacity & Latency: nhanh nhưng phải đúng dưới tải

Trading systems cần latency thấp, nhưng tối ưu latency mà phá ordering, durability hay risk control là tối ưu sai. Câu hỏi production phải là:

> Ở peak load, hệ thống còn bảo vệ invariant, giữ backlog bounded và đáp ứng SLO end-to-end không?

## 1. Latency budget theo flow

Ví dụ:

```text
Client
→ API/BFF
→ Auth
→ Risk/Reservation
→ OMS Commit
→ Gateway Queue
→ Venue Send
→ Venue ACK
```

Tổng latency là sum/queueing của từng stage. Đừng chỉ benchmark controller 5 ms.

## 2. Percentile thay average

Average che tail latency.

Theo dõi:

```text
p50
p95
p99
p99.9 khi critical
max trong window phù hợp
```

Một số request 5 giây trong market spike có thể nguy hiểm dù average 30 ms.

## 3. Little's Law mental model

Với system ổn định:

```text
Concurrency ≈ Throughput × Latency
```

Nếu throughput tăng nhưng dependency latency tăng, số in-flight request/queue sẽ phình nhanh.

## 4. Capacity envelope

Không chỉ “requests/sec”. Tách workload:

```text
new orders/sec
cancel/sec
execution reports/sec
market messages/sec
websocket fanout/sec
ledger postings/sec
reconciliation records/sec
EOD batch volume
replay/backlog drain
```

Peak của các workload có thể xảy ra cùng lúc.

## 5. Bounded queue

Unbounded queue biến overload thành memory/latency catastrophe.

```text
Producer
→ bounded queue
→ consumers
```

Khi đầy, cần policy:

- reject/throttle upstream;
- prioritize critical message;
- shed noncritical work;
- pause consumer source;
- spill/rely on durable broker nếu phù hợp.

## 6. Backpressure priority

Không phải message nào cũng ngang nhau.

Ví dụ khi overload:

```text
Execution processing > marketing notification
Cancel/kill-switch > historical analytics refresh
Risk-critical feed > UI decoration
```

Priority là business decision, không chỉ thread priority.

## 7. Database contention

Hot account/instrument có thể tạo lock contention.

Patterns cần cân nhắc:

```text
short transactions
proper indexes
optimistic versioning
partition ownership
batching khi không phá latency/invariant
avoid global lock
```

Benchmark phải có concurrent conflicts, không chỉ single-thread inserts.

## 8. Cache

Cache phù hợp cho read-heavy/reference/read-model data, nhưng critical pre-trade invariant không nên tin stale cache nếu có thể overspend/oversell.

Mỗi cache cần:

```text
source of truth
TTL/invalidation
stale behavior
fallback
warm-up
rebuild
```

## 9. Market data fan-out

Một tick có thể fan-out tới hàng nghìn/millions client subscriptions. Tách ingestion/normalization critical path khỏi client fan-out chậm.

```text
Feed
→ Normalize
→ Durable/Hot Distribution
   ├→ Risk
   ├→ Conditional Orders
   ├→ Analytics
   └→ WebSocket Fanout
```

Client chậm không được block ingestion.

## 10. Replay storm

Sau outage:

```text
live traffic
+ backlog replay
+ cache warmup
+ reconciliation
```

cùng lúc. Capacity test phải có recovery load, không chỉ steady-state.

## 11. GC / allocation / runtime tuning

Với .NET/Java, allocation rate và GC pause có thể ảnh hưởng tail latency. Nhưng đừng micro-optimize object allocation trước khi đo queueing/database/network bottleneck.

Quy trình:

```text
measure
profile
identify dominant bottleneck
change one thing
a/b/load test
verify correctness
```

## 12. Load model phải giống market

Uniform load không thực tế. Market có burst:

```text
open auction
market open
large price move
close auction
news event
reconnect after outage
```

Test burst/ramp/spike/soak.

## 13. Capacity headroom

Không chạy production thường xuyên ở 95-100% sustainable throughput. Cần headroom cho burst, failover (mất một node/site), replay và unexpected market activity.

## 14. Degraded mode

Khi near-capacity:

```text
pause expensive analytics
reduce UI refresh rate
limit noncritical history query
preserve order/cancel/execution/risk path
```

Degradation phải graceful và observable.

## 15. Performance invariant tests

Load test không chỉ assert latency. Assert:

```text
no duplicate trades
no overspend
no negative reservation
no lost sequence
no ledger imbalance
no unbounded backlog
```

Nhanh mà sai là fail.

## Metrics

```text
throughput by operation
p50/p95/p99 end-to-end latency
queue depth/age
DB lock wait/deadlock
consumer lag
GC pause/allocation
connection pool utilization
cache hit/stale rate
websocket slow consumers
replay drain ETA
```

## Definition of Done

- [ ] Có latency budget end-to-end.
- [ ] Capacity model theo business workload.
- [ ] Queue bounded + overload policy.
- [ ] Recovery/replay load được test.
- [ ] Critical vs noncritical priority rõ.
- [ ] Tail latency được theo dõi.
- [ ] Cache có stale semantics.
- [ ] Load tests kiểm tra business invariants.

## Bài tập

Tạo load profile market-open: 5x order submit trong 60 giây, 10x market ticks, sau đó gateway reconnect và replay backlog. Xác định queue nào được phép tăng, queue nào phải bounded nghiêm ngặt, và SLO nào ưu tiên để bảo vệ trading correctness.