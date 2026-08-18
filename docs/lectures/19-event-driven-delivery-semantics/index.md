---
title: "Bài 19 — Event Delivery Semantics"
description: "At-least-once delivery, idempotent consumers, outbox/inbox, ordering, replay, DLQ và unknown outcomes."
---

# Bài 19 — Event Delivery: “exactly once” thực sự cần ở đâu?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Thiết kế message flow chịu duplicate, retry và replay</span></div>

Financial systems hiếm khi kiểm soát toàn bộ network để đảm bảo một message “chỉ được giao đúng một lần”. Mục tiêu thực tế thường là **at-least-once delivery + exactly-once business effect**.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- at-most/at-least/exactly-once semantics;
- outbox/inbox;
- idempotency identity;
- ordering scope;
- retry/DLQ/replay;
- side-effect suppression trong historical replay.
</div>

## 1. Delivery Semantics

### At-most-once
Có thể mất, không duplicate.

### At-least-once
Không muốn mất nhưng duplicate có thể xảy ra.

### Exactly-once
Thường chỉ meaningful trong bounded system/transactional abstraction, không phải magic toàn distributed world.

## 2. Exactly-once Business Effect

```text
Message arrives N times
→ business mutation applied once
```

Ví dụ Execution `ABC` replay 5 lần → trade booked 1 lần.

## 3. Transactional Outbox

```text
BEGIN
  mutate business state
  insert outbox
COMMIT

Dispatcher → broker
```

Tránh commit DB rồi crash trước publish.

## 4. Inbox / Dedup

```text
Receive
→ check identity
→ apply business mutation
→ mark processed
```

Nếu có thể trong cùng local transaction.

## 5. Identity

Không dedup bằng payload hash nếu source có authoritative ID tốt hơn.

```text
TradeId
ExecId
OrderId + EventType + Version
SettlementInstructionId
```

## 6. Ordering

Không phải mọi event cần global total order.

Xác định ordering scope:

```text
per order
per account
per instrument
per session
per partition
```

## 7. Retry

Retry chỉ an toàn khi:

```text
transient failure
+ idempotency/dedup
+ bounded/backoff/jitter
```

## 8. DLQ / Parking Lot

DLQ không phải nghĩa địa.

Need owner, reason, reprocess process, audit và poison-message classification.

## 9. Replay

Replay cần:

```text
from/to boundary
schema version
business rule version
side-effect policy
idempotency behavior
observability
```

## 10. Side Effects

Historical replay không được gửi lại email, submit exchange order hoặc payment nếu không có explicit sandbox/suppression policy.

## 11. Schema Evolution

Events sống lâu cần compatibility strategy.

```text
additive change
versioning
upcasting/translation
consumer tolerance
```

## 12. Backpressure

Consumer lag tăng phải visible. Autoscale chỉ giúp nếu bottleneck scaleable; external systems có fixed capacity cần throttle.

## 13. Unknown External Outcome

Message broker retry không giải quyết outbound unknown outcome với exchange/bank. Cần status query/reconciliation theo external protocol.

## 14. Common mistakes

- “Kafka gives exactly once, done”;
- retry without idempotency;
- DLQ không owner;
- global ordering không cần thiết;
- replay fire external side effects;
- dedup state tách transaction khỏi mutation.

<div class="key-takeaway"><strong>Takeaway</strong>Distributed delivery nên được thiết kế cho **duplicates, delay, reorder và replay** ngay từ đầu.</div>

## Checklist

- [ ] Delivery semantics documented.
- [ ] Stable event identity.
- [ ] Outbox/inbox where needed.
- [ ] Ordering scope explicit.
- [ ] DLQ lifecycle.
- [ ] Replay safe.

## Bài tập

1. Implement outbox dispatcher crash-safe.
2. Replay same event 100 times.
3. Design per-order ordering partition.
4. Create DLQ reprocess workflow.

## Đọc tiếp

[Bài 20 — HA / DR / BCP / Observability](../20-ha-dr-bcp-observability/).