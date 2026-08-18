# Bài 01 — Kinh tế học vi mô: vì sao giá hình thành?

Kinh tế vi mô nghiên cứu cách **cá nhân, doanh nghiệp và thị trường** ra quyết định khi nguồn lực hữu hạn. Với securities engineer, mục tiêu không phải thuộc đồ thị cung–cầu mà là hiểu logic phía sau **price discovery, liquidity, incentives và market behavior**.

## 1. Scarcity và Opportunity Cost

Nguồn lực có giới hạn nên mọi quyết định đều có chi phí cơ hội.

Ví dụ nhà đầu tư có 1 tỷ đồng:

```text
Mua cổ phiếu FPT
        ↓
Không còn cùng 1 tỷ đó để mua trái phiếu / gửi tiết kiệm / giữ tiền mặt
        ↓
Expected return phải được so với alternative return
```

Đây là gốc của khái niệm **required return** trong finance.

## 2. Supply — Demand

Giá cân bằng hình thành nơi lượng cung gặp lượng cầu.

Trong chứng khoán, mental model này chuyển thành **order book**:

```text
SELL / ASK
121.0   2,000
120.5   1,500
120.0   3,000
----------------
119.9   2,500
119.5   4,000
119.0   1,000
BUY / BID
```

Order book là biểu hiện rất cụ thể của cung và cầu ở từng mức giá.

### Spread

```text
Best Ask - Best Bid = Bid/Ask Spread
```

Spread nhỏ thường gắn với thanh khoản tốt hơn; spread lớn có thể phản ánh thanh khoản kém hoặc uncertainty cao.

## 3. Elasticity

Elasticity đo mức phản ứng của demand/supply trước thay đổi giá hoặc yếu tố khác.

Trong market microstructure, tư duy tương tự giúp hiểu:

- tại sao một cổ phiếu thanh khoản thấp có thể biến động mạnh với một order không quá lớn;
- tại sao market impact phụ thuộc độ sâu order book;
- tại sao không thể giả định “mua 1 triệu cổ phiếu ở last price”.

## 4. Marginal Thinking

Doanh nghiệp tối ưu tại biên: lợi ích tăng thêm so với chi phí tăng thêm.

Trong trading/risk:

```text
Additional Position
        ↓
Additional Expected Return
        vs
Additional Risk / Margin / Capital Usage
```

Đây là nền để hiểu portfolio optimization và risk-adjusted return.

## 5. Firm, Cost và Profit

Doanh nghiệp có:

```text
Revenue
- Variable Cost
- Fixed Cost
= Operating Profit
```

Các khái niệm micro quan trọng khi đọc doanh nghiệp:

- economies of scale;
- marginal cost;
- pricing power;
- barriers to entry;
- network effects;
- competition structure.

## 6. Market Structures

### Perfect competition
Nhiều bên tham gia, ít pricing power.

### Monopoly
Một người bán thống trị.

### Oligopoly
Một số ít doanh nghiệp lớn chi phối.

### Monopolistic competition
Nhiều người bán nhưng sản phẩm có khác biệt.

Khi phân tích cổ phiếu, câu hỏi quan trọng không phải “P/E bao nhiêu?” trước tiên, mà là:

> Doanh nghiệp kiếm tiền nhờ lợi thế kinh tế nào và lợi thế đó bền vững bao lâu?

## 7. Information Asymmetry

Người mua và người bán không luôn có cùng thông tin. Đây là nền cho:

- adverse selection;
- signaling;
- disclosure;
- corporate governance;
- insider trading regulation;
- investor relations.

Investor Relations tồn tại một phần để giảm khoảng cách thông tin giữa doanh nghiệp và thị trường.

## 8. Externality và Regulation

Thị trường không tự giải quyết mọi vấn đề. Finance có systemic risk, information asymmetry, manipulation và principal-agent conflict; vì vậy xuất hiện regulator, exchange rule, disclosure rule, clearing mechanism.

## Liên hệ trực tiếp với hệ thống chứng khoán

```text
Microeconomics
    ↓
Supply / Demand
    ↓
Order Book
    ↓
Price Discovery
    ↓
Matching Engine

Information Asymmetry
    ↓
Disclosure / IR

Incentives
    ↓
Fee / Market Maker / Broker behavior
```

## Checklist

Sau bài này bạn phải giải thích được:

- Opportunity cost ảnh hưởng required return thế nào?
- Bid, Ask và Spread biểu diễn supply/demand ra sao?
- Tại sao order lớn gây market impact?
- Pricing power ảnh hưởng valuation thế nào?
- Information asymmetry liên quan gì tới IR và regulation?

## Bài tập

Chọn một mã cổ phiếu thanh khoản cao và một mã thanh khoản thấp. Quan sát bid/ask, depth và spread; giải thích bằng supply-demand và market impact thay vì chỉ nhìn chart giá.