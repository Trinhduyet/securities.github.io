# Bài 03 — Finance Foundations: tiền, thời gian, rủi ro và định giá

Finance bắt đầu từ một câu hỏi: **một đồng tiền ở các thời điểm và trạng thái rủi ro khác nhau có giá trị như nhau không?** Câu trả lời là không.

## 1. Time Value of Money

```text
FV = PV × (1 + r)^n
PV = FV / (1 + r)^n
```

Tư duy này là gốc của bond pricing, DCF, loan schedule và derivatives valuation.

## 2. Cash Flow

Đừng nhầm accounting profit với cash flow.

Một doanh nghiệp có lợi nhuận nhưng thiếu cash vì:

- accounts receivable tăng;
- inventory tăng;
- capex lớn;
- debt repayment.

Ba báo cáo tài chính liên kết:

```text
Income Statement
       ↓
Net Income
       ↓
Cash Flow Statement
       ↕
Balance Sheet
```

## 3. Risk và Return

Expected return cao thường đi cùng risk cao hơn, nhưng phải định nghĩa risk.

Các dạng risk:

- market risk;
- credit risk;
- liquidity risk;
- interest-rate risk;
- FX risk;
- operational risk;
- counterparty risk;
- settlement risk.

Trong software, mỗi risk có data/state khác nhau; không nên có một field `RiskScore` rồi coi như xong.

## 4. Diversification

Portfolio risk phụ thuộc không chỉ từng tài sản mà còn correlation.

```text
Asset A risk
Asset B risk
Correlation(A,B)
        ↓
Portfolio Risk
```

Đây là lý do position engine phải nhìn theo portfolio, không chỉ từng order.

## 5. Required Return và Discount Rate

Một cách tư duy:

```text
Required Return
= Risk-free Rate
+ Risk Premium
```

Trong equity valuation có thể dùng CAPM như một model tham khảo:

```text
E(Ri) = Rf + βi × (E(Rm) - Rf)
```

Không nên coi CAPM là chân lý; điều quan trọng là hiểu **discount rate phản ánh time value + risk**.

## 6. Corporate Finance

Doanh nghiệp quyết định:

- đầu tư dự án nào;
- tài trợ bằng debt hay equity;
- giữ lại lợi nhuận hay trả dividend;
- quản lý working capital thế nào.

Các khái niệm cần nắm:

```text
NPV
IRR
WACC
ROIC
ROE
Debt/Equity
Free Cash Flow
Working Capital
```

## 7. Valuation

### DCF

```text
Enterprise Value
≈ Present Value of future Free Cash Flows
```

### Relative valuation

```text
P/E
P/B
EV/EBITDA
EV/Sales
```

Multiple chỉ có nghĩa khi so với growth, profitability, risk và accounting quality.

## 8. Fixed Income Foundations

Bond có:

```text
Face Value
Coupon
Coupon Schedule
Maturity
Yield
Price
Accrued Interest
```

Quan hệ quan trọng:

```text
Yield ↑ → Bond Price ↓
Yield ↓ → Bond Price ↑
```

Duration đo sensitivity gần đúng của giá trước biến động yield.

## 9. Finance → Domain Model

```text
Cash Flow → Ledger / Settlement
Risk      → Risk Engine
Position  → Portfolio / PnL
Yield     → Bond Pricing
NAV       → Fund Core
Discount  → Valuation / Research
```

## Checklist

Bạn phải giải thích được:

- PV/FV và discount rate;
- profit khác cash flow;
- systematic vs idiosyncratic risk;
- diversification;
- DCF vs multiples;
- yield-price relationship;
- duration dùng để làm gì.

## Bài tập

Thiết kế một API `GET /portfolio/{id}/risk-summary`. Trước khi nghĩ JSON, hãy liệt kê các risk dimension cần có và nguồn dữ liệu của từng dimension. Đây là cách finance dẫn dắt API design, không phải ngược lại.