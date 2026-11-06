'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * Trang lập lá số Tử Vi Đẩu Số
 * Sử dụng thuật toán an sao chính tông theo cổ tịch và hệ thống Nghê Hải Hà
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());

  // ── Chưa lập lá số: Hiển thị form nhập thông tin ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--t-gold)' }}>
          Lập Lá Số Tử Vi Đẩu Số
        </h1>
        <p style={{ color: 'var(--t-faint)', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          Nhập đầy đủ thông tin ngày tháng năm và giờ sinh (Dương lịch hoặc Âm lịch) để hệ thống tự động an sao lập lá số Tử Vi tức thì.
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── Đã lập lá số: Hiển thị Bàn lá số + Luận giải ──
  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
      <button
        type="button"
        onClick={() => { setChart(null); setSelectedPalace(null); }}
        style={{
          marginBottom: 16, padding: '8px 18px', cursor: 'pointer',
          border: '1px solid var(--t-border)', borderRadius: 10,
          background: 'var(--t-surface)', color: 'var(--t-gold)', fontSize: 13,
          fontWeight: 500,
        }}
      >
        ← Lập Lại Lá Số
      </button>

      <TimeNav
        chart={chart}
        view={view}
        liunianYear={liunianYear}
        onViewChange={setView}
        onYearChange={setLiunianYear}
      />

      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]"
        style={{
          gap: 20, marginTop: 16, alignItems: 'start',
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <InsightPanel chart={chart} selectedPalace={selectedPalace} />
      </div>
    </main>
  );
}
