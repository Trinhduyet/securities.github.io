---
title: "UI Inspection — VPS SmartOne Web (Playwright)"
description: "Khám phá read-only SmartOne Web qua Playwright MCP: menu, terminology, domain map và reference architecture — phân tách UI quan sát vs suy luận."
inspectionDate: "2026-08-18"
platform: "VPS SmartOne Web"
url: "https://smartoneweb.vps.com.vn/"
---

# UI Inspection — VPS SmartOne Web

<div class="lesson-meta">
  <span><strong>Ngày khảo sát</strong> 18/08/2026 ~17:24 ICT</span>
  <span><strong>Phương pháp</strong> Playwright MCP — chỉ đọc, không đặt/hủy lệnh, không chuyển tiền</span>
  <span><strong>Phiên</strong> Chưa đăng nhập (public market data)</span>
</div>

## Giới hạn phiên khảo sát

| Hạng mục | Trạng thái |
|---|---|
| Playwright MCP browser | **Không chia sẻ cookie** với tab Chrome đang đăng nhập của người dùng |
| Trang công khai (`/`, `/market`) | ✅ Quan sát trực tiếp |
| Trang yêu cầu auth (`/equity`, `/derivative`, `/asset`, `/utility`, `/discover`) | ❌ Crash UI: `Cannot read properties of undefined (reading 'layout')` |
| Menu Cơ sở / Phái sinh / Tài sản / Tiện ích (click) | Mở modal **Đăng nhập** |
| Tính năng sau login | 📋 Ghi nhận từ [hướng dẫn công khai VPS](https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide), **không** quan sát trực tiếp trong phiên này |

> **Quy ước ký hiệu:** 🟢 = quan sát UI trực tiếp · 🟡 = suy luận reference architecture · 🔵 = từ tài liệu công khai broker (chưa xác nhận UI phiên này)

## Navigation map (quan sát 🟢)

```text
Top bar
├── Logo VPS
├── Bảng giá          → /
├── Thị trường        → /market
├── Cơ sở             → yêu cầu login (modal)
├── Phái sinh         → yêu cầu login (modal)
├── Tài sản           → yêu cầu login (modal)
├── Tiện ích          → yêu cầu login (modal)
├── Ưu đãi của bạn (5)→ yêu cầu login / route lỗi khi truy cập trực tiếp
├── Đăng nhập         → modal SmartID + password
└── Thu gọn

Bảng giá — board tabs
├── Danh mục theo dõi
├── HOSE | VN30 | HNX | HNX30 | UPCOM | Phái sinh | CP Ngành | Thỏa thuận | Tự doanh | Lô lẻ
└── Cột: Mã CK, TC, Trần, Sàn, Giá/KL 1-3 (mua), Khớp, Giá/KL 1-3 (bán), Tổng KL, Dư mua/bán, TB, Cao, Thấp, ĐTNN

Thị trường — analytics widgets
├── Chỉ số A-D (Tăng / Tham chiếu / Giảm)
├── Top tăng | Top giảm | Cổ phiếu GD hàng đầu | Top GD nước ngoài
├── Chuyển động thị trường | Giao dịch khối ngoại | Chuyển động ngành
├── Độ sâu thị trường
├── Top đóng góp index | Độ rộng | Thanh khoản | Giá trị GD | Khối lượng GD | Vốn hóa
└── Khung thời gian: Hôm nay | 1 tuần | 1 tháng | 3 tháng | 6 tháng | 1 năm
```

## Screenshots

| # | Màn hình | File |
|---|---|---|
| 1 | Bảng giá (home) | `./screenshots/vps-smartone/vps-smartone-01-home.png` |
| 2 | Thị trường | `./screenshots/vps-smartone/vps-smartone-02-market.png` |
| 3 | Tab HOSE | `./screenshots/vps-smartone/vps-tab-HOSE.png` |
| 4 | Tab Phái sinh (board) | `./screenshots/vps-smartone/vps-tab-Phái-sinh.png` |
| 5 | Top tăng | `./screenshots/vps-smartone/vps-market-Top-tang.png` |
| 6 | Route /equity (auth error) | `./screenshots/vps-smartone/vps-route-equity.png` |
| 7 | Modal đăng nhập | `./screenshots/vps-smartone/vps-login-modal.png` |

