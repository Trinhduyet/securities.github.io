---
title: "Bài 21 — Security, Compliance & Audit"
description: "Authentication, authorization, segregation of duties, privileged operations, secrets, tamper-evident audit và compliance controls."
---

# Bài 21 — Security & Compliance: ai được phép làm gì với tiền, lệnh và dữ liệu?

<div class="lesson-meta"><span><strong>Track</strong> Production Securities Engineering</span><span><strong>Mức độ</strong> Advanced</span><span><strong>Mục tiêu</strong> Security theo resource/business operation, không chỉ login</span></div>

Trong brokerage, một admin có khả năng sửa account restriction hoặc trigger manual adjustment là privileged actor với financial impact.

<div class="learning-objectives"><strong>Sau bài này bạn phải giải thích được:</strong>

- authentication vs authorization;
- resource/account entitlement;
- segregation of duties;
- maker-checker;
- secrets/cert/HSM concerns;
- audit evidence và data privacy.
</div>

## 1. Authentication

Xác định caller là ai.

## 2. Authorization

Xác định caller được làm gì trên resource nào.

```text
User A can trade Account X
User B can view but not trade
Ops role can adjust only with approval
```

## 3. Least Privilege

Service/user chỉ có quyền tối thiểu cần thiết.

## 4. Segregation of Duties

Không để một người có thể create + approve + settle một high-risk adjustment nếu policy yêu cầu separation.

## 5. Maker-Checker

```text
Maker creates action
→ Checker approves/rejects
→ Executor applies
→ Audit records evidence
```

## 6. Privileged Operations

Examples:

```text
kill switch
manual ledger adjustment
account unlock
margin override
symbol enable/disable
session reset
certificate rotation
```

Need stronger controls.

## 7. Secrets and Certificates

```text
API keys
DB credentials
FIX/network certificates
private keys
HSM-backed keys when required
```

No secrets in config repo/log.

## 8. Audit Log

Audit answers:

```text
who
what
which resource
before/after
when
why/reason
approval
correlation
source IP/device/context where needed
```

## 9. Tamper Resistance

Audit store should limit mutation and have retention/access controls appropriate to risk/regulation.

## 10. Sensitive Data

PII, financial data, credentials, tokens need classification, masking and least-access.

## 11. Data at Rest / In Transit

Use appropriate encryption and key-management practices; exact requirements depend system/regulation.

## 12. Service-to-Service Identity

Do not trust network location alone.

Use authenticated workload identity/mTLS/token mechanism consistent with platform.

## 13. Compliance as Code/Policy

Rules like account restriction, employee trading restriction, approval threshold should be explicit/versioned where possible.

## 14. Incident Evidence

Logs/audit/trace phải đủ reconstruct incident without leaking secrets.

## 15. Common mistakes

- authentication = authorization;
- admin role = all power;
- shared service accounts;
- secrets in logs;
- manual DB fix no audit;
- audit log itself editable by same operator.

<div class="key-takeaway"><strong>Takeaway</strong>Security trong securities system phải bảo vệ **business authority**, không chỉ HTTP endpoints.</div>

## Checklist

- [ ] Strong authN/authZ.
- [ ] Resource entitlement.
- [ ] Least privilege.
- [ ] SoD/maker-checker.
- [ ] Secrets/cert lifecycle.
- [ ] Privileged audit.
- [ ] Sensitive-data controls.

## Bài tập

1. Model roles for trader/ops/risk/admin.
2. Design maker-checker ledger adjustment.
3. Threat-model FIX gateway certificate handling.
4. Define audit schema.

## Đọc tiếp

[Bài 22 — Performance, Capacity & Latency](../22-performance-capacity-latency/).