---
title: "Bài 02 — Kinh tế học vĩ mô"
description: "Từ GDP, lạm phát, lãi suất và chính sách đến định giá tài sản, chu kỳ thị trường và quyết định đầu tư."
---

# Bài 02 — Kinh tế học vĩ mô: vì sao cả thị trường cùng tăng hoặc cùng giảm?

<div class="lesson-meta">
  <span><strong>Track</strong> Economics & Finance</span>
  <span><strong>Mức độ</strong> Foundation</span>
  <span><strong>Mục tiêu</strong> Hiểu các biến vĩ mô truyền dẫn vào doanh nghiệp, lãi suất và giá tài sản</span>
</div>

Một cổ phiếu có thể tốt lên dù doanh nghiệp không công bố tin gì, hoặc giảm mạnh dù báo cáo lợi nhuận vẫn ổn. Lý do thường nằm ở **môi trường vĩ mô**: lãi suất, lạm phát, tăng trưởng, tỷ giá, thanh khoản hệ thống và kỳ vọng chính sách.

<div class="learning-objectives">
<strong>Sau bài này bạn phải giải thích được:</strong>

- GDP thực khác GDP danh nghĩa thế nào;
- lạm phát tác động đến purchasing power và required return ra sao;
- vì sao lãi suất tăng thường gây áp lực lên định giá tài sản;
- chính sách tiền tệ và tài khóa truyền dẫn vào nền kinh tế thế nào;
- chu kỳ kinh tế ảnh hưởng earnings, credit risk và sector rotation ra sao;
- backend/data platform cần lưu macro data theo version, period và release time vì sao.
</div>

## 1. GDP — đo quy mô hoạt động kinh tế

GDP thường được hiểu bằng identity:

```text
GDP = Consumption + Investment + Government Spending + Net Exports
```

Nhưng với investor, câu hỏi quan trọng hơn là:

> tăng trưởng đến từ đâu, bền vững không, và doanh nghiệp nào hưởng lợi?

Ví dụ đầu tư công tăng có thể thúc đẩy xây dựng, vật liệu, logistics; xuất khẩu yếu có thể làm giảm doanh thu nhóm doanh nghiệp phụ thuộc thị trường ngoài nước.

## 2. GDP danh nghĩa và GDP thực

Nếu sản lượng không đổi nhưng giá tăng 10%, GDP danh nghĩa có thể tăng dù nền kinh tế không sản xuất nhiều hơn.

```text
Nominal GDP = current price × current quantity
Real GDP    = base-year price × current quantity
```

Vì vậy phân tích tăng trưởng phải tách **price effect** khỏi **volume effect**.

## 3. Inflation — lạm phát

Lạm phát làm giảm sức mua của tiền.

Nếu lợi suất danh nghĩa là 8% nhưng inflation 5%, real return xấp xỉ:

```text
Real Return ≈ Nominal Return - Inflation
            ≈ 8% - 5%
            ≈ 3%
```

Công thức chính xác hơn:

```text
1 + real = (1 + nominal) / (1 + inflation)
```

### Tại sao inflation làm thị trường khó chịu?

```text
Inflation ↑
  ↓
Policy rate có thể ↑
  ↓
Cost of capital ↑
  ↓
Present value of future cash flows ↓
  ↓
Valuation pressure
```

## 4. Interest Rate — biến số trung tâm của finance

Giả sử nhận `110` sau một năm.

Nếu discount rate 5%:

```text
PV = 110 / 1.05 ≈ 104.76
```

Nếu discount rate 10%:

```text
PV = 110 / 1.10 = 100
```

Cùng cash flow, lãi suất cao hơn → present value thấp hơn.

Đây là cầu nối trực tiếp từ macro sang valuation.

## 5. Yield Curve

Yield curve mô tả lãi suất theo kỳ hạn.

```text
Short-term yield
Medium-term yield
Long-term yield
```

Shape của curve chứa kỳ vọng về policy, inflation, growth và risk premium.

Không nên học máy móc “inverted yield curve = recession”. Engineer/data analyst cần lưu **observation date, maturity, source và revision** để historical backtest đúng.

## 6. Monetary Policy

Ngân hàng trung ương tác động nền kinh tế qua các công cụ như policy rate, open-market operations, reserve/liquidity mechanisms tùy hệ thống.

Mental model:

```text
Policy stance
   ↓
Interbank / funding conditions
   ↓
Bank lending rates
   ↓
Credit creation
   ↓
Consumption / Investment
   ↓
Growth / Inflation
```

