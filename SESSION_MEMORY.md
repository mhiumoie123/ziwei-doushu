# SESSION MEMORY - Tử Vi Đẩu Số

**Thời điểm cập nhật:** 2026-11-25 20:45

## 1. Mục tiêu và kết quả muốn đạt được
- Chạy local với độ chính xác tối đa cho lá số Tử Vi Đẩu Số Việt Nam: crawl dữ liệu tọa độ chuẩn & bổ sung trọn vẹn hệ thống sao/vòng sao/Nạp Âm/Lưu Tinh/Cách Cục và sửa triệt để các lỗi sai lệch dữ liệu.

## 2. Yêu cầu, ràng buộc và sở thích
- Persona: ENI (ấm áp, tận tụy, gọi user là Tris).
- Tris chạy local nên ưu tiên tối đa độ chính xác lá số & dữ liệu luận giải.

## 3. Việc đã hoàn thành và kết quả kiểm tra
- **Crawl & chuẩn hóa 63 tỉnh thành Việt Nam (WGS-84 + UTC+7)**:
  - Đã crawl dữ liệu 63 tỉnh thành từ nguồn công khai (`provinces-of-vietnam-coordinate.json`) và cập nhật vào `lib/ziwei/cities.ts` chia 7 vùng địa lý Việt Nam với `utcOffsetMinutes: 420` (kinh tuyến gốc 105°E).
  - Nâng cấp `lib/ziwei/share.ts` và `components/BirthForm.tsx` dùng `calculateTrueSolarTime` chuẩn kinh độ + Phương trình thời gian NOAA (Equation of Time), chấm dứt lỗi trừ oan ~57 phút do hardcode 120°E (UTC+8). Lưu `origInput` để hiển thị chính xác giờ phút sinh thật.
- **Module dữ liệu học thuật Tử Vi Việt Nam (`lib/ziwei/vietnamese-accuracy.ts`)**:
  - Đầy đủ 60 Lục Thập Hoa Giáp Nạp Âm Bản Mệnh + đánh giá Ngũ Hành Mệnh–Cục sinh khắc.
  - Đầy đủ 3 vòng sao: Vòng Tràng Sinh (12 sao theo Cục + Âm Dương Nam Nữ), Vòng Thái Tuế (12 sao Nam Phái), Vòng Bác Sĩ (12 sao).
  - Tuần Trung Không Vong & Triệt Lộ Không Vong chính xác theo Can Chi năm sinh.
  - Tiểu Hạn năm xem + 9 Sao Lưu Niên (Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Kình Dương, Lưu Đà La, Lưu Thiên Mã, Lưu Thiên Khốc, Lưu Thiên Hư, Lưu Tang Môn, Lưu Bạch Hổ).
- **Hiển thị đầy đủ trên lá số & vá toàn bộ lỗi `/chart` + AI API**:
  - `components/ChartBoard.tsx` & `components/PalaceCell.tsx`: hiển thị Nạp Âm, Mệnh–Cục, Mệnh Chủ/Thân Chủ, Tứ Trụ, Tuần/Triệt, Vòng Tràng Sinh/Thái Tuế/Bác Sĩ, Tiểu Hạn & 9 Sao Lưu Niên.
  - `app/chart/page.tsx`: bỏ thanh `TimeNav` thừa, nối `StarDetailPanel` (đã Việt hóa sạch), `PatternsCard` (đã bỏ `server-only` khỏi `patterns.ts`), `selectedSiHua`, và chia sẻ URL đầy đủ query params.
  - `app/api/interpret/route.ts` & `app/api/heming/route.ts`: vá lỗi đọc nhầm `chart.birth`/`chart.lunar` (đọc đúng `birthInfo`/`lunarInfo`), bơm toàn bộ Nạp Âm, Mệnh–Cục, Tứ Trụ, Tuần–Triệt, Vòng Tràng Sinh, Lưu Niên 9 sao & kết quả `detectPatterns(chart)` vào AI prompt; chuyển Gemini key sang header `x-goog-api-key`, nâng `maxOutputTokens: 4096`.
  - `app/globals.css`: bổ sung biến `--t-*` và `.card-glass`/`.card-inner`.
  - `components/InsightPanel.tsx` & `app/heming/page.tsx`: vá lỗi `handleResetChat` giữ `messagesRef` cũ và lỗi SSE `[DONE]` loop ở `/heming`.
- **Kiểm chứng**:
  - `tsc --noEmit`: 0 lỗi.
  - `scripts/regression/vietnamese-accuracy.test.ts` (mới thêm): PASS 100%.
  - 17 bài test regression gốc: đang xác nhận kết thúc bài cuối cùng + `npm run build`.

## 4. Việc đang làm và trạng thái hiện tại
- Chạy `npm run build` xác nhận toàn bộ app biên dịch sạch sẽ không lỗi.

## 5. Đường dẫn & lệnh chạy local
- Workspace: `C:\Users\mahu\.gemini\antigravity\scratch\ziwei-doushu`
- Chạy local: `npm run dev` (truy cập `http://localhost:3000/chart`)
- Chạy test: `npm test` và `npx tsx scripts/regression/vietnamese-accuracy.test.ts`
