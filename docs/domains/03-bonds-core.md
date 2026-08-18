---
title: "Domain 03 — Bonds Core"
description: "Giải thích trái phiếu từ face value, coupon, yield, clean/dirty price, accrued interest, duration đến maturity và settlement bằng ví dụ số cụ thể."
---

# Domain 03 — Core giao dịch trái phiếu

<div class="lesson-meta">
  <span><strong>Domain</strong> Bonds / Fixed Income</span>
  <span><strong>Mức độ</strong> Core</span>
  <span><strong>Ví dụ xuyên suốt</strong> Bond mệnh giá 100 triệu, coupon 8%</span>
</div>

Nếu cổ phiếu thường khiến người mới nghĩ về “giá tăng hay giảm”, thì trái phiếu bắt đầu từ một câu hỏi khác:

> **Người mua đưa tiền hôm nay để đổi lấy những dòng tiền nào trong tương lai, vào ngày nào, và rủi ro gì có thể làm những dòng tiền đó thay đổi?**

Bond Core vì thế không chỉ lưu `couponRate` và `maturityDate`; nó phải quản lý **cash-flow schedule, entitlement, accrued interest, pricing convention, settlement và lifecycle tới maturity**.

<div class="learning-objectives">
<strong>Sau domain này bạn phải giải thích được:</strong>

- Issuer, Face Value, Coupon, Coupon Rate và Maturity;
- Coupon schedule được sinh ra như thế nào;
- Yield là gì và vì sao yield tăng thường làm bond price giảm;
- Clean Price khác Dirty Price;
- Accrued Interest là gì;
- Day-count convention vì sao quan trọng;
- Duration/DV01 dùng để đo interest-rate risk thế nào;
- coupon entitlement và maturity/redemption được xử lý như workflow ra sao.
</div>

## 1. Từ điển thuật ngữ

| Thuật ngữ | Giải thích dễ hiểu | Ví dụ |
|---|---|---|
| **Issuer** | Tổ chức phát hành trái phiếu để vay vốn | Doanh nghiệp/Chính phủ |
| **Face Value / Par Value** | Mệnh giá gốc của trái phiếu | 100.000.000 đ |
| **Coupon** | Khoản lãi tiền mặt trả định kỳ | 4 triệu mỗi 6 tháng |
| **Coupon Rate** | Tỷ lệ lãi tính trên mệnh giá | 8%/năm |
| **Coupon Frequency** | Tần suất trả coupon | 2 lần/năm |
| **Maturity Date** | Ngày đáo hạn, thường hoàn trả principal | 31/12/2030 |
| **Principal** | Phần gốc/mệnh giá được hoàn trả | 100 triệu |
| **Cash-flow Schedule** | Lịch các khoản tiền dự kiến nhận | Coupon #1, #2, …, principal |
| **Yield** | Tỷ suất sinh lời hàm ý từ giá mua và cash flows | Mua rẻ hơn → yield thường cao hơn |
| **Accrued Interest** | Lãi tích lũy từ kỳ coupon trước tới settlement date | 2 triệu giữa kỳ |
| **Clean Price** | Giá bond chưa cộng accrued interest | 99 triệu |
| **Dirty Price** | Số tiền thực theo convention: clean + accrued interest | 101 triệu |
| **Day-count Convention** | Quy tắc đếm số ngày để tính lãi tích lũy | Actual/365, 30/360… tùy terms |
| **Duration** | Thước đo độ nhạy giá bond với biến động lãi suất/yield | Duration cao → nhạy hơn |
| **DV01 / PV01** | Giá bond thay đổi xấp xỉ bao nhiêu khi yield đổi 1 basis point | +1bp làm PV giảm X đồng |
| **Entitlement** | Quyền nhận coupon/principal theo holding và record rule | Account A được nhận coupon |
| **Redemption** | Hoàn trả gốc khi maturity hoặc theo điều khoản | Trả lại 100 triệu principal |

## 2. Ví dụ bond đơn giản

Giả sử bond minh họa:

```text
Face Value       = 100.000.000 đ
Coupon Rate      = 8% / năm
Coupon Frequency = 2 lần / năm
Maturity         = 3 năm
```

Coupon mỗi 6 tháng:

```text
100.000.000 × 8% / 2 = 4.000.000 đ
```

Cash-flow schedule đơn giản:

```text
6 tháng    → 4.000.000 coupon
12 tháng   → 4.000.000 coupon
18 tháng   → 4.000.000 coupon
24 tháng   → 4.000.000 coupon
30 tháng   → 4.000.000 coupon
36 tháng   → 4.000.000 coupon + 100.000.000 principal
```

Đó là lý do Bond Core cần **schedule**, không chỉ hai field `rate` và `maturity`.

## 3. Cash-flow Schedule là business object

Một schedule record có thể cần:

