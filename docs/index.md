---
layout: home

title: Securities Engineering
titleTemplate: false

hero:
  name: Securities Engineering
  text: Business Domains → Trading Systems → Production
  tagline: Hiểu một nền tảng chứng khoán từ Order, Risk và OMS đến Exchange Gateway, FIX, Clearing, VSDC, Ledger, Reconciliation và HA/DR.
  actions:
    - theme: brand
      text: Xem System Map
      link: /resources/system-map.html
    - theme: alt
      text: 8 Business Domains
      link: /domains/index.html
    - theme: alt
      text: 24 bài giảng
      link: /lectures/index.html

features:
  - title: System-first
    details: Biết OMS, Gateway, Market Data, Post-trade và VSDC nằm ở đâu trước khi học chi tiết từng domain.
  - title: Business-first
    details: Mỗi thiết kế bắt đầu từ lifecycle, invariant, authority và state — không bắt đầu từ framework.
  - title: Failure-driven
    details: Timeout, duplicate, retry, replay, split brain và reconciliation là phần của thiết kế.
  - title: Evidence-aware
    details: Phân biệt UI/public evidence, internal state và external authoritative state.
---

## Bắt đầu bằng bản đồ hệ thống

Nếu mới vào ngành chứng khoán, hãy đọc **[System Map](./resources/system-map.html)** trước.

Nó trả lời bốn câu hỏi nền tảng:

1. Trading Core / OMS chịu trách nhiệm gì?
2. Exchange Gateway khác OMS ở đâu?
3. Trading Venue / Market Infrastructure khác broker system thế nào?
4. Vì sao VSDC / Settlement Bank thuộc post-trade path chứ không phải cùng một order gateway?

~~~text
ORDER
Investor
→ Trading API
→ Risk / Reservation
→ OMS
→ Exchange Gateway
→ Trading Venue

POST-TRADE
Execution
→ Trade Booking
→ Clearing / Settlement
→ VSDC / Settlement Bank
→ Reconciliation

MARKET DATA
Market Feed
→ Normalize / Sequence / Freshness
→ Realtime Platform
→ UI / Risk / Analytics
~~~

## Sau System Map, chọn mục tiêu học

<div class="course-grid">
  <a class="course-card" href="./domains/"><strong>8 Core Domains</strong><span>Business lifecycle: Securities, Derivatives, Bonds, Funds, Realtime, Conditional Orders, Rewards và Workflow.</span></a>
  <a class="course-card" href="./lectures/"><strong>24 Lectures</strong><span>Lộ trình tuần tự từ economics/finance đến market infrastructure và production engineering.</span></a>
  <a class="course-card" href="./engineering/"><strong>Production Engineering</strong><span>OMS, FIX, Gateway, Ledger, idempotency, reconciliation, HA/DR và architecture boundaries.</span></a>
  <a class="course-card" href="./case-studies/"><strong>Broker App Case Studies</strong><span>Map SSI iBoard, VPS SmartOne và TCInvest từ UI sang entity, state và failure mode.</span></a>
  <a class="course-card" href="./projects/"><strong>Projects & Game Day</strong><span>Order lifecycle, FIX recovery, ledger/reconciliation và production failure drills.</span></a>
  <a class="course-card" href="./stockai/"><strong>StockAI Engineering</strong><span>Case study market data, RAG, AI assistant và .NET orchestration.</span></a>
</div>

## Hai taxonomy khác nhau

### Business taxonomy

Securities, Derivatives, Bonds, Funds, Realtime Analytics, Conditional Orders, Rewards và Enterprise Workflow là **business domains**.

### Engineering taxonomy

Risk, OMS, FIX Session, Exchange Gateway, Trade Capture, Clearing/Settlement, Ledger/Reconciliation, Event Delivery, HA/DR và Performance là **system/engineering concerns**.

Không nên coi hai danh sách này là các component cùng cấp.

## Curriculum 24 bài

- **01–05 — Economics & Finance**
- **06–12 — Market & Brokerage Core**
- **13–24 — Production Securities Engineering**

→ [Xem toàn bộ 24 bài](./lectures/index.html)

## Golden questions

~~~text
Business fact nào đang thay đổi?
Ai là authority của fact đó?
Invariant nào không được phá?
State transition nào hợp lệ?
Timeout có thể là UNKNOWN không?
Duplicate/out-of-order xử lý thế nào?
Durable identity là gì?
Recovery/replay từ đâu?
Reconcile với external evidence nào?
Ai vận hành khi automation không đủ?
~~~

Nếu câu trả lời chưa rõ, việc chọn microservices, Kafka hay database vẫn còn quá sớm.

## Tài nguyên tra cứu

- [System Map](./resources/system-map.html)
- [Glossary](./resources/glossary.html)
- [Competency Matrix](./resources/competency-matrix.html)
- [50 Failure Scenarios](./resources/failure-scenarios.html)
- [Review Checklist](./resources/checklist.html)
- [Primary References](./resources/references.html)
