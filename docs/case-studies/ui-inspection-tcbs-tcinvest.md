---
title: "UI Inspection — TCBS / TCInvest"
description: "Khảo sát read-only TCInvest và hệ thống iWealth: capability công khai, domain map, reference architecture. Authenticated UI chưa xác minh."
inspectionDate: "2026-08-18"
platform: "TCBS / TCInvest"
---

# TCBS / TCInvest — Public UI Inspection

> **Authenticated UI:** Not yet verified — `tcinvest.tcbs.com.vn` redirect `guest/login` (18/08/2026).

## Inspection metadata

| Hạng mục | Giá trị |
|---|---|
| Ngày | 18/08/2026 |
| Public URL | https://www.tcbs.com.vn/ca-nhan/he-thong/ |
| TCInvest URL | https://tcinvest.tcbs.com.vn/ |
| Authenticated | **Không** — redirect `guest/login` |
| Browser | Playwright MCP Extension, read-only |
| Login / OTP / PIN | Không nhập |
| Giao dịch tài chính | Không thực hiện |

Không ghi account identifier, số dư, vị thế hay dữ liệu cá nhân.

## Kết luận phiên khảo sát

| Tab | URL | Authenticated | Top-level menus / labels |
|---|---|---|---|
| Hệ thống iWealth | `/ca-nhan/he-thong/` | no | Cổ phiếu iStock, Trái phiếu iBond, Quỹ iFund, Phái sinh iFuture, Sản phẩm, Hệ thống, Đăng nhập, Mở tài khoản |
| Sản phẩm | `/ca-nhan/san-pham/` | no | iBond, iStock, iFund, iFuture, iConnect, AllConnect, iPlan, iWealth Partner, iCopy, Margin T+, Marginsure, Micro Saving, iXu, iWealth Club |
| iPO | `/ca-nhan/san-pham/ipo/` | no | Đăng ký IPO, Danh sách đợt, Tra cứu sổ lệnh (mô tả) |
| Đầu tư định kỳ | `/ca-nhan/san-pham/dau-tu-dinh-ky/` | no | Fundmart, chu kỳ tuần/tháng/quý |
| Help — Lệnh điều kiện | `help.tcbs.com.vn/lenh-dieu-kien/` | no | Lệnh điều kiện, TWAP, Lệnh 24/7 |
| Help — Lô lẻ | `help.tcbs.com.vn/.../lo-le...` | no | Đặt lệnh cổ phiếu, lô 1–99 |
| TCInvest | `/guest/login` | **no** | GD chứng khoán trực tuyến, Bảng giá, Phân tích đầu tư, Quản lý gia sản, iWealth Club, Liên kết và tiện ích |

**Không có tab TCInvest đã đăng nhập.** Capability sau login được đánh dấu **Chưa xác minh** (🔴) trừ khi tài liệu công khai mô tả (🟡).

Screenshot login **không lưu** vì trang có QR.

## Legend

| Ký hiệu | Ý nghĩa |
|---|---|
| 🟢 | **Observed screen** — trang public/guest thực sự đã mở (Playwright) |
| 🟣 | **Client evidence** — label/module trên site chưa inspect workflow đầy đủ |
| 🟡 | **Official documentation** — help / product page TCBS |
| 🔵 | **Reference design** — không phải kiến trúc nội bộ TCBS |
| 🔴 | **Not verified** — authenticated TCInvest chưa có trong phiên này |
| — | **Not found** |

## Platform model

```text
TCBS  = công ty chứng khoán / brokerage business
TCInvest = customer-facing investment platform (iWealth)

TCInvest UI
    ↓
Unified Customer Experience
    ↓
Domain-specific capabilities
    ├── Securities (iStock)
    ├── Bonds (iBond / iConnect)
    ├── Funds (iFund / Fundmart)
    ├── Derivatives (iFuture)
    ├── Conditional Orders / TWAP
    └── Workflow (IPO, eKYC, quyền)
          ↓
Shared cross-cutting
    ├── Customer / Account
    ├── Cash / Ledger
    ├── Portfolio projection
    ├── Identity
    └── Notifications / Rewards (iXu)
```

> Một app ≠ một domain. UI gom sản phẩm; backend reference phải tôn trọng bounded context.

---

## Market / bảng giá / phân tích

**Status:** 🟢 guest module “Bảng giá” + 🟡 iStock (TCPrice, TCAnalysis)

### UI observed

