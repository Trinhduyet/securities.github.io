---
title: "Bài 05 — Phân tích đầu tư"
description: "Fundamental analysis, technical analysis, portfolio thinking và data lineage cho investor-facing systems."
---

# Bài 05 — Phân tích đầu tư: từ doanh nghiệp, dữ liệu giá đến quyết định portfolio

<div class="lesson-meta">
  <span><strong>Track</strong> Economics & Finance</span>
  <span><strong>Mức độ</strong> Foundation</span>
  <span><strong>Mục tiêu</strong> Hiểu fundamental, technical và portfolio analysis theo góc nhìn dữ liệu</span>
</div>

Investor không chỉ cần “giá hôm nay”. Họ cần trả lời ba câu hỏi: **mua cái gì, ở giá nào, với tỷ trọng bao nhiêu**.

<div class="learning-objectives">
<strong>Sau bài này bạn phải giải thích được:</strong>

- fundamental analysis đánh giá business/valuation thế nào;
- technical analysis dùng price-volume data thế nào;
- portfolio analysis xử lý risk ở cấp danh mục ra sao;
- adjusted price và corporate actions quan trọng vì sao;
- backtest dễ sai do look-ahead, survivorship và data snooping thế nào.
</div>

## 1. Fundamental Analysis

Fundamental analysis bắt đầu từ business economics:

```text
Industry
→ Competitive Position
→ Revenue Drivers
→ Margins
→ Capital Intensity
→ Cash Flow
→ Balance Sheet
→ Valuation
```

## 2. Financial Statements

### Income Statement

```text
Revenue
- COGS
= Gross Profit
- Operating Expenses
= Operating Profit
- Interest/Tax
= Net Income
```

### Balance Sheet

```text
Assets = Liabilities + Equity
```

### Cash Flow Statement

```text
Operating Cash Flow
Investing Cash Flow
Financing Cash Flow
```

## 3. Quality of Earnings

Net income tăng nhưng operating cash flow giảm mạnh có thể là warning.

Cần nhìn:

- receivables;
- inventory;
- one-off gains;
- capitalization policy;
- working capital.

## 4. Ratios

```text
ROE
ROA
Gross Margin
Operating Margin
Net Margin
Debt/Equity
Interest Coverage
Current Ratio
Asset Turnover
```

Ratio chỉ hữu ích khi hiểu business model và peer context.

## 5. Valuation Multiples

```text
P/E
P/B
EV/EBITDA
EV/Sales
Dividend Yield
```

Không so P/E của bank với software company mà không hiểu economics.

## 6. DCF

DCF định giá cash flow, không định giá chart.

Sensitivity table nên xét:

```text
Revenue growth
Margin
WACC
Terminal growth
Capex / reinvestment
```

## 7. Technical Analysis

Technical analysis xử lý market-observed data:

```text
Price
Volume
Volatility
Trend
Momentum
Support/Resistance
Market Breadth
```

## 8. OHLCV

```text
Open
High
Low
Close
Volume
```

Candle aggregation phải dựa event time, session và eligible trade rules phù hợp.

## 9. Moving Average

SMA(n):

```text
SMA_n = average(last n closes)
```

EMA đặt weight lớn hơn cho dữ liệu gần đây.

Indicator không “biết tương lai”; nó chỉ transform historical inputs.

## 10. RSI

RSI là momentum oscillator. Không nên hard-code `RSI < 30 => BUY` như universal truth.

Signal phải được backtest theo market, period, costs và execution assumptions.

## 11. MACD

MACD dùng chênh lệch giữa hai EMA và signal line để capture momentum/trend changes.

## 12. ATR / Volatility

ATR đo trading range, hữu ích cho position sizing/stop logic nhưng không đại diện toàn bộ risk.

## 13. Adjusted Price

Corporate actions làm raw price series bị discontinuity.

```text
Raw Price
+ Corporate Action Factors
→ Adjusted Price
```

Không version factor thì historical indicators có thể thay đổi mà không audit được.

## 14. Portfolio Analysis

Một stock tốt không đồng nghĩa portfolio tốt.

Cần xét:

```text
Expected Return
Volatility
Correlation
Concentration
Liquidity
Drawdown
Sector Exposure
Factor Exposure
```

## 15. Position Sizing

Thay vì “mã này tốt → all-in”, portfolio process đặt constraint:

```text
Max position
Max sector
Risk budget
Liquidity limit
Loss tolerance
```

## 16. Backtesting Pitfalls

### Look-ahead bias
Dùng dữ liệu chưa tồn tại tại decision time.

### Survivorship bias
Chỉ test trên mã còn tồn tại hôm nay.

### Data snooping
Thử quá nhiều strategy rồi chọn cái đẹp nhất.

### Unrealistic execution
Bỏ phí, slippage, liquidity và delay.

## 17. Data Lineage

Investor-facing analytics cần biết:

```text
Source
AsOfTime
AdjustmentVersion
IndicatorParameters
ModelVersion
CalculationTime
```

## 18. Fundamental + Technical không loại trừ nhau

Một workflow có thể là:

```text
Fundamental
→ universe selection

Technical / Market Data
→ timing / risk monitoring

Portfolio
→ sizing / diversification
```

## 19. Common mistakes

- coi indicator là prediction oracle;
- không adjust corporate action;
- bỏ transaction cost;
- dùng current financial statement revision cho past backtest;
- overfit strategy;
- không tách signal generation và execution reality.

<div class="key-takeaway">
<strong>Takeaway</strong>

Investment analysis là **data + model + assumption + decision process**. System tốt phải giữ lineage để người dùng biết kết quả đến từ dữ liệu và rule nào.
</div>

## Checklist

- [ ] Đọc 3 financial statements.
- [ ] Hiểu key ratios/multiples.
- [ ] Biết DCF sensitivity.
- [ ] Hiểu OHLCV và indicator basics.
- [ ] Biết adjusted price.
- [ ] Biết portfolio constraints.
- [ ] Nhận diện backtest bias.

## Bài tập

1. Phân tích một công ty bằng revenue → margin → cash flow → valuation.
2. Tính SMA20/RSI14 từ historical close.
3. Backtest một rule đơn giản có fee + slippage.
4. Thiết kế schema lưu `IndicatorRun` và `ValuationRun` có lineage.

## Đọc tiếp

Tiếp theo: [Bài 06 — Order Lifecycle & Matching](../06-order-matching/).