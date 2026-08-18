# Checklist — Review một hệ thống chứng khoán

Dùng checklist này khi review requirement, design hoặc code. Không phải mục nào cũng áp dụng cho mọi domain.

## 1. Business Model

- [ ] Entity và terminology đúng nghiệp vụ.
- [ ] Order, Execution, Trade, Settlement không bị nhập nhằng.
- [ ] Có state machine cho long-running entity.
- [ ] Terminal/non-terminal states rõ ràng.
- [ ] Business calendar/timezone được định nghĩa.
- [ ] Effective-dated configuration được version nếu cần audit.

## 2. Invariants

- [ ] Buying Power không âm ngoài rule cho phép.
- [ ] Sellable Qty không bị oversell.
- [ ] `CumQty + LeavesQty = OrderQty` theo lifecycle phù hợp.
- [ ] Duplicate execution không double-book.
- [ ] Reservation không leak.
- [ ] Reward/entitlement không double-credit.
- [ ] Margin/PnL deterministic với cùng input/version.

## 3. Distributed Failure

- [ ] Phân biệt success / failure / unknown outcome.
- [ ] External command có stable business identity.
- [ ] Retry chỉ dùng khi operation idempotent hoặc có dedup.
- [ ] Consumer chịu duplicate.
- [ ] Out-of-order event có policy.
- [ ] Sequence gap detectable.
- [ ] Crash sau DB commit/trước publish có recovery.

## 4. External Connectivity

- [ ] Adapter tách protocol khỏi domain.
- [ ] Session state được persist nếu protocol yêu cầu.
- [ ] Reconnect/replay/resend được test.
- [ ] Primary/backup connection có failover procedure.
- [ ] Certificate/secret/HSM policy rõ.
- [ ] Không giả định standard protocol = venue-specific implementation.

## 5. Ledger & Accounting

- [ ] Business effect có transaction/entry identity.
- [ ] History không bị silently overwrite.
- [ ] Balance/position có thể trace về source entries.
- [ ] Fee/tax versioned theo effective date.
- [ ] Adjustment/reversal có audit trail.

## 6. Post-trade

- [ ] Trade booking tách order state.
- [ ] Clearing obligation model rõ.
- [ ] Settlement date dùng market calendar.
- [ ] DVP/cash/securities legs được phân biệt.
- [ ] Corporate action/entitlement có lifecycle.

## 7. Reconciliation

- [ ] Internal orders ↔ venue orders.
- [ ] Internal executions ↔ venue trades.
- [ ] Internal cash ↔ bank.
- [ ] Internal securities ↔ depository/custodian.
- [ ] Settlement obligation ↔ VSDC/external result.
- [ ] Break có severity/owner/SLA.
- [ ] Có rerun/recompare/audit.

## 8. Market Data

- [ ] Event time vs processing time rõ.
- [ ] Sequence/gap handling.
- [ ] Duplicate không double-count volume.
- [ ] Late event policy.
- [ ] Snapshot/incremental resync.
- [ ] Stale-feed detection.
- [ ] Corporate-action adjustment version.

## 9. Security

- [ ] Authentication.
- [ ] Authorization theo account/resource.
- [ ] Segregation of duties.
- [ ] Privileged operations audit.
- [ ] Encryption/secret management.
- [ ] Sensitive logs được mask.

## 10. Observability

- [ ] Infrastructure metrics.
- [ ] Business metrics.
- [ ] Stuck state detection.
- [ ] Unknown outcome count.
- [ ] Reconciliation break count.
- [ ] Feed staleness.
- [ ] Session sequence gaps.
- [ ] Workflow SLA breach.

## 11. HA/DR

- [ ] RTO/RPO rõ.
- [ ] Stateful component có ownership/fencing.
- [ ] DB/message store replication strategy.
- [ ] Failover test.
- [ ] DR drill.
- [ ] Reconciliation sau recovery.

## 12. Architecture Smells

Cảnh báo khi thấy:

```text
Account.Balance là nguồn duy nhất
Order == Trade
Timeout == Failed
Retry without idempotency
Update order price trực tiếp để "sửa lệnh"
Microservice cho từng entity
Kafka cho mọi thứ
Redis làm source of truth cho ledger
DateTime.Now rải khắp business logic
Không có reconciliation
```

Một design ít service nhưng bảo vệ invariant tốt thường đáng tin cậy hơn một sơ đồ microservices rất đẹp nhưng không có recovery semantics.