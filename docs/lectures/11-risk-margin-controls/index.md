---
title: "Bài 11 — Risk, Margin & Trading Controls"
description: "Pre-trade, intraday và post-trade risk; margin, limits, liquidation, kill switch và explainable decisions."
---

# Bài 11 — Risk, Margin & Controls: làm sao ngăn một order hợp lệ về cú pháp nhưng nguy hiểm về tài chính?

<div class="lesson-meta"><span><strong>Track</strong> Market & Brokerage Core</span><span><strong>Mức độ</strong> Core</span><span><strong>Mục tiêu</strong> Thiết kế risk như state + policy + atomic controls</span></div>

Risk engine không phải `if (balance >= amount)`. Nó bảo vệ exposure, margin, concentration, account restrictions và operational limits.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- pre/intra/post-trade risk;
- risk policy versioning;
- margin state machine;
- liquidation orchestration;
- atomic limit consumption;
- stale data và kill switch controls.
</div>

<div class="callout">
<strong>Broker UI (🟢 SSI margin screen)</strong><br/>
Màn hình Margin tổng quan iBoard (🟢) cho thấy <em>Tỷ lệ KQ</em>, <em>Tổng nợ</em>, <em>Lãi tạm tính</em>, trạng thái <em>An toàn</em> — thuộc <strong>01 + Risk</strong>, không phải toàn bộ Domain 08. Nút <em>Tăng sức mua</em> (🟣) là workflow credit — phiên khảo sát không click.
</div>

## 1. Ba lớp risk

```text
Pre-trade
Intraday / Real-time
Post-trade / EOD
```

## 2. Pre-trade Controls

```text
Account status
Buying power
Sellable qty
Price/qty limits
Instrument eligibility
Marginability
Concentration
Credit line
```

## 3. Intraday Risk

```text
Position
PnL
Margin utilization
Market movement
Concentration
Credit exposure
```

## 4. Post-trade Risk

```text
Settlement exposure
Unresolved breaks
Limit breaches
Margin recomputation
```

## 5. Policy Versioning

```text
RiskPolicy
PolicyVersion
EffectiveFrom
Scope
Parameters
DecisionReason
InputSnapshotVersion
```

Phải giải thích order hôm qua bị reject theo rule hôm qua.

## 6. Margin Mental Model

```text
Collateral Value
Exposure / Debit
Initial Margin
Maintenance Margin
Available Margin
Margin Ratio
```

Formula cụ thể phụ thuộc product/policy.

## 7. Risk State Machine

```text
NORMAL
→ WARNING
→ MARGIN_CALL
→ RESTRICTED
→ LIQUIDATION_REQUIRED
```

Transition có reason/time/policy version.

## 8. Forced Liquidation

Không `sell everything` đơn giản.

Phải giải quyết:

- instrument priority;
- quantity;
- price policy;
- partial fill;
- reject;
- market closed;
- concurrent liquidators;
- collateral top-up giữa workflow.

## 9. Atomic Limit Consumption

```text
Limit = 1bn
Order A = 700m
Order B = 700m
```

Hai request đọc snapshot cũ sẽ vượt limit nếu không có concurrency control.

## 10. Stale Market Data

Risk engine phải có policy khi price stale:

```text
fail closed
fallback price
apply haircut
restrict new orders
manual escalation
```

## 11. Kill Switch

```text
Disable account
Disable symbol
Disable market
Disable new BUY
Cancel all working orders
Global stop
```

Require strong auth/audit/maker-checker khi phù hợp.

## 12. Explainable Decision

```json
{
  "decision": "REJECT",
  "reasonCode": "BUYING_POWER_EXCEEDED",
  "policyVersion": "BP-2026-08-01",
  "required": 120180000,
  "available": 100000000
}
```

## 13. Fail-open vs Fail-closed

Risk dependency timeout không có universal answer.

Critical financial control thường thiên fail-closed, nhưng business/operation cần explicit policy theo operation và degraded mode.

## 14. Common mistakes

- hard-code threshold;
- risk decision không reason;
- two concurrent orders consume same limit;
- liquidation fire-and-forget;
- stale price dùng vô hạn;
- failover tạo hai active risk owners.

<div class="key-takeaway"><strong>Takeaway</strong>Risk là **deterministic policy + atomic resource control + explainable state machine**.</div>

## Checklist

- [ ] Pre/intra/post risk.
- [ ] Versioned policy.
- [ ] Atomic critical limits.
- [ ] Margin state machine.
- [ ] Liquidation recoverable.
- [ ] Stale data policy.
- [ ] Kill switch audited.

## Bài tập

1. Simulate concurrent exposure allocation.
2. Model liquidation workflow with partial fills.
3. Design stale-price policy matrix.
4. Build explainable risk response contract.

## Đọc tiếp

[Bài 12 — EOD, Reconciliation & Operations](../12-eod-reconciliation-operations/).