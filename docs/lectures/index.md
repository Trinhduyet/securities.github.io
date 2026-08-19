# Bài giảng — Curriculum 24 bài

24 bài được chia thành ba track. Có thể đọc tuần tự từ Bài 01, hoặc bắt đầu Track II nếu đã vững kinh tế/tài chính; tuy nhiên Track III giả định bạn đã hiểu Order, Trade, Cash, Position, Risk và Post-trade.

## Track I — Economics & Finance · Bài 01–05

| Bài | Chủ đề | Câu hỏi chính |
|---|---|---|
| 01 | [Kinh tế học vi mô](./01-microeconomics/index.html) | Cung–cầu, incentive và price discovery hoạt động thế nào? |
| 02 | [Kinh tế học vĩ mô](./02-macroeconomics/index.html) | Lãi suất, lạm phát và chính sách truyền dẫn vào tài sản ra sao? |
| 03 | [Tài chính nền tảng](./03-finance-foundations/index.html) | Giá trị thời gian của tiền, risk/return và valuation là gì? |
| 04 | [Thị trường chứng khoán](./04-securities-market/index.html) | Instrument, market participant và lifecycle chứng khoán khác nhau thế nào? |
| 05 | [Phân tích đầu tư](./05-investment-analysis/index.html) | Fundamental, technical và portfolio analysis dùng dữ liệu thế nào? |

## Track II — Market & Brokerage Core · Bài 06–12

| Bài | Chủ đề | Câu hỏi chính |
|---|---|---|
| 06 | [Order Lifecycle & Matching](./06-order-matching/index.html) | Khi khách bấm BUY, trước/trong/sau khớp xảy ra gì? |
| 07 | [KRX / FIX / VSDC](./07-clearing-settlement-krx-fix-vsdc/index.html) | Trading infrastructure nối broker với exchange và post-trade thế nào? |
| 08 | [Account / Cash / Position / Buying Power](./08-account-cash-position-buying-power/index.html) | Balance, buying power, position và sellable quantity khác nhau ra sao? |
| 09 | [Security Master & Corporate Actions](./09-security-master-corporate-actions/index.html) | Instrument identity, effective rules và entitlement được quản lý thế nào? |
| 10 | [Market Data Engineering](./10-market-data-engineering/index.html) | Sequence gap, stale feed, replay và candle/indicator correctness xử lý ra sao? |
| 11 | [Risk, Margin & Controls](./11-risk-margin-controls/index.html) | Pre-trade/intraday risk bảo vệ exposure và liquidation thế nào? |
| 12 | [EOD, Reconciliation & Operations](./12-eod-reconciliation-operations/index.html) | Làm sao chứng minh internal state khớp external reality cuối ngày? |

## Track III — Production Securities Engineering · Bài 13–24

| Bài | Chủ đề | Trọng tâm production |
|---|---|---|
| 13 | [OMS Internals & State Machine](./13-oms-internals-state-machine/index.html) | state transition, reservation, cancel race, unknown outcome |
| 14 | [FIX 4.4 Session Recovery](./14-fix44-session-recovery/index.html) | sequence, resend, gap fill, PossDup, restart |
| 15 | [Exchange Gateway & KRX Connectivity](./15-exchange-gateway-krx-connectivity/index.html) | adapter, readiness, fencing, certification, failover |
| 16 | [Trade Capture & Booking](./16-trade-capture-booking/index.html) | execution dedup, trade booking transaction, correction |
| 17 | [Clearing, Netting & Settlement](./17-clearing-netting-settlement/index.html) | obligation, DVP, settlement legs, external reconciliation |
| 18 | [Ledger, Accounting & Projections](./18-ledger-accounting-projections/index.html) | immutable history, postings, reversal, rebuild |
| 19 | [Event Delivery Semantics](./19-event-driven-delivery-semantics/index.html) | outbox/inbox, ordering, replay, DLQ |
| 20 | [HA / DR / BCP / Observability](./20-ha-dr-bcp-observability/index.html) | RTO/RPO, fencing, recovery, business readiness |
| 21 | [Security / Compliance / Audit](./21-security-compliance-audit/index.html) | entitlement, SoD, privileged access, evidence |
| 22 | [Performance / Capacity / Latency](./22-performance-capacity-latency/index.html) | p99, bounded queue, overload, recovery capacity |
| 23 | [Production Runbook & Incidents](./23-production-runbook-incident-operations/index.html) | degraded mode, kill switch, game day, postmortem |
| 24 | [Architecture Boundaries & DDD](./24-architecture-boundaries-ddd-modular-monolith-microservices/index.html) | consistency boundary, modular monolith vs microservices |

## Cách đọc một bài

Dùng cùng một bộ câu hỏi cho mọi chủ đề:

```text
Business problem là gì?
→ Entity/state nào tồn tại?
→ Invariant nào không được phá?
→ External authority nào liên quan?
→ Timeout/duplicate/out-of-order xảy ra thì sao?
→ Durable state nằm đâu?
→ Recovery/replay thế nào?
→ Reconciliation chứng minh kết quả bằng gì?
```

## Sau 24 bài

Tiếp tục theo thứ tự:

1. [8 Core Domains](../domains/index.html)
2. [Core Securities Engineering](../engineering/index.html)
3. [5 Projects](../projects/index.html)
4. [Competency Matrix](../resources/competency-matrix.html)
5. [50 Failure Scenarios](../resources/failure-scenarios.html)

Mục tiêu cuối không phải thuộc nhiều thuật ngữ, mà là có thể giải thích **business correctness khi hệ thống gặp failure**.