---

## Feature cards

### 1. Bảng giá realtime (board HOSE/HNX/UPCOM)

**Core Domain:** Realtime Analytics

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Lưới bảng giá với 3 mức giá mua/bán, giá khớp, TC/Trần/Sàn, Tổng KL, ĐTNN |
| Giải thích nghiệp vụ | Hiển thị **order book snapshot** và **last trade** theo thời gian thực để NĐT theo dõi thanh khoản trước khi giao dịch |
| Thuật ngữ | **TC** (giá tham chiếu) · **Trần/Sàn** (ceiling/floor) · **KL** (khối lượng) · **ĐTNN** (giao dịch nhà đầu tư nước ngoài) · **Dư mua/bán** (bid/ask surplus) |
| Ví dụ số | Mã **PLX** đóng cửa 18/08: giá khớp **37.95** (+2.45, +6.90%), Tổng KL **5,350,900** CP |
| Entity / state | `QuoteSnapshot` → `{ symbol, refPrice, ceiling, floor, bid[1..3], ask[1..3], lastPrice, totalVolume, foreignBuy, foreignSell, sessionStatus }` · Session: **Đóng cửa** |
| Invariant 🟡 | Giá khớp nằm trong [Sàn, Trần]; tổng KL monotonic tăng trong phiên; sequence feed không lùi |
| API/command 🟡 | `GET /market/quotes?board=HOSE` · WebSocket `subscribe(symbols[])` |
| DB/projection 🟡 | `quote_snapshots` (TTL ngắn) · `intraday_bars` · không phải source of truth giao dịch |
| External dependency | HOSE/HNX/UPCOM market data feed; news ticker (tinnhanhchungkhoan.vn, hsx.vn) |
| Failure scenarios | Feed stale nhưng UI vẫn hiển thị giá cũ; mất kết nối WS; sequence gap |
| Reconciliation | Đối chiếu cuối ngày với file đóng cửa sàn; alert nếu lastPrice lệch official close |

---

### 2. Chỉ số thị trường (VN-INDEX, VN30, HNX, UPCOM)

**Core Domain:** Realtime Analytics

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Widget chỉ số: điểm, % thay đổi, KLGD (CP), GTGD (Tỷ), breadth (Tăng/Giảm/TC), trạng thái phiên |
| Giải thích nghiệp vụ | **Market index** tổng hợp diễn biến toàn thị trường / nhóm blue-chip |
| Thuật ngữ | **VN-INDEX** · **VN30** · **KLGD** · **GTGD** · **Breadth** (129↑ / 76= / 167↓) |
| Ví dụ số | VN-INDEX **1,732.02** (+4.56, +0.26%), GTGD **14.87 nghìn tỷ**, phiên **Đóng cửa** |
| Entity / state | `IndexTick` → `{ indexCode, level, change, changePct, volume, value, advancers, unchanged, decliners, status }` |
| Invariant 🟡 | `advancers + unchanged + decliners ≈ universe count`; index recompute theo methodology HOSE |
| API/command 🟡 | `GET /market/indices` |
| DB/projection 🟡 | `index_ticks` time-series; `index_eod` |
| External dependency | Sở giao dịch index calculation |
| Failure scenarios | Index value cập nhật nhưng breadth stale |
| Reconciliation | So official index close từ HOSE |

---

### 3. Thị trường — Top tăng / Top giảm / GD hàng đầu

**Core Domain:** Realtime Analytics

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Bảng xếp hạng: Mã CK, Giá khớp, +/-, %, Tổng KL, Tổng GT (Triệu) |
| Giải thích nghiệp vụ | **Market scanner** — lọc cổ phiếu biến động mạnh hoặc thanh khoản cao |
| Ví dụ số | **CMV** +6.93% (9.10), GT **64** triệu · **ASP** +6.58%, KL **140,800** |
| Entity / state | `RankingRow` ranked by `%change` or `value` · time window: Hôm nay → 1 năm |
| Invariant 🟡 | Ranking deterministic theo cùng price source tại timestamp T |
| API/command 🟡 | `GET /market/rankings?type=top_gainers&period=today` |
| Failure scenarios | Corporate action (split) làm % sai nếu không adjust |
| Reconciliation | Cross-check với board sort manual |