```text
CashFlowId
BondId
CashFlowType = COUPON | PRINCIPAL
AccrualStartDate
AccrualEndDate
RecordDate
PaymentDate
Rate / Amount
Currency
Version
Status
```

Nếu terms bị amend, overwrite schedule cũ sẽ làm mất lịch sử calculation. Nên có version/effective dating hoặc adjustment model phù hợp.

## 4. Price và Yield — quan hệ ngược chiều

Bond price về bản chất là present value của các cash flows tương lai.

Mental model:

```text
Yield ↑ → discount mạnh hơn → Present Value ↓ → Price ↓
Yield ↓ → discount nhẹ hơn → Present Value ↑ → Price ↑
```

### Ví dụ trực giác

Bond cũ trả coupon 8%. Sau đó thị trường xuất hiện bond mới tương đương rủi ro nhưng trả 10%.

Bond 8% trở nên kém hấp dẫn hơn, nên để người mua chấp nhận, giá bond cũ thường phải giảm.

Ngược lại nếu market yield giảm còn 6%, bond coupon 8% trở nên hấp dẫn và giá có thể tăng.

## 5. Clean Price và Dirty Price

Giả sử:

```text
Face Value       = 100m
Clean Price      = 99m
Accrued Interest = 2m
```

Thì:

```text
Dirty Price = Clean Price + Accrued Interest
            = 101m
```

**Clean Price** hữu ích để so sánh market value của bond mà không bị “nhảy” theo số ngày tích lũy coupon.

**Dirty Price** phản ánh số tiền phải thanh toán theo pricing convention khi accrued interest được cộng vào.

Nếu API trả `price=99` mà downstream hiểu đó là dirty price, settlement amount có thể sai.

## 6. Accrued Interest — vì sao người mua phải trả phần lãi đã tích lũy?

Giả sử coupon 4m mỗi 6 tháng.

Bạn mua bond đúng giữa kỳ coupon. Seller đã giữ bond nửa kỳ, nên về kinh tế seller “đã kiếm” một phần coupon sắp tới.

Nếu convention đơn giản hóa cho ví dụ:

```text
Coupon period       = 180 ngày
Days accrued        = 90 ngày
Coupon per period   = 4.000.000
Accrued Interest    ≈ 4.000.000 × 90/180
                    = 2.000.000
```

Production **không được mặc định `days/365` cho mọi bond**. Phải dùng đúng `DayCountConvention` trong terms.

## 7. Day-count Convention là gì?

Đây là quy tắc xác định numerator/denominator khi tính phần lãi tích lũy.

Ví dụ một số convention phổ biến trên thế giới:

```text
Actual/365
Actual/360
30/360
Actual/Actual
```

Không cần thuộc công thức ngay, nhưng engineer phải hiểu:

> cùng hai ngày lịch nhưng accrued interest có thể khác nếu convention khác.

Vì vậy `DayCountConvention` là domain data, không phải utility ẩn trong code.

## 8. Yield không phải Coupon Rate

Người mới hay nhầm:

```text
Coupon Rate = 8%
⇒ Yield = 8%
```

Không đúng nếu bond được mua với giá khác par hoặc có cash-flow timing khác.

Ví dụ:

```text
Face Value = 100m
Coupon = 8m/năm
Market Price = 95m
```

Bạn bỏ ra 95m nhưng vẫn nhận coupon dựa trên face value 100m và principal 100m tại maturity. Yield do đó có thể cao hơn 8%.

Nếu market price = 105m, yield có thể thấp hơn coupon rate.

## 9. Duration — “bond này nhạy với lãi suất bao nhiêu?”

**Duration** là thước đo giúp ước lượng độ nhạy của price trước thay đổi yield.

Mental model đơn giản:

```text
Modified Duration = 5
Yield tăng khoảng 1%
→ Price có thể giảm xấp xỉ ~5%
```

Đây chỉ là approximation; convexity giúp cải thiện khi move lớn.

Điểm engineering:

```text
DurationValue
CalculationDate
YieldCurveVersion
PriceVersion
MethodVersion
```

phải traceable nếu dùng cho risk/reporting.

## 10. DV01 / PV01 — thay đổi giá trị khi yield đổi 1 basis point

`1 basis point (1bp) = 0,01%`.

DV01 trả lời câu hỏi kiểu:

> Nếu yield tăng 1bp, giá trị position bond thay đổi xấp xỉ bao nhiêu tiền?

Ví dụ:

```text
DV01 = 50.000 đ
Yield +1bp
→ Position value giảm xấp xỉ 50.000 đ
```

Nếu portfolio có nhiều bond, risk system có thể aggregate DV01 theo issuer, maturity bucket hoặc portfolio.

## 11. Coupon Entitlement

Giả sử account A giữ bond đủ điều kiện nhận coupon.

Flow:

