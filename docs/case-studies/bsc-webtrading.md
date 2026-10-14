---
title: "BSC WebTrading — Price Board & Trading Case Study"
description: "Học Market Data, quick order, conditional order, multi-product boards và negotiated trading từ BSC WebTrading bằng public/official evidence."
---

# BSC WebTrading — từ bảng giá realtime đến Order Command

<div class="lesson-meta">
  <span><strong>Broker</strong> BSC / BIDV Securities</span>
  <span><strong>Evidence</strong> 🟢 Public priceboard · 🟡 Official docs</span>
  <span><strong>Khảo sát</strong> 14/10/2026 · READ-ONLY</span>
</div>

BSC là case study tốt để nhìn rõ boundary giữa:

~~~text
Market Data Projection
        ↓
User selects price / symbol
        ↓
Order Command
        ↓
Account / Risk / Reservation
        ↓
OMS
        ↓
Exchange Connectivity
~~~

Public evidence ở đây **không chứng minh** BSC dùng protocol, database, event bus, FIX engine hay topology nội bộ nào cụ thể.

## 1. Public priceboard cho thấy gì?

Bảng giá public BSC hiện thể hiện các nhóm market view như:

- VN-Index, VN30, HNX-Index, HNX30, UPCOM.
- Danh mục yêu thích.
- Nhóm chỉ số / ngành.
- Giao dịch thỏa thuận (GDTT).
- Phái sinh.
- Chứng quyền.
- ETF.
- TPDN.
- Lô lẻ.
- Buy In label trên UI public.

Các cột market-depth / quote chính gồm:

~~~text
Trần / Sàn / Tham chiếu

Dư mua
  Giá 3 / KL 3
  Giá 2 / KL 2
  Giá 1 / KL 1

Khớp lệnh
  Mã CK
  Giá
  KL
  +/- / %

Dư bán
  Giá 1 / KL 1
  Giá 2 / KL 2
  Giá 3 / KL 3

Tổng KL
Cao / TB / Thấp
NN Mua / NN Bán / NN Room
~~~

Public page cũng expose connection status và trạng thái lỗi kết nối.

**Engineering lesson:** bảng giá là một **read model / projection** của market data. Nó không phải source of truth cho internal order state và cũng không chứng minh transport phía dưới là WebSocket hay công nghệ cụ thể nào.

Nguồn:
- https://trading.bsc.com.vn/priceboard
- https://www.bsc.com.vn/tin-tuc/tin-chi-tiet/92817-huong-dan-cach-doc-bang-dien-chung-khoan/

## 2. Bảng giá không phải Central Order Book của broker

Ba mức bid/ask trên UI là market-depth data phục vụ người dùng.

Không nên suy:

~~~text
UI có 3 mức giá mua/bán
→ broker sở hữu central matching order book
~~~

Mental model đúng:

~~~text
Trading Venue / Market Data Source
             ↓
       Market Data Feed
             ↓
 normalize / sequence / freshness
             ↓
      Price Board Projection
             ↓
           User
~~~

Central matching authority thuộc trading venue / market infrastructure, không thuộc priceboard UI.

Đọc sâu:
- [System Map](/resources/system-map.html)
- [Bài 10 — Market Data Engineering](/lectures/10-market-data-engineering/)
- [Bài 06 — Order & Matching](/lectures/06-order-matching/)

## 3. Click giá bid/ask → Order Command

Tài liệu chính thức của BSC xác nhận WebTrading cho phép:

- chọn nút **Giao dịch**; hoặc
- chọn trực tiếp mức giá dư mua / dư bán trên bảng giá

để bắt đầu đặt lệnh nhanh.

Đây là ví dụ rất tốt để phân biệt:

~~~text
Market Data Selection
        ↓
prefill order intent
        ↓
Order Command
        ↓
Validation / Risk
        ↓
Reservation
        ↓
OMS
~~~

Click một mức giá trên bảng **không được hiểu là order đã đi ra Sở**.

Reference flow:

~~~text
User clicks Ask Price
→ UI prefills Symbol + Price + Side
→ user chooses sub-account
→ enters quantity / order type / validity
→ confirms
→ authentication
→ Trading API
→ Risk / Reservation
→ OMS
→ Exchange Gateway
~~~

Nguồn:
- https://www.bsc.com.vn/giao-dich-chung-khoan-co-so/
- https://www.bsc.com.vn/bsc-web-trading/

## 4. ProTrading cho thấy Trading UI là composition của nhiều read model

Tài liệu hướng dẫn BSC WebTrading cho thấy màn hình ProTrading có thể ghép:

