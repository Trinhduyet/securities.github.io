---
title: "System Map — Brokerage Platform Architecture"
description: "Bản đồ canonical phân biệt Trading Core/OMS, Exchange Gateway, Market Data, Post-trade, VSDC, Ledger và 8 business domains."
---

# System Map — Công ty chứng khoán nhìn từ Backend

> **Đây là system map canonical của website.** Các bài khác nên dẫn về đây thay vì tự tạo một topology cạnh tranh.

Trang này phân biệt ba loại khái niệm:

- **Business domain** — Securities, Derivatives, Bonds...
- **Runtime/system component** — OMS, Risk Engine, Exchange Gateway, Market Data Platform...
- **External market infrastructure** — trading venue, depository/clearing infrastructure, settlement bank.

## 1. Bản đồ tổng thể

~~~mermaid
flowchart TB
    INV[Investor Web / Mobile] --> API[API Gateway / BFF]
    API --> IAM[Customer / IAM / Trading Account]

    API --> OMS[Trading Core / OMS]
    IAM --> OMS
    OMS --> RISK[Risk / Limits / Reservation]
    RISK --> OMS

    OMS --> EXGW[Exchange Connectivity / Gateway]
    EXGW --> VENUE[HOSE / HNX Trading Infrastructure]
    VENUE --> EXGW
    EXGW --> OMS

    MKT[Market Data Sources] --> MD[Market Data Platform]
    MD --> INV
    MD --> RISK
    MD --> ANA[Realtime Analytics]
    ANA --> COND[Conditional Orders]
    COND --> OMS

    OMS --> TRADE[Execution / Trade Booking]
    TRADE --> POST[Post-Trade / Clearing / Settlement]
    POST --> VSDC[VSDC / Depository / Clearing Infrastructure]
    POST --> BANK[Settlement Bank]

    OMS --> LEDGER[Cash / Securities Ledger]
    TRADE --> LEDGER
    POST --> LEDGER

    EXGW --> RECON[Reconciliation]
    POST --> RECON
    LEDGER --> RECON
    VSDC --> RECON
    BANK --> RECON

    API --> DER[Derivatives Core]
    API --> BOND[Bonds Core]
    API --> FUND[Funds Core]
    API --> WF[Enterprise Workflow]

    OMS --> EVT[Business Events]
    DER --> EVT
    BOND --> EVT
    FUND --> EVT
    EVT --> REWARD[Rewards]
~~~

Đây là **mental model học tập**, không phải topology bắt buộc của một CTCK cụ thể.

## 2. Ba flow phải tách biệt

### Order / Trading Flow

~~~text
Investor
→ Trading API
→ Pre-trade Risk
→ Cash/Securities Reservation
→ OMS
→ Exchange Gateway
→ Trading Venue
→ ACK / Reject / Execution
~~~

### Market Data Flow

~~~text
Market Feed
→ Sequence / Normalize / Validate
→ Realtime Store / Stream
→ UI / Risk / Analytics / Conditional Orders
~~~

### Post-Trade Flow

~~~text
Execution
→ Trade Booking
→ Clearing / Netting
→ Settlement Obligation
→ VSDC / Settlement Bank
→ Reconciliation
~~~

**VSDC không nên được vẽ như một nhánh giống HOSE/HNX dưới cùng một order gateway.** Broker có thể có connectivity riêng cho post-trade/depository operations, nhưng trách nhiệm nghiệp vụ khác exchange order routing.

## 3. Trading Core / OMS

OMS là stateful business processor cho vòng đời order.

~~~text
Accept command
→ validate
→ reserve resource
→ persist order intent
→ route outbound
→ process venue events
→ update quantities/status
→ book execution/trade
→ release/consume reservation
→ recover/reconcile
~~~

Một OMS production **không phải CRUD table orders**.

Đọc sâu:
- [Domain 01 — Securities Core](../domains/01-securities-core.html)
- [Bài 11 — Risk, Margin & Controls](../lectures/11-risk-margin-controls/)
- [Bài 13 — OMS Internals](../lectures/13-oms-internals-state-machine/)

## 4. Exchange Gateway

Gateway là protocol boundary giữa canonical business model của broker và venue-specific contract.

~~~text
Trading Core
→ Exchange Port
→ Venue Adapter
→ Session Engine
→ Network
→ Venue
~~~

Trách nhiệm thường gồm mapping protocol, session lifecycle, sequence/recovery, heartbeat/reconnect, routing, bounded queue/backpressure, durable inbound/outbound state, certificates, ownership/fencing và certification.

