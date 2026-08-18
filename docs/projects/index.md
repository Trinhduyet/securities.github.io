# Projects — Học bằng failure scenario

Các project không nhằm tạo một app chứng khoán đẹp. Mục tiêu là ép thiết kế phải xử lý đúng những tình huống production mà CRUD tutorial thường bỏ qua.

<div class="course-grid">
  <a class="course-card" href="./project-01-order-lifecycle"><strong>Project 01 — Order Lifecycle</strong><span>Partial fill, cancel race, duplicate execution, reservation và unknown outcome.</span></a>
  <a class="course-card" href="./project-02-brokerage-platform"><strong>Project 02 — Brokerage Platform</strong><span>Thiết kế 8 domains + market infrastructure + post-trade end-to-end.</span></a>
  <a class="course-card" href="./project-03-fix-gateway-recovery-lab"><strong>Project 03 — FIX Gateway Lab</strong><span>Sequence gap, resend, duplicate, restart, active/standby và fencing.</span></a>
  <a class="course-card" href="./project-04-ledger-reconciliation-lab"><strong>Project 04 — Ledger & Reconciliation</strong><span>Posting, projections, reversal, rebuild, bank/depository breaks.</span></a>
  <a class="course-card" href="./project-05-brokerage-production-game-day"><strong>Project 05 — Production Game Day</strong><span>Market-open load, outage, split-brain, DR, stale feed và incident recovery.</span></a>
</div>

## Thứ tự làm

```text
Project 01 — correctness của Order
       ↓
Project 03 — correctness của Exchange Connectivity
       ↓
Project 04 — correctness của Money/Securities State
       ↓
Project 02 — ghép toàn platform
       ↓
Project 05 — phá platform và chứng minh recovery
```

Project 02 có thể đọc sớm để có system map, nhưng chỉ nên coi capstone hoàn thành sau khi bạn đã làm các lab failure/recovery.

## Cách review project

Không hỏi “có bao nhiêu microservice?”. Hỏi:

- invariant nào được bảo vệ ở đâu?
- crash giữa hai bước thì sao?
- duplicate/replay có gây double effect không?
- internal state lệch external state thì phát hiện thế nào?
- failover có tạo hai active owner cùng lúc không?
- degraded mode khi market đang mở là gì?
- sau recovery, bằng chứng nào chứng minh business state đã hội tụ?

## Definition of Graduation

Bạn chưa “xong” chỉ vì demo happy-path chạy. Khóa học coi project hoàn thành khi:

```text
Failure injected
→ detector fires
→ durable state survives
→ retry/replay is safe
→ business invariant holds
→ reconciliation converges
→ audit explains what happened
```

Nếu đạt được chuỗi này cho Order, FIX Gateway, Ledger và Settlement, bạn đã có nền tư duy cần thiết của core securities engineering.