- Guest TCInvest: **Bảng giá** — “theo dõi trực tuyến biến động giá … dòng cung - cầu”.
- iStock public: **Bảng giá TCPrice**, **TCAnalysis**, bộ lọc cổ phiếu, đồ thị thị trường, báo cáo DN.

### Business meaning

Nhà đầu tư cần **quote realtime** và **thông tin doanh nghiệp** trước khi ra quyết định; đây là read-heavy market data, không phải OMS.

### Glossary

| Thuật ngữ | Giải thích | Ví dụ số (minh họa) |
|---|---|---|
| Tick | Một cập nhật giá/khối lượng tại một thời điểm | FPT last = 120,000 tại 14:02:01 |
| Quote | Snapshot giá mua/bán tốt nhất | Bid 119,900 / Ask 120,100 |
| Bid | Giá bên mua sẵn sàng trả | 119,900 |
| Ask | Giá bên bán sẵn sàng nhận | 120,100 |
| Spread | Ask − Bid | 200 đồng |
| Market Depth | Nhiều mức giá + KL | Bid1 500 CP, Bid2 800 CP |
| OHLCV | Open/High/Low/Close/Volume của nến | O 119.5, H 121.0, L 119.2, C 120.0, V 1.2m |
| SMA / EMA | Trung bình động đơn / mũ | SMA20 = 118,400 |
| RSI / MACD | Chỉ báo động lượng | RSI = 62 |
| VWAP | Giá trung bình theo khối lượng | 119,850 |
| Market Cap | Vốn hóa | 120,000 × 1.2 tỷ CP |
| P/E, P/B | Định giá | P/E = 18.5 |

### Concrete example

VN-INDEX đóng cửa 1,732.02; FPT last 120,000; spread 200 đồng.

### Entity / State

`QuoteSnapshot`, `OrderBookLevel`, `Candle`, `IndicatorValue`, `ScreenerResult`

### Invariants

Giá khớp nằm trong [sàn, trần] theo rule phiên; sequence tick không lùi; indicator phải gắn `priceSource` + `asOf`.

### Reference API

`GET /market/quotes/{symbol}` · `GET /market/depth/{symbol}` · `GET /market/candles?interval=1m`

### Reference data model

`quote_snapshots` (TTL ngắn) · `intraday_bars` · `corporate_fundamentals`

### Events

`QuoteUpdated` · `TradePrinted` · `SessionStatusChanged`

### Dependencies

HOSE / HNX / UPCOM market data; TCAnalysis research feed.

### Failure scenarios

Feed stale nhưng UI vẫn xanh; sequence gap; corporate action chưa adjust chart.

### Reconciliation

Đối chiếu close chính thức của sở với `index_eod` / `quote_eod`.

### Related Core Domain

[05 Realtime Analytics](/domains/05-realtime-analytics) · [Bài 10 Market Data](/lectures/10-market-data-engineering/)

---

## Equity trading / sổ lệnh

**Status:** 🟡 iStock + help cổ phiếu · 🔴 form đặt lệnh sau login

### UI observed / public

- iStock: đặt lệnh cổ phiếu, công nghệ xử lý lệnh tốc độ cao.
- Help: Sổ lệnh cổ phiếu, sửa/hủy lệnh chưa khớp, loại lệnh LO/ATO/ATC/MP, phiên KLĐK.

### Business meaning

Tạo **order** trên thị trường cơ sở, theo dõi lifecycle đến execution/trade/settlement.

### Glossary

| Thuật ngữ | Giải thích | Ví dụ |
|---|---|---|
| Order | Yêu cầu mua/bán chưa/đang làm việc | BUY 1,000 FPT @ 120,000 |
| Execution | Một lần khớp | 300 @ 119,900 |
| Trade | Kết quả nghiệp vụ sau booking | TradeId T-01 qty 300 |
| Reservation | Giữ cash/CK trước khi gửi sàn | Reserve 120m + buffer |
| Buying Power | Sức mua derived | Xem mục Margin |
| Partial Fill | Khớp một phần | CumQty 300 / Leaves 700 |
| Cancel Race | Hủy chồng với khớp | Cancel lúc đang khớp thêm 200 |
| Unknown Outcome | Timeout sau khi đã gửi | Broker ACK, sàn chưa rõ |
| Settlement | Chuyển giao tiền/CK | T+2 tiền bán chờ về |

### Concrete example

