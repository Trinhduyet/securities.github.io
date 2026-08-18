# Domain 06 — Hệ thống lệnh điều kiện thời gian thực

Conditional Order Engine biến một rule của khách thành **order thật** khi điều kiện thị trường thỏa mãn. Đây là domain nhỏ nhưng có đầy đủ vấn đề distributed systems: concurrency, idempotency, stale data, retry và unknown outcome.

## 1. Ví dụ

```text
Nếu FPT <= 100,000
→ BUY 1,000 FPT
```

Rule chưa được gửi ngay tới exchange nếu venue không native-support loại điều kiện đó. Broker engine theo dõi market rồi tạo order khi trigger.

## 2. Pipeline

```text
Market Data
   ↓
Condition Evaluator
   ↓
Condition matched?
   ↓ yes
Atomic Trigger Transition
   ↓
Generate Trading Order
   ↓
Risk / Buying Power
   ↓
OMS / Venue
```

## 3. State Machine

```text
DRAFT
→ ACTIVE
→ TRIGGERING
→ TRIGGERED
→ ORDER_SUBMITTED
→ COMPLETED
```

Các nhánh:

```text
ACTIVE → CANCELLED
ACTIVE → EXPIRED
TRIGGERING → FAILED_RETRYABLE
```

`TRIGGERING` giúp chống hai worker cùng tạo order.

## 4. Race Condition

Hai tick liên tiếp đều thỏa rule:

```text
Tick 1001 = 99,900
Tick 1002 = 99,800
```

Hai worker cùng đọc `ACTIVE` có thể tạo hai order.

Giải pháp cần **atomic state transition**:

```sql
UPDATE conditional_orders
SET status = 'TRIGGERING'
WHERE id = @id
  AND status = 'ACTIVE';
```

Chỉ worker update được 1 row mới có quyền generate order.

## 5. Idempotency giữa Trigger Engine và OMS

Sau khi transition thành `TRIGGERING`, request sang OMS timeout.

Không biết order đã tạo chưa.

Dùng deterministic idempotency/business key:

```text
GeneratedOrderKey = ConditionalOrderId + TriggerVersion
```

OMS phải trả lại cùng order cho cùng key thay vì tạo order mới.

## 6. Stop Loss / Take Profit

Rule đơn giản:

```text
Stop Loss: price <= threshold
Take Profit: price >= threshold
```

Nhưng phải định nghĩa price source:

- last trade?
- bid/ask?
- reference/index price?
- mark price?

## 7. Trailing Stop

Ví dụ long position, trailing 5%:

```text
Peak = max(Peak, CurrentPrice)
TriggerPrice = Peak × 95%
```

State `Peak` là business state và phải update đúng khi event duplicate/out-of-order.

## 8. OCO

One-Cancels-the-Other:

```text
Take Profit ─┐
             ├─ khi một nhánh trigger → cancel/disable nhánh kia
Stop Loss ───┘
```

Đây là coordinated state transition, không chỉ hai row độc lập.

## 9. Stale Market Data

Không được trigger từ feed đã stale ngoài policy.

```text
if marketDataAge > threshold
    suspend / reject trigger evaluation
```

Policy phụ thuộc loại sản phẩm/risk.

## 10. Restart / Replay

Engine restart phải biết:

- rule nào active;
- rule nào đang triggering;
- event nào đã xử lý;
- generated order nào đã tồn tại.

Không dựa vào RAM duy nhất.

## Invariants

```text
Một trigger version → tối đa một generated trading order
Cancelled/Expired rule không trigger
OCO không cho cả hai leg gây business effect độc lập
Stale/corrupt feed được xử lý theo policy rõ
All transitions auditable
```

## Metrics

```text
active_rules
trigger_latency_ms
trigger_duplicate_prevented
stale_feed_suspensions
generated_order_timeout
trigger_recovery_count
```

## Bài tập

Thiết kế sequence diagram cho case: trigger xảy ra → OMS tạo order thành công → response timeout → Trigger Engine retry. Chứng minh tại sao chỉ có một order cuối cùng.