---
title: "UI Inspection — SSI iBoard (authenticated)"
description: "Khảo sát READ-ONLY SSI iBoard đã đăng nhập: menu, terminology, domain map. Phân tách UI quan sát vs reference architecture."
inspectionDate: "2026-08-19"
platform: "SSI iBoard"
---

# SSI iBoard — Authenticated UI Inspection

## Inspection metadata

| Hạng mục | Giá trị |
|---|---|
| Ngày | 19/08/2026 |
| URL | https://iboard.ssi.com.vn/ |
| Authenticated | **Có** (nút Tài khoản hiện; không ghi số TK) |
| Browser | Playwright MCP Extension |
| Giao dịch / chuyển tiền / đổi PIN | **Không thực hiện** |

## Legend

🟢 OBSERVED AUTHENTICATED UI · 🟡 OFFICIAL PUBLIC · 🔵 REFERENCE DESIGN · 🔴 NOT VERIFIED (màn hình không mở)

## Top-level menus discovered (🟢)

```text
Bảng giá
Thông tin thị trường
Giao dịch cơ sở
Giao dịch phái sinh
Giao dịch tiền
Quản lý tài sản
Margin - Vay ký quỹ
Sản phẩm đầu tư
Dịch vụ & Tiện ích
Giao diện của tôi
```

Board filters (🟢): Danh mục của tôi, VN30, HNX30, HOSE, HNX, UPCOM, Trái phiếu riêng lẻ, Phái sinh, Chứng quyền, ETF, Lô lẻ, Đặt lệnh.

### Submenu Thông tin thị trường (🟢 DOM popup `mainMenu-marketInsight`)

```text
Biểu đồ kỹ thuật          /analysis/trading-view
Cảnh báo                  /analysis/alerts
Toàn cảnh thị trường      /analysis/market-overview
Xu hướng dòng tiền        /analysis/money-flow
Cổ phiếu ngành & heatmap  /market-insight
Bản đồ nhiệt chuyên sâu   /analysis/in-depth-heatmap
Bộ lọc cổ phiếu           /analysis/stock-filter
Top cổ phiếu              /analysis/top-stock
Phân tích cơ bản          /analysis/fundamental-analysis
Báo cáo doanh nghiệp      /analysis/business-snapshot
Thông tin doanh nghiệp    /analysis/company-profile
Tin tức & sự kiện         /news
Khuyến nghị đầu tư        /trading-recommendations
```

Các submenu khác (Giao dịch cơ sở / phái sinh / tiền / tài sản / sản phẩm / tiện ích) **không** render popup ổn định khi hover tự động; inventory bên dưới lấy từ **label SPA đã login**, không phải từ screenshot form.

### Capability inventory từ client authenticated (🟢 labels trong SPA)

Không mở form giao dịch. Các label sau tồn tại trong ứng dụng đã login:

```text
Trading: Đặt lệnh cơ sở, Đặt lệnh thỏa thuận, Sổ lệnh cơ sở, Sửa lệnh, Hủy lệnh,
         Lệnh điều kiện, Sổ lệnh điều kiện, Đặt lệnh phái sinh, Sổ lệnh phái sinh
Cash:    Nộp/chuyển tiền, Ứng trước tiền bán, Sao kê tiền cơ sở/phái sinh,
         Ứng trước ký quỹ phái sinh
Assets:  Danh mục cơ sở/phái sinh, Tài sản & Hiệu suất, Lãi/Lỗ
Margin:  Tổng quan, Thông tin khoản vay, Gói vay, Tỷ lệ KQ, Tăng sức mua, Mã cho vay
Bonds:   Giao dịch trái phiếu, SBOND / SBOND PRO
Funds:   Giao dịch CCQ mở, Sổ lệnh CCQ, Danh mục CCQ  (🔴 màn hình không mở)
Rights:  Thông tin quyền
IPO:     IPO Cổ phiếu, IPO Chứng quyền
S-CASH:  sản phẩm sinh lời trên tiền
```

**Screens inspected:** Bảng giá `/` · Margin Tổng quan `/margin/general` · route `/analysis/market-overview` (đã mở; dashboard chủ yếu canvas/lazy — **không** screenshot vì nút tài khoản chứa PII).  
**Screens skipped for safety:** Đặt lệnh submit, Tăng sức mua / Kích hoạt Siêu Vốn M+ / Đăng ký gói vay, chuyển tiền, ứng trước, hủy/sửa lệnh, đổi mật khẩu, danh mục có holdings.

## Screenshots

| File | Ghi chú |
|---|---|
| `./screenshots/ssi/ssi-market-board.png` | Board VN30; đã ẩn nút số tài khoản |
| `./screenshots/ssi/ssi-margin.png` | Tổng quan margin; số nợ/lãi = 0 trên UI |

---

## Feature: Bảng giá realtime

**Status:** 🟢 · **Domain:** [05](/domains/05-realtime-analytics)