---

### 4. Chuyển động ngành / Giao dịch khối ngoại / Độ sâu thị trường

**Core Domain:** Realtime Analytics

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Tab analytics trên `/market`: sector rotation, foreign flow, market depth |
| Giải thích nghiệp vụ | Phân tích **dòng tiền** theo ngành và **nhà đầu tư nước ngoài** |
| Thuật ngữ | **Khối ngoại** · **Ngành** · **Độ sâu** (depth) |
| Entity / state | `SectorFlow`, `ForeignNetFlow`, `DepthAggregate` |
| External dependency | Market data + classification master (ngành) |
| Failure scenarios | Sector mapping outdated; foreign room data delay |

---

### 5. Tab board — Phái sinh (market data only)

**Core Domain:** Realtime Analytics (+ Derivatives Core khi đặt lệnh)

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Board filter **Phái sinh** trên bảng giá công khai |
| Giải thích nghiệp vụ | Hiển thị **derivatives quotes** (VN30F, …) trên cùng UI với cơ sở |
| 🟡 Khi login | Menu **Phái sinh** → giao dịch hợp đồng tương lai (chưa quan sát) |
| Entity / state | `DerivativeQuote` vs `EquityQuote` — product type khác nhau |
| Invariant 🟡 | Derivatives tick size / session hours khác cơ sở |
| External dependency | HNX derivatives market data |

---

### 6. Tìm kiếm mã CK

**Core Domain:** Realtime Analytics

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Textbox **Tìm kiếm** trên board |
| Giải thích nghiệp vụ | **Symbol lookup** — điều hướng nhanh tới mã |
| 🔵 Sau click mã | Hướng dẫn VPS: trang tin tức + hồ sơ DN + lịch sử giá + biểu đồ |
| API/command 🟡 | `GET /securities/search?q=FPT` |
| DB/projection 🟡 | `securities_master` |

---

### 7. Tin nóng / Tổng GD / Tổng GDTT

**Core Domain:** Realtime Analytics

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Ticker tin HOSE/tinnhanhchungkhoan; **Tổng GD: 15,701 Tỷ** · **Tổng GDTT: 4,777 Tỷ** |
| Giải thích nghiệp vụ | **Market-wide turnover** và news context |
| Thuật ngữ | **GDTT** — giá trị giao dịch thỏa thuận (put-through) |
| Invariant 🟡 | Tổng GD ≥ GDTT; cộng theo toàn thị trường |

---

### 8. Ưu đãi của bạn (badge 5)

**Core Domain:** Rewards

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | Nút **Ưu đãi của bạn** với badge **5** (hiển thị khi chưa login) |
| Giải thích nghiệp vụ | **Promotion / loyalty** — thông báo ưu đãi cho khách hàng |
| 🟡 Entity | `Promotion`, `CustomerEntitlement`, `UnreadCount` |
| Truy cập trực tiếp `/discover` | ❌ Application error (thiếu session) |
| Failure scenarios | Badge count lệch server; promotion expired vẫn hiển thị |

---

### 9. Modal đăng nhập

**Core Domain:** Enterprise Workflow

| Trường | Nội dung |
|---|---|
| 🟢 UI feature | SmartID/password, thời gian đăng nhập **180 phút**, link Mở tài khoản / Quên MK |
| Giải thích nghiệp vụ | **Authentication boundary** trước mọi tính năng giao dịch |
| Thuật ngữ | **SmartID** · **Thời gian đăng nhập** (session TTL) |
| Entity / state | `Session`: CREATED → ACTIVE → EXPIRED · 🔵 sai MK 3 lần → captcha |
| Invariant 🟡 | Trading commands bắt buộc có session hợp lệ |
| API/command 🟡 | `POST /auth/login` · `POST /auth/logout` |
| External dependency | Identity provider nội bộ VPS |
| Failure scenarios | Session hijack; concurrent login >2 máy (🔵 VPS cảnh báo) |
| Reconciliation | Audit log login vs IP/device |

