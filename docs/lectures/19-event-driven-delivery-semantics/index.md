# Bài 19 — Event-Driven Delivery Semantics: at-least-once, inbox/outbox và exactly-once business effect

Kafka, RabbitMQ hay một message broker không tự làm business đúng. Trong securities core, câu hỏi cần trả lời là:

> Nếu message mất, duplicate, đến sai thứ tự hoặc consumer crash sau khi commit thì business effect cuối cùng có vẫn đúng và reconcile được không?

## 1. Delivery khác Business Effect

```text
Message delivery may happen multiple times
                ↓
Business effect must converge correctly
```

Mục tiêu thường thực tế hơn “exactly-once network delivery” là:

```text
at-least-once transport
+ stable business identity
+ idempotent consumer
= effectively-once business effect
```

## 2. Dual-write hole

Sai:

```text
BEGIN DB
  update Trade
COMMIT
publish TradeBooked
```

Nếu crash sau commit trước publish:

```text
DB đúng
Downstream không bao giờ biết
```

Transactional Outbox:

```text
BEGIN
  mutate business state
  insert outbox row
COMMIT

Dispatcher
  ↓
publish
  ↓
mark sent/checkpoint
```

Outbox dispatcher có thể publish duplicate; consumer vẫn phải idempotent.

## 3. Inbox / Dedup

Consumer nhận:

```text
TradeBooked { TradeId=T100 }
```

Trong cùng transaction khi phù hợp:

```text
check/insert Inbox(T100,event-type/version)
apply ledger effect
commit
```

Redelivery → inbox/business uniqueness chặn double effect.

## 4. Idempotency key

Key phải đại diện **business operation**, không phải một random retry attempt.

Tốt:

```text
TradeBooked:T100
RewardEarn:Campaign10:TradeT100
SettlementInstruction:ObligationO77
```

Nguy hiểm:

```text
Guid.NewGuid() on every retry
```

vì retry mới trở thành business command mới.

## 5. Same key, different payload

Nếu client gửi cùng `IdempotencyKey` nhưng payload khác:

```text
request 1: BUY 100 FPT
request 2: BUY 200 FPT
same key
```

Không được silently dùng kết quả cũ hoặc tạo order mới. Trả conflict và audit mismatch.

## 6. Ordering

Một aggregate có thể cần order:

```text
OrderAccepted
PartialFill
PartialFill
CancelledRemainder
```

Nhưng event bus global ordering thường không tồn tại hoặc không cần.

Thiết kế:

```text
partition key = OrderId / AccountId / InstrumentId
```

chỉ khi ordering boundary thực sự cần và scale trade-off chấp nhận được.

## 7. Out-of-order event

Ví dụ `CancelAccepted` đến projection trước `PartialFill` do hai pipeline khác nhau. Policy có thể:

- sequence/version gate;
- buffer/reorder;
- reject to parking lot;
- apply commutative operation nếu domain cho phép;
- rebuild projection từ authoritative history.

Đừng giả định timestamp arrival = business order.

## 8. Poison message

Message luôn fail vì schema/data invariant violation không nên retry vô hạn.

```text
Retry bounded
→ Parking Lot / DLQ
→ alert
→ inspect/fix
→ controlled replay
```

Critical financial message ở DLQ cần owner/SLA, không phải nơi “quên message”.

## 9. Schema evolution

Event contract cần:

```text
EventType
EventVersion
BusinessId
OccurredAt
Source
Correlation/Causation
Payload
```

Consumer cũ/new phải có migration strategy. Không rename field production rồi mong replay history tự hiểu.

## 10. Replay

Replay dùng cho recovery/rebuild nhưng cực nguy hiểm với external side effects.

```text
Historical TradeBooked replay
→ rebuild portfolio OK
→ gửi SMS/email lại? không
→ submit order ra venue lại? tuyệt đối không
```

Consumer cần replay mode/side-effect boundary rõ.

## 11. Saga khi nào cần?

Saga hữu ích khi business process thật sự trải nhiều consistency boundary:

```text
Fund Subscription
→ reserve cash
→ submit to fund platform
→ pricing/allocation later
→ settlement
```

Nhưng đừng dùng Saga để chữa việc tách một invariant local thành nhiều service quá sớm.

## 12. Correlation vs Idempotency

```text
CorrelationId = trace một workflow
CausationId   = event nào gây event này
IdempotencyKey = business operation nào không được apply hai lần
```

Ba field có thể giống trong case đơn giản nhưng semantics khác nhau.

## 13. Broker outage

Nếu message broker down:

- local transaction có tiếp tục không?
- outbox backlog bao nhiêu là chấp nhận?
- critical flow fail-open/fail-closed?
- backlog drain có gây load spike?
- replay ordering còn đúng?

Hãy define degraded mode thay vì chỉ retry connection.

## 14. Metrics

```text
outbox backlog/age
publish failures
consumer lag
inbox duplicate hits
DLQ count/oldest age
schema errors
replay throughput
out-of-order rejects
processing latency by event type
```

## Definition of Done

- [ ] Dual-write hole có giải pháp.
- [ ] Consumer idempotent theo business identity.
- [ ] Ordering boundary explicit.
- [ ] Out-of-order policy có test.
- [ ] Poison message có parking-lot workflow.
- [ ] Schema version/replay strategy rõ.
- [ ] Replay không lặp external side effects.
- [ ] Saga chỉ dùng khi business boundary thật sự distributed.

## Bài tập

Xây flow `TradeBooked → Ledger → Rewards → Notification` với at-least-once delivery. Inject duplicate, out-of-order, crash sau commit, broker outage 15 phút và replay 1 triệu events. Chứng minh ledger/reward không double và notification không bị gửi lại trong historical rebuild.