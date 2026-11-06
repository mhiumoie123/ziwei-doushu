import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Tử Vi Đẩu Số · An Sao & Luận Giải Lá Số Chính Tông',
  description: 'Hệ thống an sao lập lá số Tử Vi Đẩu Số chuẩn xác theo cổ thư kinh điển và truyền thừa Nghê Hải Hà. Phân tích chi tiết 14 chính tinh, 12 cung, tam phương tứ chính, tứ hóa, đại hạn và lưu niên.',
  keywords: 'tử vi đẩu số, tu vi dau so, lập lá số tử vi, an sao tử vi, 14 chính tinh, 12 cung, tứ hóa, đại hạn, lưu niên, cách cục tử vi, cốt tủy phú',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Tử Vi Đẩu Số · An Sao & Luận Giải Lá Số Chính Tông',
    description: 'Hệ thống an sao lập lá số Tử Vi Đẩu Số chuẩn xác theo cổ thư kinh điển. Phân tích 14 chính tinh, 12 cung vị, tứ hóa và vận trình đại hạn lưu niên.',
    url: SITE_URL,
    siteName: 'Tử Vi Đẩu Số',
    locale: 'vi_VN',
    type: 'website',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
