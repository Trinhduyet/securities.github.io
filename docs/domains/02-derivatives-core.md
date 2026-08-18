# Domain 02 — Core giao dịch phái sinh

Phái sinh không phải equity core cộng thêm field `ContractCode`. Trung tâm domain chuyển từ **securities ownership** sang **position + margin + mark-to-market + risk**.

## Core concepts

```text
Contract
Underlying
Expiry
Multiplier
Long / Short Position
Open / Close
Average Price
Realized PnL
Unrealized PnL
Initial Margin
Maintenance Margin
Available Margin
Mark-to-Market
```

## Position

Ví dụ:

```text
BUY 10 contracts
→ Long Position +10

SELL 4 to close
→ Long Position +6
```

Tùy market/accounting convention, engine phải xác định chính xác open/close và net/gross position rules.

## PnL

Mental model đơn giản:

```text
Unrealized PnL
≈ (MarkPrice - EntryPrice) × Position × Multiplier
```

Production phải xử lý:

- contract multiplier;
- long vs short sign;
- daily settlement/reference price;
- fee/tax;
- currency;
- rounding.

## Margin

```text
Position
   ↓
Risk Parameters
   ↓
Required Margin
   ↓
Available Margin
   ↓
Margin Ratio / Warning
```

State có thể đi qua:

```text
NORMAL → WARNING → MARGIN_CALL → LIQUIDATION
```

Các threshold/rule phải versioned và lấy từ market/risk configuration, không chôn trong code.

## Mark-to-Market

Market price thay đổi liên tục:

```text
Market Data
   ↓
Position Engine
   ↓
PnL
   ↓
Margin Engine
   ↓
Risk Decision
```

Đây là pipeline latency-sensitive nhưng correctness vẫn quan trọng hơn “real-time bằng mọi giá”.

## Liquidation

Forced liquidation là workflow có risk cao:

- chọn position nào đóng trước;
- quantity bao nhiêu;
- market state;
- order reject/partial fill;
- repeated attempts;
- audit/notification.

Không viết `if margin < x then SellAll()`.

## Expiry

Contract lifecycle:

```text
Listed → Tradable → Near Expiry → Last Trading → Expired → Final Settlement
```

Scheduler/calendar là domain concern, không chỉ cron technical.

## Invariants

```text
Margin available phải phản ánh working orders + positions
Duplicate fill không được double position
PnL deterministic với cùng input/version
Risk parameter có effective date
Liquidation workflow idempotent/auditable
```

## Storage pattern

Nên tách:

```text
Immutable transaction/execution history
        ↓
Position projection
PnL projection
Margin projection
```

Projection có thể rebuild/reconcile khi cần.

## Observability

Theo dõi:

```text
margin_calculation_latency
stale_market_price_age
margin_call_count
liquidation_order_reject_rate
position_reconciliation_breaks
```

## Câu hỏi thực hành

Nếu market feed đứng 30 giây nhưng order gateway vẫn hoạt động, margin engine dùng giá nào? Hệ thống nên fail-open hay fail-closed? Câu trả lời phải xuất phát từ risk policy, không phải sở thích của developer.