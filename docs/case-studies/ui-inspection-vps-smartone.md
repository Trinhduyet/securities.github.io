---
title: "UI Inspection — VPS SmartOne (authenticated)"
description: "Khảo sát READ-ONLY SmartOne Web đã đăng nhập: menu, terminology, domain map. Không lộ PII."
inspectionDate: "2026-08-19"
platform: "VPS SmartOne Web"
---

# VPS SmartOne — Authenticated UI Inspection

## Inspection metadata

| Hạng mục | Giá trị |
|---|---|
| Ngày | 19/08/2026 |
| URL | https://smartoneweb.vps.com.vn/ |
| Authenticated | **Có** (không còn nút Đăng nhập; header hiện tên — **đã ẩn, không ghi**) |
| Browser | Playwright MCP Extension |
| Giao dịch / chuyển tiền | **Không thực hiện** |

## Legend

🟢 OBSERVED · 🟡 OFFICIAL ([Brief User Guide](https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide)) · 🔵 REFERENCE · 🔴 screen không mở

## Top-level menus (🟢)

```text
Bảng giá
Thị trường
Cơ sở
Phái sinh
Tài sản
Tiện ích
Ưu đãi / Discover
```

Board tabs (🟢): HOSE, VN30, HNX, HNX30, UPCOM, Phái sinh, CP Ngành, Thỏa thuận, Tự doanh, Lô lẻ, Chứng quyền, ETF.

### Capability labels trong client authenticated (🟢 SPA)

```text
Orders:  Đặt lệnh cơ sở/phái sinh, Sổ lệnh trong ngày, Sổ lệnh thường,
         Trạng thái lệnh, Lịch sử lệnh, Sổ lệnh phiên kế tiếp,
         Hủy lệnh (không click)
Cond:    Lệnh điều kiện STOP / TCO / Trailing stop / SL/TP, Sổ lệnh điều kiện
Assets:  Danh mục đầu tư, Tài sản ròng, Tài sản cơ sở/phái sinh,
         Sức mua, Sức mua từ tiền mặt, CK khả dụng (guide),
         Tiền chờ VSD, Sao kê tiền/CK/lãi lỗ
Cash:    Chuyển tiền nội bộ / Napas / NH liên kết, Ứng trước tiền bán,
         Ứng trước tự động (không submit)
Rights:  Lịch sử hưởng quyền
```

**Screens inspected:** Bảng giá `/` · Thị trường `/market`  
**Không commit screenshot header** (có tên khách hàng). Dùng board public cũ: `./screenshots/vps/vps-market-board.png`. Widget thị trường đã chụp phiên public: `./screenshots/vps-smartone/vps-market-*.png`.  
**Skipped:** Đặt/Hủy lệnh, Chuyển tiền, Ứng trước, Tài sản (holdings), bất kỳ nút không chắc READ.

### Widgets `/market` (🟢 authenticated)

```text
ALL / HSX / HNX / VN30 / UPCOM
Tiêu chuẩn · Nâng cao · Bổ trợ (Tin tức)
Dòng chảy thị trường
Độ sâu thị trường
Khối ngoại
Tự doanh
Top tăng / Top giảm
Cổ phiếu GD hàng đầu
Top GD nước ngoài
Chuyển động thị trường
```

---

## Feature: Bảng giá

**Status:** 🟢 · **Domain:** [05](/domains/05-realtime-analytics)

Cột: Mã CK, TC, Trần, Sàn, Bid/Ask 1–3, Khớp, ĐTNN. Chỉ số VN-INDEX, Tổng GD / Tổng GDTT.

Tick, Quote, Bid, Ask, Spread, Depth, OHLCV — cùng nghĩa SSI. Ví dụ public phiên trước: VN-INDEX 1,732.02, phiên Đóng cửa / Liên tục tùy thời điểm.

---

## Feature: Trạng thái lệnh (VPS wording)

**Status:** 🟡 official guide · 🟢 SPA `Trạng thái lệnh`  
**Domain:** 01

### 1. UI

Guide + labels SPA: chờ khớp tại VPS / tại sàn; khớp 1 phần / hoàn toàn; chờ hủy tại VPS / tại sàn; từ chối tại VPS / tại sàn.

### 2. Business meaning

Tách **broker accepted** khỏi **market accepted**. Timeout trên UI không chứng minh venue đã reject.

### 3. Glossary

| UI | Ý nghĩa |
|---|---|
| Chờ khớp tại VPS | Broker đã nhận, chưa (hoặc chưa xong) gửi sàn |
| Chờ khớp tại sàn | Đã vào sổ lệnh thị trường |
| Khớp 1 phần | Execution nhưng LeavesQty > 0 |
| Khớp hoàn toàn | FILLED; chưa Settled |
| Từ chối tại VPS / sàn | Reject nội bộ vs reject venue |

