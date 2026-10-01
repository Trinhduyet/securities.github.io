# RAG tài liệu chứng khoán: CMS, ingestion và citation

## Nguồn tài liệu

Ưu tiên công bố từ HOSE/HNX/VSDC và website IR của doanh nghiệp khi quyền truy cập cho phép. API/provider được cấp phép có thể bổ sung company metadata, research và news. Việc đã đăng nhập vào website không đồng nghĩa có quyền thu thập hàng loạt, lưu toàn văn hay phân phối lại.

## Ba phương thức ingestion

1. **Auto sync:** nguồn đã cấu hình được scheduler/worker kiểm tra nội dung mới theo giới hạn và điều khoản của nguồn.
2. **URL ingestion:** admin nhập URL được phép, server xác thực domain, redirect, content type và chặn SSRF trước khi tải.
3. **File upload:** admin tải PDF/DOCX/XLSX để xử lý bất đồng bộ; original file được lưu trong object storage.

```mermaid
flowchart LR
  S[Source / URL / file] --> J[Queue]
  J --> D[Download + deduplicate]
  D --> O[Original + version]
  O --> P[Text / tables]
  P --> C[Metadata-aware chunks]
  C --> E[Embedding]
  E --> Q[Qdrant]
  Q --> R[Hybrid retrieval + rerank]
  R --> A[Answer + citation]
```

## Metadata tối thiểu

| Dữ liệu | Trường cần giữ |
| --- | --- |
| Nguồn | Provider, canonical URL, quyền sử dụng, fetchedAt |
| Tài liệu | Document ID, version, SHA-256, ticker, loại báo cáo |
| Kỳ tài chính | Năm, quý, riêng/hợp nhất, kiểm toán/chưa kiểm toán |
| Chunk | Section, trang, bảng, text, embedding model/version |
| Ingestion | Job ID, status, retry count, error, indexedAt |

Không chỉ embed plain text của BCTC: bảng phải giữ header, đơn vị và kỳ so sánh. Chỉ version active của tài liệu `READY` mới tham gia retrieval mặc định.

## Hybrid retrieval

Kết hợp keyword/sparse + dense search, filter ticker/kỳ/loại tài liệu và rerank khi cần. Các phép tính tài chính được thực hiện bởi backend trên số liệu chuẩn hóa; LLM tổng hợp nhưng không được tự đoán giá trị.

## Citation end-to-end

```text
Answer [1] → chunk ID → document version → trang
           → file gốc / source URL
```

Không bịa citation URL hoặc trang. Tài liệu không cho phép lưu full content có thể chỉ được lưu metadata/đường dẫn theo quyền sử dụng.

## CMS cần có

Source health, sync history, upload/URL, trạng thái parsing/embedding/indexing, document versions, retry và reindex. Job xử lý lâu không chạy trực tiếp trong HTTP request.
