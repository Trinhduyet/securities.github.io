---
title: "8 Core Domains của một công ty chứng khoán"
description: "Định vị 8 business domains trong brokerage platform và nối chúng với OMS, Risk, Gateway, Post-trade và production engineering."
---

# 8 Core Domains của một công ty chứng khoán

<div class="lesson-meta">
  <span><strong>Đối tượng</strong> Backend developer chưa làm core chứng khoán</span>
  <span><strong>Cách học</strong> System map → domain → lifecycle → failure → engineering</span>
</div>

## 1. Đừng coi 8 domain là 8 service

Đọc **[System Map](../resources/system-map.html)** trước.

Có hai taxonomy khác nhau:

### Business taxonomy

Securities, Derivatives, Bonds, Funds, Realtime Analytics, Conditional Orders, Rewards và Enterprise Workflow.

### Engineering taxonomy

Risk, OMS, FIX Session, Exchange Gateway, Trade Capture, Clearing/Settlement, Ledger/Reconciliation, Event Delivery, HA/DR và Performance.

**OMS, FIX và Gateway không phải các domain ngang hàng với Securities/Bonds/Funds.** Chúng là system/engineering concerns phục vụ một hoặc nhiều domain.

Domain cũng **không đồng nghĩa với microservice**.

## 2. Mental model toàn platform

~~~text
ORDER FLOW
Investor
→ Trading API
→ Risk / Reservation
→ OMS
→ Exchange Gateway
→ Trading Venue

MARKET DATA FLOW
Market Feed
→ Realtime Platform
→ UI / Risk / Analytics / Conditional Orders

POST-TRADE FLOW
Execution
→ Trade Booking
→ Clearing / Settlement
→ VSDC / Settlement Bank
→ Reconciliation
~~~

Điểm cần nhớ:

- Broker OMS khác central matching engine.
- FIX session state khác order business state.
- Exchange Gateway khác Post-trade connectivity.
- VSDC không nên được mô hình hóa như một order venue cùng cấp dưới Exchange Gateway.
- FILLED không đồng nghĩa SETTLED.
- Timeout không tự động đồng nghĩa FAILED.

## 3. Từ điển nền tảng

| Thuật ngữ | Nghĩa dễ hiểu | Ví dụ |
|---|---|---|
| Lifecycle | Vòng đời của business object | NEW → PARTIALLY_FILLED → FILLED |
| State | Trạng thái hiện tại | WORKING, CANCELLED, SETTLED |
| Invariant | Điều kiện tuyệt đối không được phá | Không bán > sellable quantity |
| Authority | Nguồn có quyền xác nhận một fact | Venue evidence cho execution |
| Ledger | Lịch sử business effects | deposit, reserve, settlement, fee |
| Projection | Current view tính từ history | available cash, position |
| Idempotency | Duplicate không tạo effect lần hai | cùng ExecId chỉ book một lần |
| Reservation | Giữ resource tránh double spending | giữ cash cho BUY |
| Settlement | Chuyển giao tiền/chứng khoán | cash leg + securities leg |
| Reconciliation | So internal state với external evidence | internal trade ↔ venue evidence |
| Unknown outcome | Timeout khiến chưa biết external side đã commit chưa | gửi order rồi mất ACK |

## 4. Bản đồ 8 business domains

| # | Domain | Câu hỏi business chính | Ví dụ |
|---|---|---|---|
| 1 | [Securities Core](./01-securities-core.html) | Order, execution, trade, cash/position thay đổi thế nào? | BUY 1.000 FPT |
| 2 | [Derivatives Core](./02-derivatives-core.html) | Long/Short, P&L và margin được quản lý thế nào? | Long futures |
| 3 | [Bonds Core](./03-bonds-core.html) | Coupon, yield, accrued interest, maturity thế nào? | Bond coupon 8% |
| 4 | [Funds Core](./04-funds-core.html) | Subscription/redemption dùng NAV và cut-off nào? | Mua quỹ mở |
| 5 | [Realtime Analytics](./05-realtime-analytics.html) | Tick thành candle/indicator/signal thế nào? | 1-minute candle |
| 6 | [Conditional Orders](./06-conditional-orders.html) | Condition đúng thì sinh đúng một order thật thế nào? | Stop-loss |
| 7 | [Rewards](./07-rewards.html) | Earn/use/expire/adjust points thế nào? | Trading reward |
| 8 | [Enterprise Workflow](./08-enterprise-workflow.html) | Approval/SLA/maker-checker/audit chạy thế nào? | eKYC/approval |

