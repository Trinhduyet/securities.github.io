---
title: "Bài 03 — Tài chính nền tảng"
description: "Time value of money, risk-return, cash flow, cost of capital và valuation — nền tảng để hiểu mọi instrument tài chính."
---

# Bài 03 — Tài chính nền tảng: tiền hôm nay khác tiền ngày mai thế nào?

<div class="lesson-meta">
  <span><strong>Track</strong> Economics & Finance</span>
  <span><strong>Mức độ</strong> Foundation</span>
  <span><strong>Mục tiêu</strong> Hiểu cash flow, discounting, risk/return và valuation</span>
</div>

Nếu được chọn `100 triệu hôm nay` hoặc `100 triệu sau 3 năm`, bạn nên chọn hôm nay — vì tiền có **time value**. Từ ý tưởng đơn giản này sinh ra bond pricing, DCF, NPV, IRR, cost of capital và phần lớn finance.

<div class="learning-objectives">
<strong>Sau bài này bạn phải giải thích được:</strong>

- future value và present value;
- simple vs compound return;
- expected return và risk;
- diversification vì sao giảm unsystematic risk;
- NPV/IRR dùng để đánh giá investment thế nào;
- cost of equity, debt và WACC liên quan valuation ra sao;
- cash flow khác accounting profit vì sao.
</div>

## 1. Time Value of Money

### Future Value

```text
FV = PV × (1 + r)^n
```

100 triệu, 8%/năm, 3 năm:

```text
FV = 100 × 1.08^3 ≈ 125.97 triệu
```

### Present Value

```text
PV = FV / (1 + r)^n
```

125.97 triệu sau 3 năm với discount rate 8% có PV khoảng 100 triệu.

## 2. Compounding

Khác biệt giữa simple và compound return ngày càng lớn theo thời gian.

```text
Year 0: 100
Year 1: 108
Year 2: 116.64
Year 3: 125.97
```

Finance system phải explicit compounding convention, day-count convention và frequency đối với sản phẩm cần chúng.

## 3. Cash Flow trước Profit

Accounting profit có thể dương nhưng doanh nghiệp vẫn thiếu tiền.

```text
Revenue
- Expense
= Accounting Profit
```

khác với:

```text
Cash Inflows
- Cash Outflows
= Net Cash Flow
```

Receivables, inventory, capex và debt repayment tạo khác biệt lớn.

## 4. NPV

```text
NPV = Σ CF_t / (1+r)^t - Initial Investment
```

Nếu NPV > 0, project tạo value theo discount rate giả định.

Ví dụ đầu tư 100, nhận 60 năm 1 và 60 năm 2, r=10%:

```text
NPV = 60/1.1 + 60/1.1² - 100
    ≈ 4.13
```

## 5. IRR

IRR là discount rate làm NPV = 0.

Không nên dùng IRR mù quáng khi cash flow đổi dấu nhiều lần hoặc project có scale khác nhau.

## 6. Return

Simple return:

```text
R = (P1 - P0 + Income) / P0
```

Nếu mua 100, bán 110 và nhận dividend 3:

```text
R = 13%
```

Portfolio analytics phải tách price return, income return và total return khi cần.

## 7. Expected Return

```text
E[R] = Σ probability_i × return_i
```

Ví dụ:

| Scenario | Probability | Return |
|---|---:|---:|
| Bull | 30% | 25% |
| Base | 50% | 10% |
| Bear | 20% | -15% |

```text
E[R] = 0.3×25% + 0.5×10% + 0.2×(-15%) = 9.5%
```

Expected return không phải guaranteed return.

## 8. Risk

Risk có nhiều nghĩa:

```text
Volatility
Drawdown
Default risk
Liquidity risk
Market risk
Credit risk
Operational risk
Settlement risk
```

Đừng dùng một chỉ số volatility để đại diện mọi rủi ro.

## 9. Diversification

Nếu hai assets không perfectly correlated, portfolio variance có thể thấp hơn weighted average variance đơn giản.

Đây là nền tảng của portfolio construction.

```text
Asset-specific risk
  ↓ diversification
Reduced

Systematic risk
  ↓
Không biến mất chỉ bằng diversification
```

## 10. Risk-free Rate và Risk Premium

Mental model:

```text
Required Return
= Risk-free Rate
+ Risk Premium
```

Risk premium bù cho uncertainty, illiquidity, credit risk hoặc equity risk tùy asset.

## 11. Cost of Equity

Một framework thường gặp là CAPM:

```text
Ke = Rf + β(Rm - Rf)
```

Đây là model, không phải định luật tự nhiên. Beta đo sensitivity trong historical/statistical framework, không capture mọi risk.

## 12. Cost of Debt

Debt holder có contractual cash flow và priority khác equity.

After-tax debt cost thường xét tax shield:

```text
Kd_after_tax = Kd × (1 - Tax Rate)
```

## 13. WACC

```text
WACC = E/(D+E) × Ke + D/(D+E) × Kd × (1-T)
```

WACC thường dùng discount unlevered/free cash flow to firm khi assumptions phù hợp.

## 14. Enterprise Value vs Equity Value

Đừng nhầm:

```text
Enterprise Value
≈ value of operations to debt + equity capital providers
```

với:

```text
Equity Value
= value attributable to shareholders
```

Bridge thường xem xét net debt và các adjustment khác.

## 15. DCF mental model

```text
Forecast Revenue
→ Margin
→ Operating Profit
→ Tax
→ Reinvestment
→ Free Cash Flow
→ Discount
→ Terminal Value
→ Enterprise Value
→ Equity Value
```

Sai lầm lớn nhất không nằm ở công thức mà ở assumptions.

## 16. Duration thinking

Asset nhận cash flow xa trong tương lai nhạy hơn với discount-rate changes.

Đó là lý do long-duration growth stock thường nhạy với lãi suất.

## 17. Finance trong backend system

Các calculator production cần:

- deterministic input;
- versioned assumptions;
- currency;
- rounding convention;
- business calendar/day count khi liên quan;
- audit trail;
- unit tests với known examples.

## 18. Common mistakes

- dùng `double` tùy tiện cho money;
- trộn percentage với decimal;
- quên compounding convention;
- dùng profit thay cash flow;
- hard-code discount rate;
- không lưu assumption version.

<div class="key-takeaway">
<strong>Takeaway</strong>

Finance biến cash flow trong tương lai thành giá trị hôm nay bằng **discount rate phản ánh time value + risk**. Mọi valuation chỉ đáng tin bằng assumptions và cash-flow model phía sau.
</div>

## Checklist

- [ ] Tính được PV/FV.
- [ ] Hiểu NPV/IRR.
- [ ] Phân biệt expected vs realized return.
- [ ] Phân biệt volatility với các loại risk khác.
- [ ] Hiểu diversification.
- [ ] Hiểu WACC/enterprise/equity value.
- [ ] Biết finance calculation cần version + rounding + audit.

## Bài tập

1. Tính FV của 500 triệu sau 10 năm ở 7%.
2. Xây NPV calculator có unit tests.
3. Tạo DCF đơn giản 5 năm với 3 scenario.
4. Thiết kế `ValuationRun` lưu model version, assumptions và outputs.

## Đọc tiếp

Tiếp theo: [Bài 04 — Thị trường chứng khoán](../04-securities-market/).