# Tài liệu tham khảo

Danh sách này ưu tiên **nguồn chính thức/primary source** cho market infrastructure và chuẩn kỹ thuật. Khi implement production, phải kiểm tra phiên bản quy chế/spec mới nhất.

## Việt Nam — Regulator / Market Infrastructure

### Ủy ban Chứng khoán Nhà nước (SSC)

- [Chính thức vận hành hệ thống công nghệ thông tin mới của Thị trường Chứng khoán — 05/05/2025](https://ssc.gov.vn/webcenter/portal/ubck/pages_r/l/chitit?dDocName=APPSSCGOVVN1620154578)
- [Thông báo đưa hệ thống CNTT thị trường chứng khoán vào vận hành từ 05/05/2025](https://ssc.gov.vn/webcenter/portal/ubck/pages_r/l/chitit?dDocName=APPSSCGOVVN1620154041)

> KRX là bối cảnh hạ tầng công nghệ thị trường. Khi kết nối production, dùng interface specification/message dictionary/network/certification rule được cấp cho đúng thành viên; không suy rằng vanilla FIX 4.4 tự động tương thích toàn bộ KRX interface.

### VSDC — Vietnam Securities Depository and Clearing Corporation

- [VSDC — Official Website](https://www.vsd.vn/)
- [VSDC — English Website](https://www.vsd.vn/en/)
- Trên website chính thức, VSDC công bố các nhóm dịch vụ gồm securities registration, securities depository, clearing & settlement, corporate actions, fund services, securities borrowing/lending và các dịch vụ liên quan.

### Quy chế bù trừ/thanh toán

- [Quyết định 39/QĐ-HĐTV 2025 — Quy chế hoạt động bù trừ và thanh toán giao dịch chứng khoán](https://thuvienphapluat.vn/van-ban/Chung-khoan/Quyet-dinh-39-QD-HDTV-2025-Quy-che-hoat-dong-bu-tru-va-thanh-toan-giao-dich-chung-khoan-655003.aspx)

> Link tra cứu văn bản thuận tiện; khi áp dụng pháp lý/production hãy đối chiếu văn bản chính thức, website VSDC/SSC và các sửa đổi mới nhất.

## FIX Trading Community

### Standards & Message Dictionary

- [FIX Trading Community — Standards](https://www.fixtrading.org/standards/)
- [FIX 4.4 Message Summary by Category](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/messages_sorted_by_category.html)
- [FIX 4.4 MsgType (Tag 35)](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/tag35.html)

### Order / Execution

- [FIX 4.4 ExecutionReport (35=8)](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/body_5756.html)
- [FIX 4.4 ResendRequest (35=2)](https://fiximate.fixtrading.org/legacy/en/FIX.4.4/body_5150.html)

### Session Recovery

- [FIX Session Layer Online](https://www.fixtrading.org/standards/fix-session-layer-online/)
- [FIX Session Layer Test Cases](https://www.fixtrading.org/standards/fix-session-testcases-online/)

Đọc session specification theo failure scenario:

```text
sequence gap
→ ResendRequest
→ retransmit/gap fill
→ PossDup handling
→ application dedup
→ session state persistence
→ restart/failover
```

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
- Enterprise Integration Patterns — messaging, idempotent receiver và integration patterns.

## Kiến thức nào phải luôn verify lại?

Các nội dung có thể thay đổi theo thời gian:

```text
trading rules
order types/session rules
settlement cycle
margin/risk regulations
fees/taxes
market calendars
KRX/member interface specification
VSDC procedures
network/certificate/certification requirements
```

Tài liệu khóa học dạy mental model; implementation production phải đọc rule/spec đang có hiệu lực.

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
- sau recovery, reconcile với OMS/venue bằng key nào?

Đó là cách biến reference thành engineering knowledge.