# Resources

Dùng phần này như reference library khi đọc lecture, review design hoặc chuẩn bị system-design interview.

## Đọc đầu tiên: System Map

**[System Map — Brokerage Platform Architecture](./system-map.html)** là bản đồ canonical của website.

Nó phân biệt:

~~~text
Business Domain
vs
Runtime/System Component
vs
External Market Infrastructure
~~~

và ba flow:

~~~text
Order / Trading
Market Data
Post-Trade / Settlement
~~~

Nếu chưa chắc OMS, Exchange Gateway, Trading Venue, VSDC và Ledger nằm ở đâu, đọc System Map trước.

<div class="course-grid">
  <a class="course-card" href="./system-map"><strong>System Map</strong><span>OMS, Risk, Gateway, Market Data, Post-trade, VSDC, Ledger, authority và data flow.</span></a>
  <a class="course-card" href="./glossary"><strong>Glossary</strong><span>Thuật ngữ finance, trading, FIX, clearing, settlement và engineering.</span></a>
  <a class="course-card" href="./checklist"><strong>Review Checklist</strong><span>Invariant, distributed failure, ledger, market data, security, HA/DR và operations.</span></a>
  <a class="course-card" href="./competency-matrix"><strong>Competency Matrix</strong><span>Tự đánh giá từ finance-aware backend đến securities architecture lead.</span></a>
  <a class="course-card" href="./failure-scenarios"><strong>50 Failure Scenarios</strong><span>Catalog cho design review, chaos test, game day và interview.</span></a>
  <a class="course-card" href="./references"><strong>References</strong><span>Nguồn chính thức/primary sources để kiểm tra market rules và protocol.</span></a>
</div>

## Khi học

~~~text
System Map
→ Lecture / Domain
→ Glossary khi cần
→ Failure Scenarios
→ Competency Matrix
~~~

## Khi review architecture

~~~text
System Map
→ Review Checklist
→ Failure Scenarios
→ Primary References / Specification
~~~

## Khi implement production

Ưu tiên nguồn chính thức cho rule/protocol có thể thay đổi: SSC, HOSE/HNX/VSDC, FIX Trading Community, văn bản pháp lý và specification/certification material dành cho thành viên thị trường.

Không suy production interface chỉ từ blog, UI broker hoặc ví dụ generic.
