---
title: "Bài 07 — KRX, FIX 4.4, Clearing, Settlement và VSDC"
description: "Market infrastructure: exchange connectivity, FIX session/application semantics, clearing, settlement và reconciliation."
---

# Bài 07 — KRX / FIX / VSDC: từ exchange connectivity đến settlement

<div class="lesson-meta">
  <span><strong>Track</strong> Market & Brokerage Core</span>
  <span><strong>Mức độ</strong> Core</span>
  <span><strong>Mục tiêu</strong> Hiểu trading infrastructure end-to-end</span>
</div>

Một engineer hiểu trading không thể dừng ở `Order → FILLED`. Sau execution còn trade booking, clearing, settlement và reconciliation; trước execution còn exchange gateway và session protocol.

<div class="learning-objectives">
<strong>Sau bài này bạn phải giải thích được:</strong>

- KRX, FIX 4.4 và VSDC là ba khái niệm khác nhau;
- application message khác session message;
- sequence gap/resend/recovery dùng để làm gì;
- clearing khác settlement;
- DVP và reconciliation vì sao bắt buộc;
- venue-specific specification vì sao quan trọng hơn generic FIX examples.
</div>

## 1. End-to-end Map

```text
Investor
→ Broker OMS / Risk
→ Exchange Gateway
→ Venue / Matching
→ Execution
→ Trade Booking
→ Clearing
→ Settlement
→ Depository + Bank
→ Reconciliation
```

## 2. KRX trong bối cảnh Việt Nam

Hệ thống CNTT mới của thị trường chứng khoán Việt Nam do KRX cung cấp đã đi vào vận hành từ 05/05/2025.

Điều cần nhớ về engineering:

```text
KRX context
≠ generic FIX standard
≠ VSDC business role
```

Triển khai production phải theo member interface specification, certification rules, message dictionary và network requirements của đúng market.

## 3. FIX 4.4 Application Layer

Các message thường gặp:

| MsgType | Message | Vai trò |
|---|---|---|
| D | NewOrderSingle | lệnh mới |
| F | OrderCancelRequest | hủy |
| G | OrderCancelReplaceRequest | sửa |
| 8 | ExecutionReport | ack/status/fill/reject |
| 9 | OrderCancelReject | reject cancel/replace |
| H | OrderStatusRequest | hỏi trạng thái |
| AE | TradeCaptureReport | trade report |

## 4. Canonical Domain Model vs FIX Tags

Core không nên phụ thuộc trực tiếp:

```text
35=D
11=ClOrdID
54=Side
38=Qty
44=Price
```

Nên có:

```text
Domain Command
→ Exchange Adapter
→ Venue Mapper
→ FIX/Wire Message
```

## 5. Session Layer

```text
Logon
Logout
Heartbeat
TestRequest
MsgSeqNum
ResendRequest
SequenceReset
PossDupFlag
OrigSendingTime
```

Đây là phần reliability của protocol.

## 6. Sequence Gap

Receiver chờ:

```text
100
101
102
```

nhưng nhận:

```text
100
102
```

→ sequence gap → recovery/resend semantics.

## 7. Persistent Session State

```text
SessionId
SenderCompId
TargetCompId
NextSenderSeqNum
NextTargetSeqNum
Message Store
Logon State
```

Restart không được tự ý reset nếu session contract yêu cầu continuity.

## 8. Transport Correctness != Business Correctness

FIX sequence giúp đảm bảo session transport, nhưng duplicate business effect vẫn phải được chống ở application/domain layer.

```text
PossDup=Y
ExecId=ABC
```

Không được book trade hai lần.

## 9. Timeout

Outbound message có thể đã tới venue dù caller timeout.

Recovery cần:

- stable business identity;
- session state;
- status query/reconciliation;
- dedup.

## 10. Trade xong chưa phải settlement xong

```text
FILLED
→ Trade Booking
→ Clearing
→ Obligation
→ Settlement
→ Reconciliation
```

## 11. Clearing

Clearing trả lời:

> ai phải giao tiền/chứng khoán bao nhiêu?

Có thể gồm validation, netting, obligation calculation theo rule.

## 12. Settlement

Settlement thực hiện chuyển giao obligations.

```text
Cash leg
Securities leg
```

## 13. DVP

Delivery versus Payment giảm principal risk bằng cách phối hợp securities delivery với payment leg theo model thị trường.

## 14. Settlement Calendar

Không dùng:

```csharp
tradeDate.AddDays(2)
```

Mà phải dùng business/settlement calendar, holidays, cutoffs và product rules.

## 15. VSDC

VSDC nằm ở post-trade infrastructure: registration/depository/clearing/settlement/corporate-actions related functions theo phạm vi nghiệp vụ.

Broker integration phải xem VSDC/external result là authority phù hợp cho nhiều post-trade facts.

## 16. Reconciliation

```text
Internal Orders     ↔ Venue Orders
Internal Trades     ↔ Venue Trades
Internal Cash       ↔ Bank
Internal Securities ↔ Depository
Internal Settlement ↔ External Settlement Result
```

## 17. External IDs

Phải giữ:

```text
ClientOrderId
VenueOrderId
ExecId
TradeId
SettlementInstructionId
BatchId
BusinessDate
```

Không có identity mapping thì recovery/recon cực khó.

## 18. Common mistakes

- “support FIX 4.4 = connect production KRX”;
- reset sequence tùy ý;
- duplicate ExecutionReport double-book;
- FILLED = done;
- clearing = settlement;
- không có reconciliation.

<div class="key-takeaway">
<strong>Takeaway</strong>

Market connectivity production cần **protocol correctness + domain idempotency + post-trade reconciliation**. Không một lớp nào thay thế lớp còn lại.
</div>

## Checklist

- [ ] KRX/FIX/VSDC được phân biệt.
- [ ] Session state persisted.
- [ ] Sequence gap/replay test được.
- [ ] Business dedup độc lập transport sequence.
- [ ] Clearing vs settlement rõ.
- [ ] External IDs và reconciliation đầy đủ.

## Bài tập

1. Mô phỏng FIX session sequence 100–110 với gap 104.
2. Mô phỏng duplicate `ExecutionReport` sau resend.
3. Vẽ DVP settlement flow.
4. Thiết kế reconciliation key matrix cho order/trade/cash/securities.

## Đọc tiếp

Tiếp theo: [Bài 08 — Account, Cash, Position & Buying Power](../08-account-cash-position-buying-power/).