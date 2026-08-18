---
title: "Bài 14 — FIX 4.4 Session Recovery"
description: "FIX session state, sequence numbers, resend, gap fill, PossDup, restart và business dedup."
---

# Bài 14 — FIX 4.4 Session Recovery: reconnect không có nghĩa là đã recover

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Hiểu stateful protocol recovery</span></div>

FIX parsing dễ hơn FIX recovery. Production problem thực sự là sequence continuity, replay, duplicates và failover ownership.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- sender/target sequence;
- resend request và gap fill;
- PossDup/OrigSendingTime;
- persistent message store;
- restart/failover session ownership;
- transport replay vs business dedup.
</div>

## 1. Session Identity

```text
BeginString
SenderCompID
TargetCompID
Session Qualifier nếu implementation dùng
```

Session state gắn với logical counterpart, không chỉ TCP socket.

## 2. Sequence Numbers

Mỗi direction có sequence riêng.

```text
Outbound NextSenderSeqNum
Inbound  NextTargetSeqNum
```

## 3. Gap Detection

Expected=101, Receive=104 → gap.

Không nên apply blind messages nếu session spec yêu cầu recovery sequence semantics.

## 4. Resend Request

Receiver yêu cầu peer retransmit range phù hợp.

## 5. Gap Fill / Sequence Reset

Session protocol có thể dùng sequence reset/gap fill cho messages không cần replay nguyên bản tùy semantics/spec.

Engineer phải hiểu đúng contract thay vì reset cho “hết lỗi”.

## 6. PossDup

Retransmitted application messages có duplicate potential.

Transport layer đánh dấu duplicate possibility; domain layer vẫn phải dedup bằng business identity.

## 7. Message Store

```text
SessionId
Direction
MsgSeqNum
MsgType
RawMessage
SendingTime
BusinessIdentity
ReplayMetadata
```

Retention và performance cần thiết kế theo certification/operations requirement.

## 8. Logon Recovery

Reconnect flow phải resolve:

```text
local expected seq
peer expected seq
resend obligations
pending outbound
pending inbound gaps
```

## 9. Restart

Nếu restart làm seq về 1 không đúng contract, peer có thể reject hoặc session state diverge.

## 10. Failover

Primary chết, standby lên phải có:

```text
same durable session state
exclusive ownership
fencing
network readiness
certificate/secrets
```

## 11. Split Brain

Hai nodes cùng nghĩ active trên một logical session là incident nghiêm trọng.

Leader election chưa đủ nếu old leader vẫn có external connectivity; cần fencing/ownership enforcement.

## 12. Transport vs Business Identity

```text
MsgSeqNum = transport identity/order
ClOrdID/OrderID/ExecID = business identities
```

Không dedup execution chỉ bằng MsgSeqNum.

## 13. Recovery Scenario

```text
35=D seq=100 sent
venue accepts
35=8 seq=501 response lost
connection drops
reconnect
resend/recovery
35=8 arrives PossDup
```

Business effect phải apply đúng một lần.

## 14. Testing

Test matrix:

```text
lost outbound
lost inbound
duplicate inbound
gap
out-of-order socket delivery simulation
restart
failover
stale standby
split brain attempt
```

## 15. Metrics

```text
session status
sender/target seq
sequence gaps
resend count
replay volume
logon failures
heartbeat timeout
duplicate business events
```

## 16. Common mistakes

- reset seq để “fix nhanh”;
- sequence store trong RAM;
- HA = 2 pods;
- PossDup ignored;
- MsgSeqNum dùng làm business dedup;
- standby thiếu fencing.

<div class="key-takeaway"><strong>Takeaway</strong>FIX recovery là **state machine ở transport layer**; core business vẫn cần identity, idempotency và reconciliation riêng.</div>

## Checklist

- [ ] Persistent seq state.
- [ ] Message store/replay.
- [ ] Gap/resend tested.
- [ ] PossDup handled.
- [ ] Failover exclusive ownership.
- [ ] Business dedup separate.

## Bài tập

1. Viết simulator two-sided seq.
2. Inject gap và resend.
3. Failover session store giữa node A/B.
4. Prove duplicate execution not double-booked.

## Đọc tiếp

[Bài 15 — Exchange Gateway & KRX Connectivity](../15-exchange-gateway-krx-connectivity/).