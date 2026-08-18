---
title: "Bài 18 — Ledger, Accounting & Projections"
description: "Immutable business entries, balances, double-entry thinking, reversals, projections, rebuild và reconciliation."
---

# Bài 18 — Ledger & Accounting: tại sao financial system không nên chỉ UPDATE Balance?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Thiết kế auditable financial state</span></div>

Nếu một customer hỏi “vì sao số dư giảm 120.180.000?”, hệ thống phải trả lời bằng transaction history, không phải “column hiện tại đang như vậy”.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- ledger vs balance projection;
- debit/credit mental model;
- immutable entry + reversal;
- reservation/pending/settled states;
- rebuild projection;
- ledger reconciliation.
</div>

## 1. History First

```text
Business Transactions / Entries
→ Projection
→ Current Balance / Position
```

## 2. Cash Example

```text
Deposit              +500m
Reservation           available -120m / reserved +120m
Trade Booking         pending payable
Settlement            settled cash movement
Fee                   -0.18m
Release remainder
```

Implementation có thể dùng sub-ledger/double-entry tùy model.

## 3. Double-entry Mental Model

Mọi financial effect có đối ứng để hệ thống cân bằng trong accounting boundary.

Không nhất thiết expose accounting chart directly cho domain, nhưng invariants cần rõ.

## 4. Entry Identity

```text
EntryId
TransactionId
Account/LedgerAccount
Amount
Currency/Instrument
Direction
BusinessDate
Reference
CreatedAt
```

Unique business key ngăn duplicate posting.

## 5. Immutable + Reversal

Không sửa/xóa historical entry để “fix”.

```text
Original Entry
→ Reversal
→ Correcting Entry
```

## 6. Projection

Balances phục vụ read nhanh.

Projection có thể:

```text
incrementally update
rebuild from ledger
snapshot + replay
```

## 7. Reservation

Reservation có thể model như separate business state/sub-ledger, miễn audit và invariant rõ.

## 8. Cash vs Securities Ledger

Cash theo currency; securities theo instrument/position semantics.

Không giả định chúng giống hệt nhau.

## 9. Pending vs Settled

Trade booking và settlement là hai moments khác nhau.

Projection nên thể hiện pending receivable/payable nếu business cần.

## 10. Fees/Tax

Mỗi posting trace tới policy version và trade/source.

## 11. Rebuild

Nếu projection corrupt:

```text
freeze scope
→ determine trusted ledger range
→ rebuild
→ compare
→ switch/readiness
```

Không rebuild live mù quáng.

## 12. Reconciliation

Ledger internal vẫn cần so external bank/depository/settlement evidence.

Balanced internal ledger không chứng minh external reality đúng.

## 13. Precision

Money/quantity cần decimal/fixed precision, rounding convention, currency/instrument scale.

## 14. Common mistakes

- mutable history;
- duplicate posting;
- balance không trace được;
- current fee rule áp historical;
- projection = source of truth duy nhất;
- internal balance = external reconciliation.

<div class="key-takeaway"><strong>Takeaway</strong>Ledger cho **explainability, audit, replay và reconciliation**; balance chỉ là current view.</div>

## Checklist

- [ ] Entry/transaction IDs.
- [ ] Immutable history.
- [ ] Reversal semantics.
- [ ] Pending/settled modeled.
- [ ] Projection rebuildable.
- [ ] Precision/rounding explicit.
- [ ] External recon.

## Bài tập

1. Model cash ledger cho BUY partial fills.
2. Implement reversal.
3. Rebuild balance from entries.
4. Inject duplicate booking and prove unique constraint catches it.

## Đọc tiếp

[Bài 19 — Event Delivery Semantics](../19-event-driven-delivery-semantics/).