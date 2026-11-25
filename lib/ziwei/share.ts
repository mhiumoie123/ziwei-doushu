import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';
import { getProvinceUtcOffsetMinutes } from './cities';
import {
  branchFromSolarMinutes,
  calculateTrueSolarTime,
  resolveZiweiDayOffset,
  shiftGregorianDate,
  type TrueSolarTimeResult,
} from './true-solar-time';

/**
 * Tính Chi giờ sinh theo Chân Thái Dương Thời (0-11).
 * - Hỗ trợ đúng múi giờ chuẩn của khu vực (Việt Nam = 420 phút / 105°E; Trung Quốc = 480 phút / 120°E).
 * - Khi có ngày sinh & địa điểm cụ thể, cộng thêm Phương trình thời gian NOAA (Equation of Time ±16 phút).
 */
export function calcTrueSolarBranch(
  clockHour: number,
  clockMinute: number,
  longitude: number,
  utcOffsetMinutes = 480,
  date?: { year: number; month: number; day: number },
): number {
  if (date && date.year > 0 && date.month > 0 && date.day > 0) {
    return calculateTrueSolarTime({
      year: date.year,
      month: date.month,
      day: date.day,
      clockHour,
      clockMinute,
      longitude,
      utcOffsetMinutes,
    }).branch;
  }
  const meridian = utcOffsetMinutes / 4;
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - meridian) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  return branchFromSolarMinutes(solar);
}

/** Tính chi tiết Chân Thái Dương Thời (bao gồm lệch kinh độ + phương trình thời gian NOAA) */
export function calcTrueSolarDetail(form: BirthFormState): TrueSolarTimeResult | null {
  if (form.unknownTime) return null;
  const y = parseInt(form.year) || 2000;
  const m = parseInt(form.month) || 1;
  const d = parseInt(form.day) || 1;
  const clockHour = parseInt(form.clockHour) || 0;
  const clockMinute = parseInt(form.clockMinute) || 0;
  const utcOffsetMinutes = form.utcOffsetMinutes ?? getProvinceUtcOffsetMinutes(form.province);
  const hasLocation = !!form.province;

  return calculateTrueSolarTime({
    year: y,
    month: m,
    day: d,
    clockHour,
    clockMinute,
    longitude: hasLocation ? form.longitude : undefined,
    utcOffsetMinutes,
  });
}

/**
 * BirthFormState → BirthInfo
 *
 * Quy tắc giờ Tý (chuẩn hệ thống Nghê Hải Hà / Tam Hợp Phái):
 * · 23:00–23:59 = Vãn Tý thời (Tý muộn) → đổi sang ngày hôm sau (+1 ngày)
 * · 00:00–00:59 = Tảo Tý thời (Tý sớm) → giữ nguyên ngày sinh
 * · Đổi ngày dựa trên Chân Thái Dương Thời (đúng múi giờ UTC+7 cho VN / UTC+8 cho TQ + NOAA EoT khi có địa điểm).
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  const origY = parseInt(form.year) || 0;
  const origM = parseInt(form.month) || 0;
  const origD = parseInt(form.day) || 0;
  const clockHour = parseInt(form.clockHour) || 0;
  const clockMinute = parseInt(form.clockMinute) || 0;

  let y = origY;
  let m = origM;
  let d = origD;
  let hour = 0;

  const utcOffsetMinutes = form.utcOffsetMinutes ?? getProvinceUtcOffsetMinutes(form.province);

  if (!form.unknownTime) {
    if (form.province && origY > 0 && origM > 0 && origD > 0) {
      // Có địa điểm → dùng đầy đủ tính toán Chân Thái Dương Thời (Kinh độ đúng múi giờ + NOAA Equation of Time)
      const tst = calculateTrueSolarTime({
        year: origY,
        month: origM,
        day: origD,
        clockHour,
        clockMinute,
        longitude: form.longitude,
        utcOffsetMinutes,
      });
      hour = tst.branch;
      const dayOffset = resolveZiweiDayOffset(tst);
      if (dayOffset !== 0) {
        ({ year: y, month: m, day: d } = shiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
      }
    } else {
      // Không chọn địa điểm → giữ nguyên giờ đồng hồ chuẩn (không trừ kinh độ hay EoT)
      const meridian = utcOffsetMinutes / 4;
      const lonOffset = form.province ? (form.longitude - meridian) * 4 : 0;
      const solar = clockHour * 60 + clockMinute + lonOffset;
      const normalizedMinutes = ((solar % 1440) + 1440) % 1440;
      hour = branchFromSolarMinutes(normalizedMinutes);
      const dayOffset = resolveZiweiDayOffset({
        dayOffset: Math.floor(solar / 1440),
        normalizedMinutes,
        branch: hour,
      });
      if (dayOffset !== 0 && y > 0 && m > 0 && d > 0) {
        ({ year: y, month: m, day: d } = shiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
      }
    }
  }

  return {
    year: y,
    month: m,
    day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
    origInput: !form.unknownTime && origY > 0 && origM > 0 && origD > 0
      ? { year: origY, month: origM, day: origD, clockHour, clockMinute }
      : undefined,
  };
}

/** BirthFormState → URLSearchParams (dùng cho liên kết chia sẻ lá số) */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.province && Number.isFinite(form.longitude)) p.set('lo', String(form.longitude));
  const tz = form.utcOffsetMinutes ?? getProvinceUtcOffsetMinutes(form.province);
  if (tz !== 480) p.set('tz', String(tz));
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>, trả về null nếu thiếu ngày sinh */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  const province = params.get('p') || '';
  const tzRaw = params.get('tz');
  const utcOffsetMinutes = tzRaw !== null && Number.isFinite(Number(tzRaw))
    ? Number(tzRaw)
    : getProvinceUtcOffsetMinutes(province);

  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    province,
    city: params.get('c') || '',
    longitude: parseFloat(params.get('lo') || (utcOffsetMinutes === 420 ? '105.85' : '120')),
    utcOffsetMinutes,
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}
