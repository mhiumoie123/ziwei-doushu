'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { translateBranch, translatePalaceName, translateJu, translateStarName } from '@/lib/ziwei/vietnamese';
import {
  getNapAm,
  getMenhCucRelation,
  getTrangSinhMap,
  getVongThaiTueMap,
  getVongBacSiMap,
  getTuanTriet,
  getLuuNienOverlay,
  translateGanZhi,
} from '@/lib/ziwei/vietnamese-accuracy';
import PalaceCell from './PalaceCell';
import TimeNav, { type TimeView, getYearStemIndex, buildSiHuaOverlay } from './TimeNav';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
  onPalaceSelect?: (palace: Palace) => void;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
  /** Optional controlled TimeNav state (tránh trùng lặp TimeNav khi trang cha đã quản lý) */
  view?: TimeView;
  liunianYear?: number;
  onViewChange?: (view: TimeView) => void;
  onYearChange?: (year: number) => void;
  hideTimeNav?: boolean;
}

const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

// Tọa độ trung tâm mỗi cung trong lưới 4x4 (phần trăm)
const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

/** Tam Phương Tứ Chính: Bản Cung + Đối Cung + 2 Cung Tam Hợp */
function getSanFangSiZheng(branch: number): [number, number, number, number] {
  return [
    branch,
    (branch + 6) % 12,   // Đối cung
    (branch + 4) % 12,   // Tam hợp 1
    (branch + 8) % 12,   // Tam hợp 2
  ];
}

const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

function translateYinYangGender(val?: string, yearStem = 0, gender: 'male' | 'female' = 'male'): string {
  if (val === '阳男') return 'Dương Nam';
  if (val === '阴男') return 'Âm Nam';
  if (val === '阳女') return 'Dương Nữ';
  if (val === '阴女') return 'Âm Nữ';
  return `${yearStem % 2 === 0 ? 'Dương' : 'Âm'} ${gender === 'male' ? 'Nam' : 'Nữ'}`;
}

