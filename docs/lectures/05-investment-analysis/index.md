# Bài 05 — Phân tích đầu tư: Fundamental + Technical + Portfolio

Mục tiêu của bài này không phải dạy “mẹo mua cổ phiếu”, mà giúp engineer hiểu các feature mà app chứng khoán thường cung cấp: financial statements, ratios, chart, indicators, screener, alert, watchlist và portfolio analytics.

## 1. Fundamental Analysis

Bắt đầu từ business model:

```text
Customer
  ↓
Revenue Model
  ↓
Gross Margin
  ↓
Operating Cost
  ↓
Operating Profit
  ↓
Capital Structure / Tax
  ↓
Net Income + Cash Flow
```

### Ba báo cáo

**Income Statement**: doanh thu, chi phí, lợi nhuận.

**Balance Sheet**: tài sản, nợ, vốn chủ.

**Cash Flow Statement**: operating, investing, financing cash flow.

### Ratio cần hiểu

```text
Profitability: ROE, ROA, ROIC, Margin
Growth: Revenue Growth, EPS Growth
Leverage: Debt/Equity, Net Debt/EBITDA
Valuation: P/E, P/B, EV/EBITDA
Efficiency: Asset Turnover, Working Capital
```

Đừng hiển thị ratio mà không lưu kỳ báo cáo, currency, consolidated/separate scope và restatement/version.

## 2. Valuation

### DCF
Estimate future cash flow và discount về hiện tại.

### Relative valuation
So sánh multiple với peer/history.

### Asset-based
Hữu ích với một số doanh nghiệp tài sản lớn.

System design cần hỗ trợ **assumption**, không chỉ output cuối cùng. Một DCF tool tốt phải audit được growth, margin, WACC và terminal assumption.

## 3. Technical Analysis

TA nghiên cứu price/volume behavior.

Data pipeline:

```text
Tick
 ↓
Candle Aggregator
 ↓
OHLCV
 ↓
Indicator Engine
 ↓
Signal / Screener / Alert
```

Các indicator phổ biến:

- SMA / EMA;
- RSI;
- MACD;
- Bollinger Bands;
- ATR;
- Volume / VWAP;
- support/resistance derived features.

### Ví dụ RSI

Indicator là deterministic function trên chuỗi dữ liệu. Câu hỏi engineering:

- candle missing thì sao?
- corporate action adjustment thế nào?
- timezone/session nào?
- late tick có recompute candle không?
- replay có cho cùng kết quả không?

## 4. Fundamental và Technical không loại trừ nhau

Một workflow thực tế có thể là:

```text
Fundamental Screener
ROE > threshold
Debt controlled
Growth positive
      ↓
Technical Timing
Trend / Volume / Momentum
      ↓
Risk & Position Sizing
```

## 5. Portfolio Analysis

App trading không nên chỉ hiện tổng lãi/lỗ.

Nên hiểu:

```text
Cost Basis
Realized PnL
Unrealized PnL
Cash
Exposure
Allocation
Concentration
Drawdown
Benchmark Return
```

## 6. Data correctness quan trọng hơn chart đẹp

Một chart có thể render đúng nhưng data sai vì:

- split/dividend adjustment;
- timezone;
- duplicate tick;
- missing market session;
- stale reference price;
- wrong decimal/lot scaling.

Trong financial analytics, **data lineage và reproducibility** quan trọng ngang UI.

## 7. Không biến signal thành lời hứa lợi nhuận

Indicator là feature thống kê, không phải guarantee. Research system nên phân biệt:

```text
Raw Data
Derived Indicator
Signal
Research Opinion
Customer Action
```

và lưu provenance/version khi cần audit.

## Checklist

- Đọc được 3 báo cáo tài chính và liên kết của chúng.
- Phân biệt profitability, leverage, growth, valuation ratios.
- Hiểu DCF assumptions.
- Hiểu OHLCV và indicator pipeline.
- Phân biệt realized/unrealized PnL.
- Nhận ra data adjustment/revision problem.

## Bài tập

Thiết kế một screener: `ROE > 15%`, `Debt/Equity < 1`, `Revenue growth > 10%`, `RSI 40–60`, `volume > 20-day average`. Ghi rõ source, update frequency, missing-data rule và versioning của mỗi input.