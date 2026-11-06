export const metadata = { title: 'Chính sách bảo mật · Tử Vi Đẩu Số', description: 'Chính sách bảo mật thông tin người dùng' };

export default function PrivacyPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Trang chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>TỬ VI ĐẨU SỐ</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Chính Sách Bảo Mật</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 4 năm 2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Thông tin chúng tôi thu thập</h2>
      <p>Nhằm phục vụ việc an sao lập lá số Tử Vi và hỗ trợ luận giải, hệ thống có thể thu thập các thông tin sau:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Thông tin lập lá số</strong>: Họ tên (tùy chọn), ngày tháng năm sinh Dương lịch, giờ sinh, giới tính Nam/Nữ, kinh độ nơi sinh (để hiệu chỉnh Giờ Thái Dương Thật).</li>
        <li><strong>Thông tin tương tác</strong>: Lịch sử các lá số đã lập lưu trên trình duyệt của bạn (Local Storage).</li>
        <li><strong>Thông tin phản hồi</strong>: Góp ý, nhận xét về độ chính xác và chất lượng luận giải.</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Mục đích sử dụng thông tin</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Thông tin ngày giờ sinh chỉ được dùng để tính toán tọa độ tinh bàn và lập lá số cho người dùng.</li>
        <li>Toàn bộ thuật toán lập lá số chạy trực tiếp ngay trên trình duyệt (client-side) hoặc máy chủ của bạn mà không gửi dữ liệu ra bên ngoài.</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Quyền riêng tư và chia sẻ dữ liệu</h2>
      <p>Chúng tôi không bán hay cung cấp thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Bảo mật thông tin</h2>
      <p>Mã nguồn hoàn toàn mở, minh bạch và tuân thủ các tiêu chuẩn kỹ thuật an toàn web hiện đại (HTTPS, mã hóa lưu trữ).</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Cookie và Lưu trữ cục bộ (Local Storage)</h2>
      <p>Trang web sử dụng Local Storage để lưu tùy chọn giao diện (Sáng/Tối), danh sách lịch sử lá số cá nhân để bạn dễ dàng tra cứu lại mà không phải nhập lại từ đầu.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Điều khoản dịch vụ</a> · <a href="/" style={{ color: 'var(--ac)' }}>Quay lại trang chủ</a>
        </p>
      </main>
    </>
  );
}
