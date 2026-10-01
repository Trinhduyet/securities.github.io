# StockAI — Verification & Delivery Checklist

## Functional checks

- [ ] /stock/SSI, /stock/HPG, /stock/FPT tải dữ liệu theo ticker; không giữ cache/subscription của mã trước.
- [ ] /market và /chat market rail sử dụng cùng market-data contract.
- [ ] Mọi quote/index có source, providerTimestamp, freshness và trạng thái.
- [ ] Lightweight Charts dùng OHLC thật; thay loại chart/timeframe/indicator không tạo dữ liệu giả.
- [ ] Chat dùng chat-capable model; reranker không xuất hiện trong chat model selector.
- [ ] Fallback free-only không gọi paid endpoint.
- [ ] BCTC có phiên bản, kỳ, đơn vị, bảng và citation theo trang.
- [ ] Auto sync, URL ingest và upload đều có job log và deduplication.
- [ ] CMS mutation được authorization bảo vệ.

## Failure-driven tests

| Tình huống | Kết quả mong đợi |
| --- | --- |
| DNSE disconnect | Hiển thị stale/unavailable; retry có giới hạn, không mock |
| Out-of-order candle | Không làm sai chuỗi OHLC |
| Chuyển SSI sang HPG | Hủy subscription SSI; quote/chart/AI context đổi theo HPG |
| OpenRouter trả 404/429 | Fallback hợp lệ hoặc lỗi rõ ràng |
| Embedding model đổi | Reindex có version, không trộn vector spaces |
| File trùng SHA-256 | Bỏ qua hoặc tạo version đúng chính sách |
| BCTC thiếu bảng/đơn vị | Đánh dấu warning; không sinh số |
| Citation thiếu source | Không cho phép gắn citation giả |
| Ingestion bị crash | Job có checkpoint/retry và trạng thái quan sát được |

## Verification commands

```bash
npm run build:check
```

Đối với ứng dụng StockAI riêng: chạy lint/build Next.js, build/test .NET, integration tests cho Redis/PostgreSQL/Qdrant, contract tests DNSE/SSI và test SSE end-to-end. Đừng đánh dấu hoàn thành chỉ vì UI render.
