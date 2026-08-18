# Reliability, Ledger, Idempotency và Reconciliation

Trong core securities, correctness không chỉ là “request trả 200”. Correctness là **business effect đúng, không mất, không nhân đôi, có thể giải thích và reconcile**.

## 1. Failure Taxonomy

### Definite failure
Request bị reject trước khi external side commit.

### Definite success
Có authoritative confirmation đủ theo contract.

### Unknown outcome
Timeout/disconnect khiến caller không biết external side đã commit chưa.

`UNKNOWN` phải là trạng thái được thiết kế, không phải exception message trong log.

## 2. Idempotency

Ví dụ command:

```text
SubmitOrder
IdempotencyKey = client-request-123
```

Cùng key + cùng semantic payload → trả cùng business result.

Nếu cùng key nhưng payload khác, nên reject conflict thay vì đoán.

## 3. Inbox / Dedup

External event có thể duplicate:

```text
Execution ExecID=ABC
Execution ExecID=ABC PossDup=Y
```

Pattern:

```text
Receive
  ↓
Check/Dedup Identity
  ↓
Apply Business Effect
  ↓
Mark Processed
```

Nếu có thể, dedup state + business mutation trong cùng local transaction.

## 4. Transactional Outbox

Khi DB change và publish event phải nhất quán:

```text
BEGIN
  update business state
  insert outbox event
COMMIT

async dispatcher → broker
```

Tránh:

```text
DB commit success
process crash
publish never happened
```

## 5. Ledger

Ledger tốt thường append business entries thay vì overwrite history.

### Cash example

```text
Deposit            +500m
Order Reservation  -120m available / +120m reserved
Trade Settlement   -119.95m settled effect
Fee                -0.18m
Release Reservation ...
```

Implementation có thể dùng sub-ledger/double-entry tùy accounting model; điều quan trọng là **entry identity + immutable audit trail + balanced rules**.

## 6. Projection

```text
Ledger / Transactions
        ↓
Projection
        ↓
Current Balance
Position
PnL
```

Projection corrupt có thể rebuild nếu source history đáng tin cậy.

## 7. Reconciliation

### Order reconciliation
Internal vs venue order state.

### Trade reconciliation
Internal executions/trades vs venue report.

### Cash reconciliation
Internal ledger vs bank/settlement result.

### Securities reconciliation
Internal holdings vs depository/custodian.

### Settlement reconciliation
Internal obligations vs VSDC.

## 8. Reconciliation Key

Phải định nghĩa explicit:

```text
Venue + TradingDate + OrderId
Venue + ExecId
Account + Currency + BusinessDate
Account + Instrument + PositionType
SettlementBatch + ObligationId
```

Không fuzzy match bằng timestamp nếu có authoritative IDs.

## 9. Break Workflow

```text
Compare
  ↓
MATCH ─────→ close
  ↓ BREAK
Classify
  ↓
Auto Repair?
  ├─ yes → repair + audit + recompare
  └─ no  → Ops Workflow → resolve
```

Break cần severity, owner, SLA và evidence.

## 10. Retry

Retry phù hợp với transient failure, nhưng phải kết hợp idempotency.

```text
Retry without idempotency
= duplicate generator
```

Dùng backoff + jitter để tránh retry storm.

## 11. Concurrency Control

### Optimistic
Version column / compare-and-swap tốt khi conflict hiếm.

### Pessimistic
Lock khi conflict nguy hiểm và scope nhỏ.

### Atomic conditional update
Rất hữu ích cho state machine:

```sql
UPDATE orders
SET status = 'TRIGGERING'
WHERE id = @id AND status = 'ACTIVE';
```

## 12. Replay

Replay phải có boundary/version:

- event schema version;
- business rule version;
- from/to sequence;
- idempotency/dedup behavior;
- side effect suppression nếu chạy historical rebuild.

Không replay blindly vào email/payment/exchange side effects.

## 13. HA/DR

High Availability không chỉ chạy 2 pods.

Với FIX/session-sensitive gateway phải hiểu:

```text
Session ownership
Persistent sequence state
Leader election/fencing
Primary/standby
Network failover
Message store
Recovery procedure
```

DR phải có RTO/RPO và drill định kỳ.

## 14. Checklist review

- [ ] Có trạng thái UNKNOWN khi outcome không xác định.
- [ ] Mọi external command quan trọng có stable identity.
- [ ] Consumer chịu duplicate.
- [ ] Publish sau DB mutation không có dual-write hole.
- [ ] Ledger/history audit được.
- [ ] Projection rebuild được khi cần.
- [ ] Reconciliation là productized workflow.
- [ ] Retry có idempotency.
- [ ] HA xử lý stateful session, không chỉ load balancing.
- [ ] DR có procedure đã test.

## Bài tập

Phân tích case: venue đã fill 1,000 cổ phiếu, broker nhận ExecutionReport nhưng DB commit thất bại. Viết recovery path sao cho cuối cùng internal position đúng mà không double book nếu message được resend.