```text
BUY 1,000 FPT @ 120,000
Order value = 120,000,000
+ fee/risk buffer
→ Required buying power
```

### Entity / State

```text
CREATED → VALIDATING → PENDING_NEW → NEW
→ PARTIALLY_FILLED → FILLED
nhánh: REJECTED | PENDING_CANCEL → CANCELLED
```

### Invariants

`OrderQty = CumQty + LeavesQty + CancelledQty` (tùy model). BUY ≤ buying power. SELL ≤ sellable qty.

### Reference API

`POST /trading/orders` · `POST /trading/orders/{id}/cancel` · `GET /trading/orders`

### Reference data model

`orders` · `executions` · `trades` · `cash_reservations` · `security_reservations`

### Events

`OrderAccepted` · `ExecutionReported` · `OrderRejected`

### Dependencies

OMS → exchange gateway → HOSE/HNX/UPCOM · [Bài 06 Matching](/lectures/06-order-matching/) · [Bài 13 OMS](/lectures/13-oms-internals-state-machine/)

### Failure scenarios

Double-click đặt lệnh; gateway timeout; cancel vs partial fill.

### Reconciliation

Sổ lệnh UI vs OMS vs báo cáo sàn.

### Related Core Domain

[01 Securities Core](/domains/01-securities-core)

---

## Odd lot (lô lẻ)

**Status:** 🟡 help chính thức · 🟢 trang hướng dẫn đã mở

### UI observed

Help: mua/bán **1–99** ngay giao diện Đặt lệnh cổ phiếu; HOSE có bảng giá lô lẻ riêng.

### Business meaning

Lô chẵn (round lot, thường 100) và lô lẻ (odd lot) là **hai ngữ cảnh khớp**, không phải `qty % 100 == 0`.

### Glossary

Round lot = 100 CP · Odd lot = 37 CP · Không khớp chéo lô lẻ ↔ lô chẵn (theo help TCBS).

### Concrete example

SELL 37 FPT LO trong phiên liên tục lô lẻ (09:15–11:30, 13:00–14:30).

### Entity / State

```text
OrderValidationContext
├── Venue / Board
├── Instrument
├── LotType = ODD_LOT
├── Session
├── OrderType = LO
└── EffectiveRuleVersion
```

### Invariants

HSX: lô lẻ chỉ LO; không khớp với lô chẵn; session hours riêng.

### Failure scenarios

Validate odd-lot bằng round-lot rule; sở hữu lô lẻ rải nhiều tiểu khoản.

### Related Core Domain

[01 Securities Core](/domains/01-securities-core)

---

## Margin / sức mua / tín dụng

**Status:** 🟡 help cổ phiếu, Margin T+, Marginsure · 🔴 màn hình hạn mức sau login

### Business meaning

Tiểu khoản thường dùng tiền mặt; tiểu khoản ký quỹ dùng **hạn mức tín dụng + TSĐB**.

Help TCBS (công thức public, số minh họa **không** lấy từ account thật):

```text
Tiểu khoản thường:
A = Tiền mặt + Tiền bán chờ về (đã trừ phí ứng trước)

Ví dụ help:
Tiền mặt 100m
1,000 VNM, giá cho vay 100,000, tỷ lệ 50%
Sức mua cơ bản = 100m + 50m = 150m
```

Reference buying power (🔵):

```text
Cash                    200m
Credit Limit            300m
Existing Loan           100m
Reserved Buy             50m
Risk Buffer              20m
----------------------------
Available Buying Power  derived, không đồng nghĩa Cash
```

### Glossary

Buying Power ≠ Cash ≠ Credit ≠ NAV tài khoản.  
Collateral, LTV, Margin Ratio (Rtt), Maintenance, Margin Call, Force Sell.

### Entity / State

`MarginAccount` · `CreditLimit` · `OutstandingLoan` · `CollateralPosition` · `RttSnapshot`

### Invariants

Không cho BUY vượt buying power tại thời điểm reserve. Hai order đồng thời không được cùng pass cùng một pool.

### Failure scenarios

Buying power stale; force-sell trùng với khách nộp tiền.

### Related Core Domain

[01 Securities Core](/domains/01-securities-core) + Risk · [Bài 08](/lectures/08-account-cash-position-buying-power/) · [Bài 11](/lectures/11-risk-margin-controls/)

---

## Conditional orders

**Status:** 🟡 help “Lệnh điều kiện” · 🔴 form sau login

### UI observed

