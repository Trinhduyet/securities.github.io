# Projects — Học bằng failure scenario

Các project không nhằm tạo một app chứng khoán đẹp. Mục tiêu là ép thiết kế phải xử lý đúng những tình huống production mà CRUD tutorial thường bỏ qua.

## Project 01 — Order Lifecycle Simulator

[Đi tới Project 01](./project-01-order-lifecycle.md)

Bạn sẽ xử lý partial fill, cancel race, duplicate execution, reservation leak và unknown submit outcome.

## Project 02 — Brokerage Platform

[Đi tới Project 02](./project-02-brokerage-platform.md)

Capstone nối Equity/Derivatives/Bonds/Funds với Market Data, Conditional Orders, Ledger, Post-trade, Reconciliation, HA/DR và observability.

## Cách review project

Không hỏi “có bao nhiêu microservice?”. Hỏi:

- invariant nào được bảo vệ ở đâu?
- crash giữa hai bước thì sao?
- duplicate/replay có gây double effect không?
- internal state lệch external state thì phát hiện thế nào?
- failover có tạo hai active owner cùng lúc không?
