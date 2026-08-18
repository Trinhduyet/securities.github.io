# Failure Scenario Catalog — 50 câu hỏi để review Core Securities

Dùng catalog này khi design review, test plan, chaos/game day hoặc phỏng vấn system design. Với mỗi scenario, trả lời 6 câu:

```text
1. Business impact?
2. Durable source of truth?
3. Invariant nào có nguy cơ bị phá?
4. Retry/idempotency/recovery thế nào?
5. Reconciliation với nguồn nào?
6. Alert/owner/SLA?
```

## Order / OMS

1. Client submit cùng `ClientOrderId` hai lần.
2. Hai BUY đồng thời cùng đọc buying power cũ.
3. Reserve thành công nhưng process crash trước send.
4. Venue accept nhưng ACK bị mất.
5. Order reject đến sau timeout.
6. Partial fill rồi cancel request.
7. Fill đến trong `PENDING_CANCEL`.
8. Duplicate execution được resend.
9. Out-of-order execution/status.
10. Venue báo fill làm CumQty vượt OrderQty do upstream corruption.

## FIX / Gateway

11. Sequence gap inbound.
12. Outbound resend requested.
13. Duplicate `PossDup=Y`.
14. Gateway restart mất RAM state.
15. Session store unavailable trước market open.
16. Active A và standby B cùng nghĩ mình là owner.
17. Primary network down nhưng backup route up.
18. Socket connected nhưng session chưa recovered.
19. Certificate hết hạn lúc pre-market.
20. Outbound queue tăng không giới hạn.

## Market Data

21. Một incremental sequence bị mất.
22. Feed socket sống nhưng không có message mới.
23. Duplicate trade tick làm volume double.
24. Late tick đến sau candle close.
25. Snapshot và incremental overlap.
26. Market data stale nhưng conditional order vẫn trigger.
27. Corporate-action adjustment version sai.
28. WebSocket slow client kéo chậm ingestion.

## Risk / Margin

29. Hai orders cùng consume một credit limit.
30. Risk data dùng stale market price.
31. Margin calculation lag trong market shock.
32. Liquidation order partial fill rồi market đóng.
33. Account nạp collateral trong lúc liquidation workflow chạy.
34. Kill switch propagate không đầy đủ giữa các node.

## Trade / Ledger

35. Trade DB commit nhưng `TradeBooked` chưa publish.
36. `TradeBooked` redeliver 20 lần.
37. Ledger post một nửa entries rồi exception.
38. Projection consumer lag 30 phút.
39. Projection bị corrupt cần rebuild.
40. Fee rule lịch sử bị overwrite.
41. Trade correction sau EOD.
42. Manual adjustment không có checker.

## Clearing / Settlement / Reconciliation

43. Internal trade có, external trade thiếu.
44. External trade có, internal trade thiếu.
45. Cash obligation amount mismatch.
46. Securities settled quantity mismatch.
47. Bank timeout nhưng payment có thể đã thành công.
48. Reconciliation job rerun tạo duplicate repair.
49. DR restore snapshot cũ hơn external venue state.
50. EOD close trong khi còn critical unknown orders.

## Cách biến scenario thành automated test

Mỗi test nên có:

```text
Given durable initial state
When failure injected at exact boundary
And retry/restart/replay occurs
Then business invariant still holds
And final state converges
And audit/reconciliation explains result
```

Ví dụ:

```text
Given AvailableCash=100m
When BUY A=80m and BUY B=80m concurrently
Then at most one operation may reserve under strict cash-only policy
And ReservedCash <= 100m
And no negative available balance
```

## Review rule

Nếu câu trả lời cho một failure scenario chỉ là:

```text
retry
restart service
check logs
```

thì design chưa đủ. Hãy tiếp tục cho đến khi chỉ ra được **business identity, transaction boundary, durable state, duplicate behavior và reconciliation evidence**.