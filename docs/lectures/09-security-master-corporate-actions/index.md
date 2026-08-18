---
title: "Bài 09 — Security Master & Corporate Actions"
description: "Instrument identity, effective-dated trading rules, corporate actions, entitlements và historical reproducibility."
---

# Bài 09 — Security Master & Corporate Actions: vì sao Symbol không phải toàn bộ instrument?

<div class="lesson-meta"><span><strong>Track</strong> Market & Brokerage Core</span><span><strong>Mức độ</strong> Core</span><span><strong>Mục tiêu</strong> Quản lý instrument/reference data và entitlement đúng lịch sử</span></div>

Trading core không thể hoạt động chỉ với `Symbol = FPT`. Một security có identity, venue, board, currency, lifecycle và effective-dated rules.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- symbol khác instrument identity;
- reference data ảnh hưởng pre-trade/risk/settlement thế nào;
- corporate action có lifecycle và key dates ra sao;
- entitlement phải dùng historical ownership snapshot đúng thời điểm;
- amendment/reversal cần version và audit vì sao.
</div>

## 1. Security Master

```text
InstrumentId
Symbol
ISIN / ExternalIds
Venue
Board
InstrumentType
Currency
ParValue
TradingStatus
Listing/Delisting
EffectiveFrom/To
```

## 2. Symbol không đủ làm immutable key

Symbol có thể thay đổi hoặc được tái sử dụng tùy market. Internal stable ID giúp preserve history.

## 3. Effective-dated Trading Rules

```text
LotSize
TickSize Rule
Price Band Rule
Settlement Rule
Order Type Eligibility
Margin Eligibility
```

Audit order ngày D phải dùng rule có hiệu lực ngày D.

## 4. Data Quality

Reference data sai có thể làm đồng thời:

```text
Order validation sai
Risk sai
Market data mapping sai
Settlement sai
Corporate action sai
```

Cần source, version, approval và reconciliation controls.

## 5. Corporate Action Types

```text
Cash Dividend
Stock Dividend
Bonus Shares
Rights Issue
Split / Reverse Split
Merger / Exchange
Redemption / Maturity
Voting / Meeting Entitlement
```

## 6. Lifecycle

```text
Announcement
→ Event Definition
→ Key Dates
→ Entitlement
→ Election/Instruction nếu có
→ Allocation/Payment
→ Reconciliation
```

## 7. Key Dates

```text
Announcement Date
Ex Date
Record Date
Election Deadline
Payment Date
```

Meaning phụ thuộc event/market rules.

## 8. Entitlement Calculation

Ví dụ cash dividend:

```text
EligibleQty = 1,000
Rate        = 2,000/share
Gross       = 2,000,000
Tax         = policy(...)
Net         = Gross - Tax
```

Lưu source snapshot + rule version.

## 9. Không dùng Current Position cho Record Date

Job chạy hôm nay nhưng entitlement phải dựa ownership theo record-date rule hoặc external entitlement evidence phù hợp.

Đây là temporal-data problem.

## 10. Amendment

Không silently overwrite event cũ.

```text
Event Version 1
→ amended
Event Version 2
→ recalculate impacted entitlements
→ adjustment/reversal
```

## 11. Corporate Action và Market Data

Historical analytics cần:

```text
Raw Price
Adjustment Factor
Adjusted Price
Factor Version
```

## 12. Corporate Action và Open Orders

Xử lý open order quanh ex-date/split phải theo market-specific rule, không suy generic.

## 13. Reconciliation

```text
Internal Entitlement
↔ Depository/Custodian/Official Evidence
```

Break phải có owner và resolution lifecycle.

## 14. Common mistakes

- Symbol = immutable identity;
- overwrite current rules;
- entitlement theo current position;
- rerun job double-credit;
- amend bằng UPDATE không history;
- adjustment factor không version.

<div class="key-takeaway"><strong>Takeaway</strong>Reference data và corporate actions là **temporal, versioned business facts**. Historical correctness quan trọng không kém current correctness.</div>

## Checklist

- [ ] Stable InstrumentId.
- [ ] Effective-dated rules.
- [ ] Data source/version controls.
- [ ] Event identity/version.
- [ ] Entitlement traceable.
- [ ] Rerun/amend idempotent.
- [ ] External reconciliation.

## Bài tập

1. Thiết kế cash dividend flow end-to-end.
2. Mô phỏng split 2:1 và adjusted price.
3. Model event amendment sau khi entitlement đã calculated.
4. Viết query `rules as of business date`.

## Đọc tiếp

[Bài 10 — Market Data Engineering](../10-market-data-engineering/).