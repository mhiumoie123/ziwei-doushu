'use client';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BirthInfo } from '@/lib/ziwei/types';
import { SHICHEN } from '@/lib/ziwei/constants';
import { translateBranch } from '@/lib/ziwei/vietnamese';
import { useTheme } from '@/components/ThemeProvider';
import { PROVINCES, getProvinceUtcOffsetMinutes } from '@/lib/ziwei/cities';
import { formToBirthInfo, calcTrueSolarBranch, calcTrueSolarDetail } from '@/lib/ziwei/share';
import { formatTrueSolarClock, formatSignedMinutes } from '@/lib/ziwei/true-solar-time';

export interface BirthFormState {
  name: string;
  year: string;
  month: string;
  day: string;
  clockHour: string;
  clockMinute: string;
  unknownTime: boolean;
  province: string;
  city: string;
  longitude: number;
  utcOffsetMinutes?: number;
  gender: 'male' | 'female';
}

interface BirthFormProps {
  onSubmit: (info: BirthInfo) => void;
  loading?: boolean;
  initialData?: Partial<BirthFormState>;
  onFormSave?: (data: BirthFormState) => void;
  /** Ẩn nút lập lá số bên trong (dùng cho trang Hợp Mệnh khi nút bấm nằm ở cha) */
  hideSubmit?: boolean;
}

const YEAR_OPTIONS = Array.from({ length: 127 }, (_, i) => 2026 - i);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);
const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => i);

