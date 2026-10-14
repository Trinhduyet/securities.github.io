---
title: "Broker Domain Matrix — SSI / VPS / TCBS / BSC"
description: "Bảng map capability theo mức evidence (observed screen, client evidence, official docs) sang 8 Core Domains."
---

# Broker Domain Matrix

<div class="lesson-meta">
  <span><strong>Cập nhật</strong> 14/10/2026</span>
  <span><strong>Evidence</strong> 🟢 🟣 🟡 🔴 —</span>
  <span><strong>Không suy luận</strong> kiến trúc nội bộ từng broker</span>
</div>

## Evidence taxonomy

| Ký hiệu | Nghĩa |
|---|---|
| 🟢 | **Observed screen** — màn hình authenticated/public thực sự đã mở và nhìn thấy |
| 🟣 | **Authenticated client evidence** — label / route / menu / component trong SPA sau login; screen chưa inspect đầy đủ |
| 🟡 | **Official documentation** — help, hướng dẫn, product page chính thức |
| 🔵 | **Reference design** — state / API / model do course đề xuất (dùng trong feature cards, không ghi trong cell matrix) |
| 🔴 | **Not verified** — chưa đủ evidence |
| — | **Not found** — không thấy trong phạm vi khảo sát |

Một cell có thể kết hợp: `🟢+🟡`, `🟣+🟡`.

**SPA** (*Single Page Application*) = web app tải phần lớn UI bằng JavaScript, đổi màn hình không reload toàn trang.

**Client evidence** = bằng chứng từ code/menu/route/label phía ứng dụng sau login — **không** đồng nghĩa đã kiểm tra workflow thực tế hay submit form.

Phiên READ-ONLY: SSI + VPS authenticated **19/08/2026**. TCBS authenticated **chưa xác minh** (public **18/08/2026**). BSC public priceboard + official docs **14/10/2026**, authenticated 🔴.

| Capability | SSI | VPS | TCBS | BSC | Core Domain |
|---|---|---|---|---|---|
| Market Board | 🟢 | 🟢 | 🟡 | 🟢+🟡 | [05](/domains/05-realtime-analytics) |
| Order Entry | 🟢+🟣 | 🟣+🟡 | 🟡 | 🟡 | [01](/domains/01-securities-core) |
| Order Status | 🟣+🟡 | 🟣+🟡 | 🟡 | 🟡 | [01](/domains/01-securities-core) |
| Partial Fill | 🟡 | 🟡 | 🟡 | 🔴 | [01](/domains/01-securities-core) |
| Buying Power | 🟣+🟡 | 🟣+🟡 | 🟡 | 🔴 | [01](/domains/01-securities-core) + Risk |
| Margin (overview / ratio / debt) | 🟢 | 🔴 | 🟡 | 🔴 | [01](/domains/01-securities-core) + Risk |
| Portfolio / P&L | 🟣 | 🟣 | 🟡 | 🟡 | Cross-domain projection |
| Cash / Statement | 🟣+🟡 | 🟣+🟡 | 🟡 | 🔴 | [01](/domains/01-securities-core) |
| Pending Settlement | 🟣+🟡 | 🟣+🟡 | 🟡 | 🔴 | [01](/domains/01-securities-core) + Settlement |
| Cash Advance | 🟣+🟡 | 🟣+🟡 | 🔴 | 🔴 | 01 + Financing + [08](/domains/08-enterprise-workflow) + Ledger/Settlement |
| Derivatives | 🟢+🟣 | 🟢+🟣 | 🟡 | 🟡 | [02](/domains/02-derivatives-core) |
| Bonds | 🟢+🟣 | 🟣 | 🟡 | 🟢* | [03](/domains/03-bonds-core) |
| Funds | 🟣 | 🟣 | 🟡 | 🔴 | [04](/domains/04-funds-core) |
| Technical Analytics | 🟢 | 🟢 | 🟡 | 🔴 | [05](/domains/05-realtime-analytics) |
| Conditional Orders | 🟣+🟡 | 🟣+🟡 | 🟡 | 🟡 | [06](/domains/06-conditional-orders) |
| TWAP | — | — | 🟡 | 🔴 | [06](/domains/06-conditional-orders) |
| Rewards / Loyalty | 🔴 | 🟣* | 🟡 | 🔴 | [07](/domains/07-rewards) — *promotion UI; ledger not verified |
| eKYC / Onboarding | 🟡 | 🔴 | 🟡 | 🟡 | [08](/domains/08-enterprise-workflow) |
| IPO | 🟣+🟡 | — | 🟡 | 🔴 | [08](/domains/08-enterprise-workflow) |
| Corporate Actions | 🟣+🟡 | 🟣+🟡 | 🟡 | 🔴 | [01](/domains/01-securities-core) + [08](/domains/08-enterprise-workflow) |
| Order History | 🟣+🟡 | 🟣+🟡 | 🟡 | 🟡 | [01](/domains/01-securities-core) |
| Cash Transfer | 🟣+🟡 | 🟣+🟡 | 🟡 | 🔴 | [01](/domains/01-securities-core) + [08](/domains/08-enterprise-workflow) |
| Margin apply / Tăng sức mua | 🟣 | 🔴 | 🟡 | 🔴 | [08](/domains/08-enterprise-workflow) + Risk |
| Odd-lot board / trading | — | — | 🟡 | 🟢+🟡 | [01](/domains/01-securities-core) + Market Rules |
| Negotiated / GDTT | — | — | 🔴 | 🟢+🟡 | [01](/domains/01-securities-core) + Market Rules |
| Foreign buy/sell/room | 🟢 | 🟢 | 🟡 | 🟢 | [05](/domains/05-realtime-analytics) + Reference Data |

