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

| Ký hiệu | Nghĩa |
|---|---|
| 🟢 | **Observed screen** — màn hình authenticated thực sự đã mở |
| 🟣 | **Authenticated client evidence** — label/route/menu SPA; screen chưa inspect đầy đủ |
| 🟡 | **Official documentation** — [Brief User Guide](https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide) |
| 🔵 | **Reference design** |
| 🔴 | **Not verified** |
| — | **Not found** |

**Client evidence** ≠ observed workflow. **Projection** = read model tổng hợp, không nhất thiết source of truth.

## Top-level menus (🟢 observed screen)

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

### Capability labels trong client authenticated (🟣 SPA)

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
**Screenshot authenticated:** `./screenshots/vps/authenticated/` (đã ẩn tên). Public: `./screenshots/vps/public/`. Inventory: [screenshots/README](./screenshots/README).  
**Skipped:** Đặt/Hủy lệnh, Chuyển tiền, Ứng trước, Tài sản (holdings), sức mua số thật, sổ lệnh bảng thật.

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

**Status:** 🟡 official guide · 🟣 SPA label `Trạng thái lệnh` · 🔴 không mở bảng lệnh thật  
**Domain:** 01 · Cross-link: [Bài 13 OMS](/lectures/13-oms-internals-state-machine/)

### 1. UI

Guide + 🟣 labels SPA: chờ khớp tại VPS / tại sàn; khớp 1 phần / hoàn toàn; chờ hủy; từ chối.

### 2. Business meaning

Tách **broker received** khỏi **market handoff**. UI wording **không** chứng minh exchange internal queue, central order book placement, hay exact gateway session state.

Mental model (🔵 reference):

```text
Broker Received → Market Handoff → Market Accepted / Working
→ Matching eligibility → Execution
```

### 3. Glossary

| UI | Ý nghĩa thận trọng |
|---|---|
| Chờ khớp tại VPS | Broker đã nhận; chưa xong bước nội bộ trước/sau handoff |
| Chờ khớp tại sàn | Broker cho biết order đã sang lifecycle phía sàn/thị trường và đang chờ xử lý hoặc khớp theo rule thị trường — **không** đồng nghĩa “đã nằm trong central order book” |
| Khớp 1 phần | Execution; LeavesQty > 0 (🔵) |
| Khớp hoàn toàn | FILLED; chưa Settled |
| Từ chối tại VPS / sàn | Reject nội bộ vs reject phía thị trường |

### 4. Example — BUY + partial + cancel race (🔵)

```text
BUY 1,000 FPT @ 120,000
→ chờ VPS → chờ sàn → khớp 400 (CumQty=400, LeavesQty=600)
User cancel — Case A: CumQty=400, CancelledQty=600, LeavesQty=0
Case B (race): fill thêm 200 → CumQty=600, CancelledQty=400, LeavesQty=0
```

FILLED / partial fill trên UI ≠ Settled.

### 5. State

```text
CREATED → ACCEPTED_AT_BROKER → SENT_TO_EXCHANGE / MARKET_HANDOFF → WORKING
→ PARTIALLY_FILLED → FILLED
→ PENDING_CANCEL → CANCELLED
```

### 6. Invariants

`OrderQty = CumQty + LeavesQty + CancelledQty` (khi model có CancelledQty). `CumQty <= OrderQty`. FILLED ≠ Settled.

### 7–12. Reference / failure / recon

`GET /orders/{id}`. Cancel race + timeout UNKNOWN. Reconcile internal order ↔ venue facts (không suy từ label UI).

---

## Feature: Buying power / sức mua

**Status:** 🟣 labels `Sức mua`, `Sức mua từ tiền mặt` · 🔴 không chụp số  
**Domain:** 01 + Risk · Cross-link: [Bài 08 Buying Power](/lectures/08-account-cash-position-buying-power/)

**Buying Power UI** = derived projection — không `Account.Balance = BuyingPower`.

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

## Feature: CK khả dụng / pending settlement / Tiền chờ VSD

**Status:** 🟡 guide · 🟣 labels tài sản / tiền chờ VSD · 🔴 không mở Tài sản  
**Domain:** 01 + Settlement · Cross-link: [Bài 07 KRX/VSDC](/lectures/07-clearing-settlement-krx-fix-vsdc/) · [Bài 17 Settlement](/lectures/17-clearing-netting-settlement/)

**Pending Settlement** = tiền/CK đã phát sinh từ trade nhưng chưa hoàn tất settlement.

### Mini-case: SELL + Tiền chờ VSD (🔵 illustrative)

```text
User SELL 1,000 FPT — trade đã khớp (FILLED trên sổ lệnh)
→ Trade exists → broker ghi PendingSaleReceivable
→ UI có thể hiển thị "Tiền chờ VSD" / tiền chờ về
→ chưa chắc cash đã settled
→ settlement hoàn thành → settled/available thay đổi theo rule
```

Reference state (🔵):

```text
PendingSaleReceivable { TradeId, Amount, TradeDate, SettlementDate, Status }
Status: PENDING → SETTLED
```

Recon: internal receivable ↔ VSDC/settlement result ↔ bank cash leg.

### CK khả dụng (structure ví dụ)

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

**Status:** 🟣 labels · 🔴 không chụp P&L · **Portfolio UI** = projection
Unrealized vs Realized. Giá TB vs Giá TT (guide PVA lỗ 522,000đ / 6.79%).

---

## Feature: Cash transfer / ứng trước

**Status:** 🟣 labels · 🔴 không submit · **Domain:** 01 + Financing + [08](/domains/08-enterprise-workflow) + Ledger/Settlement

Internal / Napas / NH liên kết. Timeout ≠ failed; cần inquiry.

---

## Feature: Derivatives / Conditional / Rewards / Bonds / Funds

| Feature | Status | Domain |
|---|---|---|
| Phái sinh menu + board tab | 🟢 | 02 |
| Lệnh điều kiện STOP/TCO/Trailing/SLTP | 🟣+🟡 | 06 |
| Ưu đãi / Discover | 🟣 promotion UI | **07 Rewards: 🔴 not verified** (chưa thấy points/voucher/ledger) |
| Tài sản trái phiếu / quỹ | 🟣 | 03 / 04 — screen 🔴 |
| Lịch sử hưởng quyền | 🟣 | 01 + 08 |

---

## VPS → 8 Core Domains

| Domain | Evidence |
|---|---|
| 01 | 🟢 board/market · 🟣+🟡 order, sức mua, CK khả dụng, pending VSD |
| 02 | 🟢 menu + board Phái sinh |
| 03 / 04 | 🟣 asset labels — screen 🔴 |
| 05 | 🟢 Bảng giá + `/market` widgets |
| 06 | 🟣+🟡 conditional labels |
| 07 | 🟣 Ưu đãi only — **loyalty ledger 🔴** |
| 08 | 🟣 chuyển tiền, ứng trước, quyền (không submit) |

Margin overview VPS: 🔴 trong phiên 19/08. Order state deep dive → [ssi-iboard](./ssi-iboard) companion + [Bài 13](/lectures/13-oms-internals-state-machine/).

Xem [vps-smartone](./vps-smartone)