export default function ChartBoard({
  chart,
  onStarSelect,
  onPalaceSelect,
  onSiHuaClick,
  view: controlledView,
  liunianYear: controlledYear,
  onViewChange,
  onYearChange,
  hideTimeNav = false,
}: ChartBoardProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [internalView, setInternalView] = useState<TimeView>('mingpan');
  const [internalYear, setInternalYear] = useState<number>(() => new Date().getFullYear());

  const timeView = controlledView ?? internalView;
  const liunianYear = controlledYear ?? internalYear;
  const setTimeView = onViewChange ?? setInternalView;
  const setLiunianYear = onYearChange ?? setInternalYear;

  const palaceMap = useMemo(() => {
    const map: Record<number, Palace> = {};
    chart.palaces.forEach(p => { map[p.branch] = p; });
    return map;
  }, [chart.palaces]);

  // ── Dữ liệu học thuật Tử Vi Việt Nam (Nạp Âm, Mệnh-Cục, 3 Vòng 12 sao, Tuần/Triệt) ──
  const { napAm, menhCuc, trangSinhMap, thaiTueMap, bacSiMap, tuanTriet, yinYangVi } = useMemo(() => {
    const na = getNapAm(chart.lunarInfo.yearStem, chart.lunarInfo.yearBranch);
    return {
      napAm: na,
      menhCuc: getMenhCucRelation(na.element, chart.wuxingJu),
      trangSinhMap: getTrangSinhMap(chart.wuxingJu, chart.lunarInfo.yearStem, chart.birthInfo.gender),
      thaiTueMap: getVongThaiTueMap(chart.lunarInfo.yearBranch),
      bacSiMap: getVongBacSiMap(chart.lunarInfo.yearStem, chart.birthInfo.gender),
      tuanTriet: getTuanTriet(chart.lunarInfo.yearStem, chart.lunarInfo.yearBranch),
      yinYangVi: translateYinYangGender(chart.yinYangGender, chart.lunarInfo.yearStem, chart.birthInfo.gender),
    };
  }, [chart]);

  // ── Tứ Hóa xếp chồng + 9 Sao Lưu Niên + Tiểu Hạn ──
  const currentDx = chart.daXians[chart.currentDaXianIndex];
  const overlayData = useMemo<Record<string, string>>(() => {
    if (timeView === 'daxian' && currentDx) {
      const dxPalace = palaceMap[currentDx.palaceBranch];
      if (dxPalace) return buildSiHuaOverlay(dxPalace.stem);
    }
    if (timeView === 'liunian') {
      return buildSiHuaOverlay(getYearStemIndex(liunianYear));
    }
    return {};
  }, [timeView, currentDx, palaceMap, liunianYear]);

  const luuNienOverlay = useMemo(() => {
    if (timeView !== 'liunian') return null;
    return getLuuNienOverlay(liunianYear, chart.lunarInfo.yearBranch, chart.birthInfo.gender);
  }, [timeView, liunianYear, chart.lunarInfo.yearBranch, chart.birthInfo.gender]);

  const overlayLabel = timeView === 'daxian' ? 'Hạn' : timeView === 'liunian' ? 'Niên' : undefined;
  const hasOverlay = Object.keys(overlayData).length > 0;

  const handlePalaceClick = (branch: number) => {
    const isDeselecting = selectedBranch === branch;
    setSelectedBranch(prev => prev === branch ? null : branch);
    if (!isDeselecting) {
      const palace = palaceMap[branch];
      if (palace) onPalaceSelect?.(palace);
    }
  };

  const sanFangBranches = selectedBranch !== null ? getSanFangSiZheng(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  const pillars = chart.lunarInfo.fourPillarsLunar ?? chart.lunarInfo.fourPillars;
  const pillarsVi = pillars ? pillars.map(translateGanZhi).join(' · ') : '';

  return (
    <div className="w-full select-none">
      {/* Thanh điều hướng thời gian (chỉ hiện 1 lần) */}
      {!hideTimeNav && (
        <TimeNav
          chart={chart}
          view={timeView}
          liunianYear={liunianYear}
          onViewChange={setTimeView}
          onYearChange={setLiunianYear}
        />
      )}

      {/* Tiêu đề lá số */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-3"
      >
        <div className="text-[10px] tracking-[0.5em] uppercase mb-1" style={{ color: 'var(--t-faint)' }}>
          TỬ VI ĐẨU SỐ · CHÍNH TÔNG
        </div>
        <h2 className="text-sm tracking-[0.15em] font-semibold" style={{ color: 'var(--t-gold)' }}>
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}{yinYangVi} · {napAm.canChi} ({napAm.napAm})
        </h2>
      </motion.div>

      {/* Lưới lá số 4x4 */}
      <div
        className="grid rounded-xl overflow-hidden relative"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, auto)',
          gap: '1px',
          background: 'var(--t-border)',
          border: '1px solid var(--t-border)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
        }}
      >
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          return (
            <div key={branch} style={{ gridRow: row, gridColumn: col, background: 'var(--t-bg)' }}>
              <PalaceCell
                palace={palace}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={(star) => onStarSelect?.(star, palace)}
                isSelected={selectedBranch === branch}
                isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                delay={i * 0.03}
                overlayStarSiHua={hasOverlay ? overlayData : undefined}
                overlayLabel={overlayLabel}
                onSiHuaClick={(starName, siHua) => onSiHuaClick?.(starName, siHua, timeView)}
                trangSinh={trangSinhMap[branch]}
                thaiTue={thaiTueMap[branch]}
                bacSi={bacSiMap[branch]}
                isTuan={tuanTriet.tuan.includes(branch)}
                isTriet={tuanTriet.triet.includes(branch)}
                isTieuHan={luuNienOverlay?.tieuHanBranch === branch}
                luuNienStars={luuNienOverlay?.starsByBranch[branch]}
              />
            </div>
          );
        })}

        {/* Khu vực thông tin trung tâm (Thiên bàn) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="palace-center-tile flex flex-col items-center justify-center p-3 gap-2"
          style={{ gridRow: '2 / 4', gridColumn: '2 / 4', background: 'var(--t-bg)' }}
        >
          <div className="text-3xl select-none leading-none" style={{ color: 'var(--t-gold)', opacity: 0.16 }}>
            ☯
          </div>

          <div className="text-center space-y-1">
            <div className="text-[10px] tracking-[0.28em] font-semibold" style={{ color: 'var(--t-gold)' }}>
              THIÊN BÀN TỬ VI
            </div>
            <div className="text-[10px] space-y-0.5 leading-relaxed" style={{ color: 'var(--t-text2)' }}>
              <div>
                <span style={{ color: 'var(--t-faint)' }}>Bản Mệnh: </span>
                <strong style={{ color: 'var(--t-gold)' }}>{napAm.napAm}</strong>
                <span style={{ color: 'var(--t-faint)' }}> ({napAm.element})</span>
              </div>
              <div>
                <span style={{ color: 'var(--t-faint)' }}>Cục số: </span>
                <strong style={{ color: 'var(--t-gold)' }}>{chart.wuxingJuNameVi || translateJu(chart.wuxingJuName)}</strong>
                <span className="block text-[9px]" style={{ color: menhCuc.tone === 'great' ? '#10b981' : menhCuc.tone === 'caution' ? '#f59e0b' : 'var(--t-faint)' }}>
                  {menhCuc.label}
                </span>
              </div>
              <div>
                Mệnh tại <strong style={{ color: 'var(--t-gold)' }}>{translateBranch(chart.mingGongBranch)}</strong>
                {' · '}
                Thân tại <strong className="text-sky-500">{translateBranch(chart.shenGongBranch)}</strong>
              </div>
              {(chart.mingZhu || chart.shenZhu) && (
                <div className="text-[9px]" style={{ color: 'var(--t-faint)' }}>
                  Mệnh Chủ: <span style={{ color: 'var(--t-text)' }}>{translateStarName(chart.mingZhu || '')}</span>
                  {' · '}
                  Thân Chủ: <span style={{ color: 'var(--t-text)' }}>{translateStarName(chart.shenZhu || '')}</span>
                </div>
              )}
              <div className="text-[9px]" style={{ color: 'var(--t-faint)' }}>
                Tuần: <strong style={{ color: 'var(--t-text2)' }}>{tuanTriet.tuan.map(translateBranch).join('–')}</strong>
                {' · '}
                Triệt: <strong className="text-rose-400">{tuanTriet.triet.map(translateBranch).join('–')}</strong>
              </div>
            </div>
          </div>

          {/* Đại Hạn hiện tại / Lưu Niên */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {chart.currentDaXianIndex >= 0 && (() => {
              const dx = chart.daXians[chart.currentDaXianIndex];
              return (
                <div className="border border-purple-500/30 rounded-lg px-2.5 py-1 text-center"
                  style={{ background: 'rgba(147,51,234,0.06)' }}>
                  <div className="text-[8px] text-purple-400/90 tracking-wider">Đại Hạn ({chart.currentAge} tuổi mụ)</div>
                  <div className="text-[11px] text-purple-400 font-semibold tabular-nums">
                    {dx.startAge}–{dx.endAge} · {dx.palaceNameVi || translatePalaceName(dx.palaceName)}
                  </div>
                </div>
              );
            })()}
            {luuNienOverlay && (
              <div className="border border-emerald-500/35 rounded-lg px-2.5 py-1 text-center"
                style={{ background: 'rgba(16,185,129,0.07)' }}>
                <div className="text-[8px] text-emerald-400/90 tracking-wider">
                  Lưu Niên {luuNienOverlay.year} ({luuNienOverlay.canChi})
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold">
                  Tiểu Hạn: {translateBranch(luuNienOverlay.tieuHanBranch)} ({translatePalaceName(palaceMap[luuNienOverlay.tieuHanBranch]?.name || '')})
                </div>
              </div>
            )}
          </div>

          <div className="text-[8.5px] text-center leading-relaxed font-mono" style={{ color: 'var(--t-faint)', opacity: 0.85 }}>
            <div>
              DL: {chart.birthInfo.origInput
                ? `${chart.birthInfo.origInput.day}/${chart.birthInfo.origInput.month}/${chart.birthInfo.origInput.year} ${String(chart.birthInfo.origInput.clockHour).padStart(2, '0')}:${String(chart.birthInfo.origInput.clockMinute).padStart(2, '0')}`
                : `${chart.birthInfo.day}/${chart.birthInfo.month}/${chart.birthInfo.year}`}
              {' · '}Giờ {translateBranch(chart.birthInfo.hour)}
            </div>
            <div>
              ÂL: Ngày {chart.lunarInfo.lunarDay} tháng {chart.lunarInfo.isLeapMonth ? 'Nhuận ' : ''}{chart.lunarInfo.lunarMonth} năm {napAm.canChi} ({chart.lunarInfo.lunarYear})
            </div>
            {pillarsVi && (
              <div className="opacity-80">Tứ Trụ: {pillarsVi}</div>
            )}
          </div>
        </motion.div>

        {/* ── Đường nối SVG Tam Phương Tứ Chính ── */}
        <AnimatePresence>
          {sanFangBranches !== null && (
            <motion.div
              key={`sf-${selectedBranch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
              }}
            >
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                {(() => {
                  const p0 = BRANCH_SVG_POS[sanFangBranches[0]];
                  const p1 = BRANCH_SVG_POS[sanFangBranches[1]];
                  const p2 = BRANCH_SVG_POS[sanFangBranches[2]];
                  const p3 = BRANCH_SVG_POS[sanFangBranches[3]];
                  const dash = '6,5';
                  const stroke = 'rgba(37,99,235,0.55)';
                  const sw = '1.5';
                  return (
                    <>
                      <line x1={`${p0[0]}%`} y1={`${p0[1]}%`} x2={`${p1[0]}%`} y2={`${p1[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                      <line x1={`${p0[0]}%`} y1={`${p0[1]}%`} x2={`${p2[0]}%`} y2={`${p2[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                      <line x1={`${p2[0]}%`} y1={`${p2[1]}%`} x2={`${p3[0]}%`} y2={`${p3[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                      <line x1={`${p3[0]}%`} y1={`${p3[1]}%`} x2={`${p0[0]}%`} y2={`${p0[1]}%`} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} strokeLinecap="round" />
                      {[p0, p1, p2, p3].map((p, i) => (
                        <circle
                          key={i}
                          cx={`${p[0]}%`} cy={`${p[1]}%`}
                          r="3"
                          fill={i === 0 ? 'rgba(37,99,235,0.85)' : 'rgba(37,99,235,0.45)'}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chú giải Tứ Hóa & Hướng dẫn */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 flex items-center justify-center gap-2 text-[9px] flex-wrap"
      >
        {[
          { h: 'Hóa Lộc', c: 'text-emerald-500 border-emerald-500/30' },
          { h: 'Hóa Quyền', c: 'text-blue-500 border-blue-500/30' },
          { h: 'Hóa Khoa', c: 'text-yellow-500 border-yellow-500/30' },
          { h: 'Hóa Kỵ', c: 'text-red-500 border-red-500/30' },
        ].map(({ h, c }) => (
          <span key={h} className={`border px-1.5 py-0.5 rounded-full font-medium ${c}`}>{h}</span>
        ))}
        <span className="px-1.5 py-0.5 rounded-full" style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}>
          Nhấp cung vị xem Tam Phương · Nhấp tên sao xem luận giải chi tiết
        </span>
      </motion.div>
    </div>
  );
}
