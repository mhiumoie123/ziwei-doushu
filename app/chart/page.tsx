'use client';
import { useState, useEffect, useMemo } from 'react';
import BirthForm, { type BirthFormState } from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import PatternsCard from '@/components/PatternsCard';
import StarDetailPanel from '@/components/StarDetailPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import ShareModal from '@/components/ShareModal';
import { generateChart } from '@/lib/ziwei/algorithm';
import { formToBirthInfo, formToSearchParams, searchParamsToForm } from '@/lib/ziwei/share';
import type { BirthInfo, ZiweiChart, Palace, Star } from '@/lib/ziwei/types';

/**
 * Trang lập lá số Tử Vi Đẩu Số
 * An sao chính tông chuẩn Nam Phái / Nghê Hải Hà + Chân Thái Dương Thời Việt Nam (63 tỉnh thành UTC+7 + NOAA EoT)
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [savedForm, setSavedForm] = useState<BirthFormState | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [selectedStar, setSelectedStar] = useState<{ star: Star; palaceName: string } | null>(null);
  const [selectedSiHua, setSelectedSiHua] = useState<{ starName: string; siHua: string; view: TimeView } | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());
  const [shareOpen, setShareOpen] = useState(false);

  // Tự động lập lá số nếu mở từ liên kết chia sẻ có query params (?y=...&m=...&d=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const parsed = searchParamsToForm(params);
    if (!parsed || !parsed.year || !parsed.month || !parsed.day) return;
    const fullForm: BirthFormState = {
      name: parsed.name ?? '',
      year: parsed.year,
      month: parsed.month,
      day: parsed.day,
      clockHour: parsed.clockHour ?? '8',
      clockMinute: parsed.clockMinute ?? '0',
      unknownTime: parsed.unknownTime ?? false,
      province: parsed.province ?? '',
      city: parsed.city ?? '',
      longitude: parsed.longitude ?? 105.85,
      utcOffsetMinutes: parsed.utcOffsetMinutes ?? 420,
      gender: parsed.gender ?? 'male',
    };
    try {
      const info = formToBirthInfo(fullForm);
      setSavedForm(fullForm);
      setChart(generateChart(info));
    } catch {
      // Nếu URL không hợp lệ thì hiện form nhập bình thường
    }
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    if (!savedForm) return window.location.href;
    const qs = formToSearchParams(savedForm).toString();
    return `${window.location.origin}/chart?${qs}`;
  }, [savedForm]);

  const handleSubmit = (info: BirthInfo) => {
    setChart(generateChart(info));
    setSelectedPalace(null);
    setSelectedStar(null);
    setSelectedSiHua(null);
    if (typeof window !== 'undefined' && savedForm) {
      const qs = formToSearchParams(savedForm).toString();
      window.history.replaceState(null, '', `/chart?${qs}`);
    }
  };

  // ── Chưa lập lá số: Hiển thị form nhập thông tin ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'var(--t-gold)' }}>
          Lập Lá Số Tử Vi Đẩu Số
        </h1>
        <p style={{ color: 'var(--t-faint)', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          Nhập ngày giờ và nơi sinh (đã hỗ trợ 63 tỉnh thành Việt Nam chuẩn UTC+7 &amp; Chân Thái Dương Thời NOAA) để an sao lập lá số Tử Vi chính xác tức thì.
        </p>
        <BirthForm
          initialData={savedForm ?? undefined}
          onFormSave={setSavedForm}
          onSubmit={handleSubmit}
        />
      </main>
    );
  }

  const orig = chart.birthInfo.origInput;
  const birthData = {
    year: String(orig?.year ?? chart.birthInfo.year),
    month: String(orig?.month ?? chart.birthInfo.month),
    day: String(orig?.day ?? chart.birthInfo.day),
    hour: String(orig?.clockHour ?? (chart.birthInfo.hour * 2)),
    minute: String(orig?.clockMinute ?? 0),
    gender: chart.birthInfo.gender,
    city: chart.birthInfo.city,
  };

  // ── Đã lập lá số: Hiển thị Bàn lá số + Cách cục + Chi tiết sao + Luận giải AI ──
  return (
    <main style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            setChart(null);
            setSelectedPalace(null);
            setSelectedStar(null);
            setSelectedSiHua(null);
          }}
          style={{
            padding: '8px 18px', cursor: 'pointer',
            border: '1px solid var(--t-border)', borderRadius: 10,
            background: 'var(--t-surface)', color: 'var(--t-gold)', fontSize: 13,
            fontWeight: 500,
          }}
        >
          ← Lập Lại Lá Số
        </button>

        <button
          type="button"
          onClick={() => setShareOpen(true)}
          style={{
            padding: '8px 18px', cursor: 'pointer',
            border: '1px solid rgba(212,168,67,0.35)', borderRadius: 10,
            background: 'rgba(212,168,67,0.12)', color: 'var(--t-gold)', fontSize: 13,
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <span>✦</span> Xuất Ảnh &amp; Chia Sẻ Lá Số
        </button>
      </div>

      {/* Thanh điều hướng Bản Mệnh / Đại Hạn / Lưu Niên duy nhất, đồng bộ trực tiếp với ChartBoard */}
      <TimeNav
        chart={chart}
        view={view}
        liunianYear={liunianYear}
        onViewChange={setView}
        onYearChange={setLiunianYear}
      />

      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]"
        style={{
          gap: 20, marginTop: 12, alignItems: 'start',
        }}
      >
        <div className="space-y-4 min-w-0">
          <ChartBoard
            chart={chart}
            hideTimeNav
            view={view}
            liunianYear={liunianYear}
            onViewChange={setView}
            onYearChange={setLiunianYear}
            onPalaceSelect={setSelectedPalace}
            onStarSelect={(star, palace) => setSelectedStar({ star, palaceName: palace.name })}
            onSiHuaClick={(starName, siHua, v) => setSelectedSiHua({ starName, siHua, view: v })}
          />

          {selectedStar && (
            <StarDetailPanel
              star={selectedStar.star}
              palaceName={selectedStar.palaceName}
              onClose={() => setSelectedStar(null)}
            />
          )}

          <PatternsCard chart={chart} />
        </div>

        <div className="lg:sticky lg:top-4" style={{ height: 'min(82vh, 860px)' }}>
          <InsightPanel
            chart={chart}
            selectedPalace={selectedPalace}
            selectedSiHua={selectedSiHua}
          />
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={shareUrl}
        chart={chart}
        birth={birthData}
      />
    </main>
  );
}
