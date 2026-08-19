---
title: "Screenshot inventory — SSI / VPS / TCBS"
description: "Danh mục ảnh minh họa public và authenticated (redacted), có source URL, capture date, evidence level và PII status."
---

# Screenshot inventory

Ảnh chỉ minh họa **UI / capability**. Không dùng screenshot để suy ra kiến trúc nội bộ SSI, VPS hoặc TCBS.

**SPA** = *Single Page Application*. **Redacted** = đã crop/ẩn tên, số tài khoản hoặc vùng nhạy cảm trước khi commit.

Phiên thu thập chính: **19/08/2026**, READ-ONLY. Không gửi lệnh, không chuyển tiền, không thay đổi tài khoản.

## Evidence

| Ký hiệu | Ý nghĩa |
|---|---|
| 🟢 | Authenticated/public screen thực sự đã mở và chụp |
| 🟡 | Public marketing/help/documentation chính thức |
| 🔴 | Authenticated screen chưa xác minh hoặc không commit vì an toàn |

## Inventory

| File | App | Evidence / Source Type | Source URL / Route | Captured | Mô tả | Domain | PII Status | Dùng ở đâu |
|---|---|---|---|---|---|---|---|---|
| `ssi/public/ssi-public-hero-iboard.png` | SSI | 🟡 Public Marketing Page | `ssi.com.vn/.../iboard-web` | 19/08/2026 | Hero iBoard Web Trading | Overview | safe | [SSI](../ssi-iboard), [Gallery](../visual-gallery) |
| `ssi/public/ssi-public-product-overview.png` | SSI | 🟡 Public Documentation | `ssi.com.vn/.../giao-dich-chung-khoan-ib-web` | 19/08/2026 | Mục lục/hướng dẫn giao dịch iBoard | 01, 05 | safe | [SSI](../ssi-iboard), [Gallery](../visual-gallery) |
| `ssi/public/ssi-public-cash-operations.png` | SSI | 🟡 Public Documentation | `ssi.com.vn/.../giao-dich-tien-iboard-web` | 19/08/2026 | Nạp/chuyển tiền, ứng trước, sao kê | 01 + Financing + 08 + Settlement | safe | [SSI](../ssi-iboard), [Gallery](../visual-gallery) |
| `ssi/authenticated/ssi-auth-market-board-redacted.png` | SSI | 🟢 Authenticated UI | `https://iboard.ssi.com.vn/` | 19/08/2026 | Bảng giá VN30, bid/ask, Trần/Sàn/TC | 05 | redacted | [SSI](../ssi-iboard), [UI Inspection](../ui-inspection-ssi-iboard), [Gallery](../visual-gallery) |
| `ssi/authenticated/ssi-auth-margin-overview-redacted.png` | SSI | 🟢 Authenticated UI | `/margin/general` | 19/08/2026 | Tỷ lệ KQ, trạng thái An toàn, Tổng nợ, gói vay | 01 + Risk | redacted | [SSI](../ssi-iboard), [Bài 11](/lectures/11-risk-margin-controls/), [Gallery](../visual-gallery) |
| `ssi/authenticated/ssi-auth-market-analytics-redacted.png` | SSI | 🟢 Authenticated UI | `/analysis/market-overview` / market analytics area | 19/08/2026 | Top đột phá / vượt đỉnh, analytics | 05 | redacted | [SSI](../ssi-iboard), [Domain 05](/domains/05-realtime-analytics), [Gallery](../visual-gallery) |
| `vps/public/vps-public-smartone-hero.png` | VPS | 🟡 Public Marketing Page | `https://smartoneweb.vps.com.vn/` | 19/08/2026 | SmartOne landing/product context | Overview | safe | [VPS](../vps-smartone), [Gallery](../visual-gallery) |
| `vps/public/vps-public-user-guide-overview.png` | VPS | 🟡 Public Documentation | `https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide` | 19/08/2026 | Hướng dẫn HomeTrade / SmartOne | 01, 05 | safe | [VPS](../vps-smartone), [Gallery](../visual-gallery) |
| `vps/public/vps-public-market-board.png` | VPS | 🟡 Public UI | `https://smartoneweb.vps.com.vn/` | 19/08/2026 | Bảng giá public, còn nút Đăng nhập | 05 | safe | [VPS](../vps-smartone), [Gallery](../visual-gallery) |
| `vps/public/vps-public-market-depth.png` | VPS | 🟡 Public UI | SmartOne public market view | 19/08/2026 | Widget độ sâu thị trường | 05 | safe | [VPS](../vps-smartone), [Gallery](../visual-gallery) |
| `vps/authenticated/vps-auth-market-board-redacted.png` | VPS | 🟢 Authenticated UI | `https://smartoneweb.vps.com.vn/` | 19/08/2026 | Bảng giá VN30 sau login | 05 | redacted | [VPS](../vps-smartone), [UI Inspection](../ui-inspection-vps-smartone), [Gallery](../visual-gallery) |
| `vps/authenticated/vps-auth-market-insight-redacted.png` | VPS | 🟢 Authenticated UI | `/market` | 19/08/2026 | Dòng chảy, khối ngoại, chuyển động ngành | 05 | redacted | [VPS](../vps-smartone), [Domain 05](/domains/05-realtime-analytics), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-system-overview.png` | TCBS | 🟡 Public Marketing Page | `https://www.tcbs.com.vn/ca-nhan/he-thong/` | 19/08/2026 | Hệ thống iWealth / TCInvest | Overview | safe | [TCBS](../tcbs-tcinvest), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-products-overview.png` | TCBS | 🟡 Public Marketing Page | `https://www.tcbs.com.vn/ca-nhan/san-pham/` | 19/08/2026 | Catalog đa sản phẩm | 01–04 | safe | [TCBS](../tcbs-tcinvest), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-stocks-product.png` | TCBS | 🟡 Public Marketing/Product Content | `https://www.tcbs.com.vn/ca-nhan/san-pham/` | 19/08/2026 | iStock — equity/analytics/conditional capability | 01, 05, 06 | safe | [TCBS](../tcbs-tcinvest), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-bonds-product.png` | TCBS | 🟡 Public Marketing/Product Content | `https://www.tcbs.com.vn/ca-nhan/san-pham/` | 19/08/2026 | iBond / bond product context | 03 | safe | [TCBS](../tcbs-tcinvest), [Domain 03](/domains/03-bonds-core), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-funds-product.png` | TCBS | 🟡 Public Marketing/Product Content | `https://www.tcbs.com.vn/ca-nhan/san-pham/` | 19/08/2026 | iFund / Fundmart | 04 | safe | [TCBS](../tcbs-tcinvest), [Domain 04](/domains/04-funds-core), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-derivatives-product.png` | TCBS | 🟡 Public Marketing/Product Content | `https://www.tcbs.com.vn/ca-nhan/san-pham/` | 19/08/2026 | iFuture | 02 | safe | [TCBS](../tcbs-tcinvest), [Domain 02](/domains/02-derivatives-core), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-recurring-investment.png` | TCBS | 🟡 Public Marketing Page | `https://www.tcbs.com.vn/ca-nhan/san-pham/dau-tu-dinh-ky/` | 19/08/2026 | Đầu tư định kỳ quỹ | 04 | safe | [TCBS](../tcbs-tcinvest), [Gallery](../visual-gallery) |
| `tcbs/public/tcbs-public-conditional-order.png` | TCBS | 🟡 Public Documentation | `https://help.tcbs.com.vn/lenh-dieu-kien/` + TWAP help | 19/08/2026 | Lệnh điều kiện / TWAP documentation | 06 | safe | [TCBS](../tcbs-tcinvest), [Domain 06](/domains/06-conditional-orders), [Gallery](../visual-gallery) |

