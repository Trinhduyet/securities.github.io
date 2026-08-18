---
title: "Bài 16 — Trade Capture & Booking"
description: "Execution identity, trade booking transaction, fees/tax, corrections, busts và reconciliation."
---

# Bài 16 — Trade Capture & Booking: execution về rồi, business effect được ghi nhận thế nào?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Apply execution exactly once và tạo trade/audit đúng</span></div>

Một `ExecutionReport` không chỉ update `CumQty`. Nó có thể tạo trade, consume reservation, thay đổi position/cash pending, fee/tax và downstream settlement obligations.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- execution identity và dedup;
- trade booking transaction boundary;
- fees/tax versioning;
- correction/bust/reversal;
- booking vs settlement;
- reconciliation với external trade evidence.
</div>

## 1. Execution Identity

```text
Venue + ExecId
```

hoặc identity theo exact venue contract.

Unique business key cần ngăn double booking.

## 2. Booking Flow

```text
Execution Received
→ dedup
→ validate order/qty
→ update order quantities
→ create Trade
→ consume reservation
→ create ledger/pending effects
→ create downstream event/outbox
→ commit
```

## 3. Atomicity

Nếu Trade created nhưng Order not updated, state diverges.

Transaction boundary phải bảo vệ invariant liên quan.

## 4. Partial Fills

Một order sinh nhiều trades/executions.

Trade entity không nên overwrite order row history.

## 5. Average Price

```text
AvgPx = Σ(qty_i × price_i) / Σ(qty_i)
```

Need decimal precision/rounding rules.

## 6. Fees and Tax

```text
FeePolicyVersion
TaxRuleVersion
EffectiveDate
AccountSegment
Instrument/Market
```

Không hard-code rate trong execution handler.

## 7. Pending Effects

Execution có thể tạo:

```text
pending cash payable/receivable
pending securities receivable/deliverable
```

không đồng nghĩa settled immediately.

## 8. Trade Correction / Bust

Production cần adjustment/reversal semantics, không DELETE trade.

```text
Original Trade
→ Correction/Bust Event
→ Reversal/Adjustment Entries
→ New Effective State
```

## 9. Late / Duplicate Execution

Duplicate: no second effect.

Late but valid: apply according to authoritative order/session/business-date semantics.

## 10. Unknown Order Link

Nếu execution về nhưng OMS không tìm thấy order mapping, không drop. Tạo exception/reconciliation workflow.

## 11. Reconciliation

```text
Internal Trades
↔ Venue Trade Reports
```

Compare identity, account, instrument, qty, price, time, side, status.

## 12. Event Publication

Booking + integration event tránh dual-write hole bằng outbox hoặc equivalent.

## 13. Audit

Trade phải trace về:

```text
Order
Execution raw message/evidence
Fee/tax policy
Booking transaction
Corrections
Settlement references
```

## 14. Common mistakes

- duplicate ExecId double position;
- Trade == Order;
- DELETE correction;
- fee current rate applied to historical trade;
- booking = settlement;
- publish event after commit without recovery mechanism.

<div class="key-takeaway"><strong>Takeaway</strong>Trade booking là **financial posting boundary**: execution phải tạo business effect đúng một lần, traceable và reversible bằng accounting semantics.</div>

## Checklist

- [ ] Stable Exec identity.
- [ ] Atomic booking.
- [ ] Versioned fees/tax.
- [ ] Pending vs settled separated.
- [ ] Correction/reversal.
- [ ] Trade reconciliation.

## Bài tập

1. Book 3 partial executions và tính AvgPx.
2. Send duplicate ExecId 10 lần.
3. Model trade bust.
4. Design booking transaction + outbox.

## Đọc tiếp

[Bài 17 — Clearing, Netting & Settlement](../17-clearing-netting-settlement/).