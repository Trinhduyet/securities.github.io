---
title: "Bài 15 — Exchange Gateway & KRX Connectivity"
description: "Gateway architecture, anti-corruption layer, session ownership, readiness, certification, backpressure và failover."
---

# Bài 15 — Exchange Gateway: lớp mỏng hay hệ thống stateful critical?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Thiết kế venue connectivity an toàn và recoverable</span></div>

Gateway không chỉ map JSON sang FIX. Nó sở hữu protocol state, network connectivity, certification behavior và recovery semantics.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- anti-corruption layer;
- canonical model vs venue model;
- readiness khác liveness;
- session ownership/fencing;
- backpressure trước venue;
- certification và operational controls.
</div>

## 1. Architecture

```text
Trading Core
→ Exchange Port
→ Venue Adapter
→ Session Engine
→ Network
→ Venue
```

## 2. Anti-Corruption Layer

Core command:

```text
SubmitOrder
CancelOrder
ReplaceOrder
```

Gateway dịch sang venue-specific messages/tags/rules.

## 3. Canonical vs Venue-Specific

Canonical model không nên giả định mọi venue có cùng order types/status semantics.

Adapter phải preserve distinctions quan trọng, không normalize đến mức mất meaning.

## 4. Outbound Pipeline

```text
Command
→ validate route/readiness
→ map
→ persist outbound/session state
→ encode
→ send
→ track unknown/pending ack
```

## 5. Inbound Pipeline

```text
Receive
→ session validation
→ decode
→ durable record/dedup
→ map canonical event
→ publish/apply
```

## 6. Readiness

Liveness chỉ nói process còn chạy.

Gateway ready cần có thể yêu cầu:

```text
session logged on
sequence synchronized
message store healthy
network route healthy
cert valid
ownership active
```

## 7. Backpressure

Nếu venue slow hoặc disconnected, không nên unbounded queue orders.

Policy cần:

```text
queue limit
reject/degraded mode
priority
TTL
operator visibility
```

## 8. Session Ownership

Một logical session thường chỉ có một active owner.

Need fencing để standby không cùng gửi.

## 9. Primary / Standby

```text
Primary Gateway
Standby Gateway
Primary Network
Backup Network
DR Site
```

Failover phải được rehearsed.

## 10. Certification

Production connectivity yêu cầu test cases không chỉ happy path:

```text
logon/logout
sequence recovery
cancel/replace
rejections
session reset rules
network break
reconnect
replay
order status cases
```

## 11. Configuration

Version:

```text
venue endpoints
sender/target IDs
certificates
routing tables
message mappings
trading calendars
feature flags
```

## 12. Security Zone

Gateway thường cần network isolation, secret/cert controls, restricted admin access và audit.

## 13. Observability

```text
session status
seq positions
send queue depth
ack latency
rejects
network latency
reconnects
replay volume
cert expiry
```

## 14. Common mistakes

- stateless REST gateway mindset;
- core biết raw FIX tags;
- readiness = process up;
- queue unbounded khi venue down;
- two active sessions;
- config change không version/audit.

<div class="key-takeaway"><strong>Takeaway</strong>Exchange gateway là **stateful protocol boundary** cần ownership, durability, backpressure và operational discipline.</div>

## Checklist

- [ ] Domain/protocol separated.
- [ ] Durable session/outbound state.
- [ ] Readiness business-aware.
- [ ] Bounded queue.
- [ ] Fencing.
- [ ] Certification scenarios.
- [ ] Config/audit controls.

## Bài tập

1. Vẽ primary/standby gateway.
2. Design readiness endpoint semantics.
3. Simulate venue outage with 10k pending submits.
4. Create certification test matrix.

## Đọc tiếp

[Bài 16 — Trade Capture & Booking](../16-trade-capture-booking/).