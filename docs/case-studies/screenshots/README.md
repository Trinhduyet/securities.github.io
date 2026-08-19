---
title: "Screenshot inventory — SSI / VPS / TCBS"
description: "Danh mục ảnh minh họa public và authenticated (redacted) dùng trong Broker App Case Studies."
---

# Screenshot inventory

Ảnh chỉ minh họa **UI / capability**. Không dùng screenshot để suy ra kiến trúc nội bộ SSI, VPS hoặc TCBS.

**SPA** = Single Page Application. **Redacted** = đã ẩn tên / số tài khoản trên UI trước khi chụp.

Phiên thu thập: **19/08/2026**, READ-ONLY. Không gửi lệnh, không chuyển tiền.

| File | App | Source Type | Mô tả | Domain | PII Status | Dùng ở đâu |
|---|---|---|---|---|---|---|
| `ssi/public/ssi-public-hero-iboard.png` | SSI | Public Marketing Page | Hero iBoard Web Trading | Overview | safe | [ssi-iboard](../ssi-iboard) |
| `ssi/public/ssi-public-product-overview.png` | SSI | Public Documentation | Mục lục hướng dẫn giao dịch trên iBoard | 01, 05 | safe | [ssi-iboard](../ssi-iboard) |
| `ssi/public/ssi-public-cash-operations.png` | SSI | Public Documentation | Nạp/chuyển tiền, ứng trước, sao kê | 01 + 08 + Settlement | safe | [ssi-iboard](../ssi-iboard) |
| `ssi/authenticated/ssi-auth-market-board-redacted.png` | SSI | Authenticated UI | Bảng giá VN30, bid/ask, Trần/Sàn/TC | 05 | redacted | [ssi-iboard](../ssi-iboard), [ui-inspection-ssi](../ui-inspection-ssi-iboard) |
| `ssi/authenticated/ssi-auth-margin-overview-redacted.png` | SSI | Authenticated UI | Tỷ lệ KQ, An toàn, Tổng nợ, gói vay | 01 + Risk | redacted | [ssi-iboard](../ssi-iboard), [Bài 11](/lectures/11-risk-margin-controls/) |
| `ssi/authenticated/ssi-auth-market-analytics-redacted.png` | SSI | Authenticated UI | Top đột phá / vượt đỉnh | 05 | redacted | [ssi-iboard](../ssi-iboard), [Domain 05](/domains/05-realtime-analytics) |
| `vps/public/vps-public-smartone-hero.png` | VPS | Public Marketing Page | Landing / login SmartOne (không QR, không form đã điền) | Overview | safe | [vps-smartone](../vps-smartone) |
| `vps/public/vps-public-user-guide-overview.png` | VPS | Public Documentation | Hướng dẫn HomeTrade / SmartOne | 01, 05 | safe | [vps-smartone](../vps-smartone) |
| `vps/public/vps-public-market-board.png` | VPS | Public Marketing Page | Bảng giá public (còn nút Đăng nhập) | 05 | safe | [vps-smartone](../vps-smartone) |
| `vps/public/vps-public-market-depth.png` | VPS | Public Marketing Page | Widget độ sâu thị trường | 05 | safe | [vps-smartone](../vps-smartone) |
| `vps/authenticated/vps-auth-market-board-redacted.png` | VPS | Authenticated UI | Bảng giá VN30 sau login; đã ẩn tên | 05 | redacted | [vps-smartone](../vps-smartone), [ui-inspection-vps](../ui-inspection-vps-smartone) |
| `vps/authenticated/vps-auth-market-insight-redacted.png` | VPS | Authenticated UI | `/market` — dòng chảy, khối ngoại, ngành | 05 | redacted | [vps-smartone](../vps-smartone), [Domain 05](/domains/05-realtime-analytics) |
| `tcbs/public/tcbs-public-system-overview.png` | TCBS | Public Marketing Page | Hệ thống iWealth / TCInvest | Overview | safe | [tcbs-tcinvest](../tcbs-tcinvest) |
| `tcbs/public/tcbs-public-products-overview.png` | TCBS | Public Marketing Page | Catalog đa sản phẩm | 01–04 | safe | [tcbs-tcinvest](../tcbs-tcinvest) |
| `tcbs/public/tcbs-public-stocks-product.png` | TCBS | Public Marketing Page | iStock — bảng giá, lệnh điều kiện, danh mục | 01, 05, 06 | safe | [tcbs-tcinvest](../tcbs-tcinvest) |
| `tcbs/public/tcbs-public-bonds-product.png` | TCBS | Public Marketing Page | iBond — an toàn / lợi nhuận / thanh khoản | 03 | safe | [tcbs-tcinvest](../tcbs-tcinvest), [Domain 03](/domains/03-bonds-core) |
| `tcbs/public/tcbs-public-funds-product.png` | TCBS | Public Marketing Page | iFund / Fundmart | 04 | safe | [tcbs-tcinvest](../tcbs-tcinvest), [Domain 04](/domains/04-funds-core) |
| `tcbs/public/tcbs-public-derivatives-product.png` | TCBS | Public Marketing Page | iFuture | 02 | safe | [tcbs-tcinvest](../tcbs-tcinvest), [Domain 02](/domains/02-derivatives-core) |
| `tcbs/public/tcbs-public-recurring-investment.png` | TCBS | Public Marketing Page | Đầu tư định kỳ quỹ từ 10.000đ | 04 | safe | [tcbs-tcinvest](../tcbs-tcinvest) |
| `tcbs/public/tcbs-public-conditional-order.png` | TCBS | Public Documentation | Help lệnh điều kiện / TWAP links | 06 | safe | [tcbs-tcinvest](../tcbs-tcinvest), [Domain 06](/domains/06-conditional-orders) |

## Skipped (an toàn)

| App | Screen | Lý do |
|---|---|---|
| SSI | Sổ lệnh, danh mục, sao kê tiền, ứng trước form | Holdings / số dư thật |
| SSI | Tăng sức mua, Đặt lệnh submit | Side effect |
| VPS | Sức mua, CK khả dụng, tiền chờ VSD, Tài sản | Số dư / holdings thật |
| VPS | Trạng thái lệnh bảng thật | Có thể lộ lệnh/qty |
| VPS | Chuyển tiền | Bank / PII |
| TCBS | Authenticated TCInvest | **Not verified** — redirect `guest/login` |
| Tất cả | QR login, OTP, PIN | Không commit |

## Thư mục

```text
screenshots/
├── README.md          ← file này
├── ssi/public/
├── ssi/authenticated/
├── vps/public/
├── vps/authenticated/
├── tcbs/public/
├── tcbs/authenticated/   (trống — chưa verify login)
└── shared/               (dự phòng so sánh chéo)
```
