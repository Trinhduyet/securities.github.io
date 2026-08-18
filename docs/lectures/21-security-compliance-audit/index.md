# Bài 21 — Security, Compliance & Audit: bảo vệ quyền giao dịch và bằng chứng nghiệp vụ

Security trong công ty chứng khoán không dừng ở OAuth/JWT. Một trading platform phải bảo vệ **ai được thao tác tài khoản nào, ai được thay đổi risk rule, ai được failover gateway, ai được manual-adjust ledger, và sau đó chứng minh được ai đã làm gì**.

## 1. Authentication khác Authorization

```text
Authentication → bạn là ai?
Authorization  → bạn được làm gì trên resource nào?
```

Ví dụ user đã login nhưng không có nghĩa được đặt lệnh trên mọi account liên kết trong hệ thống.

## 2. Entitlement model

Một authorization decision có thể phụ thuộc:

```text
User/Employee
CustomerId
TradingAccountId
Role
Product
Market
Operation
Channel
Risk/Restriction state
Effective time
```

Đừng chỉ `role == Admin` cho mọi privileged operation.

## 3. Customer trading authorization

Flow:

```text
Authenticated Principal
→ account ownership/mandate check
→ trading status/restriction
→ product entitlement
→ operation permission
→ risk/pre-trade
```

Authorization fail phải xảy ra trước business mutation.

## 4. Segregation of Duties

Các nghiệp vụ nhạy cảm có thể cần maker/checker/four-eyes theo policy:

```text
manual cash adjustment
securities adjustment
risk limit increase
fee-rule change
corporate-action override
settlement repair
privileged configuration
```

Một người không nên vừa tạo vừa duyệt cùng sensitive change nếu control yêu cầu tách vai trò.

## 5. Privileged Access

Operations/support cần quyền mạnh nhưng phải bounded:

```text
just-in-time access
approval
expiry
reason/ticket reference
session recording/audit khi phù hợp
least privilege
```

Không cấp shared production admin account.

## 6. Audit Log vs Debug Log

Debug log có thể rotate/format tùy app. Audit evidence cần semantics mạnh hơn:

```text
Who
What operation
Which business object
Before/After hoặc business delta
When
Why / ReasonCode
Approval
CorrelationId
Source channel
```

Audit record critical không nên bị user có quyền business thông thường sửa/xóa.

## 7. Sensitive data

Không log:

```text
password
private key
full secret/token
raw PIN/OTP
sensitive personal data ngoài nhu cầu
```

Mask account/PII theo policy nhưng vẫn giữ đủ correlation để điều tra.

## 8. Certificate & Key Management

External connectivity có thể dùng certificate/private keys theo interface requirements.

Cần lifecycle:

```text
generate/import
store securely
access control
rotation
expiry monitoring
revocation
DR availability
```

Không để private key trong repo/container image.

## 9. HSM/PKI

Khi infrastructure/policy yêu cầu, HSM giúp bảo vệ private-key operation và giảm khả năng key export. Engineering cần hiểu failure mode: HSM cluster unavailable thì gateway/payment flow fail thế nào, fail-open hay fail-closed?

## 10. Configuration governance

Risk/tick/fee/calendar/route config có thể ảnh hưởng trực tiếp tiền.

Mỗi change nên có:

```text
Version
EffectiveFrom
Author
Approver
Reason
Diff
Validation
Rollback plan
```

Feature flag thay đổi trading behavior cũng là production control, không chỉ developer convenience.

## 11. Immutable evidence

Không phải mọi audit system cần blockchain/WORM, nhưng cần chống silent tampering phù hợp risk:

```text
append-only controls
restricted delete
hash/signature/chained evidence khi policy cần
central log retention
backup/retention policy
```

## 12. Fraud/abuse controls

Security engineering giao với business risk:

```text
account takeover
abnormal order pattern
credential stuffing
API abuse
privileged insider action
reward abuse
manual-adjustment abuse
```

Detection cần business context, không chỉ WAF alert.

## 13. Incident investigation

Khi khách nói “tôi không đặt lệnh này”, cần trace:

```text
login/session/device evidence
request/correlation id
authorization decision
order command
OMS state
venue message
execution/trade
notification
manual ops actions
```

Nếu mỗi service log một format/timezone khác nhau, investigation rất khó.

## 14. Time synchronization

Audit/trading correlation phụ thuộc clock. Infrastructure cần time-sync policy; application nên lưu timestamp chuẩn + business date/session semantics.

## 15. Data retention

Retention khác nhau cho:

```text
audit
orders/trades
FIX raw messages
customer data
market data
operations evidence
```

Áp dụng theo legal/regulatory/internal policy hiện hành; không đặt `DELETE after 30 days` generic.

## 16. Security failure mode

- authorization service timeout;
- certificate hết hạn trước market open;
- leaked secret;
- privileged account compromise;
- audit sink unavailable;
- config deploy sai risk limit;
- HSM unavailable;
- clock drift.

Mỗi case cần runbook và fail-safe policy.

## Definition of Done

- [ ] Authentication và resource-level authorization tách rõ.
- [ ] Sensitive operation có SoD/maker-checker khi policy cần.
- [ ] Privileged access time-bounded/audited.
- [ ] Audit evidence khác debug log.
- [ ] Secret/certificate lifecycle có owner/rotation/alert.
- [ ] Production config có version/approval/rollback.
- [ ] Incident có thể trace end-to-end bằng stable IDs.
- [ ] Retention dựa policy hiện hành.

## Bài tập

Thiết kế flow manual cash adjustment 100 triệu: maker tạo, checker duyệt, ledger post, customer balance update, audit evidence immutable và reconciliation. Sau đó giả lập checker token bị compromise và chỉ ra control nào giới hạn blast radius.