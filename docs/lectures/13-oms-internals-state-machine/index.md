---
title: "Bài 13 — OMS Internals & State Machine"
description: "Order aggregate internals, command/event processing, concurrency, reservation, persistence và recovery semantics."
---

# Bài 13 — OMS Internals: từ API đặt lệnh đến state machine production

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Thiết kế OMS quanh invariant, durability và external authority</span></div>

Một OMS production không phải CRUD `orders` table. Nó là stateful transaction processor đứng giữa client, risk, cash/position và exchange.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- command vs authoritative external event;
- aggregate/state transition design;
- concurrency/versioning;
- inbound/outbound persistence;
- unknown outcome recovery;
- why actor/single-writer is an option, not a religion.
</div>

<div class="callout">
<strong>Broker UI (🟡 VPS guide / 🟣 labels)</strong><br/>
VPS “chờ tại VPS / chờ tại sàn” minh họa <em>broker received vs market handoff</em> — không map “chờ tại sàn” = “đã vào central order book”. SSI/VPS tách sổ lệnh điều kiện khỏi sổ lệnh thường (🟣). Timeout trên UI ≠ venue reject.
</div>


## 1. Core Responsibilities

```text
Accept Command
Validate
Reserve Resource
Persist Order Intent
Route Outbound
Process Venue Events
Update Quantities/Status
Book Executions
Release/Consume Reservation
Expose Query State
Recover/Reconcile
```

## 2. Command vs Event

```text
CancelOrder = request/intention
CancelAccepted = authoritative outcome
```

Không set `Cancelled` chỉ vì client gửi cancel.

## 3. Aggregate State

```text
OrderId
ClientOrderId
Status
OrderQty
CumQty
LeavesQty
Price
Side
ReservationId
VenueOrderId
Version
Timestamps
```

## 4. Transition Function

Mental model:

```text
New State = Apply(Current State, Event)
```

Transition invalid phải reject/log as protocol/business anomaly.

## 5. Concurrency

Options:

```text
Optimistic version
Pessimistic lock
Atomic conditional update
Single-writer/actor ownership
Partitioned command processing
```

Chọn theo conflict profile và latency, không theo trend.

## 6. Outbound Durability

Câu hỏi critical:

> DB commit rồi process crash trước network send thì sao?

Cần persisted outbound intent/outbox hoặc tương đương để recovery.

## 7. Inbound Durability

Venue event nhận xong nhưng crash trước business commit phải replay/recover được.

Pattern:

```text
Receive
→ durable inbox/message log
→ dedup
→ transaction apply effect
→ mark processed
```

## 8. Idempotency

Keys khác nhau cho layers khác nhau:

```text
Client request idempotency
Venue order identity
Execution identity
Message/session sequence
```

Không dùng một key cho mọi semantics.

## 9. Unknown Submit

```text
Persisted order
→ send venue
→ timeout
```

State nên có `Unknown/PendingRecovery` semantics, không mù quáng create new order.

## 10. Reservation Coupling

Nếu pre-trade invariant critical, order + reservation transaction boundary phải được thiết kế rõ.

Tách services quá sớm biến invariant local thành saga phức tạp.

## 11. Read Model

Queries có thể dùng projection/cache, nhưng critical commands không dựa stale projection nếu phá invariant.

## 12. State Transition Audit

Không nhất thiết full Event Sourcing, nhưng cần đủ evidence:

```text
from
input
rule/version
to
timestamp
source
correlation ids
```

## 13. Recovery Startup

OMS start không chỉ `health=200`.

Readiness có thể yêu cầu:

```text
DB ready
session state loaded
outbox replay status known
reconciliation baseline loaded
critical dependencies ready
```

## 14. Sharding / Partitioning

Có thể partition theo account/order/session, nhưng phải preserve ordering nơi business cần.

## 15. Common mistakes

- controller tự mutate status;
- event handler không dedup;
- DB commit/network send dual-write hole;
- read replica bảo vệ buying power;
- restart bỏ quên pending outbound;
- hai nodes active cùng ownership mà không fencing.

<div class="key-takeaway"><strong>Takeaway</strong>OMS production là **durable state machine với exactly-once business effect trên nền delivery có thể duplicate/timeout**.</div>

## Checklist

- [ ] Commands/events tách.
- [ ] Valid transitions explicit.
- [ ] Concurrency strategy.
- [ ] Durable inbound/outbound.
- [ ] Layer-specific idempotency.
- [ ] Unknown recovery.
- [ ] Startup readiness business-aware.

## Bài tập

1. Implement transition table.
2. Crash inject ở 5 điểm submit lifecycle.
3. Design outbox/inbox schemas.
4. Compare optimistic concurrency vs single-writer design.

## Đọc tiếp

[Bài 14 — FIX 4.4 Session Recovery](../14-fix44-session-recovery/).