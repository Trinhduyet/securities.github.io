---
title: "Bài 17 — Clearing, Netting & Settlement"
description: "Obligations, netting, DVP, settlement states, calendars, failures và external reconciliation."
---

# Bài 17 — Clearing, Netting & Settlement: sau Trade còn những nghĩa vụ nào?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Model post-trade obligations và settlement lifecycle</span></div>

FILLED chỉ kết thúc execution lifecycle. Post-trade mới biến trade thành obligations tiền/chứng khoán và cuối cùng thành settled ownership.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- gross vs net obligation;
- clearing vs settlement;
- cash/securities legs;
- DVP;
- settlement calendar/cutoff;
- fail/shortfall/reconciliation workflow.
</div>

<div class="callout">
<strong>Broker UI (🟡 VPS / 🟢 SSI)</strong><br/>
VPS mô tả CK chờ nhận/gửi T1–T3 và tiền chờ về sau bán. SSI có <em>Ứng trước tiền bán</em>: biến pending receivable thành cash usable trước settlement. Đó là post-trade, không phải matching.
</div>


## 1. Trade to Obligation

```text
Trades
→ Validate/Confirm
→ Clearing
→ Netting
→ Obligations
→ Settlement Instructions
→ Cash/Securities Transfer
→ Confirm
→ Reconcile
```

## 2. Gross vs Net

Gross xử lý từng obligation riêng; netting giảm số amount/quantity cần settle theo rule.

Ví dụ cash:

```text
Buy obligations  = -500m
Sell receivables = +300m
Net cash         = -200m
```

## 3. Securities Obligation

Net theo instrument/account/member scope theo market rules.

Không tự suy netting dimension.

## 4. Clearing

Clearing tính nghĩa vụ.

## 5. Settlement

Settlement thực hiện chuyển giao.

Đừng merge hai khái niệm.

## 6. Settlement State

```text
Calculated
Confirmed
Ready
Submitted
Pending
PartiallySettled
Settled
Failed / Exception
```

Tên tùy system nhưng lifecycle explicit.

## 7. DVP

Cash leg và securities leg phải phối hợp theo settlement model để giảm principal risk.

## 8. Calendars

```text
Trade Date
Settlement Date
Holiday
Cutoff
Business Date
Product Rule
```

No `AddDays(n)` naive.

## 9. Shortfall / Fail

Nếu thiếu tiền hoặc chứng khoán:

```text
detect
→ classify
→ funding/borrow/operational action theo rule
→ resubmit/adjust
→ reconcile
```

## 10. External Authority

Settlement result từ depository/clearing/bank là external evidence cần ingest và reconcile.

## 11. Idempotency

Settlement instruction retry không được tạo duplicate transfer instruction ngoài contract.

Stable instruction identity quan trọng.

## 12. Cash/Securities Ledger

Settlement confirmation chuyển pending effects sang settled effects bằng ledger entries/reclassification theo accounting design.

## 13. Reconciliation

```text
Internal Obligation ↔ Clearing Result
Internal Cash       ↔ Bank
Internal Securities ↔ Depository
```

## 14. Common mistakes

- clearing = settlement;
- FILLED = settled;
- settlement date = calendar date + N;
- retry transfer blind;
- no instruction ID;
- settlement correction bằng overwrite.

<div class="key-takeaway"><strong>Takeaway</strong>Post-trade correctness là **obligation lifecycle + authoritative external confirmations + reconciliation**.</div>

## Checklist

- [ ] Clearing/netting dimensions explicit.
- [ ] Settlement states.
- [ ] Cash/securities legs separated.
- [ ] Calendar/cutoff modeled.
- [ ] Stable instruction IDs.
- [ ] External recon.

## Bài tập

1. Net 20 trades into obligations.
2. Model settlement shortfall.
3. Design DVP sequence diagram.
4. Build obligation reconciliation table.

## Đọc tiếp

[Bài 18 — Ledger, Accounting & Projections](../18-ledger-accounting-projections/).