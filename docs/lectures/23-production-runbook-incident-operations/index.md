---
title: "Bài 23 — Production Runbook & Incident Operations"
description: "Incident detection, degraded modes, kill switches, runbooks, game days, reconciliation and postmortems."
---

# Bài 23 — Production Operations: khi thị trường đang mở mà hệ thống lỗi, bạn làm gì trong 5 phút đầu?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Chuyển architecture thành operational capability</span></div>

Production securities engineering không kết thúc khi deploy. Market-open incidents yêu cầu detection, containment, recovery và business-state proof.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- severity và incident command;
- runbook/action preconditions;
- degraded mode;
- kill switch;
- reconciliation before reopen;
- game day/postmortem.
</div>

## 1. Incident Lifecycle

```text
Detect
→ Triage
→ Contain
→ Stabilize
→ Recover
→ Reconcile
→ Reopen
→ Postmortem
```

## 2. First Questions

```text
Customer impact?
Orders affected?
Unknown outcomes?
External venue/session state?
Data loss/corruption risk?
Can new traffic make it worse?
```

## 3. Severity

Define severity by business impact, not engineer stress.

## 4. Incident Roles

```text
Incident Commander
Operations/Technical Lead
Business/Risk Representative
Communications
Recorder
```

Scale depending org.

## 5. Runbook

Runbook action cần:

```text
precondition
command/step
expected result
rollback
owner
risk
verification
```

## 6. Degraded Mode

Examples:

```text
allow cancels, block new orders
read-only portfolio
disable conditional orders
freeze one market
serve stale data with explicit stale banner
```

Degraded mode phải design/test trước incident.

## 7. Kill Switch

Emergency stop có scope, authorization, audit và confirmation.

## 8. Unknown Orders

Connection loss có thể tạo pool unknown.

Không reopen blindly trước recovery/reconciliation policy.

## 9. Data Corruption

Nếu suspected corruption:

```text
stop propagation
isolate scope
identify trusted checkpoint/source
rebuild/reconcile
```

## 10. Communication

Status messages phải factual:

```text
what affected
since when
current mitigation
next update
customer/business action if any
```

## 11. Reopen Criteria

```text
critical sessions healthy
sequence synchronized
unknown orders resolved/bounded
ledger balanced
market data live
high-severity breaks controlled
business approval
```

## 12. Game Day

Inject planned failures:

```text
FIX disconnect
DB failover
market-data gap
duplicate executions
outbox backlog
DR switch
stale risk price
```

## 13. Postmortem

Focus system causes, timeline, contributing factors, detection gaps, recovery gaps và actions.

Avoid superficial “human error”.

## 14. Automation

Automate safe diagnostics/checks, nhưng emergency mutation still needs authorization/guardrails.

## 15. Common mistakes

- runbook chỉ là wiki screenshot;
- no degraded mode;
- restart first, understand later;
- reopen vì dashboard green;
- manual DB fix no record;
- postmortem blame individual.

<div class="key-takeaway"><strong>Takeaway</strong>Operational maturity là khả năng **contain failure mà không tạo financial inconsistency mới**.</div>

## Checklist

- [ ] Incident roles/severity.
- [ ] Tested runbooks.
- [ ] Degraded modes.
- [ ] Kill switches.
- [ ] Reconciliation before reopen.
- [ ] Game days.
- [ ] Actionable postmortems.

## Bài tập

1. Viết runbook FIX disconnect.
2. Define reopen criteria after DB failover.
3. Run table-top game day market-data stale.
4. Write blameless postmortem template.

## Đọc tiếp

[Bài 24 — Architecture Boundaries & DDD](../24-architecture-boundaries-ddd-modular-monolith-microservices/).