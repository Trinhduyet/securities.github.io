# Domain 07 — Hệ thống thưởng điểm thông minh

Reward/Loyalty không phải feature phụ nếu nó liên quan tiền/điểm có giá trị. Thiết kế tốt nên dùng **rule engine + entitlement + immutable-ish ledger + expiration** thay vì `Customer.Points += x`.

## 1. Event-driven mental model

```text
Business Events
├── AccountOpened
├── TradeCompleted
├── DepositCompleted
└── CampaignAction
       ↓
Eligibility / Rule Engine
       ↓
Reward Calculation
       ↓
Point Ledger
       ↓
Balance Projection
       ↓
Notification / Redemption
```

## 2. Point Ledger

```text
+100  OPEN_ACCOUNT
+500  TRADE_CAMPAIGN
-300  REDEEM_VOUCHER
-100  EXPIRED
```

Balance là projection/sum theo rule, không phải source duy nhất.

## 3. Idempotency

`TradeCompleted` có thể được delivery nhiều lần.

Dedup identity:

```text
RewardSourceKey = CampaignId + BusinessEventId + RewardType
```

Cùng source không được award lần hai nếu campaign rule yêu cầu exactly-once business effect.

## 4. Rule Engine

Ví dụ:

```text
IF TradeValue >= 100m
AND CustomerSegment = VIP
AND CampaignActive
THEN +500 points
```

Rule phải có:

- effective period;
- version;
- priority;
- eligibility;
- cap/limit;
- exclusivity/stacking rule.

## 5. Expiration

Mỗi credit có thể expiry khác nhau.

Khi redeem, thường cần rule như FIFO theo expiry/earning date. Không đủ nếu chỉ lưu tổng balance.

## 6. Campaign Budget

Campaign có thể có:

```text
Total Budget
Per-customer Cap
Daily Cap
Reward Inventory
```

Concurrency có thể làm overspend nếu check và award không atomic.

## 7. Fraud / Abuse

Các signal:

- wash-like behavior phục vụ farming reward;
- duplicate account abuse;
- rapid reversal;
- suspicious referral graph.

“Thông minh” nên bắt đầu từ deterministic controls trước ML.

## 8. Personalization

Khi core correctness đã ổn:

```text
Customer Features
      ↓
Segmentation / Recommendation
      ↓
Next Best Offer
```

ML chỉ đề xuất; entitlement/ledger vẫn cần deterministic rule.

## Invariants

- một source event không award ngoài intended multiplicity;
- balance không âm nếu product không cho phép;
- expiry/redeem auditable;
- campaign cap không bị race condition phá;
- adjustment/reversal không xóa history.

## Câu hỏi design

Nếu campaign rule bị cấu hình sai và award nhầm 1 triệu giao dịch, bạn update `Points=old-500` hàng loạt hay tạo reversal ledger entries? Với audit/reconciliation, reversal thường an toàn và giải thích được hơn.