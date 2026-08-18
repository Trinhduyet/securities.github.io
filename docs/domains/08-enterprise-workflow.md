# Domain 08 — Hệ thống quy trình doanh nghiệp

Một công ty chứng khoán có hàng trăm workflow: account opening, KYC/AML, approval, fee override, bond onboarding, corporate action, customer complaint, limit increase, settlement exception, reconciliation break.

Hard-code workflow bằng nested `if` sẽ nhanh chóng trở thành legacy khó kiểm soát.

## 1. Core Model

```text
ProcessDefinition
ProcessVersion
ProcessInstance
Task
Actor / Role
Transition
Decision
SLA
Escalation
Attachment
Comment
AuditLog
```

## 2. Ví dụ Account Opening

```text
Application
  ↓
eKYC
  ↓
AML / Screening
  ↓
Compliance Review?
  ↓
Approval
  ↓
Account Provisioning
  ↓
Trading Activation
```

Không phải khách nào cũng đi cùng một path; workflow engine cần conditional transition.

## 3. Versioning

Nếu workflow v1 có:

```text
A → B → C
```

và ngày mai v2:

```text
A → B → Risk → C
```

process instance đã chạy trên v1 không được tự động “biến thành” v2 trừ khi có migration rule rõ.

## 4. Human Task vs Automated Task

```text
Human Task
- approve/reject
- request more information

Service Task
- call KYC service
- create account
- calculate risk

Timer Task
- SLA timeout
- reminder
- escalation
```

## 5. Idempotent Service Task

Workflow engine có thể retry service task, nên downstream command phải idempotent.

```text
CreateTradingAccount(ProcessInstanceId)
```

retry không được tạo hai account.

## 6. SLA và Escalation

```text
Task Created
  ↓
DueAt
  ↓
Reminder
  ↓
Escalate
  ↓
Breach
```

SLA là domain data và cần business calendar, không chỉ cron timer.

## 7. Audit

Cần trả lời:

```text
Ai làm?
Lúc nào?
Từ state nào sang state nào?
Dựa trên dữ liệu/version nào?
Lý do gì?
Có attachment/evidence nào?
```

Trong regulated workflow, audit trail là feature chính.

## 8. Saga-like Coordination

Một workflow dài có thể gọi nhiều system:

```text
KYC
→ CRM
→ Core Account
→ Bank Link
→ Notification
```

Không có distributed transaction xuyên tất cả. Cần retry, compensation/manual repair và status visibility.

## 9. Build vs Workflow Engine

Tự build khi workflow đơn giản, ổn định, domain-specific.

Cân nhắc BPM/workflow engine khi:

- nhiều human task;
- process thay đổi thường xuyên;
- timer/escalation phức tạp;
- business muốn visualize/configure;
- long-running process cần persistence/recovery.

## Invariants

- transition phải hợp lệ theo process version;
- một human decision không apply hai lần;
- service task retry an toàn;
- audit append-only/traceable;
- process không “mất” khi service restart.

## Câu hỏi design

Một settlement exception cần Operations xử lý trong 30 phút, sau đó tự escalates tới supervisor. Nếu service restart giữa chừng, timer/SLA state nằm ở đâu và recovery thế nào?