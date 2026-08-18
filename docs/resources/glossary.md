# Glossary — Securities Engineering

## Economics & Finance

**Opportunity Cost** — lợi ích của lựa chọn tốt nhất bị bỏ qua khi chọn phương án khác.

**Inflation** — mức tăng giá chung làm giảm sức mua của tiền.

**Discount Rate** — tỷ suất dùng quy đổi cash flow tương lai về hiện tại.

**WACC** — weighted average cost of capital.

**ROE** — lợi nhuận trên vốn chủ sở hữu.

**ROIC** — lợi nhuận trên vốn đầu tư.

**Free Cash Flow** — cash flow còn lại sau các chi phí/đầu tư cần thiết theo định nghĩa phân tích sử dụng.

**Yield** — lợi suất của fixed-income instrument theo convention cụ thể.

**Duration** — thước đo sensitivity/time-weighted exposure của bond cashflows; modified duration thường dùng ước lượng độ nhạy giá theo yield.

## Trading

**Order** — chỉ thị/ý định mua bán.

**Execution / Fill** — kết quả khớp một phần/toàn bộ order.

**Trade** — giao dịch được hình thành từ execution theo rule thị trường.

**Order Book** — tập bid/ask đang chờ theo price levels/orders.

**Bid** — giá mua.

**Ask/Offer** — giá bán.

**Spread** — chênh lệch best ask và best bid.

**Liquidity** — khả năng giao dịch với market impact/chi phí thấp theo ngữ cảnh.

**Price Priority** — giá cạnh tranh hơn được ưu tiên theo rule.

**Time Priority** — cùng mức giá thì order sớm hơn được ưu tiên theo rule.

**Partial Fill** — order chỉ khớp một phần.

**CumQty** — cumulative executed quantity.

**LeavesQty** — remaining working quantity.

**Buying Power** — khả năng mua sau khi tính cash, margin, reservation và rule liên quan.

**Sellable Quantity** — quantity hiện đủ điều kiện bán.

## FIX

**FIX** — Financial Information eXchange protocol family.

**MsgType(35)** — loại FIX message.

**MsgSeqNum(34)** — sequence number của FIX session message.

**ClOrdID(11)** — client-assigned order identifier trong FIX flow.

**NewOrderSingle(D)** — FIX message gửi order mới.

**ExecutionReport(8)** — message báo order status/fill/reject theo FIX semantics.

**ResendRequest(2)** — yêu cầu retransmission khi sequence gap/lost messages/recovery.

**SequenceReset(4)** — reset/gap-fill sequence theo FIX rules.

**PossDupFlag** — đánh dấu khả năng message là retransmission/duplicate theo session semantics.

## Post-trade

**Clearing** — đối chiếu/xác định nghĩa vụ sau trade, bao gồm netting theo rule áp dụng.

**Netting** — bù trừ nhiều nghĩa vụ thành nghĩa vụ ròng theo rule.

**Settlement** — chuyển giao money và securities để hoàn tất nghĩa vụ.

**DVP** — Delivery versus Payment; gắn chuyển giao securities với thanh toán money nhằm giảm principal risk.

**Depository** — hạ tầng/tổ chức quản lý đăng ký/lưu ký và các nghiệp vụ liên quan.

**VSDC** — Tổng công ty Lưu ký và Bù trừ Chứng khoán Việt Nam.

**KRX System** — ngữ cảnh hệ thống CNTT thị trường chứng khoán Việt Nam do KRX cung cấp, go-live 05/05/2025; không đồng nghĩa “chỉ là FIX 4.4”.

## Reliability

**Idempotency** — thực hiện lại cùng logical operation không tạo thêm business effect ngoài intended result.

**At-least-once delivery** — message có thể được giao một hoặc nhiều lần.

**Exactly-once business effect** — dù delivery duplicate, business effect cuối chỉ apply một lần.

**Outbox** — lưu event cần publish cùng transaction với business state rồi dispatch async.

**Inbox/Dedup** — lưu identity message/event đã xử lý để chống duplicate.

**Reconciliation** — đối chiếu state nội bộ với external/authoritative records và xử lý break.

**Unknown Outcome** — caller không thể xác định operation đã commit ở remote side hay chưa.

**RTO** — Recovery Time Objective.

**RPO** — Recovery Point Objective.

## Funds / Bonds / Derivatives

**NAV** — Net Asset Value của quỹ.

**Subscription** — mua/đăng ký chứng chỉ quỹ theo fund process.

**Redemption** — bán lại/rút vốn khỏi quỹ theo rule.

**Cut-off** — thời điểm phân loại request vào valuation/dealing cycle.

**Clean Price** — bond price không gồm accrued interest theo convention.

**Dirty Price** — clean price + accrued interest.

**Mark-to-Market** — định giá position theo market/reference price hiện hành.

**Initial Margin** — margin yêu cầu để mở/duy trì exposure theo rule.

**Maintenance Margin** — ngưỡng margin duy trì theo rule.

**Margin Call** — yêu cầu bổ sung/điều chỉnh khi margin condition vi phạm threshold.