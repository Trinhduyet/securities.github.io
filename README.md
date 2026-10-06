# Securities Engineering

> Lộ trình tiếng Việt để hiểu một nền tảng chứng khoán từ **business lifecycle** đến **production architecture**.

Repository dành cho backend engineer muốn đi xa hơn mức “biết API đặt lệnh” để hiểu rõ Order, Execution, Trade, OMS, Risk, Exchange Gateway, FIX, clearing, settlement, ledger, reconciliation, HA/DR và operations như các khái niệm có boundary rõ ràng.

## Bắt đầu ở đâu?

Đừng bắt đầu bằng việc đọc ngẫu nhiên 24 bài hoặc 8 domain.

| Mục tiêu | Bắt đầu tại |
|---|---|
| Hiểu toàn bộ platform | [System Map](docs/resources/system-map.md) |
| Hiểu các vùng nghiệp vụ | [8 Core Domains](docs/domains/index.md) |
| Học tuần tự từ nền tảng | [24 Lectures](docs/lectures/index.md) |
| Đi sâu production engineering | [Core Securities Engineering](docs/engineering/index.md) |
| Map UI broker thật sang backend | [Broker App Case Studies](docs/case-studies/index.md) |
| Xem case AI/market data | [StockAI Engineering](docs/stockai/index.md) |

Mental model đầu tiên:

~~~text
ORDER FLOW
Investor → Trading API → OMS/Risk → Exchange Gateway → Trading Venue

MARKET DATA FLOW
Market Feed → Market Data Platform → UI / Risk / Analytics

POST-TRADE FLOW
Execution → Trade Booking → Clearing/Settlement → VSDC/Bank → Reconciliation
~~~

Ba flow có liên quan nhưng **không phải cùng một system**.

## Hai taxonomy phải tách biệt

### Business Domains

Trả lời: **nghiệp vụ nào phải được quản lý?**

1. Securities Core
2. Derivatives Core
3. Bonds Core
4. Funds Core
5. Realtime Analytics
6. Conditional Orders
7. Rewards
8. Enterprise Workflow

### Production Engineering

Trả lời: **làm sao chạy nghiệp vụ đó đúng khi có concurrency, timeout, duplicate, failover và scale?**

~~~text
Risk / Limits
→ OMS Internals
→ FIX Session
→ Exchange Gateway
→ Trade Capture
→ Clearing / Settlement
→ Ledger / Reconciliation
→ Event Delivery
→ HA / DR
→ Performance / Operations
~~~

**Domain không đồng nghĩa với microservice. OMS/FIX/Gateway cũng không phải các domain ngang hàng với 8 business domains.**

## Curriculum

- **Track I — Economics & Finance (01–05):** economics, finance, securities, investment.
- **Track II — Market & Brokerage Core (06–12):** matching, market infrastructure, account/cash/position, market data, risk, reconciliation.
- **Track III — Production Securities Engineering (13–24):** OMS, FIX, gateway, post-trade, ledger, event delivery, HA/DR, security, performance, operations, architecture boundaries.

Chi tiết: [docs/lectures/index.md](docs/lectures/index.md).

## Nguyên tắc xuyên suốt

> Đừng bắt đầu từ Microservices. Hãy bắt đầu từ **business invariant + state + authority + failure semantics**.

~~~text
Không bán > Sellable Quantity
Không dùng > Available Buying Power
Một ExecID không được book hai lần
Timeout không tự động đồng nghĩa Failed
FIX failover không được tạo dual session owner
Settlement phải reconcile được với external evidence
~~~

Khi các điều trên đã rõ, việc chọn SQL, Kafka, Redis, modular monolith hay microservices mới có cơ sở.

## Chạy tài liệu local

~~~bash
npm install
npm run dev
~~~

Kiểm tra build và route:

~~~bash
npm run build:check
~~~

Website: https://trinhduyet.github.io/securities.github.io/
