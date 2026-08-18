# Hướng dẫn viết 8 Core Domains

File này là quy ước biên tập nội bộ để các domain không quay lại kiểu “liệt kê thuật ngữ”.

## Nguyên tắc

1. Thuật ngữ tiếng Anh xuất hiện lần đầu phải có giải thích tiếng Việt ngay tại chỗ.
2. Mỗi khái niệm khó cần ít nhất một ví dụ số hoặc một tình huống thực tế.
3. Luôn phân biệt **nghiệp vụ** với **implementation**.
4. Mỗi flow cần trả lời: input là gì, state thay đổi gì, output gì, failure xảy ra thì sao.
5. Không dùng `invariant`, `idempotency`, `ledger`, `projection`, `reconciliation`, `settlement`, `entitlement`, `margin`, `watermark`, `backpressure`, `orchestration` như từ “ai cũng biết”.

## Template

```text
Câu chuyện thực tế
→ Từ điển thuật ngữ
→ Mental model
→ Ví dụ số cụ thể
→ Lifecycle/state
→ Data model / API / event
→ Invariant bằng tiếng Việt
→ Failure scenario
→ Checklist
→ Bài tập
```

Mục tiêu: một backend developer chưa làm chứng khoán vẫn đọc được, nhưng nội dung vẫn đủ sâu cho engineer thiết kế core.