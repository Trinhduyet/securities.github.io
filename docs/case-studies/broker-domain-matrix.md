---
title: "Broker Domain Matrix — SSI / VPS / TCBS"
description: "Bảng map capability công khai/quan sát được của SSI iBoard, VPS SmartOne và TCInvest sang 8 Core Domains."
---

# Broker Domain Matrix

<div class="lesson-meta">
  <span><strong>Cập nhật</strong> 19/08/2026</span>
  <span><strong>Nguồn</strong> UI public + tài liệu chính thức + UI inspection</span>
  <span><strong>Không suy luận</strong> kiến trúc nội bộ từng broker</span>
</div>

Ký hiệu:

| Ký hiệu | Nghĩa |
|---|---|
| ✓ | Observed authenticated UI **hoặc** official public documentation |
| ? | Chưa xác minh trong phạm vi kiểm tra |
| — | Không thấy trong phạm vi kiểm tra |

Cập nhật **19/08/2026**: SSI iBoard và VPS SmartOne đã khảo sát authenticated (READ-ONLY). Không commit PII.

| Capability | SSI | VPS | TCBS | Core Domain |
|---|:---:|:---:|:---:|---|
| Market Board | ✓ | ✓ | ✓ | [05](/domains/05-realtime-analytics) |
| Order Entry | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Order Status | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Partial Fill | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Buying Power | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Margin | ✓ | ? | ✓ | [01](/domains/01-securities-core) / Risk |
| Portfolio | ✓ | ✓ | ✓ | Cross-domain |
| Cash | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Pending Settlement | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Cash Advance | ✓ | ✓ | ? | [01](/domains/01-securities-core) |
| Derivatives | ✓ | ✓ | ✓ | [02](/domains/02-derivatives-core) |
| Bonds | ✓ | ? | ✓ | [03](/domains/03-bonds-core) |
| Funds | ? | ? | ✓ | [04](/domains/04-funds-core) |
| Technical Analytics | ✓ | ✓ | ✓ | [05](/domains/05-realtime-analytics) |
| Conditional Orders | ✓ | ✓ | ✓ | [06](/domains/06-conditional-orders) |
| TWAP | — | — | ✓ | [06](/domains/06-conditional-orders) / [01](/domains/01-securities-core) |
| Rewards | — | ✓ | ✓ | [07](/domains/07-rewards) |
| eKYC / Workflow | ? | ? | ✓ | [08](/domains/08-enterprise-workflow) |
| IPO | ✓ | — | ✓ | [08](/domains/08-enterprise-workflow) |
| Corporate Actions | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) / [08](/domains/08-enterprise-workflow) |
| Equity Trading | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Order History | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) |
| Cash Operations | ✓ | ✓ | ✓ | [01](/domains/01-securities-core) / [08](/domains/08-enterprise-workflow) |

## Ghi chú theo nền tảng

### SSI iBoard

Nguồn: authenticated UI 19/08/2026 (bảng giá, margin tổng quan) + SPA labels + tài liệu công khai SSI. Bonds = trái phiếu riêng lẻ / SBOND. Funds CCQ = label, screen chưa mở. Rewards không thấy.

### VPS SmartOne

Nguồn: authenticated UI 19/08/2026 (bảng giá, `/market`) + SPA labels + [Brief User Guide](https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide). Conditional orders và ứng trước = labels client. Bonds/Funds = label tài sản, screen chưa mở. Rewards = Ưu đãi.

### TCBS / TCInvest

Nguồn: [hệ thống iWealth](https://www.tcbs.com.vn/ca-nhan/he-thong/), [sản phẩm](https://www.tcbs.com.vn/ca-nhan/san-pham/), help TCBS. Authenticated screens: **chưa xác minh**. iXu / iWealth Partner = Rewards. iPO / onboarding 3 phút = Workflow.

Chi tiết: [ui-inspection-tcbs-tcinvest](./ui-inspection-tcbs-tcinvest) · [tcbs-tcinvest](./tcbs-tcinvest)