## 7. Fiscal Policy

Chính phủ tác động qua chi tiêu, thuế và đầu tư công.

```text
Government spending ↑
→ aggregate demand ↑
→ business revenue có thể ↑
→ nhưng debt/funding pressure cũng có thể ↑
```

Không có policy nào chỉ có một effect.

## 8. Exchange Rate

Tỷ giá ảnh hưởng doanh nghiệp khác nhau.

### Exporter

Doanh thu USD, chi phí VND có thể hưởng lợi khi USD mạnh — nhưng còn contract, hedging, input import và elasticity.

### Importer

Nhập nguyên liệu bằng USD có thể chịu cost pressure khi VND yếu.

Do đó backend analytics không nên hard-code `USD/VND ↑ = exporter tốt` mà cần exposure model.

## 9. Business Cycle

Một mental model đơn giản:

```text
Expansion
→ Peak
→ Slowdown
→ Recession
→ Recovery
```

Sector sensitivity khác nhau:

- cyclical: construction, discretionary, commodities;
- defensive: utilities, essential consumption;
- rate-sensitive: banks, real estate, long-duration growth stocks.

## 10. Unemployment và labor market

Labor market vừa phản ánh sức khỏe kinh tế vừa ảnh hưởng wage inflation.

```text
Tight labor market
→ wage pressure
→ consumption support
→ margin pressure ở business labor-intensive
```

## 11. Liquidity và Credit Cycle

Không chỉ policy rate, **availability of credit** cũng quan trọng.

```text
Easy credit
→ leverage ↑
→ asset demand ↑
→ risk taking ↑
```

Khi cycle đảo chiều:

```text
credit standards tighten
→ refinancing difficult
→ defaults ↑
→ forced selling
```

## 12. Macro → Company Earnings

Ví dụ công ty bán lẻ:

```text
GDP growth ↓
→ disposable income pressure
→ consumer demand ↓
→ revenue growth ↓
→ operating leverage
→ profit falls faster than revenue
```

Đây là lý do valuation model phải có scenario thay vì chỉ extrapolate lịch sử.

## 13. Macro → Asset Pricing

```text
Risk-free rate
+ inflation expectation
+ growth expectation
+ risk premium
= required return context
```

Thị trường không phản ứng chỉ với dữ liệu hiện tại mà với **surprise so với expectation**.

Ví dụ CPI 4% không tự động xấu. Nếu market kỳ vọng 5%, 4% có thể là positive surprise.

## 14. Dữ liệu vĩ mô là temporal data

Backend engineer phải phân biệt:

```text
Reference Period
Release Time
Revision Time
Source
Vintage
```

Một chỉ số GDP có thể được công bố sơ bộ rồi revised. Nếu backtest dùng số revised mà giả định investor đã biết từ ngày đầu, bạn tạo **look-ahead bias**.

## 15. Common mistakes

- nhìn một macro indicator rồi kết luận cả thị trường;
- dùng nominal growth thay cho real growth;
- bỏ qua expectation/surprise;
- dùng dữ liệu revised cho historical decision simulation;
- coi correlation là causation;
- hard-code “rate up = all stocks down”.

<div class="key-takeaway">
<strong>Takeaway</strong>

Macro không đưa ra lệnh BUY/SELL trực tiếp. Nó thiết lập **discount-rate environment, earnings environment và liquidity regime** mà mọi tài sản phải hoạt động bên trong.
</div>

## Checklist

- [ ] Giải thích nominal vs real GDP.
- [ ] Giải thích inflation → rate → valuation.
- [ ] Hiểu yield curve là term structure, không phải một con số.
- [ ] Phân biệt monetary vs fiscal transmission.
- [ ] Biết expectation quan trọng hơn headline value.
- [ ] Biết macro data có revision/vintage.

## Bài tập

1. Giả lập PV của một cash flow 100 triệu sau 5 năm với discount rate 6%, 9%, 12%.
2. Chọn một exporter và importer; lập bảng sensitivity với USD/VND ±5%.
3. Thiết kế schema lưu CPI/GDP có `period`, `released_at`, `revised_at`, `source`, `value`.
4. Viết một scenario: inflation cao nhưng GDP vẫn tăng — ngành nào có thể thắng/thua và vì sao?

## Đọc tiếp

Tiếp theo: [Bài 03 — Tài chính nền tảng](../03-finance-foundations/).