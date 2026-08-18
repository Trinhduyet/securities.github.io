# Bài 02 — Kinh tế học vĩ mô: nền kinh tế đi vào giá tài sản như thế nào?

Vĩ mô nghiên cứu nền kinh tế tổng thể. Với nhà đầu tư và securities engineer, cần hiểu chuỗi truyền dẫn:

```text
Growth / Inflation / Policy
        ↓
Interest Rate / Liquidity / FX
        ↓
Corporate Earnings + Discount Rate
        ↓
Asset Valuation
        ↓
Market Activity / Risk
```

## 1. GDP và tăng trưởng

GDP đo giá trị hàng hóa, dịch vụ cuối cùng được sản xuất trong nền kinh tế.

Ba cách nhìn phổ biến:

```text
GDP = C + I + G + (X - M)
```

Tăng trưởng kinh tế thường hỗ trợ doanh thu/lợi nhuận doanh nghiệp nhưng không đồng nghĩa thị trường chứng khoán luôn tăng; giá còn phụ thuộc **expectation** và **valuation**.

## 2. Inflation

Lạm phát làm giảm sức mua và ảnh hưởng:

- chi phí nguyên vật liệu;
- tiền lương;
- sức mua người tiêu dùng;
- lãi suất;
- discount rate;
- biên lợi nhuận.

Một doanh nghiệp có pricing power có thể chuyển chi phí tăng sang khách hàng tốt hơn doanh nghiệp cạnh tranh bằng giá.

## 3. Interest Rate

Lãi suất là biến số trung tâm của finance.

```text
Interest Rate ↑
   ├─ Cost of Debt ↑
   ├─ Required Return ↑
   ├─ Present Value ↓
   └─ Credit / Liquidity có thể ↓
```

Định giá một cash flow tương lai:

```text
PV = CF / (1 + r)^t
```

`r` tăng → PV giảm, nếu các yếu tố khác giữ nguyên.

## 4. Monetary Policy

Ngân hàng trung ương tác động nền kinh tế qua công cụ chính sách tiền tệ và điều kiện thanh khoản.

Engineer không cần trở thành nhà kinh tế, nhưng phải hiểu tại sao thị trường phản ứng mạnh với:

- policy rate;
- money supply/liquidity;
- credit conditions;
- expectation về future rate.

## 5. Fiscal Policy

Thuế, chi tiêu công, đầu tư công và ngân sách có thể tác động tổng cầu và từng ngành.

Ví dụ đầu tư hạ tầng lớn có thể ảnh hưởng nhóm xây dựng, vật liệu, logistics và ngân hàng qua nhiều kênh khác nhau.

## 6. Exchange Rate

FX ảnh hưởng:

- doanh nghiệp xuất khẩu/nhập khẩu;
- khoản vay ngoại tệ;
- dòng vốn nước ngoài;
- giá nguyên liệu;
- inflation.

Không nên suy luận đơn giản “tỷ giá tăng = exporter tốt”; phải xem cơ cấu revenue/cost/debt và hedging.

## 7. Business Cycle

Mental model:

```text
Expansion → Peak → Slowdown/Recession → Recovery
```

Các sector không phản ứng giống nhau. Cyclical companies khác defensive companies.

## 8. Yield Curve

Yield curve biểu diễn lãi suất theo kỳ hạn. Nó chứa expectation về growth, inflation, policy và risk premium.

Đối với bond core, yield curve không phải chart để xem cho đẹp; nó là input cho:

- pricing;
- mark-to-market;
- duration;
- risk;
- scenario analysis.

## 9. Vĩ mô → hệ thống dữ liệu

Một investment/data platform thường phải ingest:

```text
Macro Data
├── GDP
├── CPI
├── Policy Rate
├── FX
├── Yield Curve
├── Credit Growth
└── Commodity Prices
       ↓
Time-series Store
       ↓
Analytics / Research / Alert
```

Điểm kỹ thuật quan trọng: macro series có thể **revision**. Một giá trị lịch sử được công bố hôm nay có thể được cơ quan thống kê sửa sau này; data model nên lưu publication time/version nếu yêu cầu audit/research nghiêm túc.

## Checklist

- GDP growth khác stock return ở điểm nào?
- Inflation ảnh hưởng margin và discount rate thế nào?
- Tại sao rate tăng thường gây áp lực lên valuation?
- FX tác động doanh nghiệp qua những kênh nào?
- Yield curve được dùng ở bond/risk engine ra sao?

## Bài tập

Lấy một doanh nghiệp ngân hàng, một doanh nghiệp xuất khẩu và một doanh nghiệp bất động sản. Lập bảng sensitivity với 4 biến: interest rate, FX, inflation, GDP growth; giải thích kênh tác động thay vì chỉ ghi “tăng/giảm”.