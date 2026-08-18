# Tài liệu tham khảo

Danh sách này ưu tiên **nguồn chính thức/primary source** cho market infrastructure và chuẩn kỹ thuật. Khi implement production, phải kiểm tra phiên bản quy chế/spec mới nhất.

## Việt Nam — Regulator / Market Infrastructure

### Ủy ban Chứng khoán Nhà nước (SSC)

- [Chính thức vận hành hệ thống công nghệ thông tin mới của Thị trường Chứng khoán — 05/05/2025](https://ssc.gov.vn/webcenter/portal/ubck/pages_r/l/chitit?dDocName=APPSSCGOVVN1620154578)
- [Thông báo đưa hệ thống CNTT thị trường chứng khoán vào vận hành từ 05/05/2025](https://ssc.gov.vn/webcenter/portal/ubck/pages_r/l/chitit?dDocName=APPSSCGOVVN1620154041)

### VSDC

- [VSDC — Bù trừ và Thanh toán](https://vsd.vn/vi/sd/XAz40d2Q-9j569TvBgLQaQ)
- Website VSDC/VSD: https://vsd.vn/

### Quy chế bù trừ/thanh toán

- [Quyết định 39/QĐ-HĐTV 2025 — Quy chế hoạt động bù trừ và thanh toán giao dịch chứng khoán](https://thuvienphapluat.vn/van-ban/Chung-khoan/Quyet-dinh-39-QD-HDTV-2025-Quy-che-hoat-dong-bu-tru-va-thanh-toan-giao-dich-chung-khoan-655003.aspx)

> Đây là link tra cứu văn bản thuận tiện; khi áp dụng pháp lý/production hãy đối chiếu văn bản chính thức và các sửa đổi mới nhất.

## FIX Trading Community

- [FIX Trading Community — Standards](https://www.fixtrading.org/standards/)
- [FIX 4.4 Message Summary by Category](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/messages_sorted_by_category.html)
- [FIX 4.4 ExecutionReport (35=8)](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/body_5756.html)
- [FIX 4.4 ResendRequest (35=2)](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/body_5150.html)
- [FIX 4.4 MsgType (Tag 35)](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/tag35.html)

## Economics

- N. Gregory Mankiw — *Principles of Economics*.
- Hal R. Varian — *Intermediate Microeconomics*.
- Olivier Blanchard — *Macroeconomics*.

## Finance & Investment

- Richard A. Brealey, Stewart C. Myers, Franklin Allen — *Principles of Corporate Finance*.
- Aswath Damodaran — valuation materials/books.
- Bodie, Kane, Marcus — *Investments*.
- CFA Institute curriculum — ethics, quantitative methods, economics, financial statement analysis, corporate issuers, equity, fixed income, derivatives, portfolio management.

## Market Microstructure

- Larry Harris — *Trading and Exchanges: Market Microstructure for Practitioners*.
- Maureen O'Hara — *Market Microstructure Theory*.

## Distributed Systems / Reliability

- Martin Kleppmann — *Designing Data-Intensive Applications*.
- Pat Helland — writings on distributed transactions, idempotency and data ownership.
- Enterprise Integration Patterns — messaging/idempotent receiver/outbox-adjacent thinking.

## Cách dùng nguồn

Đừng đọc tài liệu theo kiểu ghi nhớ định nghĩa. Với mỗi rule/spec, hãy trích ra:

```text
Business Rule
→ State
→ Invariant
→ Message/Data Contract
→ Failure Mode
→ Recovery
→ Reconciliation
→ Test Case
```

Ví dụ khi đọc FIX `ResendRequest`, đừng dừng ở “message type 2”. Hãy hỏi:

- sequence state lưu ở đâu?
- gap detected thế nào?
- replay có duplicate business effect không?
- app layer dedup theo identity nào?
- failover node khác có tiếp tục session được không?

Đó là cách biến reference thành engineering knowledge.