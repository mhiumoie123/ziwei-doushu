<div align="center">

# Tử Vi Đẩu Số · Bộ Máy An Sao Lập Lá Số Mã Nguồn Mở

### Thuật toán là trí tuệ truyền thống của tiền nhân, không nên bị giam giữ trong những bức tường đóng kín

[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)

**[Tiếng Việt](./README.vi.md)** · [中文](./README.md) · [English](./README.en.md)

</div>

---

## I. Triết Lý Dự Án

Tử Vi Đẩu Số là viên ngọc quý trong nền học thuật mệnh lý phương Đông. Cố danh sư **Nghê Hải Hà (Ni Haixia)** trong tác phẩm kinh điển **《Thiên Kỷ》** đã hệ thống hóa và phục dựng chuẩn mực phương pháp luận Tử Vi Đẩu Số chính tông: *"Đại đạo chí giản — chú trọng Mệnh Cung vi bản, Tam Phương vi dụng, lấy Thiên - Địa - Nhân tam tài làm kim chỉ nam"*.

Phiên bản mã nguồn mở này đã được **Việt hóa toàn diện 100% sang tiếng Việt**, sử dụng hệ thống danh xưng Hán - Việt chuẩn xác, tôn nghiêm và quen thuộc với giới học giả, người nghiên cứu và người thực hành Tử Vi tại Việt Nam.

Toàn bộ thuật toán an sao, phối cục, xác định miếu hãm, nhận diện cách cục cổ điển và tính toán Giờ Thái Dương Thật đều chạy trực tiếp trên trình duyệt hoặc máy chủ của bạn với hiệu năng cực cao, hoàn toàn không phụ thuộc vào bất kỳ API thương mại hay chi phí duy trì nào.

---

## II. Các Tính Năng Nổi Bật

1. **An Sao Chính Xác Tuyệt Đối**:
   - Tích hợp động cơ an sao chuẩn mực kết hợp các hiệu chỉnh chính tông từ thầy Nghê Hải Hà.
   - Hỗ trợ đầy đủ 14 Chính Tinh, Tứ Hóa (Lộc, Quyền, Khoa, Kỵ), Lục Cát Tinh, Lục Sát Tinh, Tứ Trợ Tinh, Vòng Tràng Sinh 12 Thần, Vòng Bác Sĩ 12 Thần, Vòng Thái Tuế (Tuế Tiền Thập Nhị Thần) và Tướng Tiền Thập Nhị Thần.
2. **Hiệu Chỉnh Giờ Thái Dương Thật (True Solar Time)**:
   - Tích hợp sẵn tọa độ kinh độ các tỉnh thành lớn tại Việt Nam (Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Hải Phòng, Cần Thơ, Huế, Nha Trang, v.v.).
   - Tự động bù trừ chênh lệch múi giờ và phương trình thời gian (Equation of Time) chuẩn xác theo từng phút.
3. **Phân Định 34 Cách Cục Cổ Điển**:
   - Nhận diện tự động các cách cục quý cách (Tử Phủ Triều Viên, Song Lộc Triều Viên, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Nhật Chiếu Lôi Môn, Kim Xán Quang Huy...) cùng các cảnh báo phá cách theo nguyên văn điển tịch 《Tử Vi Đẩu Số Toàn Thư》, 《Toàn Tập》, 《Cốt Tủy Phú》.
4. **Vận Trình Đa Chiều (Đại Hạn, Lưu Niên)**:
   - Dễ dàng chuyển đổi linh hoạt giữa Bản Mệnh, Đại Hạn 10 năm và Lưu Niên từng năm.
   - Tự động hiển thị Tứ Hóa lưu động và đường bay tương tác tam phương tứ chính.
5. **Tử Vi Hợp Mệnh (So Sánh Hai Lá Số)**:
   - Chức năng đối chiếu hai lá số để xem xét duyên phận tình cảm, khả năng hợp tác làm ăn hay quan hệ gia đình.
6. **Kho Điển Tịch Cổ & Tri Thức Tra Cứu**:
   - Tra cứu trực tiếp nguyên văn các bộ sách gối đầu giường của môn phái.

---

## III. Hệ Thống Thuật Ngữ Tử Vi Bản Địa Hóa

Toàn bộ hệ thống thuật ngữ trong mã nguồn đã được chuẩn hóa theo ngữ nghĩa Tử Vi truyền thống Việt Nam:

- **Thập Tứ Chính Tinh (14 Major Stars)**:
  - *Bắc Đẩu*: Tử Vi (Đế tinh), Vũ Khúc (Tài tinh), Liêm Trinh (Tù tinh/Thứ Đào Hoa), Tham Lang (Đào Hoa tinh), Cự Môn (Ám tinh), Phá Quân (Hao tinh).
  - *Nam Đẩu*: Thiên Phủ (Lệnh tinh), Thiên Lương (Ấm tinh), Thiên Cơ (Thiện tinh), Thiên Đồng (Phúc tinh), Thiên Tướng (Ấn tinh), Thất Sát (Tướng tinh).
  - *Trung Thiên Tinh*: Thái Dương (Quý tinh), Thái Âm (Phú tinh).
