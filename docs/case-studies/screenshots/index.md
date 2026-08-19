---
title: "Screenshot Inventory — SSI / VPS / TCBS"
description: "Điểm vào ổn định cho thư viện screenshot của Broker App Case Studies."
---

# Screenshot Inventory — SSI / VPS / TCBS

Trang này là route ổn định cho `/case-studies/screenshots/` và liên kết tới danh mục ảnh đầy đủ.

<div class="lesson-meta">
  <span><strong>Phiên chính</strong> 19/08/2026</span>
  <span><strong>An toàn</strong> READ-ONLY</span>
  <span><strong>PII</strong> Authenticated screenshots đã redact/crop</span>
</div>

## Đi đâu tiếp?

<div class="course-grid">
  <a class="course-card" href="../visual-gallery.html">
    <strong>Visual Gallery</strong>
    <span>Xem ảnh theo broker, evidence và business concept.</span>
  </a>
  <a class="course-card" href="./README.html">
    <strong>Inventory chi tiết</strong>
    <span>File, source URL/route, capture date, Core Domain, PII status và nơi sử dụng.</span>
  </a>
  <a class="course-card" href="../broker-domain-matrix.html">
    <strong>Broker Domain Matrix</strong>
    <span>Đối chiếu SSI · VPS · TCBS theo evidence 🟢 🟣 🟡 🔴.</span>
  </a>
</div>

## Quy ước evidence

| Ký hiệu | Nghĩa |
|---|---|
| 🟢 | Authenticated/public screen đã thực sự mở và quan sát |
| 🟣 | Authenticated client evidence: menu / route / label, screen chưa inspect đầy đủ |
| 🟡 | Official public documentation / product page |
| 🔴 | Chưa xác minh |

> Screenshot chỉ chứng minh **UI/capability quan sát được**. Không dùng ảnh để kết luận database, service topology, protocol hay implementation nội bộ của broker.

## Thư mục ảnh

```text
screenshots/
├── ssi/
│   ├── public/
│   └── authenticated/
├── vps/
│   ├── public/
│   └── authenticated/
├── tcbs/
│   ├── public/
│   └── authenticated/
└── shared/
```

Xem danh mục đầy đủ tại [README](./README.html).