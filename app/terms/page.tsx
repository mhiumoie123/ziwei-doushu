export const metadata = { title: 'Điều khoản dịch vụ · Tử Vi Đẩu Số', description: 'Điều khoản dịch vụ và thỏa thuận sử dụng' };

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều Khoản Dịch Vụ</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 4 năm 2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Khái quát dịch vụ</h2>
      <p>Hệ thống Tử Vi Đẩu Số cung cấp công cụ an sao lập lá số và phân tích dựa trên hệ thống Tử Vi chính tông Nghê Hải Hà 《Thiên Kỷ》 cùng các điển tịch cổ. Toàn bộ nội dung mệnh lý chỉ mang tính chất tham khảo học thuật, <strong>không cấu thành bất kỳ lời khuyên y tế, đầu tư tài chính, pháp luật hay quyết định trọng đại nào trong đời sống</strong>.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Quy tắc sử dụng</h2>
      <p>Khi sử dụng dịch vụ, bạn đồng ý:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Sử dụng cho mục đích cá nhân, nghiên cứu văn hóa truyền thống và tìm hiểu bản thân một cách lành mạnh.</li>
        <li>Cung cấp thông tin ngày giờ sinh chính xác để đảm bảo độ chuẩn xác khi an sao.</li>
        <li>Tự chịu trách nhiệm đối với các nhận định và quyết định cá nhân trong cuộc sống.</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Tuyên bố miễn trừ trách nhiệm</h2>
      <p>Vận mệnh con người chịu sự tác động đồng thời của Thiên - Địa - Nhân (Thiên Mệnh 1/3, Địa Lý Phong Thủy 1/3, Nhân Sự Nỗ Lực 1/3). Lá số Tử Vi chỉ phản ánh quy luật tiên thiên, hành vi và sự nỗ lực tu dưỡng của con người mới là yếu tố quyết định. Chúng tôi không chịu trách nhiệm pháp lý đối với bất kỳ quyết định cá nhân nào của người dùng.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>Chính sách bảo mật</a> · <a href="/" style={{ color: 'var(--ac)' }}>Quay lại trang chủ</a>
        </p>
      </main>
    </>
  );
}