### 4. Example

```text
BUY 1,000 FPT @ 120,000
→ chờ VPS → chờ sàn → khớp 400 → PARTIALLY_FILLED
CumQty 400 ≠ Settled
```

### 5. State

```text
CREATED → ACCEPTED_AT_BROKER → SENT_TO_EXCHANGE → WORKING
→ PARTIALLY_FILLED → FILLED
→ PENDING_CANCEL → CANCELLED
```

### 6. Invariants

`CumQty <= OrderQty`. FILLED ≠ Settled.

### 7–10. Reference

`GET /orders/{id}` · `Order`/`Execution`/`Trade`. Events: `OrderAccepted` · `ExecutionReceived`. Deps: OMS · Exchange.

### 11–12. Failure / recon

Cancel race khi đang partial fill; timeout UNKNOWN; duplicate fill. Reconcile internal order ↔ venue.

---

## Feature: Buying power / sức mua

**Status:** 🟢 labels `Sức mua`, `Sức mua từ tiền mặt` · 🔴 không chụp số  
**Domain:** 01 + Risk

### 1–2. UI / business

Buying Power là **derived value**. Không model `Account.Balance = BuyingPower`. Label tách sức mua tổng khỏi sức mua từ tiền mặt chứng minh cash ≠ credit.

### 3. Glossary

Cash (tiền settled) ≠ Credit (hạn mức) ≠ Buying Power (sức mua còn lại sau nợ, reserved, buffer).

### 4. Example (tham chiếu, không phải số TK)

```text
Settled Cash            200m
Available Credit        250m
Existing Debt          -100m
Reserved                -50m
Risk buffer             -20m
----------------------------
Buying Power            280m
```

### 5–6. State / invariant

BuyingPower snapshot theo lệnh/phiên. `RequiredCash <= BuyingPower` tại lúc reserve.

### 7–12. Reference

`GET /accounts/{id}/buying-power`. Model: `CashBalance` · `CreditLimit` · `CashReservation`. Failure: stale BP, double reserve. Recon: cash ledger ↔ credit ↔ open orders.

---

## Feature: CK khả dụng / pending settlement

**Status:** 🟡 guide · 🟢 labels tài sản / tiền chờ VSD  
**Domain:** 01

```text
Total Position       2,000
Pending Receive        500
Reserved Sell          300
Blocked                100
Sellable             1,100   (ví dụ structure)
```

`TotalPosition != SellableQty` · invariant `SellQty <= SellableQty`.

Tiền chờ về / CK chờ nhận / CK chờ gửi: TradeDate → SettlementDate → SettledCash / SettledPosition.

---

## Feature: Portfolio / P&L

**Status:** 🟢 `Danh mục đầu tư`, `Sao kê lãi lỗ` · 🔴 không chụp P&L thật  
Unrealized vs Realized. Giá TB vs Giá TT (guide PVA lỗ 522,000đ / 6.79%).

---

## Feature: Cash transfer / ứng trước

**Status:** 🟢 labels Chuyển tiền, Ứng trước · 🔴 không submit · **Domain:** 01 + 08

Internal / Napas / NH liên kết. Timeout ≠ failed; cần inquiry.

---

## Feature: Derivatives / Conditional / Rewards / Bonds / Funds

| Feature | Status | Domain |
|---|---|---|
| Phái sinh menu + board | 🟢 | 02 |
| Lệnh điều kiện STOP/TCO/Trailing/SLTP | 🟢 labels | 06 |
| Ưu đãi / Discover | 🟢 | 07 |
| Tài sản trái phiếu / VPS bond / quỹ | 🟢 labels | 03 / 04 — screen 🔴 |
| Lịch sử hưởng quyền | 🟢 labels | 01 + 08 |

---

## VPS → 8 Core Domains

| Domain | Observed |
|---|---|
| 01 | Board, đặt lệnh labels, sổ lệnh, sức mua, CK khả dụng, pending VSD |
| 02 | Menu + board Phái sinh |
| 03 | Label tài sản trái phiếu — screen 🔴 |
| 04 | Label tài sản quỹ — screen 🔴 |
| 05 | Bảng giá, Thị trường |
| 06 | STOP/TCO/Trailing/SLTP labels |
| 07 | Ưu đãi |
| 08 | Chuyển tiền, ứng trước, quyền (không submit) |

Xem [vps-smartone](./vps-smartone)