## 5. Domain map theo system concern

| Domain | System/engineering concerns |
|---|---|
| Securities | Risk, Reservation, OMS, Gateway, Trade, Ledger, Settlement |
| Derivatives | Position, Margin/Risk, Market Data, Settlement |
| Bonds | Security Master, Cash Flow, Ledger, Settlement |
| Funds | NAV, Subscription/Redemption, Cash, Workflow |
| Realtime Analytics | Market Data, Streaming, Time-series |
| Conditional Orders | Market Data, Trigger State, Idempotency, OMS |
| Rewards | Event Delivery, Rules, Points Ledger |
| Enterprise Workflow | IAM, Approval, SLA, Audit |

Bảng này chỉ định vị concern, không khẳng định deployment topology.

## 6. Hai learning path

### Business track

~~~text
System Map
→ Securities Core
→ Derivatives / Bonds / Funds
→ Realtime Analytics
→ Conditional Orders
→ Rewards / Enterprise Workflow
~~~

### Production engineering track

~~~text
System Map
→ Securities Core
→ Risk & Limits
→ OMS Internals
→ FIX Session
→ Exchange Gateway
→ Trade Capture
→ Clearing / Settlement
→ Ledger
→ Event Delivery
→ HA / DR
→ Performance / Operations
~~~

Đọc tiếp:
1. [Risk, Margin & Controls](../lectures/11-risk-margin-controls/)
2. [OMS Internals](../lectures/13-oms-internals-state-machine/)
3. [FIX Session Recovery](../lectures/14-fix44-session-recovery/)
4. [Exchange Gateway](../lectures/15-exchange-gateway-krx-connectivity/)
5. [Trade Capture](../lectures/16-trade-capture-booking/)
6. [Clearing, Netting & Settlement](../lectures/17-clearing-netting-settlement/)
7. [Ledger](../lectures/18-ledger-accounting-projections/)
8. [HA / DR](../lectures/20-ha-dr-bcp-observability/)
9. [Performance / Capacity](../lectures/22-performance-capacity-latency/)

## 7. Cách đọc mỗi domain

~~~text
Business problem là gì?
→ Entity nào?
→ State machine nào?
→ Invariant nào?
→ Resource nào bị reserve/consume?
→ Authority nào xác nhận external outcome?
→ Timeout/duplicate/out-of-order thì sao?
→ Durable identity là gì?
→ Recovery/replay thế nào?
→ Reconcile bằng evidence nào?
~~~

## 8. Những nhầm lẫn cần tránh

- Broker working-order view không phải central order book của venue.
- Gateway không nên được mặc định coi là stateless REST proxy.
- KRX không nên được hiểu là một API duy nhất.
- VSDC không phải “venue thứ ba” của exchange order gateway.
- FILLED không đồng nghĩa settlement hoàn tất.

## 9. Bắt đầu học

1. [System Map](../resources/system-map.html)
2. [Domain 01 — Securities Core](./01-securities-core.html)
3. [Bài 11 — Risk](../lectures/11-risk-margin-controls/)
4. [Bài 13 — OMS](../lectures/13-oms-internals-state-machine/)
5. [Bài 14 — FIX](../lectures/14-fix44-session-recovery/)
6. [Bài 15 — Exchange Gateway](../lectures/15-exchange-gateway-krx-connectivity/)
7. [Bài 16–18 — Post-trade + Ledger](../lectures/16-trade-capture-booking/)
8. [Engineering Track](../engineering/)

Sau đó quay lại các domain khác với cùng mental model: **business fact → state → invariant → authority → failure → recovery → reconciliation**.