/** Kiểm tra ngày dương lịch hợp lệ */
function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function FieldError({ msg, color }: { msg: string; color: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18 }}
          style={{ color, fontSize: '11px', marginTop: '4px' }}
        >
          ✕ {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function BirthForm({ onSubmit, loading, initialData, onFormSave, hideSubmit }: BirthFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const initialProvince = initialData?.province ?? 'Việt Nam · Đồng bằng sông Hồng';
  const initialCity = initialData?.city ?? (initialData?.province === undefined ? 'Hà Nội' : '');
  const initialLon = initialData?.longitude ?? (initialData?.province === undefined ? 105.85 : 120);
  const initialUtc = initialData?.utcOffsetMinutes ?? getProvinceUtcOffsetMinutes(initialProvince);

  const [form, setForm] = useState<BirthFormState>({
    name: initialData?.name ?? '',
    year: initialData?.year ?? '',
    month: initialData?.month ?? '',
    day: initialData?.day ?? '',
    clockHour: initialData?.clockHour ?? '8',
    clockMinute: initialData?.clockMinute ?? '0',
    unknownTime: initialData?.unknownTime ?? false,
    province: initialProvince,
    city: initialCity,
    longitude: initialLon,
    utcOffsetMinutes: initialUtc,
    gender: initialData?.gender ?? 'male',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Đồng bộ trạng thái form cho component cha (trang Hợp Mệnh / Chia sẻ URL)
  useEffect(() => {
    onFormSave?.({ ...form });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const cityList = useMemo(() => {
    const prov = PROVINCES.find(p => p.name === form.province);
    return prov ? prov.cities : [];
  }, [form.province]);

  const solarDetail = useMemo(() => calcTrueSolarDetail(form), [form]);

  const branch = useMemo(() => {
    if (form.unknownTime) return 0;
    if (solarDetail) return solarDetail.branch;
    return calcTrueSolarBranch(
      parseInt(form.clockHour) || 0,
      parseInt(form.clockMinute) || 0,
      form.longitude,
      form.utcOffsetMinutes ?? getProvinceUtcOffsetMinutes(form.province),
    );
  }, [form.clockHour, form.clockMinute, form.longitude, form.utcOffsetMinutes, form.province, form.unknownTime, solarDetail]);

  const utcOffsetMin = form.utcOffsetMinutes ?? getProvinceUtcOffsetMinutes(form.province);
  const utcHoursLabel = `UTC+${(utcOffsetMin / 60).toFixed(utcOffsetMin % 60 === 0 ? 0 : 1)}`;
  const shichenInfo = SHICHEN[branch];

  // ─── Kiểm tra hợp lệ ───────────────────────────────────
  const y = parseInt(form.year) || 0;
  const m = parseInt(form.month) || 0;
  const d = parseInt(form.day) || 0;

  const errors = {
    year: !form.year ? 'Vui lòng chọn năm sinh'
      : y < 1900 || y > 2026 ? 'Khoảng năm sinh: 1900–2026'
      : '',
    month: !form.month ? 'Vui lòng chọn tháng' : '',
    day: !form.day ? 'Vui lòng chọn ngày'
      : form.year && form.month && !isValidDate(y, m, d) ? `Tháng ${m} không có ngày ${d}`
      : '',
  };
  const hasError = Object.values(errors).some(Boolean);

  // ─── Thanh tiến độ ─────────────────────────────────────
  const steps = [
    !!form.year && !!form.month && !!form.day && !errors.year && !errors.month && !errors.day,
    !!form.province && !!form.city,
    form.unknownTime || (!!form.clockHour && !!form.clockMinute),
    true,
  ];

  // ─── Summary chip ──────────────────────────────────────
  const showSummary = steps[0] && steps[2] && !hasError;
  const summaryText = showSummary
    ? [
        `Ngày ${d}/${m}/${y}`,
        form.city || (form.province ? form.province : ''),
        form.unknownTime
          ? 'Không rõ giờ sinh'
          : `Giờ ${translateBranch(branch)}${solarDetail?.corrected ? ` (Thái Dương ${formatTrueSolarClock(solarDetail)})` : ''}`,
        form.gender === 'male' ? 'Nam' : 'Nữ',
      ].filter(Boolean).join(' · ')
    : '';

  const handleProvince = (prov: string) => {
    const provData = PROVINCES.find(p => p.name === prov);
    const firstCity = provData?.cities[0];
    const utcOffset = provData?.utcOffsetMinutes ?? 480;
    setForm({
      ...form,
      province: prov,
      city: firstCity?.name || '',
      longitude: firstCity?.longitude ?? (utcOffset === 420 ? 105.85 : 120),
      utcOffsetMinutes: utcOffset,
    });
  };

  const handleCity = (cityName: string) => {
    const prov = PROVINCES.find(p => p.name === form.province);
    const cityData = prov?.cities.find(c => c.name === cityName);
    const utcOffset = prov?.utcOffsetMinutes ?? 480;
    setForm({
      ...form,
      city: cityName,
      longitude: cityData?.longitude ?? (utcOffset === 420 ? 105.85 : 120),
      utcOffsetMinutes: utcOffset,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setTouched({ year: true, month: true, day: true });
    if (hasError) return;
    onFormSave?.({ ...form });
    // Luôn đi qua formToBirthInfo để đảm bảo chuẩn Chân Thái Dương Thời + đổi ngày Vãn Tý thời
    onSubmit(formToBirthInfo(form));
  };

  // ─── Style tokens ──────────────────────────────────────
  const bg = isDark ? 'rgba(8,16,40,0.85)' : 'rgba(255,255,255,0.92)';
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(200,160,60,0.2)';
  const labelClr = isDark ? 'rgba(180,200,225,0.9)' : 'rgba(120,80,10,0.55)';
  const inputBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,252,240,0.8)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(200,160,60,0.25)';
  const inputClr = isDark ? '#e8eef8' : '#2a1a00';
  const focusBorder = isDark ? 'rgba(212,168,67,0.5)' : 'rgba(180,120,20,0.5)';
  const errorClr = isDark ? '#f87171' : '#dc2626';
  const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,250,235,0.7)';
  const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(200,160,60,0.2)';
  const goldText = isDark ? '#d4a843' : '#7a5008';
  const summaryBg = isDark ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.07)';
  const summaryBorder = isDark ? 'rgba(37,99,235,0.35)' : 'rgba(37,99,235,0.25)';
  const summaryClr = isDark ? 'rgba(147,197,253,0.9)' : 'rgba(37,99,235,0.85)';

  const inputStyle: React.CSSProperties = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: inputClr,
    borderRadius: '14px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const errorInputStyle: React.CSSProperties = { ...inputStyle, borderColor: errorClr };
  const showErr = (field: string) => touched[field] || submitAttempted;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: bg, border: `1px solid ${border}`, borderRadius: '24px', padding: '28px', backdropFilter: 'blur(20px)' }}
    >
      <h3 style={{ color: goldText, fontSize: '12px', letterSpacing: '0.4em', textAlign: 'center', marginBottom: '20px', fontWeight: 500 }}>
        ── NHẬP THÔNG TIN SINH THẦN ──
      </h3>

      {/* Thanh tiến độ */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
        {steps.map((done, i) => (
          <motion.div
            key={i}
            animate={{ background: done ? (isDark ? '#d4a843' : '#b07820') : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(200,160,60,0.15)') }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, height: '2px', borderRadius: '2px' }}
          />
        ))}
      </div>

      {/* Họ tên */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Họ và tên (Tùy chọn)</label>
        <input
          type="text"
          placeholder="Nhập họ và tên..."
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = focusBorder; }}
          onBlur={e => { e.target.style.borderColor = inputBorder; }}
        />
      </div>

      {/* Ngày sinh Dương lịch */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Ngày sinh (Dương lịch)</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          <div>
            <select
              value={form.year}
              onChange={e => { setForm({ ...form, year: e.target.value }); setTouched(t => ({ ...t, year: true })); }}
              style={showErr('year') && errors.year ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Năm sinh</option>
              {YEAR_OPTIONS.map(yr => (
                <option key={yr} value={String(yr)}>{yr}</option>
              ))}
            </select>
            <FieldError msg={showErr('year') ? errors.year : ''} color={errorClr} />
          </div>
          <div>
            <select
              value={form.month}
              onChange={e => { setForm({ ...form, month: e.target.value }); setTouched(t => ({ ...t, month: true })); }}
              style={showErr('month') && errors.month ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Tháng</option>
              {MONTH_OPTIONS.map(mo => (
                <option key={mo} value={String(mo)}>Tháng {mo}</option>
              ))}
            </select>
            <FieldError msg={showErr('month') ? errors.month : ''} color={errorClr} />
          </div>
          <div>
            <select
              value={form.day}
              onChange={e => { setForm({ ...form, day: e.target.value }); setTouched(t => ({ ...t, day: true })); }}
              style={showErr('day') && errors.day ? errorInputStyle : inputStyle}
              required
            >
              <option value="">Ngày</option>
              {DAY_OPTIONS.map(dy => (
                <option key={dy} value={String(dy)}>Ngày {dy}</option>
              ))}
            </select>
            <FieldError msg={showErr('day') ? errors.day : ''} color={errorClr} />
          </div>
        </div>
      </div>

      {/* Nơi sinh (63 Tỉnh thành Việt Nam UTC+7 & khu vực lân cận) */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Nơi sinh (Hiệu chỉnh Chân Thái Dương Thời chuẩn kinh độ &amp; NOAA)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <select
            value={form.province}
            onChange={e => handleProvince(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">Không hiệu chỉnh (Giờ đồng hồ)</option>
            {PROVINCES.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
          <select
            value={form.city}
            onChange={e => handleCity(e.target.value)}
            disabled={!form.province}
            style={{ ...inputStyle, opacity: form.province ? 1 : 0.45 }}
            onFocus={e => { e.target.style.borderColor = focusBorder; }}
            onBlur={e => { e.target.style.borderColor = inputBorder; }}
          >
            <option value="">{form.province ? 'Tỉnh / Thành phố' : 'Chọn vùng trước'}</option>
            {cityList.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <AnimatePresence mode="wait">
          {form.province && solarDetail?.corrected ? (
            <motion.p
              key="location-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(180,210,235,0.85)' : 'rgba(100,70,10,0.65)', marginTop: '5px', lineHeight: 1.5 }}
            >
              {form.city || form.province} · {form.longitude.toFixed(2)}°E ({utcHoursLabel}) ·
              Lệch kinh độ {formatSignedMinutes(solarDetail.longitudeCorrectionMinutes)}p ·
              Phương trình mặt trời {formatSignedMinutes(solarDetail.equationOfTimeMinutes)}p ·
              Tổng <strong>{formatSignedMinutes(solarDetail.totalCorrectionMinutes)} phút</strong>
            </motion.p>
          ) : (
            <motion.p
              key="location-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.55)', marginTop: '5px' }}
            >
              * Đã hỗ trợ đủ 63 tỉnh thành Việt Nam (múi giờ UTC+7, kinh tuyến gốc 105°E) và công thức thiên văn NOAA.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Giờ sinh */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
          Giờ sinh (Giờ đồng hồ địa phương {utcHoursLabel})
        </label>
        <div style={{ borderRadius: '14px', padding: '12px', background: panelBg, border: `1px solid ${panelBorder}`, opacity: form.unknownTime ? 0.45 : 1, pointerEvents: form.unknownTime ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <select
              value={form.clockHour}
              onChange={e => setForm({ ...form, clockHour: e.target.value })}
              style={inputStyle}
            >
              {HOUR_OPTIONS.map(h => (
                <option key={h} value={String(h)}>{h.toString().padStart(2, '0')} giờ</option>
              ))}
            </select>
            <select
              value={form.clockMinute}
              onChange={e => setForm({ ...form, clockMinute: e.target.value })}
              style={inputStyle}
            >
              {MINUTE_OPTIONS.map(min => (
                <option key={min} value={String(min)}>{min.toString().padStart(2, '0')} phút</option>
              ))}
            </select>
          </div>
          {/* Kết quả Chân Thái Dương Thời */}
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ fontSize: '10px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.6)' }}>
              {solarDetail?.corrected ? `Chân Thái Dương Thời ${formatTrueSolarClock(solarDetail)} → ` : 'Canh giờ sinh → '}
            </span>
            <span style={{ fontSize: '15px', color: goldText, fontWeight: 600, letterSpacing: '0.08em' }}>
              Giờ {translateBranch(branch)}
            </span>
            {shichenInfo && (
              <span style={{ fontSize: '10px', color: isDark ? 'rgba(170,195,220,0.75)' : 'rgba(140,100,20,0.6)', marginLeft: '4px' }}>
                ({shichenInfo.range})
              </span>
            )}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.unknownTime}
            onChange={e => setForm({ ...form, unknownTime: e.target.checked })}
            style={{ width: '14px', height: '14px', borderRadius: '4px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '10px', color: isDark ? 'rgba(165,185,210,0.7)' : 'rgba(140,100,20,0.55)' }}>
            Không rõ giờ sinh, tạm an theo giờ Tý (23:00 – 01:00)
          </span>
        </label>
      </div>

      {/* Giới tính */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>Giới tính</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(['male', 'female'] as const).map(g => {
            const active = form.gender === g;
            const isMale = g === 'male';
            const accent = isMale ? '37,99,235' : '225,29,72';
            return (
              <motion.button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, gender: g })}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 500,
                  border: `1px solid ${active ? `rgba(${accent},0.6)` : inputBorder}`,
                  background: active ? `rgba(${accent},0.08)` : inputBg,
                  color: active ? `rgba(${accent},0.9)` : (isDark ? 'rgba(190,205,225,0.7)' : 'rgba(100,80,40,0.4)'),
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                }}
              >
                {isMale ? '♂ Nam' : '♀ Nữ'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Summary Chip */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div style={{
              background: summaryBg,
              border: `1px solid ${summaryBorder}`,
              borderRadius: '12px',
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ fontSize: '12px', color: summaryClr }}>✓</span>
              <span style={{ fontSize: '11px', color: summaryClr, letterSpacing: '0.03em', flex: 1 }}>
                {summaryText}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút lập lá số */}
      {!hideSubmit && (
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.01 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            background: loading
              ? (isDark ? 'rgba(212,168,67,0.15)' : 'rgba(180,120,20,0.15)')
              : (isDark
                ? 'linear-gradient(135deg, rgba(180,130,40,0.9), rgba(240,200,80,0.9))'
                : 'linear-gradient(135deg, #9a6210, #c88020)'),
            color: loading ? (isDark ? 'rgba(212,168,67,0.4)' : 'rgba(120,80,10,0.4)') : (isDark ? '#08080a' : '#fff8e8'),
            boxShadow: loading ? 'none' : (isDark ? '0 4px 20px rgba(212,168,67,0.2)' : '0 4px 16px rgba(140,100,20,0.25)'),
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%' }}
              />
              Đang an sao lập lá số…
            </span>
          ) : 'LẬP LÁ SỐ TỬ VI · KHAI MỞ MỆNH CÁCH'}
        </motion.button>
      )}
    </motion.form>
  );
}
