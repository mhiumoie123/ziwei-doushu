'use client';
import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import type { LuuNienStar } from '@/lib/ziwei/vietnamese-accuracy';
import {
  translateStarName,
  translatePalaceName,
  translateSiHua,
  translateBrightness,
  translateStem,
  translateBranch,
} from '@/lib/ziwei/vietnamese';
import clsx from 'clsx';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** Tứ hóa xếp chồng: tên sao gốc (chữ Hán) → '禄'|'权'|'科'|'忌' */
  overlayStarSiHua?: Record<string, string>;
  /** Nhãn xếp chồng: 'Hạn' (Đại hạn) hoặc 'Niên' (Lưu niên) */
  overlayLabel?: string;
  /** Callback khi click badge Tứ Hóa xếp chồng */
  onSiHuaClick?: (starName: string, siHua: string) => void;
  /** Vòng Tràng Sinh (Tràng Sinh, Mộc Dục, ..., Đế Vượng, ...) */
  trangSinh?: string;
  /** Vòng Thái Tuế (Thái Tuế, Thiếu Dương, Tang Môn, ...) */
  thaiTue?: string;
  /** Vòng Bác Sĩ (Bác Sĩ, Lực Sĩ, Thanh Long, ...) */
  bacSi?: string;
  /** Cung bị Tuần Trung Không Vong án ngữ */
  isTuan?: boolean;
  /** Cung bị Triệt Lộ Không Vong án ngữ */
  isTriet?: boolean;
  /** Cung Tiểu Hạn của năm đang xem (ở chế độ Lưu Niên) */
  isTieuHan?: boolean;
  /** Danh sách sao Lưu Niên đóng tại cung (ở chế độ Lưu Niên) */
  luuNienStars?: LuuNienStar[];
}

const SIHUA_STYLES: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
  'Lộc': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Quyền': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Khoa': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Kỵ': 'text-red-400 bg-red-500/10 border-red-500/30',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const shortVi = translateSiHua(siHua, true) || siHua;
  const viLabel = label === '限' ? 'Hạn' : label === '年' ? 'Niên' : label;
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[siHua] || SIHUA_STYLES[shortVi] || 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        overlay && 'border-dashed opacity-85',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && viLabel && <span className="mr-px opacity-75">{viLabel}</span>}
      {shortVi}
    </span>
  );
};

