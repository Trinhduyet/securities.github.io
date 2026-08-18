# Resources

Dùng phần này như reference library khi đọc lecture, review design hoặc chuẩn bị system-design interview về securities platform.

<div class="course-grid">
  <a class="course-card" href="./glossary"><strong>Glossary</strong><span>Thuật ngữ finance, trading, FIX, clearing, settlement và engineering.</span></a>
  <a class="course-card" href="./system-map"><strong>System Map</strong><span>Bản đồ bounded contexts, authority và data flow của brokerage platform.</span></a>
  <a class="course-card" href="./checklist"><strong>Review Checklist</strong><span>Invariant, distributed failure, ledger, market data, security, HA/DR và operations.</span></a>
  <a class="course-card" href="./competency-matrix"><strong>Competency Matrix</strong><span>Tự đánh giá từ finance-aware backend đến securities architecture lead.</span></a>
  <a class="course-card" href="./failure-scenarios"><strong>50 Failure Scenarios</strong><span>Catalog để design review, chaos test, game day và interview.</span></a>
  <a class="course-card" href="./references"><strong>References</strong><span>Nguồn chính thức/primary sources để kiểm tra market rules và protocol.</span></a>
</div>

## Cách dùng

### Khi học lecture

Mở Glossary nếu thuật ngữ chưa chắc; sau bài dùng Competency Matrix và Failure Scenarios để tự kiểm tra xem bạn hiểu lifecycle hay chỉ nhớ định nghĩa.

### Khi review architecture

Đi theo:

```text
System Map
→ Review Checklist
→ Failure Scenarios
→ source/specification trong References
```

### Khi implement production

Ưu tiên nguồn chính thức cho rule có thể thay đổi: SSC, HOSE/HNX/VSDC, FIX Trading Community, văn bản pháp lý và specification được cấp cho thành viên thị trường. Không suy từ một bài blog rằng production interface của KRX/VSDC giống hệt ví dụ generic.

## Golden questions

Với bất kỳ component nào, luôn hỏi:

```text
Authority là ai?
State nào bền vững?
Invariant nào không được phá?
Timeout có thể là UNKNOWN không?
Duplicate/out-of-order xử lý thế nào?
Recovery/replay từ đâu?
Reconcile với nguồn nào?
Ai vận hành khi break xảy ra?
```