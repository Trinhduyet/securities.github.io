# Market Data Engineering: DNSE trước, SSI sau

## 1. Nguồn và quyền truy cập

DNSE LightSpeed là adapter đầu tiên trong StockAI; SSI FastConnect là adapter kế tiếp. Đọc tài liệu chính thức và kiểm tra quyền sử dụng dữ liệu của tài khoản trước khi triển khai. Không suy đoán endpoint, schema, subscription hoặc khả năng phân phối lại dữ liệu.

- [DNSE — kết nối Market Data](https://developers.dnse.com.vn/docs/guide/market-data/connect)
- [DNSE Developer Portal](https://developers.dnse.com.vn/)
- [SSI Developer Portal](https://developers.ssi.com.vn/)

## 2. Canonical event contract

```text
Provider event
  → validate schema / symbol / time
  → canonical Quote | Index | Depth | Trade | OHLC
  → Redis latest state + stream
  → historical persistence (when required)
  → ASP.NET API / browser subscriptions
```

Giữ cả thời điểm của provider và thời điểm hệ thống nhận. Chuẩn hóa đơn vị giá/khối lượng trước khi tính toán; không giả định mọi API dùng cùng scale.

## 3. Trạng thái và freshness

| Trạng thái | Ý nghĩa |
| --- | --- |
| REALTIME | Dữ liệu mới theo đặc tính kênh provider và ngưỡng freshness đã cấu hình |
| REALTIME_PERIODIC | Bản tin chỉ số cập nhật định kỳ |
| DELAYED / STALE | Có dữ liệu nhưng đã quá ngưỡng freshness |
| MARKET_CLOSED | Phiên đóng cửa; hiển thị bản tin cuối phiên |
| UNAVAILABLE | Không có dữ liệu có thể kiểm chứng |

Đừng tính `providerTimestamp` bằng đồng hồ trình duyệt. Khi reconnect phải subscribe lại và kiểm tra snapshot/sequence nếu provider có cơ chế tương ứng.

## 4. Multi-ticker và chart

`/stock/[ticker]` phải dùng security master, `ticker` trong mọi query/cache key, và bỏ subscription cũ khi chuyển mã. Đối với Lightweight Charts, backend cung cấp OHLC thật; đổi timeframe/interval không được tự sinh candle. Dùng `series.update()` cho bar mới và chỉ dùng `setData()` khi thay toàn bộ dataset.

## 5. Chẩn đoán

Kiểm thử disconnect/reconnect, phiên đóng cửa, dữ liệu out-of-order, trùng event, invalid price, quote của mã khác, và source không hỗ trợ một trường dữ liệu. Không chuyển sang mock trong production.