Core không nên biết raw FIX tags hay network session details.

Đọc sâu:
- [Bài 14 — FIX Session Recovery](../lectures/14-fix44-session-recovery/)
- [Bài 15 — Exchange Gateway](../lectures/15-exchange-gateway-krx-connectivity/)

## 5. Broker OMS khác Central Matching Engine

| Broker OMS | Trading Venue / Matching |
|---|---|
| Client order intent | Venue-accepted order |
| Buying power / reservation | Central market rules |
| Broker-side state | Venue-side state |
| Route/cancel/replace command | Matching / execution |
| Internal recovery | Market authoritative reports |

~~~text
Broker Working Orders / Order Projection
≠
Central Limit Order Book của trading venue
~~~

## 6. KRX nên được hiểu thế nào?

Trong tài liệu này, **KRX là bối cảnh technology platform của market infrastructure**, không phải một endpoint duy nhất mà mọi broker component gọi trực tiếp.

~~~text
Broker Systems
   │
   ├─ Exchange Connectivity
   │       ↓
   │   Trading Infrastructure
   │   (HOSE / HNX / venue rules)
   │
   └─ Post-Trade Connectivity
           ↓
       Clearing / Depository / Settlement
       (VSDC and related participants)
~~~

Khi implement thật, luôn dùng specification/certification material chính thức áp dụng cho member interface đang tích hợp.

## 7. FIX Session khác Order State

FIX xử lý protocol state như MsgSeqNum, Heartbeat, ResendRequest, GapFill, PossDup, Logon/Logout.

Order domain xử lý business identity/state như ClientOrderId, VenueOrderId, ExecId, Working, Partially Filled, Filled, Cancelled, Rejected.

~~~text
transport may replay
        ↓
business dedup
        ↓
business effect once
~~~

## 8. Post-Trade và VSDC

FILLED chưa phải kết thúc.

~~~text
Execution
→ Trade Booking
→ Clearing
→ Netting / Obligation
→ Settlement
→ Cash + Securities Movement
→ Reconciliation
~~~

VSDC nằm chủ yếu trong post-trade/depository/clearing/settlement boundary. Settlement bank cung cấp authority/evidence cho cash leg tương ứng.

Đọc sâu:
- [Bài 16 — Trade Capture](../lectures/16-trade-capture-booking/)
- [Bài 17 — Clearing, Netting & Settlement](../lectures/17-clearing-netting-settlement/)
- [Bài 18 — Ledger](../lectures/18-ledger-accounting-projections/)

## 9. Authority thinking

Không có một database là source of truth cho toàn platform.

| Fact | Authority / evidence điển hình |
|---|---|
| Customer profile | Customer/IAM core |
| Internal order intent | OMS |
| Venue-assigned order/execution status | Venue message + reconciliation evidence |
| Internal cash ledger | Ledger core |
| Depository holdings | Depository/custodian evidence |
| Settlement result | Post-trade/VSDC/bank evidence |
| Market price | Approved market-data source |

Architecture tốt document authority **theo business fact**, không theo tên database.

## 10. Reliability xuyên suốt

~~~text
messages may duplicate
messages may arrive late
responses may be lost
processes may restart
network may disconnect
state may temporarily diverge
~~~

Do đó cần hiểu Idempotency, Inbox/Dedup, Transactional Outbox, Durable Message Store, Bounded Queue, Backpressure, Replay, Reconciliation, Fencing và Audit Trail.

Mục tiêu thực tế:

~~~text
message may arrive many times
→ business effect applied once
~~~

## 11. 8 business domains nằm ở đâu?

| Domain | System/engineering concerns thường liên quan |
|---|---|
| Securities Core | OMS, Risk, Ledger, Gateway, Post-trade |
| Derivatives Core | Position, Margin, Risk, Settlement |
| Bonds Core | Security master, Cash flow, Settlement, Ledger |
| Funds Core | NAV, Subscription/Redemption, Cash, Cut-off |
| Realtime Analytics | Market Data, Streaming, Indicators |
| Conditional Orders | Market Data + Trigger + OMS |
| Rewards | Business Events + Points Ledger |
| Enterprise Workflow | IAM, Approval, SLA, Audit |

→ [Xem 8 Core Domains](../domains/)

## 12. Learning path

### Backend developer → core securities engineer

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

### Business/product track

~~~text
System Map
→ Securities
→ Derivatives
→ Bonds
→ Funds
→ Realtime
→ Conditional Orders
→ Rewards / Workflow
~~~

Sau đó mới quyết định modular monolith, microservices, event bus, database hay deployment topology.