```text
Coupon Event
   ↓
Determine Eligible Holdings
   ↓
Calculate Gross Coupon
   ↓
Tax / Fee nếu applicable
   ↓
Coupon Receivable
   ↓
Cash Payment
   ↓
Reconciliation
```

Không được tính entitlement bằng **current position lúc job chạy** nếu business rule yêu cầu holding tại record date.

## 12. Maturity / Redemption

Khi bond đáo hạn:

```text
Final Coupon
+ Principal Redemption
→ Cash Receivable
→ Cash Settlement
→ Bond Holding closed/reduced
→ Reconciliation
```

Redemption job rerun không được trả principal hai lần.

Cần idempotency key kiểu:

```text
BondId + AccountId + RedemptionEventId
```

hoặc authoritative business identity phù hợp.

## 13. Settlement Dates — đừng dùng một field `Date`

Bond workflow có thể cần phân biệt:

```text
TradeDate       = ngày giao dịch
SettlementDate  = ngày chuyển tiền/chứng khoán
RecordDate      = ngày xác định entitlement
PaymentDate     = ngày trả coupon
MaturityDate    = ngày đáo hạn
```

Các ngày này có ý nghĩa khác nhau.

## 14. Ledger Effects

Ví dụ history:

```text
PURCHASE_PRINCIPAL
ACCRUED_INTEREST_PAID
COUPON_RECEIVABLE
COUPON_CASH_RECEIVED
REDEMPTION_RECEIVABLE
REDEMPTION_CASH_RECEIVED
FEE
TAX
ADJUSTMENT / REVERSAL
```

Ledger/history giúp trả lời “vì sao cash balance thay đổi?” và hỗ trợ reconciliation.

## 15. Data model gợi ý

```text
Issuer
Bond
BondTermsVersion
CouponSchedule
CashFlow
BondTrade
BondHolding
CouponEvent
Entitlement
RedemptionEvent
CashEntry
SettlementInstruction
ReconciliationBreak
```

Ví dụ bond terms:

```json
{
  "bondId": "BOND-001",
  "faceValue": 100000000,
  "currency": "VND",
  "couponRate": 0.08,
  "couponFrequency": 2,
  "dayCountConvention": "ACTUAL_ACTUAL",
  "maturityDate": "2030-12-31",
  "termsVersion": 3
}
```

## 16. Invariant bằng tiếng Việt

```text
1. Coupon schedule phải deterministic theo terms version.
2. Accrued interest phải dùng đúng day-count convention.
3. Một coupon entitlement không được trả hai lần.
4. Record-date holding phải được xác định theo rule đúng.
5. Redemption/principal không được double-pay khi rerun.
6. Trade/holding/cash settlement phải reconcile được với external source phù hợp.
7. Amendment không được silently overwrite lịch sử đã dùng để pricing/payment.
```

## 17. Failure Scenarios

### Schedule generation sai
Sai day-count/coupon date → coupon hàng loạt sai.

### Event amend sau khi đã tính entitlement
Cần adjustment/version, không sửa silent.

### Duplicate payment message
Không được credit cash hai lần.

### Late holding correction
Phải xác định entitlement nào bị ảnh hưởng.

### Maturity job rerun
Không được redeem principal lần hai.

## 18. Checklist

- [ ] Tôi phân biệt Coupon Rate và Yield.
- [ ] Tôi tính được coupon đơn giản.
- [ ] Tôi hiểu cash-flow schedule.
- [ ] Tôi phân biệt Clean/Dirty Price.
- [ ] Tôi giải thích được Accrued Interest.
- [ ] Tôi biết Day-count Convention là domain rule.
- [ ] Tôi hiểu Duration/DV01 dùng cho interest-rate risk.
- [ ] Tôi hiểu entitlement phụ thuộc record-date rule.
- [ ] Tôi hiểu maturity/redemption phải idempotent.

## 19. Bài tập

### Bài 1 — Coupon
Face value 200m, coupon rate 9%/năm, trả 2 lần/năm. Tính coupon mỗi kỳ.

### Bài 2 — Accrued Interest
Coupon mỗi kỳ 9m, period 180 ngày, đã accrued 60 ngày theo giả định day-count đơn giản. Tính accrued amount minh họa.

### Bài 3 — Clean/Dirty
Clean = 98,5m, accrued = 1,4m. Tính dirty price.

### Bài 4 — Amendment
Bond terms thay đổi payment date sau khi schedule version 1 đã dùng cho report. Thiết kế versioning/adjustment thay vì overwrite.

<div class="key-takeaway">
<strong>Mental model cần nhớ:</strong>

Bond Core = **Terms → Cash-flow Schedule → Pricing/Yield → Entitlement → Settlement → Maturity/Redemption**. Thời gian, convention và version là domain data cốt lõi.
</div>

Tiếp theo: [Domain 04 — Funds Core](./04-funds-core.md).