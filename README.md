# Securities Engineering

> Lộ trình tiếng Việt từ **Kinh tế học → Tài chính → Chứng khoán → Hạ tầng thị trường → 8 core domains → Core Securities Engineering**.

Repository này dành cho backend engineer muốn đi xa hơn mức “biết API đặt lệnh” để hiểu **order, trade, position, cash, risk, matching, clearing, settlement, FIX, KRX, VSDC, ledger và reconciliation** như những khái niệm nghiệp vụ có invariant rõ ràng.

## Mục tiêu

Sau lộ trình, bạn phải trả lời được các câu hỏi như:

- Tại sao cung–cầu, lãi suất, lạm phát và chu kỳ kinh tế tác động tới giá tài sản?
- Order khác Trade thế nào? Một order có thể sinh bao nhiêu execution?
- Buying Power, Available Cash, Reserved Cash và Settled Cash khác nhau ra sao?
- Continuous matching, periodic auction, price priority và time priority vận hành thế nào?
- `timeout` khi gửi lệnh có phải là thất bại không?
- FIX 4.4 giải quyết session recovery, sequence gap và duplicate như thế nào?
- Clearing khác Settlement thế nào? Tại sao cần DVP và reconciliation?
- 8 domain lớn của một công ty chứng khoán nên được phân rã ra sao?
- Khi nào cần Kafka/Redis/CQRS/Outbox; khi nào một transactional core đơn giản lại tốt hơn?

## Cách học

Tài liệu lấy cảm hứng từ cách tổ chức của Learn Harness Engineering: **mỗi bài tập trung vào một câu hỏi lớn**, giải thích mental model, ví dụ thực tế, sơ đồ, failure mode, checklist và bài tập; tránh một file lý thuyết khổng lồ khó ghi nhớ.

Bắt đầu tại [`docs/index.md`](docs/index.md).

## Cấu trúc

```text
securities.github.io/
├── docs/
│   ├── index.md
│   ├── lectures/      # Kinh tế, tài chính, chứng khoán, trading infrastructure
│   ├── domains/       # 8 domain/hệ thống lớn của CTCK
│   ├── engineering/   # Reliability, ledger, architecture
│   ├── projects/      # Bài tập end-to-end
│   └── resources/     # Glossary, checklist, references
└── README.md
```

## Nguyên tắc xuyên suốt

> Đừng bắt đầu từ Microservices. Hãy bắt đầu từ **business invariant**.

Ví dụ:

```text
Không bán > Sellable Quantity
Không dùng > Available Buying Power
Một ExecID không được book hai lần
Một conditional order không được trigger hai lần
Ledger không được mất transaction
Settlement phải reconcile được với VSDC/Bank
```

Khi các invariant đã rõ, lựa chọn SQL Server, Kafka, Redis, BackgroundService, microservice hay modular monolith mới có cơ sở.