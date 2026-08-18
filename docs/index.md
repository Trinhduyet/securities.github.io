---
layout: home

title: Securities Engineering
titleTemplate: false

hero:
  name: Securities Engineering
  text: Từ Finance đến Core Trading
  tagline: Lộ trình tiếng Việt dành cho backend engineer muốn hiểu nghiệp vụ chứng khoán đủ sâu để thiết kế Order, Trade, Ledger, Risk, KRX/FIX, Clearing, Settlement và Reconciliation.
  actions:
    - theme: brand
      text: Bắt đầu từ Bài 01
      link: /lectures/01-microeconomics/
    - theme: alt
      text: Xem 8 Core Domains
      link: /domains/

features:
  - title: Finance trước Architecture
    details: Hiểu tiền, công cụ tài chính, định giá, risk và market microstructure trước khi chọn microservice hay event bus.
  - title: Trading end-to-end
    details: Order → Matching → Execution → Trade → Clearing → Settlement → Reconciliation, không dừng ở trạng thái FILLED.
  - title: Production Engineering
    details: Invariant, ledger, idempotency, unknown outcome, replay, HA/DR, audit và vận hành cuối ngày.
---

## Một lộ trình, ba thế giới

Khóa học nối ba mảng thường bị học tách rời: **kinh tế/tài chính**, **nghiệp vụ chứng khoán**, và **software engineering cho hệ thống giao dịch**.

```mermaid
flowchart LR
    A[Vi mô] --> B[Vĩ mô]
    B --> C[Tài chính]
    C --> D[Chứng khoán]
    D --> E[Đầu tư & phân tích]
    E --> F[Order & Matching]
    F --> G[KRX / FIX / VSDC]
    G --> H[8 Core Domains]
    H --> I[Ledger / Risk / Reliability]
    I --> J[Core Securities Engineer]
```

<div class="learning-path">
<strong>Mental model:</strong> Đừng bắt đầu từ Microservices. Bắt đầu từ business rule → state → invariant → failure mode → recovery → reconciliation; sau đó mới chọn architecture.
</div>

## Bắt đầu theo mục tiêu

<div class="course-grid">
  <a class="course-card" href="./lectures/01-microeconomics/"><strong>01 — Nền tảng</strong><span>Vi mô, vĩ mô, finance, securities và phân tích đầu tư.</span></a>
  <a class="course-card" href="./lectures/06-order-matching/"><strong>02 — Trading</strong><span>Order lifecycle, order book, matching, partial fill, cancel/replace.</span></a>
  <a class="course-card" href="./lectures/07-clearing-settlement-krx-fix-vsdc/"><strong>03 — Market Infrastructure</strong><span>FIX session, KRX connectivity, clearing, settlement và VSDC.</span></a>
  <a class="course-card" href="./domains/"><strong>04 — 8 Core Domains</strong><span>Equity, derivatives, bonds, funds, analytics, conditional orders, rewards và workflow.</span></a>
  <a class="course-card" href="./engineering/"><strong>05 — Engineering</strong><span>State machine, ledger, idempotency, reconciliation, HA/DR và observability.</span></a>
  <a class="course-card" href="./projects/"><strong>06 — Projects</strong><span>Xây OMS simulator và thiết kế brokerage platform end-to-end.</span></a>
</div>

## Khi nào bạn thực sự hiểu core securities?

Không phải khi bạn biết tạo endpoint `POST /orders`, mà khi bạn trả lời chắc được các câu hỏi sau:

- tiền nào **available**, tiền nào **reserved**, tiền nào **pending settlement**?
- một order partial fill 3 lần tạo bao nhiêu trade và ảnh hưởng position thế nào?
- timeout lúc submit là thất bại hay **unknown outcome**?
- duplicate execution có làm tăng position hai lần không?
- trạng thái nội bộ khác KRX/VSDC/bank thì hệ thống phát hiện và sửa bằng cách nào?
- process restart hoặc failover thì session/sequence/replay được khôi phục ra sao?

Nếu các câu trả lời đều dẫn về **invariant + durable state + recovery + reconciliation**, bạn đang đi đúng hướng.