Help tags: Chốt lãi/cắt lỗ, Lệnh dừng; hiệu lực theo khoảng khách cài; kích hoạt khi đủ điều kiện rồi đẩy sàn.

### Business meaning

Rule sống lâu hơn trading order. `ConditionalOrderId ≠ TradingOrderId`.

### Concrete example

```text
Nếu FPT <= 100,000 → SELL 1,000 FPT
Ticks: 101,000 → 100,500 → 100,200 → 99,900  ← trigger
Duplicate tick 99,900 không được sinh order thứ hai.
```

### Entity / State

```text
ACTIVE → TRIGGERING → GENERATED_ORDER → SUBMITTED → COMPLETED
ACTIVE → CANCELLED
```

### Invariants

Trigger exactly-once: `GeneratedOrderKey = ConditionalOrderId + TriggerVersion`. Price source (Last/Bid/Ask/Ref) phải versioned.

### Failure scenarios

Duplicate market event; stale quote vẫn ACTIVE; hết phiên help nói không phát sinh lệnh mới.

### Related Core Domain

[06 Conditional Orders](/domains/06-conditional-orders)

---

## TWAP

**Status:** 🟡 help “Đặt lệnh chiến lược TWAP” tồn tại · 🔴 tham số schedule chưa quan sát UI

### Business meaning

TWAP = Time Weighted Average Price: không gửi hết parent qty một lần.

Reference example (🔵, không khẳng định TCBS chia đúng vậy):

```text
BUY 10,000 FPT trong 60 phút
10:00 → 1,000
10:06 → 1,000
...
10:54 → 1,000
```

### Entity / State

`ParentOrder` · `ChildOrder` · `ScheduleSlice` · `RemainingQty`

### Invariants

`sum(child target qty) ≤ parent qty` · executed ≤ parent · scheduler restart không duplicate child.

### Related Core Domain

[06 Conditional Orders](/domains/06-conditional-orders) + [01 Securities Core](/domains/01-securities-core)

---

## Portfolio / wealth view

**Status:** 🟢 “Quản lý gia sản” trên guest login · 🟡 danh mục tổng thể iWealth · 🔴 số liệu account

### Business meaning

Portfolio là **projection đa sản phẩm**, không phải một bảng source of truth.

```text
Stocks        300m
Bonds         200m
Funds         150m
Cash           50m
-----------------
Total Assets  700m
```

NAV khách (tài sản ròng) ≠ NAV/unit của quỹ.

### Related Core Domain

Cross: 01 / 02 / 03 / 04 · [Bài 18 Ledger](/lectures/18-ledger-accounting-projections/)

---

## Bonds

**Status:** 🟢 nav iBond · 🟡 iBond/iConnect/AllConnect pages

### UI observed

Đặt lệnh trái phiếu; thỏa thuận trái phiếu; iConnect rao mua/bán NĐT khác.

### Glossary

Face Value 100m · Coupon 8%/năm · 2 kỳ/năm → coupon kỳ = 4m.  
Coupon rate ≠ Yield. Dirty Price = Clean Price + Accrued Interest.

### Entity / State

`BondHolding` · `CouponSchedule` · `NegotiatedQuote` (iConnect) · `Maturity`

### Invariants

Settlement/day-count theo contract. Marketplace thỏa thuận ≠ equity matching.

### Related Core Domain

[03 Bonds Core](/domains/03-bonds-core)

---

## Funds

**Status:** 🟢 trang đầu tư định kỳ · 🟡 iFund/Fundmart

### Concrete example

```text
Investment          100m
Subscription Fee      1m
Net Amount            99m
NAV/unit              20,000
Allocated Units       4,950
```

Public: tối thiểu từ 10,000 VND (quỹ TCC); thiếu tiền 1 kỳ → kỳ đó fail, plan tiếp tục; 5 kỳ fail → auto hủy.

### Entity / State

```text
RecurringInvestmentPlan
ACTIVE → SCHEDULED → PAYMENT_DUE → SUBSCRIPTION_CREATED
→ WAITING_NAV → ALLOCATED
```

Scheduler ở đây là **business workflow**, không chỉ cron.

### Related Core Domain

[04 Funds Core](/domains/04-funds-core)

---

## Derivatives

**Status:** 🟢 nav iFuture · 🟡 help lãi/lỗ phái sinh

### Public example (help, không phải account)

LONG 15 HĐ, mở 1,950, đóng 1,970, multiplier 100,000  
PnL trước phí = (1,970 − 1,950) × 15 × 100,000 = 30m.