### 1. UI

Chỉ số VNINDEX/VN30/HNX, 3 mức bid/ask, khớp, Trần/Sàn/TC, ĐTNN, nút Đặt lệnh.

### 2. Business meaning

Nhà đầu tư theo dõi **quote + last trade** trước khi ra lệnh.

### 3. Glossary

| Term | Tiếng Việt | Ví dụ |
|---|---|---|
| Tick | Một cập nhật giá/KL | FPT last nháy 69.00, KL 300 |
| Quote | Snapshot mua/bán | Bid1 / Ask1 |
| Bid / Ask | Giá mua / bán tốt nhất | 3 mức mỗi bên |
| Spread | Ask − Bid | 0.10 nếu bid 68.90 ask 69.00 |
| Depth | Độ sâu sổ lệnh | KL1+KL2+KL3 |
| OHLCV | Nến | Cao/Thấp trên cột Cao/Thấp |
| Reference / Trần / Sàn | TC, ceiling, floor | cột TC / Trần / Sàn |
| Session | Trạng thái phiên | UI: **Liên tục** |

### 4. Example

VNINDEX 1,733.46 (+0.08%); FPT khớp 69.00 (số trên board công khai, không phải holdings).

### 5. State / lifecycle

```text
Session: ATO → Liên tục → ATC → Đóng cửa
QuoteSnapshot cập nhật trong phiên Liên tục
```

### 6. Invariants

Giá khớp ∈ [sàn, trần]. Bid ≤ Ask ở cùng mức hợp lệ. Volume ≥ 0.

### 7. Reference API (🔵 không phải API SSI)

`GET /market/quotes` · `GET /market/depth/{symbol}` · WS `quotes.subscribe`

### 8. Reference data model

`Instrument` · `QuoteSnapshot` · `OrderBookLevel` · `TradePrint` · `IndexPoint`

### 9. Events

`QuoteUpdated` · `TradePrinted` · `SessionChanged` · `IndexTick`

### 10. Dependencies

Exchange market data · Index vendor · Clock/session calendar

### 11. Failure

Feed stale; sequence gap; duplicate tick; late print sau đóng cửa.

### 12. Reconciliation

Last quote UI ↔ official HOSE/HNX close. Volume board ↔ exchange volume.

---

## Feature: Đặt lệnh cổ phiếu (form, không submit)

**Status:** 🟢 nút **Đặt lệnh** trên board · 🔴 không mở ticket chi tiết / không bấm Mua  
**Domain:** [01](/domains/01-securities-core)

### 1. UI

Nút Đặt lệnh trên bảng giá. Menu Giao dịch cơ sở chứa Đặt lệnh / Sổ lệnh (labels SPA).

### 2. Business meaning

Tạo order BUY/SELL sau validate account + buying power + (nếu SELL) sellable qty.

### 3. Glossary

| Term | Tiếng Việt | Ý nghĩa |
|---|---|---|
| Order | Lệnh | Ý định mua/bán chưa chắc đã khớp |
| Buying power | Sức mua | Giá trị derived, không phải cash balance |
| Reservation | Giữ chỗ tiền/CK | Trừ sức mua/CK khả dụng khi lệnh còn sống |
| Execution | Khớp | Venue xác nhận fill; khác order |

### 4. Example (minh họa, không phải lệnh thật)

```text
BUY 1,000 FPT @ 120,000
Order value = 120,000,000 + fee/buffer
→ RequiredBuyingPower
Invariant: RequiredCash <= BuyingPower
```

### 5. State

`CREATED → VALIDATING → PENDING_NEW → NEW/WORKING`

### 6. Invariants

`RequiredCash <= BuyingPower` · `SellQty <= SellableQty` · `CumQty <= OrderQty`

### 7. Reference API

`POST /orders` · `GET /accounts/{id}/buying-power` — **không** phải API SSI.

### 8. Reference data model

`TradingAccount` · `CashReservation` · `Order` · `BuyingPowerSnapshot`

### 9. Events

`OrderAccepted` · `OrderRejected` · `CashReserved`

### 10. Dependencies

Identity · Risk/margin · Market session · Exchange gateway

### 11. Failure

Duplicate click; timeout UNKNOWN; stale buying power; reject vì phiên sai.

### 12. Reconciliation

Client ACK ↔ broker order id ↔ venue order id.

---

## Feature: Sổ lệnh

**Status:** 🟢 label SPA `Sổ lệnh cơ sở` · 🔴 không mở bảng lệnh thật (tránh holdings)  
**Domain:** 01

### 1–2. UI / business

Read model: người dùng theo dõi trạng thái lệnh, KL khớp, KL còn lại. **Order ≠ Execution ≠ Trade.**

### 3. Glossary

Khớp một phần = `PARTIALLY_FILLED`. Khớp hết = `FILLED`. Hủy = `CANCELLED` (sau pending cancel).