- **Thập Nhị Cung (12 Palaces)**:
  - Cung Mệnh, Huynh Đệ, Phu Thê, Tử Tức, Tài Bạch, Tật Ách, Thiên Di, Nô Bộc (Giao Hữu), Quan Lộc, Điền Trạch, Phúc Đức, Phụ Mẫu. Kèm vị trí an Cung Thân.
- **Tứ Hóa (Four Mutagens)**:
  - Hóa Lộc (Cát khánh, tài lộc dồi dào)
  - Hóa Quyền (Quyền thế, năng lực lãnh đạo)
  - Hóa Khoa (Danh tiếng, thi cử, khoa bảng, quý nhân)
  - Hóa Kỵ (Trở ngại, thị phi, bài học cuộc đời)
- **Độ Sáng Tinh Diệu (Brightness)**:
  - Miếu (Miếu Địa - rực rỡ nhất), Vượng (Vượng Địa), Đắc (Đắc Địa), Bình (Bình Hòa), Hãm (Hãm Địa).

---

## IV. Cài Đặt & Triển Khai Nhanh

### 1. Triển khai trực tiếp trên VPS (Không cần tải node_modules về máy cá nhân)

Trên máy ảo / VPS Ubuntu/Debian/CentOS của bạn, chỉ cần thực hiện các lệnh sau:

```bash
# 1. Clone repository fork của bạn về VPS
git clone https://github.com/mhiumoie123/ziwei-doushu.git
cd ziwei-doushu

# 2. Cài đặt các gói phụ thuộc trên VPS
npm install

# 3. Biên dịch phiên bản Production
npm run build

# 4. Khởi chạy ứng dụng
npm run start
```

Ứng dụng mặc định sẽ lắng nghe ở cổng `http://localhost:3000`.

### 2. Chạy nền với PM2 trên VPS

Để ứng dụng luôn hoạt động ổn định và tự khởi động lại khi VPS reboot:

```bash
# Cài đặt PM2 toàn cục (nếu chưa có)
npm install -g pm2

# Khởi chạy dịch vụ
pm2 start npm --name "ziwei-doushu" -- start

# Cấu hình tự khởi động cùng hệ thống
pm2 save
pm2 startup
```

---

## V. Cấu Trúc Mã Nguồn

```text
├── app/                        # Next.js App Router
│   ├── chart/page.tsx          # Trang Lập Lá Số chính
│   ├── heming/page.tsx         # Trang Tử Vi Hợp Mệnh
│   ├── knowledge/              # Tra cứu 14 Chính Tinh & 12 Cung Vị
│   ├── library/                # Tra cứu Điển Tịch Cổ (Toàn Thư, Toàn Tập, Cốt Tủy Phú)
│   ├── layout.tsx              # Root Layout giao diện
│   └── page.tsx                # Trang chủ phong cách cổ phong
├── components/                 # Các thành phần giao diện React
│   ├── BirthForm.tsx           # Form nhập thông tin ngày giờ sinh & tọa độ
│   ├── ChartBoard.tsx          # Bàn đồ 4x4 Thập Nhị Cung Tử Vi & Tam Phương Tứ Chính
│   ├── PalaceCell.tsx          # Ô hiển thị chi tiết một cung vị (Chính tinh, phụ tinh, hóa tinh)
│   ├── ChartSummary.tsx        # Bảng tổng hợp mệnh bàn, ngũ hành cục, thân chủ, mệnh chủ
│   ├── PatternsCard.tsx        # Danh mục nhận diện các cách cục Tử Vi thành lập
│   ├── StarDetailPanel.tsx     # Bảng tra cứu bình giải chuyên sâu từng sao
│   ├── TimeNav.tsx             # Thanh chuyển đổi Bản Mệnh, Đại Hạn, Lưu Niên
│   └── ChatPanel.tsx           # Trợ lý AI trao đổi và giải đáp
├── lib/
│   ├── ziwei/
│   │   ├── algorithm.ts        # Thuật toán an sao và liên kết dữ liệu
│   │   ├── vietnamese.ts       # Từ điển và helper chuẩn hóa thuật ngữ Tử Vi tiếng Việt
│   │   ├── constants.ts        # Hằng số thiên can, địa chi, 14 chính tinh
│   │   ├── patterns.ts         # Logic nhận diện 34 cách cục cổ truyền
│   │   ├── school-config.ts    # Cấu hình các phái (Đẩu Số Toàn Thư, Trung Châu, v.v.)
│   │   ├── cities.ts           # Tọa độ kinh độ các thành phố Việt Nam & quốc tế
│   │   └── types.ts            # Định nghĩa kiểu dữ liệu TypeScript
│   └── classics/               # Toàn văn các điển tịch cổ Hán Nôm & diễn giải
```

---

## VI. Giấy Phép & Đóng Góp

- Mã nguồn được phân phối dưới giấy phép **[MIT License](./LICENSE)**.
- Mọi đóng góp, cải tiến về thuật ngữ chuyên môn Tử Vi Đẩu Số và trải nghiệm người dùng luôn được nhiệt liệt chào đón qua GitHub Pull Request.