- recent price/time trades;
- quote / market depth;
- bid-vs-ask view;
- order ticket;
- account/sub-account selection;
- Limit / Market / Conditional order;
- validity;
- portfolio;
- active orders;
- order book;
- conditional orders.

Một screen duy nhất có thể combine nhiều projection:

~~~text
Market Data Projection
Order Read Model
Portfolio Projection
Account Context
Conditional Order Read Model
~~~

nhưng backend authority của chúng có thể khác nhau.

Do đó không thiết kế một TradingScreen DTO như source of truth cho mọi thứ.

Nguồn:
- https://www.bsc.com.vn/Download/HDSD_BSC_Webtrading_ct.pdf

## 5. Multiple sub-accounts → command context quan trọng

Official BSC material thể hiện user phải chọn **tiểu khoản** khi đặt lệnh.

Public guidance cũng phân biệt các account context như cash/margin và derivatives.

Reference command vì vậy nên mang context rõ:

~~~text
SubmitOrder
{
  CustomerId
  TradingAccountId
  SubAccountId
  Product
  Symbol
  Side
  OrderType
  Price
  Quantity
  Validity
}
~~~

Không được chỉ gửi symbol + price + quantity, vì buying power, position, margin rule và routing có thể phụ thuộc account/product context.

## 6. Conditional Order khác Trading Order

BSC chính thức hỗ trợ lệnh điều kiện trên WebTrading/Smart Invest.

Thông tin input public gồm các khái niệm như:

- trigger price;
- order price;
- price range;
- price step;
- quantity;
- validity.

Mental model:

~~~text
ConditionalOrder
    ↓ observes market/event/time
Trigger condition satisfied
    ↓
Generate TradingOrder Command
    ↓
Risk / Reservation / OMS
~~~

Invariant quan trọng:

~~~text
one logical trigger
→ at most one intended generated order
~~~

Duplicate tick/replay/restart không được sinh thêm order ngoài ý muốn.

Đọc sâu:
- [Domain 06 — Conditional Orders](/domains/06-conditional-orders.html)
- [Bài 19 — Event Delivery Semantics](/lectures/19-event-driven-delivery-semantics/)

Nguồn:
- https://www.bsc.com.vn/giao-dich-chung-khoan-co-so/
- https://www.bsc.com.vn/bsc-smart-invest/

## 7. Lô lẻ là market mode riêng, không chỉ quantity nhỏ

BSC có bảng giá lô lẻ và tài liệu hướng dẫn giao dịch lô lẻ.

Course nên nhìn lô lẻ như một **market/routing mode có rule riêng**, không đơn giản là RegularOrder với Qty < 100.

Cần verify theo rule đang hiệu lực:

~~~text
eligible venue/session
quantity rule
price rule
available holdings
routing mode
cancel/replace behavior
settlement
~~~

Nguồn:
- https://www.bsc.com.vn/giao-dich-chung-khoan-co-so/

## 8. GDTT — negotiated trading khác continuous matching

Priceboard BSC có tab GDTT.

BSC cũng công bố năm 2026 tính năng **Giao dịch thỏa thuận trực tuyến** trên WebTrading, cho phép user khởi tạo giao dịch mua/bán với đối tác đã thống nhất trước điều kiện như giá và khối lượng.

Đây không phải mental model giống continuous order-book matching.

~~~text
CONTINUOUS MATCHING
Order
→ central order book
→ price/time matching
→ execution

NEGOTIATED / AGREED TRADE
Counterparties agree terms
→ submit negotiated transaction workflow
→ validate / confirm / market infrastructure processing
→ trade result
~~~

Vì vậy domain model không nên giả định mọi trade đều sinh ra từ cùng một MatchingOrder.

Nguồn:
- https://www.bsc.com.vn/tin-tuc/tin-chi-tiet/91088-bsc-ra-mat-tinh-nang-giao-dich-thoa-thuan-truc-tuyen-tren-nen-tang-webtrading/
- https://www.bsc.com.vn/quy-dinh-giao-dich-chung/

## 9. Multi-product boards không có nghĩa One Domain Model

Public priceboard expose nhiều category:

~~~text
Cash Equity
Derivatives
Covered Warrants
ETF
Corporate Bonds / TPDN
Odd-lot
Negotiated Trading
~~~

Một UX có thể thống nhất nhưng business semantics không giống nhau.

~~~text
One Trading UI
≠
One Order Model for every product
~~~

Ví dụ:

- derivatives cần position/margin/MTM;
- bond lifecycle có coupon/accrued interest/maturity;
- covered warrant có instrument/product semantics riêng;
- odd-lot có market rule riêng;
- negotiated trading có workflow khác continuous matching.

## 10. Foreign activity / room là một projection khác

Bảng giá public BSC có NN Mua, NN Bán và NN Room.