## Cross-cutting: Cash Advance

Cash Advance không thuộc một domain duy nhất:

```text
Cash Advance
├── Securities Core      → PendingSaleReceivable
├── Financing / Credit   → AdvancePrincipal + Fee
├── Enterprise Workflow  → Request / Validate / Status
├── Ledger               → Accounting entries
└── Settlement           → Offset khi sale proceeds settle
```

Ví dụ illustrative (không phải số tài khoản thật):

```text
SELL trade → PendingReceivable = 100m
Eligible advance = 95m · Fee illustrative = 0.2m
→ cash usable tăng theo advance approved
→ settlement → proceeds clear advance obligation
```

## Ghi chú theo nền tảng

### SSI iBoard

🟢 Screens: bảng giá `/`, margin `/margin/general`, submenu Thông tin thị trường (DOM popup). 🟣 SPA: Sổ lệnh, lệnh điều kiện, ứng trước, CCQ, IPO, SBOND. Rewards: 🔴/—.

### VPS SmartOne

🟢 Screens: bảng giá `/`, thị trường `/market`. 🟡 [Brief User Guide](https://smartone.vps.com.vn/vi-VN/Home/BriefUserGuide): trạng thái lệnh, CK khả dụng, pending. 🟣 Ưu đãi = promotion UI — **Domain 07 loyalty ledger chưa verified**. Margin screen: 🔴.

### TCBS / TCInvest

🟡 Public iWealth, sản phẩm, help. Authenticated TCInvest: 🔴 (redirect `guest/login`). iXu = 🟡 product copy; authenticated reward ledger 🔴.\n\n### BSC WebTrading\n\n🟢 Public priceboard 14/10/2026: 3-level bid/ask, last trade, total volume, high/average/low, foreign buy/sell/room, multi-product tabs, odd-lot, GDTT and connection state. 🟡 Official docs: quick order by clicking bid/ask, ProTrading, conditional orders, multiple sub-accounts, derivatives and online negotiated trading. Authenticated workflow: 🔴.\n\n`Bonds = 🟢*` means the public priceboard exposes a TPDN tab; it does **not** verify a full authenticated bond-order lifecycle.\n\n→ [BSC WebTrading Case Study](./bsc-webtrading)

Chi tiết: [ui-inspection-ssi-iboard](./ui-inspection-ssi-iboard) · [ui-inspection-vps-smartone](./ui-inspection-vps-smartone) · [ui-inspection-tcbs-tcinvest](./ui-inspection-tcbs-tcinvest) · [bsc-webtrading](./bsc-webtrading)