---

## Tính năng từ hướng dẫn công khai (🔵 — chưa quan sát UI phiên này)

Các mục dưới **không được mở** trong phiên Playwright chưa login. Mapping domain dựa trên menu và hướng dẫn VPS công khai.

| UI (public guide) | Domain | Workflow / state chính |
|---|---|---|
| Đặt lệnh Mua/Bán (Ctrl+B / Ctrl+S) | Securities Core | Nhập lệnh → Xác nhận → Trạng thái lệnh đặt |
| Hủy lệnh | Securities Core | Chọn lệnh → PIN → Chờ hủy VPS/Sàn → Hủy hoàn toàn |
| Trạng thái lệnh đặt | Securities Core | Chờ khớp VPS/Sàn · Khớp 1 phần/toàn · Chờ hủy · Từ chối |
| Danh mục / Sức mua / CK khả dụng | Securities Core + Realtime Analytics | `BuyingPower`, `SellableQty`, `PendingReceive T1-T3` |
| Lãi/Lỗ dự kiến | Realtime Analytics | `(Giá TT - Giá TB) × TSLCK` — ví dụ PVA lỗ **522,000đ** (6.79%) |
| Ứng trước tiền bán | Enterprise Workflow | Tiện ích → nhập số tiền → tính phí → PIN |
| Chuyển tiền (4 loại) | Enterprise Workflow | Validate → Reserve → Bank/internal transfer |
| Chuyển khoản CK | Enterprise Workflow | Đuôi 1 ↔ đuôi 6 |
| Bán cổ phiếu lô lẻ | Securities Core | Đăng ký bán khi VPS thu mua |
| Thực hiện quyền | Enterprise Workflow | Tiện ích → quyền cổ tức/ cổ phiếu |
| Sao kê tiền/CK | Enterprise Workflow | Query theo khoảng thời gian |
| Lịch sử đặt lệnh | Securities Core | Historical order read model |
| Quản lý tài khoản / PIN / Token | Enterprise Workflow | Auth factor cho lệnh vs login |

### Ví dụ chi tiết — Trạng thái lệnh (🔵 public guide)

```text
UI labels (VPS công khai)
→ Lệnh đang chờ khớp tại VPS
→ Lệnh đang chờ khớp tại sàn
→ Lệnh khớp hoàn toàn / khớp 1 phần
→ Lệnh đang chờ hủy tại VPS / tại sàn
→ Lệnh bị từ chối tại VPS / tại sàn

State machine (reference 🟡)
CREATED → ACCEPTED_AT_BROKER → SENT_TO_EXCHANGE → WORKING
  → PARTIALLY_FILLED → FILLED
  → PENDING_CANCEL → CANCELLED
  → REJECTED
```

**Invariant 🟡:** Không coi "Xác nhận" UI = đã khớp sàn.

**Failure 🟡:** Partial fill đồng thời cancel → trạng thái cuối phải phản ánh `CumQty` thực tế.

---

## Domain coverage matrix

| Core Domain | Quan sát 🟢 | Public guide 🔵 |
|---|---|---|
| Securities Core | Board cơ sở (data only) | Đặt/hủy lệnh, sổ lệnh, danh mục, lô lẻ |
| Derivatives Core | Tab Phái sinh (data only) | Giao dịch PS (menu login) |
| Bonds Core | — | Không thấy trên SmartOne Web phiên này |
| Funds Core | — | Không thấy |
| Realtime Analytics | ✅ Phần lớn phiên công khai | Bảng giá + P&L |
| Conditional Orders | — | Không thấy trong guide SmartOne cũ |
| Rewards | Badge Ưu đãi | — |
| Enterprise Workflow | Login modal | Chuyển tiền, ứng trước, sao kê, quyền, PIN |

---

## Nguồn

- UI quan sát: Playwright MCP, 18/08/2026
- Hướng dẫn công khai: https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide
- Case study tổng hợp: [vps-smartone.md](./vps-smartone.md)