Các field này hữu ích cho UI/analytics nhưng không nên trộn với OMS order state.

Reference separation:

~~~text
Market / Reference / Foreign-room Data
                ↓
          Price Board
                ↓
              User

OMS Order State
                ↓
          Order Read Model
~~~

Một screen có thể hiển thị cả hai nhưng authority và update semantics khác nhau.

## 11. Connectivity / freshness là first-class UI state

Public priceboard BSC expose trạng thái kết nối và có error state khi dữ liệu tạm thời gián đoạn.

Đây là evidence tốt cho bài Market Data:

~~~text
Connected
Degraded
Disconnected
Stale
Recovering
~~~

Ứng dụng không nên coi last displayed price = fresh market price forever.

Một market-data consumer cần định nghĩa:

- last update time;
- freshness threshold;
- sequence/gap state khi applicable;
- reconnect policy;
- snapshot/recovery behavior;
- user-visible stale/degraded status.

Public UI **không chứng minh** BSC dùng transport cụ thể nào.

## 12. BSC trong Broker Case Study Matrix

BSC phù hợp nhất để học:

| Capability | Evidence | Engineering lesson |
|---|---|---|
| Public Price Board | 🟢 Public observed | market-data projection / depth |
| Quick Trade from bid/ask | 🟡 Official | market data → order intent |
| ProTrading | 🟡 Official | multiple read models + command ticket |
| Conditional Orders | 🟡 Official | trigger state machine / idempotency |
| Multiple sub-accounts | 🟡 Official | account/risk command context |
| Derivatives | 🟡 Official | separate position/margin domain |
| Odd-lot | 🟢+🟡 | market-mode-specific rules |
| Negotiated Trading | 🟢+🟡 | workflow differs from central matching |
| Foreign buy/sell/room | 🟢 Public observed | market/reference projection |
| Connectivity status | 🟢 Public observed | freshness/degraded-state handling |

## 13. Điều không được suy luận

Không viết:

~~~text
"BSC dùng WebSocket X"
"BSC OMS dùng FIX trực tiếp"
"BSC lưu 3-level depth trong Redis"
"BSC dùng microservice cho conditional orders"
~~~

Public evidence chỉ cho phép nói:

~~~text
BSC public UI/docs expose capability X.
Capability X cần business state / invariant Y.
Course dùng reference architecture Z để học cách thiết kế.
~~~

## 14. Nguồn chính thức

- BSC Price Board: https://trading.bsc.com.vn/priceboard
- BSC WebTrading: https://www.bsc.com.vn/bsc-web-trading/
- BSC WebTrading User Guide: https://www.bsc.com.vn/Download/HDSD_BSC_Webtrading_ct.pdf
- Giao dịch chứng khoán cơ sở: https://www.bsc.com.vn/giao-dich-chung-khoan-co-so/
- Giao dịch chứng khoán phái sinh: https://www.bsc.com.vn/giao-dich-chung-khoan-phai-sinh/
- BSC Smart Invest: https://www.bsc.com.vn/bsc-smart-invest/
- Hướng dẫn đọc bảng điện: https://www.bsc.com.vn/tin-tuc/tin-chi-tiet/92817-huong-dan-cach-doc-bang-dien-chung-khoan/
- Giao dịch thỏa thuận trực tuyến: https://www.bsc.com.vn/tin-tuc/tin-chi-tiet/91088-bsc-ra-mat-tinh-nang-giao-dich-thoa-thuan-truc-tuyen-tren-nen-tang-webtrading/
- Quy định giao dịch chung: https://www.bsc.com.vn/quy-dinh-giao-dich-chung/

## 15. Bài tập

### Bài 1 — Priceboard → canonical quote model

Thiết kế model cho:

~~~text
Reference / Ceiling / Floor
Bid depth
Ask depth
Last trade
High / Average / Low
Total volume
Foreign buy/sell/room
Freshness metadata
~~~

Tách field nào là instrument/reference data, quote, trade và analytics.

### Bài 2 — Click-to-trade

User click Ask1.

Thiết kế flow:

~~~text
click
→ prefill
→ confirm
→ auth
→ risk
→ reservation
→ submit
~~~

và chứng minh click không thể tự tạo duplicate live order.

### Bài 3 — Disconnect

Priceboard mất connection sau khi user vừa nhìn thấy giá.

Trả lời:

- UI đánh dấu stale khi nào?
- có cho submit order không?
- risk dùng price source nào?
- reconnect cần snapshot hay incremental recovery?
- observability cần metric gì?

### Bài 4 — GDTT vs continuous matching

Thiết kế hai command/lifecycle khác nhau thay vì ép cả hai vào một state machine duy nhất.