### 4. Example

```text
OrderQty 1,000 · CumQty 400 · Leaves 600 → PARTIALLY_FILLED
```

### 5. State

```text
CREATED → VALIDATING → PENDING_NEW → NEW/WORKING
→ PARTIALLY_FILLED → FILLED
NEW → PENDING_CANCEL → CANCELLED
```

### 6. Invariants

`CumQty + LeavesQty = OrderQty` (sau cancel: leaves = 0). `CumQty <= OrderQty`.

### 7–10. Reference

API: `GET /orders` · `GET /orders/{id}`. Model: `Order` · `Execution` · `Trade`. Events: `ExecutionReceived` · `OrderFilled`. Deps: OMS · Exchange.

### 11–12. Failure / recon

Partial fill + cancel race; duplicate execution; timeout hủy. Reconcile: sổ lệnh UI ↔ OMS ↔ venue.

---

## Feature: Portfolio / tài sản

**Status:** 🟢 menu Quản lý tài sản + labels Danh mục/Hiệu suất/Lãi/Lỗ · 🔴 không chụp số dư  
**Domain:** Cross 01/02/03

Portfolio = **projection**. Ví dụ reference (không phải số account):

```text
Cash             100m
Stocks           300m
Pending Receive   50m
Debt             -80m
---------------------
Net Assets       370m
```

---

## Feature: Cash / ứng trước tiền bán

**Status:** 🟢 menu Giao dịch tiền + label SPA `Ứng trước tiền bán` · 🔴 không submit  
**Domain:** 01 + 08

```text
SELL fill → Trade → Pending receivable
→ Advance request → Principal + Fee → Available cash tăng
→ Settlement → Offset advance
```

SettledCash ≠ AvailableCash ≠ Reserved ≠ PendingReceivable.

---

## Feature: Margin

**Status:** 🟢 `/margin/general`

UI: Gói của tôi, Tỷ lệ KQ, Trạng thái **An toàn**, Tổng nợ, Lãi tạm tính, Siêu Vốn M+, Thông tin khoản vay, Tăng sức mua (**không click**), Mã cho vay, Lịch sử yêu cầu.

Cash ≠ Credit ≠ Buying Power.

```text
Settled Cash            200m
Available Credit        250m
Existing Debt          -100m
Reserved Orders         -50m
Risk Buffer             -20m
----------------------------
Buying Power            280m   (reference)
```

Skipped: Kích hoạt Siêu Vốn M+, Tăng sức mua.

---

## Feature: Derivatives

**Status:** 🟢 menu Giao dịch phái sinh + board tab Phái sinh · 🔴 không mở vị thế  
**Domain:** [02](/domains/02-derivatives-core)

```text
LONG 2 HĐ, entry 1,300, mark 1,310, multiplier M
PnL = (1,310 - 1,300) × 2 × M
```

Reverse = đóng vị thế hiện tại + mở chiều ngược (🔵, không quan sát form Reverse).

---

## Feature: Conditional orders

**Status:** 🟢 SPA `Đặt lệnh điều kiện`, `Sổ lệnh điều kiện` · 🔴 không tạo rule  
**Domain:** [06](/domains/06-conditional-orders)

```text
ACTIVE → TRIGGERING → GENERATED_ORDER → SUBMITTED → COMPLETED
```

Duplicate tick không được sinh hai trading order: `GeneratedOrderKey = ConditionalOrderId + TriggerVersion` (🔵).

---

## Feature: Bonds / S-CASH / IPO / Rights

| Feature | Status | Domain |
|---|---|---|
| Trái phiếu riêng lẻ (board) | 🟢 | 03 + 05 |
| SBOND / SBOND PRO | 🟢 labels SPA | [03](/domains/03-bonds-core) |
| S-CASH banner | 🟢 | 08 / cash product |
| Thông tin quyền | 🟢 label | 01 + 08 |
| IPO cổ phiếu / CW | 🟢 labels | 08 |
| CCQ mở | 🟢 labels | 04 — màn hình 🔴 |
| Rewards | 🔴 | 07 |

Corporate action: Record Date, Ex-Date, Payment Date, Entitlement, Election, Allocation.

---

## SSI → 8 Core Domains

| Domain | Observed |
|---|---|
| 01 Securities | Board, Đặt lệnh, Sổ lệnh, lô lẻ, thỏa thuận |
| 02 Derivatives | Menu + board Phái sinh |
| 03 Bonds | Trái phiếu riêng lẻ, SBOND labels |
| 04 Funds | CCQ labels — screen 🔴 |
| 05 Analytics | Bảng giá, chỉ số, ĐTNN |
| 06 Conditional | Labels lệnh điều kiện |
| 07 Rewards | Chưa thấy |
| 08 Workflow | Margin gói vay, quyền, IPO, chuyển tiền (không submit) |

Xem case study: [ssi-iboard](./ssi-iboard)
