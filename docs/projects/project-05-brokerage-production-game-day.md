# Project 05 — Brokerage Production Game Day

Đây là bài cuối để chuyển từ “thiết kế được” sang “vận hành được”. Bạn dùng architecture của Project 02 rồi cố tình phá nó bằng một chuỗi sự cố giống production.

## Mục tiêu

Không viết thêm nhiều feature. Hãy chứng minh platform có:

```text
Detection
Degraded Mode
Failover
Recovery
Replay
Reconciliation
Audit
Postmortem
```

## Baseline system

Tối thiểu mô phỏng:

```text
Trading API
OMS
Risk/Reservation
Exchange Gateway Active/Standby
Venue Simulator
Trade Booking
Ledger
Market Data
Conditional Orders
Reconciliation
Ops Console
```

## Game Day 1 — Market open burst

Tại 09:00:

```text
5x order traffic
10x market-data traffic
2x cancel traffic
```

Assert:

- queue bounded;
- p99 không vượt SLO critical quá lâu;
- không overspend/oversell;
- no lost executions;
- noncritical analytics có thể degrade.

## Game Day 2 — Gateway disconnect

09:15 gateway Active A mất connection 40 giây.

Có:

```text
300 PENDING_NEW
2,000 working orders
```

Venue thực tế đã accept 120/300 unknown orders.

Thực hiện:

```text
route disabled
→ session recover
→ resolve unknowns
→ reconcile working orders
→ reopen route
```

Không resend mù toàn bộ 300.

## Game Day 3 — Split brain

A mất coordinator nhưng vẫn tới venue; B promote.

Assert fencing chặn A tiếp tục mutation/send sau epoch mới.

Nếu cả hai send được, game day fail ngay.

## Game Day 4 — Market data stale

Feed đứng 5 giây nhưng socket vẫn connected.

Conditional orders và Risk phải nhận `STALE`, áp dụng policy và không dùng giá cũ như live.

Sau snapshot/resync, verify sequence trước `LIVE`.

## Game Day 5 — Duplicate execution storm

Replay 20,000 ExecutionReport, 30% duplicate.

Expected:

```text
no double trade
no double position
no double ledger posting
session/application metrics show dedup/replay
```

## Game Day 6 — Broker outage

Event broker down 15 phút.

OMS/ledger critical transaction policy do bạn định nghĩa; outbox backlog tăng nhưng bounded storage/capacity alert phải hoạt động.

Khi broker lên:

```text
controlled backlog drain
+ live traffic
```

không tạo retry storm.

## Game Day 7 — Ledger projection corruption

Xóa/corrupt read projection trong simulator, giữ ledger source history.

Rebuild từ snapshot/checkpoint + replay và compare hash/final balances.

## Game Day 8 — Settlement mismatch

Internal cash obligation khác bank statement; securities quantity khác depository statement.

Create reconciliation breaks; không sửa balance trực tiếp.

Ops phải resolve bằng evidence + controlled adjustment + recompare.

## Game Day 9 — DR site

Giả lập mất toàn primary site.

Measure:

```text
RTO actual
RPO actual
session recovery time
unknown order resolution time
reconciliation completion time
business-ready time
```

“Pods ready” không phải business-ready.

## Game Day 10 — Privileged misuse

Một ops user cố manual-adjust cash mà không checker, và một config deploy cố tăng risk limit không approval.

Security/SoD control phải block hoặc tạo evidence đúng policy.

## Scorecard

| Area | Pass condition |
|---|---|
| Correctness | invariant không bị phá |
| Availability | degraded/failover đúng policy |
| Recovery | durable state + replay hoạt động |
| Reconciliation | external/internal converge |
| Security | privileged operations controlled |
| Performance | backlog bounded, critical SLO prioritized |
| Observability | detect từ business metric |
| Operations | runbook đủ để người khác thực hiện |

## Deliverables

- [ ] Game-day plan.
- [ ] 10 failure scenarios.
- [ ] Metrics dashboard.
- [ ] Alert routing/severity matrix.
- [ ] Runbook cho từng P1/P2.
- [ ] Recovery sequence diagrams.
- [ ] Reconciliation evidence.
- [ ] RTO/RPO measurement.
- [ ] Postmortem template.
- [ ] Top 10 architecture improvements sau game day.

## Điều kiện tốt nghiệp

Bạn có thể giải thích một incident xuyên suốt:

```text
Client symptom
→ API/OMS state
→ session/gateway state
→ venue evidence
→ trade/ledger state
→ settlement/external evidence
→ reconciliation
→ recovery
```

và với mỗi bước chỉ ra **source of truth, invariant, durable state, failure semantics và owner**.

Khi làm được điều đó, bạn đã đi xa hơn “backend developer biết finance”: bạn đang tư duy như một engineer hiểu core securities.