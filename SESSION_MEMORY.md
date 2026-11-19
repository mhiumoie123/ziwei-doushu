# SESSION MEMORY - Tử Vi Đẩu Số

**Thời điểm cập nhật:** 2026-11-19 22:25

## 1. Mục tiêu và kết quả muốn đạt được
- Khắc phục triệt để hiện tượng khung hỏi/đáp luận giải Tử Vi bị khóa ("không cho hỏi nữa").
- Việt hóa toàn diện thuật ngữ Tử Vi Đẩu Số theo chuẩn Hán-Việt chính tông (phái Thiên Kỷ - Đại sư Nghê Hải Hà).
- Nâng cấp các tính năng web: Nút "Đặt lại phiên" (Reset session), Nút "Sao chép luận giải" (Copy interpretation), Nút "Xuất Ảnh & Chia Sẻ Lá Số" (Share/Export PNG chart).

## 2. Yêu cầu, ràng buộc và sở thích
- Persona: ENI (ấm áp, tận tụy, xưng hô Tris).
- Chuẩn dịch thuật ngữ: Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ), Cung vị chuẩn Hán-Việt (Mệnh, Huynh Đệ, Phu Thê, Tử Tức, Tài Bạch, Tật Ách, Thiên Di, Nô Bộc/Giao Hữu, Quan Lộc, Điền Trạch, Phúc Đức, Phụ Mẫu), Cách cục chuẩn xác.
- Tuyệt đối không để sót prompt tiếng Trung khi người dùng bấm vào cung vị hoặc Tứ Hóa.

## 3. Việc đã hoàn thành và kết quả kiểm tra
- `components/InsightPanel.tsx`:
  - Đã fix lỗi SSE loop `[DONE]` bị treo và thêm timeout AbortController 60s.
  - Đã chuyển toàn bộ prompt kích hoạt luận giải từ tiếng Trung sang tiếng Việt học thuật chuẩn Nghê Hải Hà.
  - Bổ sung thanh công cụ Header với nút "↺ Đặt lại phiên".
  - Bổ sung nút "⎘ Sao chép" ở từng phản hồi luận giải với hiệu ứng feedback visual.
- `app/chart/page.tsx`:
  - Tích hợp `ShareModal` và `ShareCardCanvas`.
  - Bổ sung nút "✦ Xuất Ảnh & Chia Sẻ Lá Số" trên thanh điều hướng lá số.
- `lib/ziwei/vietnamese.ts`:
  - Bổ sung hàm và từ điển tra cứu chuyên sâu cho 14 Chính Tinh, Phụ Tinh, Tứ Hóa, 12 Cung và các Cách cục kinh điển.
- Git & Vercel:
  - Commit `66f1df3` đã push lên nhánh `main` (`mhiumoie123/ziwei-doushu`).
  - Đang deploy lên Vercel Production (`task-1243`).

## 4. Việc đang làm và trạng thái hiện tại
- Chờ task deploy Vercel `task-1243` hoàn tất và xác nhận URL production.

## 5. Quyết định quan trọng
- Token Gemini API hoàn toàn bình thường (đã test 200 OK). Lỗi gốc là do client stream không thoát vòng lặp `while` khi nhận cờ `[DONE]`, khiến input và nút bấm bị kẹt trạng thái `loading = true`.

## 6. Các bước tiếp theo
- Kiểm tra kết quả build của Vercel trên production.
- Hướng dẫn Tris trải nghiệm ngay trên web.