> Với các ảnh TCBS product-specific được chụp từ catalog/section public, inventory cố ý ghi **product catalog source** thay vì suy một URL chi tiết nếu ảnh không được lấy từ một route product riêng.

## Skipped vì an toàn

| App | Screen | Lý do |
|---|---|---|
| SSI | Sổ lệnh, danh mục, sao kê tiền, form ứng trước | Holdings / số dư / order data thật |
| SSI | Tăng sức mua, Đặt lệnh submit | Có thể tạo side effect |
| VPS | Sức mua, CK khả dụng, tiền chờ VSD, Tài sản | Số dư / holdings thật |
| VPS | Trạng thái lệnh bảng thật | Có thể lộ symbol/price/qty/order history |
| VPS | Chuyển tiền | Bank / PII / side effect risk |
| TCBS | Authenticated TCInvest | 🔴 Not verified — redirect `guest/login` trong phiên khảo sát |
| Tất cả | QR login, OTP, PIN | Secret / authentication data — không commit |

## Cấu trúc thư mục

```text
screenshots/
├── README.md
├── ssi/
│   ├── public/
│   └── authenticated/
├── vps/
│   ├── public/
│   └── authenticated/
├── tcbs/
│   ├── public/
│   └── authenticated/   # trống — chưa verify login
└── shared/
```

## Dùng ảnh đúng cách

Screenshot có thể chứng minh:

```text
UI terminology
feature/capability tồn tại
layout/state người dùng quan sát được
```

Screenshot **không** chứng minh:

```text
database schema
microservice boundary
message broker
FIX dictionary nội bộ
source-of-truth implementation
```

Xem theo mục tiêu học: [Visual Gallery](../visual-gallery) · so sánh evidence: [Broker Domain Matrix](../broker-domain-matrix).
