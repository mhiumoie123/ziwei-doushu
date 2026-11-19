# Rà soát thuật ngữ và thiết kế UI Tử Vi Đẩu Số

## Phạm vi và quy ước biên tập

Đối chiếu các bảng trong `lib/ziwei/vietnamese.ts` với ID, điều kiện và trích mục do `lib/ziwei/patterns.ts`, `lib/ziwei/constants.ts` và `lib/ziwei/shier-shen.ts` sử dụng. Các tên sách theo nhãn hiện có trong repo. Báo cáo chưa đối chiếu từng câu với ấn bản tiếng Việt cụ thể. Quy tắc an sao, phép phân bậc độ sáng và logic nhận diện cách cục giữ nguyên.

| Nhóm | Lựa chọn hiển thị và phạm vi đối chiếu |
| --- | --- |
| Chính tinh | Giữ 14 tên Hán–Việt đang dùng, như Tử Vi, Thiên Cơ, Vũ Khúc, Thất Sát. Chấp nhận các dạng chữ phồn thể phổ biến ở lớp tra tên. |
| Phụ tinh và thần sát | Tách `咸池` (Hàm Trì) với `桃花` (Đào Hoa) để giữ được tên thần trong vòng Tướng Tiền. Hai tên có thể được dùng như dị danh tùy tài liệu. Bổ sung Thiên Không, Không Vong và Triệt Lộ từ các ID có trong bộ lập số. Giữ Quan Phủ (`官府`) và Quan Phù (`官符`) riêng. |
| Tứ Hóa | Dùng Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ trong diễn giải và dạng ngắn Lộc, Quyền, Khoa, Kỵ trên lá số. Chấp nhận dạng đầy đủ và dạng một chữ của các ID đã biết. |
| Cung vị | Nhãn ngắn Mệnh và Thân hợp với cách ghép “cung Mệnh”, “Thân cư”. `交友宫` và `僕役宮` cùng hiển thị Nô Bộc. Giữ Thân như dấu trên cung tương ứng, không thêm cung thứ 13. |
| Độ sáng | Hiển thị bậc từ `brightnessRaw` ở panel chi tiết, có tên đầy đủ ở ô cung. Bất đắc địa dùng `BĐ`, Hãm địa dùng `H`, Nhàn địa dùng `Nh`. Giữ `地` là “Địa” vì mã nguồn có nhận diện giá trị này nhưng chưa xác lập nó tương đương bậc nào trong các trường phái. |
| Cách cục | Bổ sung Hỏa Tham, Linh Tham và các tổ hợp Lộc Tồn, Thiên Mã, Hóa Khoa, Xương Khúc còn thiếu. Dịch tên sinh động như “Vũ Khúc Hóa Lộc nhập Mệnh”. Dùng lối đọc Tam Kỳ Gia Hội và Kình Đà Giáp Kỵ. |

`PatternsCard` dùng mô tả tiếng Việt thay cho mô tả tiếng Trung của bộ nhận diện. Điều kiện cố định được dịch theo câu, còn điều kiện có vị trí, danh sách sao hay tên sao biến đổi được dịch theo mẫu. Điều kiện lạ giữ nguyên bản để tránh dịch sai ý từng phần. Nhãn “Yếu tố trợ cách” phân biệt tiêu chí trợ lực trong bộ nhận diện với cơ chế Tứ Hóa. Nguồn sách và tên mục có bản Việt khi nhận diện được.

Một điểm cần hội đồng biên tập xác minh là Minh Châu Xuất Hải. Bản mô tả cũ nêu Nhật Mão, Nguyệt Hợi nhưng bộ nhận diện hiện dùng điều kiện đối cung Sửu có Nhật Nguyệt đồng cung. Mô tả mới dẫn người đọc đến điều kiện của lá số. Việc đối chiếu với từng truyền bản và sửa quy tắc nếu cần thuộc một thay đổi thuật toán riêng.

## Bản nháp tính năng UI

| Ưu tiên | Trải nghiệm | Thiết kế và tiêu chí nghiệm thu |
| --- | --- | --- |
| P0 | “Vì sao có cách này?” ngay trên mỗi thẻ cách cục | Mở phần điều kiện cần, trợ cách, phá cách và tham chiếu. Bấm một cung liên quan để đưa focus về ô cung, dùng toàn bộ `p.palaces` khi mở chi tiết. Có nhãn riêng cho tổ hợp có yếu tố phá cách. Dùng được với bàn phím và không đổi điểm hay quy tắc nhận diện. |
| P0 | Chú giải sao ngay trên lá số | Thêm nút “Chú giải” cạnh bảng lá số, hiển thị đầy đủ ký hiệu độ sáng, nhóm sao và Tứ Hóa. Lấy nhãn từ `vietnamese.ts` để bảng, tooltip và panel cùng một nguồn. Mở được bằng chạm hoặc bàn phím. Ký hiệu đọc được khi không phân biệt màu. |
| P1 | So sánh bản mệnh với vận hạn | Dùng `TimeNav` để chọn một lớp hạn, làm nổi bật sao có Tứ Hóa thay đổi và cung liên quan. Giữ nhãn phân biệt bản mệnh với lớp đang xem. Trên điện thoại chuyển hai chế độ thay vì ép hai bảng cạnh nhau. Khi bỏ chọn hạn, khôi phục lá số ban đầu. |
| P1 | Từ điển thuật ngữ có tìm kiếm | Tìm theo tiếng Việt có dấu, không dấu hoặc chữ Hán. Mỗi mục có tên chính, dị danh, nhóm và ghi chú trường phái nếu có. Kết quả mở đúng panel sao hoặc chú giải. Giữ ID gốc cho liên kết và tìm kiếm, không dùng nhãn dịch làm ID. |

Luồng ưu tiên cho màn hình nhỏ: chạm thẻ cách cục → xem lý do nhận diện → chọn cung liên quan → mở chi tiết sao → quay lại đúng vị trí cuộn. Bản nháp ở mức hành vi và tiêu chí nghiệm thu. Các tính năng trong bảng chưa triển khai.

## Giới hạn xác minh

Kiểm tra offline bằng Node 24 cho bảng tên, tên và điều kiện cách cục, nguồn và ba vòng thần sát trong mã nguồn. Kiểm tra này bao phủ các chuỗi trích xuất được và các mẫu động đại diện. Việc đối chiếu dị bản, build Next.js và kiểm tra UI trên trình duyệt vẫn cần môi trường có dependencies và tư liệu biên tập. `npm run typecheck` thiếu `tsc`, còn `npm test` thiếu `tsx` trong workspace. Không tải dependencies qua mạng.