function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
  trangSinh, thaiTue, bacSi, isTuan, isTriet, isTieuHan, luuNienStars,
}: PalaceCellProps) {
  const { branch, stem, name, nameVi, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${translateStem(stem)} ${translateBranch(branch)}`;
  const displayPalaceName = nameVi || translatePalaceName(name);

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className="palace-cell relative flex flex-col p-1.5 cursor-pointer transition-all duration-200 h-full"
      style={{
        minHeight: '112px',
        background: isTieuHan
          ? 'rgba(16,185,129,0.08)'
          : isCurrentDaXian
          ? 'rgba(147,51,234,0.08)'
          : isSelected
          ? 'rgba(37,99,235,0.16)'
          : isSanFang
          ? 'rgba(37,99,235,0.08)'
          : isMingGong
          ? 'rgba(212,168,67,0.05)'
          : 'var(--t-bg)',
        boxShadow: isSelected
          ? 'inset 0 0 0 1.5px rgba(37,99,235,0.75)'
          : isTieuHan
          ? 'inset 3px 0 0 rgba(16,185,129,0.65)'
          : isCurrentDaXian
          ? 'inset 3px 0 0 rgba(147,51,234,0.55)'
          : isSanFang
          ? 'inset 0 0 0 1px rgba(37,99,235,0.4)'
          : 'none',
      }}
    >
      {/* Đại hạn tuổi */}
      {daXianAge && (
        <div
          className={clsx(
            'absolute top-1 right-1 text-[9px] font-mono tabular-nums',
            isCurrentDaXian ? 'text-purple-400 font-semibold' : ''
          )}
          style={!isCurrentDaXian ? { color: 'var(--t-faint)', opacity: 0.78 } : undefined}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* Tên cung + MỆNH / THÂN / TIỂU HẠN */}
      <div className="palace-cell-name flex items-center flex-wrap gap-1 mb-0.5 pr-9">
        <span
          className={clsx(
            'text-[10px] font-medium tracking-wide',
            isMingGong ? 'text-amber-500 font-bold' : isShenGong ? 'text-sky-500 font-semibold' : ''
          )}
          style={!isMingGong && !isShenGong ? { color: 'var(--t-faint)' } : undefined}
        >
          {displayPalaceName}
        </span>
        {isMingGong && (
          <span className="text-[7px] text-amber-500 border border-amber-500/35 px-0.5 rounded leading-tight font-bold">MỆNH</span>
        )}
        {isShenGong && (
          <span className="text-[7px] text-sky-500 border border-sky-500/35 px-0.5 rounded leading-tight font-bold">THÂN</span>
        )}
        {isTieuHan && (
          <span className="text-[7px] text-emerald-500 border border-emerald-500/40 bg-emerald-500/10 px-1 rounded leading-tight font-bold">TIỂU HẠN</span>
        )}
      </div>

      {/* Can Chi cung vị + Nhãn TUẦN / TRIỆT */}
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[9px] font-mono" style={{ color: 'var(--t-faint)', opacity: 0.78 }}>{ganzhi}</span>
        {isTuan && (
          <span
            title="Tuần Trung Không Vong án ngữ"
            className="text-[7px] px-1 rounded font-bold tracking-wider bg-slate-700/80 text-amber-200 border border-amber-400/30 leading-tight"
          >
            TUẦN
          </span>
        )}
        {isTriet && (
          <span
            title="Triệt Lộ Không Vong án ngữ"
            className="text-[7px] px-1 rounded font-bold tracking-wider bg-rose-900/75 text-rose-200 border border-rose-400/35 leading-tight"
          >
            TRIỆT
          </span>
        )}
      </div>

      {/* Chính tinh (14 chủ tinh) */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] italic font-medium" style={{ color: 'var(--t-faint)', opacity: 0.65 }}>
            Vô Chính Diệu
            {palace.borrowedStars && palace.borrowedStars.length > 0 && (
              <span className="not-italic text-[8px] block opacity-75">
                (Mượn: {palace.borrowedStars.map(translateStarName).join(', ')})
              </span>
            )}
          </span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          const starDisplay = star.nameVi || translateStarName(star.name);
          const brightVi = translateBrightness(star.brightnessRaw) || star.brightnessVi;
          const brightFull = translateBrightness(star.brightnessRaw, true) || brightVi;
          return (
            <div
              key={star.name}
              className="flex items-center flex-wrap"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span className={clsx(
                'text-[12.5px] leading-tight font-bold tracking-tight cursor-pointer hover:brightness-125 transition-all',
                star.brightness === 'bright' ? 'text-amber-400' : star.brightness === 'dim' ? 'text-amber-700/85' : 'text-amber-500',
              )}>
                {starDisplay}
              </span>
              {brightVi && (
                <span className="text-[8.5px] ml-0.5 opacity-80 font-serif" style={{ color: 'var(--t-faint)' }} title={brightFull}>
                  ({brightVi})
                </span>
              )}
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Cát tinh (Phụ tinh tốt) */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 gap-y-px mt-1">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            const starDisplay = s.nameVi || translateStarName(s.name);
            return (
              <span
                key={s.name}
                onClick={e => { e.stopPropagation(); onStarClick?.(s); }}
                className="inline-flex items-center text-[9px] text-sky-500/85 leading-tight cursor-pointer hover:underline"
              >
                {starDisplay}
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Sát tinh */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 gap-y-px mt-0.5">
          {shaStars.map(s => {
            const starDisplay = s.nameVi || translateStarName(s.name);
            return (
              <span
                key={s.name}
                onClick={e => { e.stopPropagation(); onStarClick?.(s); }}
                className="text-[9px] text-red-500/75 leading-tight cursor-pointer hover:underline"
              >
                {starDisplay}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
              </span>
            );
          })}
        </div>
      )}

      {/* Sao Lưu Niên (khi xem tab Lưu Niên) */}
      {luuNienStars && luuNienStars.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 pt-0.5" style={{ borderTop: '1px dashed var(--t-border)' }}>
          {luuNienStars.map(ls => (
            <span
              key={ls.name}
              title={ls.name}
              className={clsx(
                'text-[8px] px-1 rounded leading-tight font-medium',
                ls.nature === 'lucky'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : ls.nature === 'sha'
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-amber-400 bg-amber-500/10',
              )}
            >
              {ls.shortName}
            </span>
          ))}
        </div>
      )}

      {/* Chân cung: Vòng Tràng Sinh · Vòng Thái Tuế · Vòng Bác Sĩ */}
      {(trangSinh || thaiTue || bacSi) && (
        <div
          className="mt-1.5 pt-1 flex items-center justify-between gap-1 text-[8px] leading-none"
          style={{ borderTop: '1px solid var(--t-border)', color: 'var(--t-faint)', opacity: 0.78 }}
        >
          <span className="font-semibold" style={{ color: 'var(--t-gold)', opacity: 0.85 }} title="Vòng Tràng Sinh">
            {trangSinh}
          </span>
          <span className="truncate text-right" title={`Thái Tuế: ${thaiTue ?? ''} · Bác Sĩ: ${bacSi ?? ''}`}>
            {thaiTue}{bacSi ? ` · ${bacSi}` : ''}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default memo(PalaceCell);