Ngưỡng Tỷ lệ sử dụng TS (help): an toàn 85%, cảnh báo 87%, xử lý/force close 90%.

### Related Core Domain

[02 Derivatives Core](/domains/02-derivatives-core)

---

## IPO / offerings

**Status:** 🟢 trang iPO · 🟡 FAQ đặt cọc / phân bổ

### Workflow (public)

```text
Offering → Registration → Eligibility → Cash/Deposit reservation
→ Allocation → Refund leftover → Securities at VSDC → Listing
```

Public rule: không hủy/sửa lệnh đăng ký thành công; đặt cọc thường 10%.

Ví dụ help: 8,800 CP × 46,800 × 10% = 41,184,000 đặt cọc.

### Failure scenarios

Duplicate registration; payment mismatch; partial allocation; refund fail.

### Related Core Domain

[08 Enterprise Workflow](/domains/08-enterprise-workflow) + Securities entitlement

---

## Cash / money movement

**Status:** 🟡 help sức mua / ứng trước / chuyển tiểu khoản · 🔴 số dư thật

### Glossary

Settled Cash · Available Cash · Reserved · Pending Receivable · Pending Payable.

Available **không bắt buộc** = settled + receivable − reserved; phụ thuộc product policy (iSave, auto-advance).

**Không thao tác nộp/rút/chuyển trong phiên này.**

### Related Core Domain

01 + 08 · [Bài 17 Settlement](/lectures/17-clearing-netting-settlement/)

---

## Corporate actions

**Status:** 🟡 help cổ tức / ngày GDKHQ / thực hiện quyền online trước 15h hạn

### Glossary

Record Date · Ex-Date (GDKHQ) · Payment Date · Entitlement · Election · Allocation.

Ví dụ: 1,000 FPT × 2,000 VND = 2,000,000 gross — **không** khẳng định thuế hiện hành.

### Related Core Domain

01 + 08 · [Bài 09 Corporate Actions](/lectures/09-security-master-corporate-actions/)

---

## Rewards / loyalty

**Status:** 🟡 iXu, iWealth Partner trên product pages · 🔴 authenticated reward ledger / redemption UI chưa verify

### Business meaning

Domain 07 (Campaign, Eligibility, Reward Ledger, Points, Voucher, Redemption…) cần evidence workflow/ledger — **product copy iXu ≠ đủ** để đánh 🟢 capability loyalty end-to-end.

### Related Core Domain

Potential relation [07 Rewards](/domains/07-rewards) — **NOT YET VERIFIED** trên authenticated TCInvest.

---

## Enterprise workflow

**Status:** 🟢 Mở tài khoản 3 phút, onboarding URL · 🟡 e-contract phái sinh, IPO iOTP, thực hiện quyền

### Glossary

Process Definition · Process Instance · Human Task · Service Task · SLA · Maker-Checker · Idempotency · Compensation.

Ví dụ: mở TK online; kích hoạt tiểu khoản PS bằng HĐ điện tử; IPO xác thực iOTP (**không thực hiện trong phiên này**).

### Related Core Domain

[08 Enterprise Workflow](/domains/08-enterprise-workflow)

---

## Screenshots (public, no PII)

| File | Nội dung |
|---|---|
| `./screenshots/tcbs/public/tcbs-public-system-overview.png` | Hệ thống iWealth |
| `./screenshots/tcbs/public/tcbs-public-products-overview.png` | Catalog sản phẩm |
| `./screenshots/tcbs/public/tcbs-public-stocks-product.png` | iStock |
| `./screenshots/tcbs/public/tcbs-public-bonds-product.png` | iBond |
| `./screenshots/tcbs/public/tcbs-public-funds-product.png` | iFund |
| `./screenshots/tcbs/public/tcbs-public-derivatives-product.png` | iFuture |
| `./screenshots/tcbs/public/tcbs-public-recurring-investment.png` | Đầu tư định kỳ |
| `./screenshots/tcbs/public/tcbs-public-conditional-order.png` | Help lệnh điều kiện |
| Inventory | [screenshots/README](./screenshots/README) |

Authenticated: **not verified**. Không commit QR login.

## Chưa xác minh (authenticated)

Order entry, sổ lệnh live, buying power widget, margin Rtt screen, bond order ticket, Fundmart sau login, TWAP parameter UI, IPO ticket, cash transfer, corporate-action election form.
