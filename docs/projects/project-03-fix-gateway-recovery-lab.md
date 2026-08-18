# Project 03 — FIX Gateway & Recovery Lab

Mục tiêu project: không xây FIX engine production, mà chứng minh bạn hiểu **session state, sequence recovery, business dedup, unknown outcome và active/standby ownership**.

## Scope

Xây simulator gồm:

```text
OMS Simulator
FIX-like Gateway A
FIX-like Gateway B (standby)
Venue Simulator
Persistent Session Store
Message Store
Reconciliation Job
```

Bạn có thể dùng simplified text/JSON protocol nhưng phải giữ semantics giống các concept FIX cần học.

## Contract tối thiểu

```text
Logon
Heartbeat
NewOrder
ExecutionReport
ResendRequest
SequenceReset/GapFill
OrderStatusQuery
```

Message có:

```text
SessionId
MsgSeqNum
MsgType
PossDup
SentAt
BusinessPayload
```

## Scenario 1 — Normal

```text
seq 1 Logon
seq 2 NewOrder CL-001
seq 3 Heartbeat
← seq 10 Execution NEW
← seq 11 Execution FILL
```

Assert order lifecycle và durable session state.

## Scenario 2 — Sequence gap

Venue gửi inbound:

```text
20
21
23
```

Gateway phải detect thiếu 22, mark session recovering và yêu cầu resend.

Không cho downstream coi stream fully live trước recovery policy.

## Scenario 3 — Duplicate execution

Venue replay:

```text
Seq 22 ExecId=E100 PossDup=Y
```

Nếu `E100` đã book:

```text
Trade count không tăng
Position không tăng
Session sequence vẫn xử lý đúng
```

## Scenario 4 — Unknown order

Gateway gửi order rồi venue accept nhưng connection drop trước ACK.

OMS:

```text
PENDING_NEW → UNKNOWN
```

Sau reconnect, query/reconcile bằng stable `ClientOrderId` để resolve.

## Scenario 5 — Gateway crash

Crash A sau khi đã gửi seq 500 nhưng trước khi flush một in-memory counter.

Nếu session state chỉ ở RAM, project fail. Restore từ durable state/message store.

## Scenario 6 — Split brain

A bị mất kết nối với coordinator nhưng vẫn nói chuyện được với venue. B cố active.

Implement lease/fencing epoch đơn giản:

```text
owner = A, epoch=10
B acquire → epoch=11
A write/send với epoch=10 → rejected by local fencing guard
```

Mục tiêu hiểu concept, không phải copy cơ chế này cho mọi production stack.

## Scenario 7 — Backlog replay

Tạo 100k inbound/outbound messages, restart rồi replay trong khi live traffic vẫn đến. Theo dõi queue depth và latency; không để replay starve live critical path.

## Data model gợi ý

```text
sessions
session_messages
orders
executions
trades
inbox
outbox
ownership_leases
reconciliation_breaks
```

## Metrics

```text
session state
next in/out sequence
sequence gap count
resend count
replay count
unknown orders
execution dedup hits
active owner
gateway queue depth
recovery duration
```

## Tests bắt buộc

- [ ] gap detection;
- [ ] resend/gap fill;
- [ ] duplicate execution;
- [ ] restart recovery;
- [ ] unknown-order resolution;
- [ ] active/standby failover;
- [ ] split-brain fencing;
- [ ] replay + live traffic;
- [ ] reconciliation after failover.

## Deliverables

1. Architecture diagram.
2. Session state machine.
3. Order state machine.
4. Persistence schema.
5. Recovery sequence diagram.
6. Failure-injection tests.
7. Dashboard screenshot/design.
8. ADR: tại sao gateway không phải stateless API.

## Review questions

- MsgSeqNum và ExecId khác nhau thế nào?
- Nếu message resent với `PossDup`, application làm gì?
- B biết chắc A không còn quyền send bằng cách nào?
- Khi nào route được đánh dấu READY?
- Sau failover, external/internal order map được xác minh ở đâu?

Project đạt khi bạn không chỉ “reconnect thành công” mà chứng minh được **business state converges without duplicate effects**.