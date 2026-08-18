# Securities Engineering

> Lộ trình tiếng Việt từ **Kinh tế học → Tài chính → Chứng khoán → Market Infrastructure → 8 Core Domains → Production Securities Engineering**.

Repository dành cho backend engineer muốn đi xa hơn mức “biết API đặt lệnh” để hiểu **order, execution, trade, cash, position, risk, matching, KRX/FIX, VSDC, clearing, settlement, ledger, reconciliation, HA/DR và operations** như những khái niệm nghiệp vụ có invariant rõ ràng.

## Curriculum

```text
24 Lectures
8 Core Domains
5 Failure-driven Projects
Competency Matrix
50 Failure Scenarios
Review Checklist
Primary References
```

### Track I — Economics & Finance

Bài 01–05: vi mô, vĩ mô, finance, securities market, investment analysis.

### Track II — Market & Brokerage Core

Bài 06–12: order/matching, KRX/FIX/VSDC, account/cash/position/buying power, security master/corporate actions, market data, risk/margin, EOD/reconciliation.

### Track III — Production Securities Engineering

Bài 13–24: OMS internals, FIX session recovery, exchange gateway/KRX connectivity, trade capture, clearing/netting/settlement, ledger, delivery semantics, HA/DR/BCP, security/audit, performance, incident runbook và architecture boundaries.

## 8 Domains

1. Securities Core
2. Derivatives Core
3. Bonds Core
4. Funds Core
5. Realtime Analytics
6. Conditional Orders
7. Rewards
8. Enterprise Workflow

## Projects

1. Order Lifecycle Simulator
2. Brokerage Platform End-to-End
3. FIX Gateway & Recovery Lab
4. Ledger & Reconciliation Lab
5. Brokerage Production Game Day

## Cách học

Tài liệu lấy cảm hứng từ cách tổ chức của Learn Harness Engineering: **mỗi bài tập trung vào một câu hỏi lớn**, có mental model, ví dụ, sơ đồ, failure mode, checklist và bài tập; tránh một file lý thuyết khổng lồ.

Bắt đầu tại [`docs/index.md`](docs/index.md).

## Cấu trúc

```text
securities.github.io/
├── docs/
│   ├── index.md
│   ├── lectures/      # 24 bài từ economics đến production
│   ├── domains/       # 8 domain/hệ thống lớn của CTCK
│   ├── engineering/   # Reliability, ledger, architecture mental models
│   ├── projects/      # 5 lab/capstone dựa trên failure scenario
│   └── resources/     # Glossary, matrix, scenarios, checklist, references
├── .github/workflows/ # VitePress → GitHub Pages
├── package.json
└── README.md
```

## Nguyên tắc xuyên suốt

> Đừng bắt đầu từ Microservices. Hãy bắt đầu từ **business invariant**.

```text
Không bán > Sellable Quantity
Không dùng > Available Buying Power
Một ExecID không được book hai lần
Một conditional order không được trigger hai lần
Ledger không được mất/double transaction
Settlement phải reconcile được với external evidence
FIX failover không được tạo dual session owner
Timeout không tự động đồng nghĩa Failed
```

Khi invariant, source of truth, transaction boundary, failure semantics và reconciliation đã rõ, lựa chọn SQL Server, Kafka, Redis, BackgroundService, modular monolith hay microservices mới có cơ sở.