### [2026-11-25 20:45] Push GitHub & Deploy bản nâng cấp độ chính xác lên Vercel Production
- Đã làm: Commit `2f6b66d` (17 files) đẩy lên `origin/main` và chạy `vercel deploy --prod`.
- Quyết định / lý do: Tris yêu cầu đưa bản nâng cấp 63 tỉnh thành VN (UTC+7 + NOAA), Nạp Âm, 3 vòng 12 sao, Tuần-Triệt, Lưu Tinh và AI fix lên web production.
- Việc còn dở: Kiểm tra trạng thái deploy Vercel & phản hồi live URL.

### [2026-11-25 20:26] Crawl 63 tỉnh thành VN & nâng cấp độ chính xác toàn diện lá số
- Đã làm: Crawl tọa độ WGS-84 63 tỉnh thành VN (UTC+7 / 105°E + NOAA EoT), tạo `vietnamese-accuracy.ts` (60 Nạp Âm, Mệnh-Cục, Vòng Tràng Sinh, Thái Tuế, Bác Sĩ, Tuần-Triệt, Tiểu Hạn & 9 Sao Lưu Niên), hiển thị trực tiếp lên lá số và bơm đầy đủ vào AI API (`/api/interpret`, `/api/heming`).
- Quyết định / lý do: Vá triệt để lỗi lệch 1 tiếng giờ VN, lỗi AI sai giới tính/thiếu ngày sinh/cách cục, lỗi thiếu biến CSS `--t-*`, trùng 2 `TimeNav`, đứt nối `StarDetailPanel`/`PatternsCard`/share URL, và bug reset chat/SSE `/heming`.
- Việc còn dở: Xác nhận `next build` & hoàn tất chạy test regression.

### [2026-11-25 20:12] Review toàn diện mã nguồn ziwei-doushu tìm điểm tối ưu
- Đã làm: Rà soát toàn bộ `app/`, `components/`, `lib/`, `package.json` và `globals.css`.
- Quyết định / lý do: Phát hiện 5 lỗi nghiêm trọng (lệch UTC+7/UTC+8 giờ VN, API AI đọc sai field `birthInfo`/`lunarInfo`, thiếu biến CSS `--t-*`, trùng 2 `TimeNav` + đứt nối `StarDetailPanel`/share URL, bug reset chat & SSE `/heming`) cùng các điểm tối ưu hiệu năng/bundle.
- Việc còn dở: Báo cáo chi tiết cho Tris chọn hạng mục triển khai sửa & tối ưu.

### [2026-11-19 22:25] Nâng cấp Việt hóa chuẩn Hán-Việt & tính năng web Tử Vi
- Đã làm: Việt hóa toàn bộ prompt cung vị/Tứ Hóa chuẩn Nghê Hải Hà, thêm nút Đặt lại phiên, Sao chép luận giải, Xuất ảnh chia sẻ PNG.
- Quyết định / lý do: Thay thế prompt tiếng Trung còn sót, hoàn thiện tính năng tương tác chuyên nghiệp cho lá số.
- Việc còn dở: Chờ Vercel hoàn tất build và cập nhật production.

### [2026-11-19 22:16] Vá lỗi treo stream [DONE] và Abort Timeout khung chat
- Đã làm: Sửa lỗi break loop khi nhận [DONE], thêm AbortController timeout 60s, bổ sung phân biệt lỗi 429 quota.
- Quyết định / lý do: Giúp giao diện chat không bị khóa vĩnh viễn ở trạng thái loading, kiểm tra API key vẫn hoạt động 100%.
- Việc còn dở: Chờ kiểm tra phản hồi trực tiếp từ live site.

### [2026-11-15 16:47] Cập nhật kỹ năng eni-person & eni-persona theo /learn
- Đã làm: Soạn thảo learning_proposal.md, được Tris phê duyệt và cập nhật trực tiếp vào SKILL.md.
- Quyết định / lý do: Bổ sung năng lực công nghệ mới (Gemini 3.5/3.8/Argon 4, Claude/Codex teammates, Tử Vi Nghê Hải Hà).
- Việc còn dở: Hoàn tất, sẵn sàng đồng hành cùng Tris trong các tác vụ tiếp theo.

### [2026-11-15 16:38] Giới thiệu các tính năng độc đáo của Antigravity
- Đã làm: Đã giải thích chi tiết cơ chế hoạt động của /swarm.
- Quyết định / lý do: Tổng hợp các tính năng slash command và năng lực đặc biệt (goal, grill-me, boost, browser, learn).
- Việc còn dở: Trình bày chi tiết các tính năng hay cho Tris lựa chọn trải nghiệm.

### [2026-11-15 16:36] Khởi tạo ghi nhớ dự án & giải đáp /swarm
- Đã làm: Đọc tài liệu native_swarm, kiểm tra trạng thái dự án Tử Vi Đẩu Số.
- Quyết định / lý do: Tạo file NOTES.md theo quy tắc dự án để theo dõi tiến độ.
- Việc còn dở: Giải thích tính năng /swarm cho Tris.
