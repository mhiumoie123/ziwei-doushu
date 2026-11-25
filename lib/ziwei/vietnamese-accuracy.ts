/**
 * Hệ thống dữ liệu & thuật toán chuẩn xác Tử Vi Đẩu Số Việt Nam
 *
 * Bao gồm:
 * - 60 Lục Thập Hoa Giáp & Nạp Âm Bản Mệnh (chuẩn cổ thư)
 * - Tương quan Ngũ Hành Mệnh – Cục (sinh khắc)
 * - Vòng Tràng Sinh (12 sao theo Ngũ Hành Cục + Âm Dương Nam Nữ)
 * - Vòng Thái Tuế (12 sao Nam Phái chuẩn) & Vòng Bác Sĩ (12 sao)
 * - Tuần Trung Không Vong & Triệt Lộ Không Vong
 * - Lưu Niên Tiểu Hạn & 9 Sao Lưu Niên (Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Kình/Đà, Lưu Mã, Lưu Khốc/Hư, Lưu Tang/Hổ)
 */

import { LUCUN_TABLE, TIANMA_TABLE } from './constants';
import { boshiReverse, boshiShenByStem } from './shier-shen';
import { translateBranch, translateStem } from './vietnamese';

export type FiveElementVi = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface NapAmInfo {
  index: number;          // 0..59 (0 = Giáp Tý)
  canChi: string;         // e.g. 'Giáp Tý'
  napAm: string;          // e.g. 'Hải Trung Kim'
  meaning: string;        // e.g. 'Vàng trong biển'
  element: FiveElementVi; // 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'
}

/** 30 cặp Nạp Âm theo đúng thứ tự Lục Thập Hoa Giáp (mỗi cặp dùng cho 2 năm liên tiếp) */
const NAP_AM_PAIRS: ReadonlyArray<{
  napAm: string;
  meaning: string;
  element: FiveElementVi;
}> = [
  { napAm: 'Hải Trung Kim',    meaning: 'Vàng trong biển',         element: 'Kim' },
  { napAm: 'Lư Trung Hỏa',     meaning: 'Lửa trong lò',            element: 'Hỏa' },
  { napAm: 'Đại Lâm Mộc',      meaning: 'Gỗ rừng lớn',             element: 'Mộc' },
  { napAm: 'Lộ Bàng Thổ',      meaning: 'Đất ven đường',           element: 'Thổ' },
  { napAm: 'Kiếm Phong Kim',   meaning: 'Vàng mũi kiếm',           element: 'Kim' },
  { napAm: 'Sơn Đầu Hỏa',      meaning: 'Lửa trên đỉnh núi',       element: 'Hỏa' },
  { napAm: 'Giản Hạ Thủy',     meaning: 'Nước dưới khe',           element: 'Thủy' },
  { napAm: 'Thành Đầu Thổ',    meaning: 'Đất trên thành',          element: 'Thổ' },
  { napAm: 'Bạch Lạp Kim',     meaning: 'Vàng chân đèn',           element: 'Kim' },
  { napAm: 'Dương Liễu Mộc',   meaning: 'Gỗ cây dương liễu',       element: 'Mộc' },
  { napAm: 'Tuyền Trung Thủy', meaning: 'Nước trong suối',         element: 'Thủy' },
  { napAm: 'Ốc Thượng Thổ',    meaning: 'Đất trên mái nhà',        element: 'Thổ' },
  { napAm: 'Tích Lịch Hỏa',    meaning: 'Lửa sấm sét',             element: 'Hỏa' },
  { napAm: 'Tùng Bách Mộc',    meaning: 'Gỗ cây tùng bách',        element: 'Mộc' },
  { napAm: 'Trường Lưu Thủy',  meaning: 'Nước sông chảy dài',      element: 'Thủy' },
  { napAm: 'Sa Trung Kim',     meaning: 'Vàng trong cát',          element: 'Kim' },
  { napAm: 'Sơn Hạ Hỏa',       meaning: 'Lửa dưới chân núi',       element: 'Hỏa' },
  { napAm: 'Bình Địa Mộc',     meaning: 'Gỗ đồng bằng',            element: 'Mộc' },
  { napAm: 'Bích Thượng Thổ',  meaning: 'Đất trên vách tường',     element: 'Thổ' },
  { napAm: 'Kim Bạch Kim',     meaning: 'Vàng pha bạc sáng',       element: 'Kim' },
  { napAm: 'Phúc Đăng Hỏa',    meaning: 'Lửa ngọn đèn lớn',        element: 'Hỏa' },
  { napAm: 'Thiên Hà Thủy',    meaning: 'Nước mưa trên trời',      element: 'Thủy' },
  { napAm: 'Đại Trạch Thổ',    meaning: 'Đất nền nhà / đầm lớn',   element: 'Thổ' },
  { napAm: 'Thoa Xuyến Kim',   meaning: 'Vàng trang sức',          element: 'Kim' },
  { napAm: 'Tang Đố Mộc',      meaning: 'Gỗ cây dâu',              element: 'Mộc' },
  { napAm: 'Đại Khe Thủy',     meaning: 'Nước khe suối lớn',       element: 'Thủy' },
  { napAm: 'Sa Trung Thổ',     meaning: 'Đất pha cát',             element: 'Thổ' },
  { napAm: 'Thiên Thượng Hỏa', meaning: 'Lửa trên trời',           element: 'Hỏa' },
  { napAm: 'Thạch Lựu Mộc',    meaning: 'Gỗ cây thạch lựu',        element: 'Mộc' },
  { napAm: 'Đại Hải Thủy',     meaning: 'Nước biển lớn',           element: 'Thủy' },
];

/** Tính vị trí trong Lục Thập Hoa Giáp (0..59) từ Thiên Can (0..9) và Địa Chi (0..11) */
export function getSexagenaryIndex(stem: number, branch: number): number {
  const s = ((Math.trunc(stem) % 10) + 10) % 10;
  const b = ((Math.trunc(branch) % 12) + 12) % 12;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === s && i % 12 === b) return i;
  }
  return 0;
}

/** Tra Nạp Âm Bản Mệnh đầy đủ từ Can Chi năm sinh âm lịch */
export function getNapAm(yearStem: number, yearBranch: number): NapAmInfo {
  const idx = getSexagenaryIndex(yearStem, yearBranch);
  const pair = NAP_AM_PAIRS[Math.floor(idx / 2)] ?? NAP_AM_PAIRS[0];
  return {
    index: idx,
    canChi: `${translateStem(yearStem)} ${translateBranch(yearBranch)}`,
    napAm: pair.napAm,
    meaning: pair.meaning,
    element: pair.element,
  };
}

/** Ánh xạ số Cục (2,3,4,5,6) sang Ngũ Hành */
export function juToElement(wuxingJu: number): FiveElementVi {
  switch (wuxingJu) {
    case 2: return 'Thủy';
    case 3: return 'Mộc';
    case 4: return 'Kim';
    case 5: return 'Thổ';
    case 6: return 'Hỏa';
    default: return 'Mộc';
  }
}

const SHENG_MAP: Record<FiveElementVi, FiveElementVi> = {
  Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim', Kim: 'Thủy', Thủy: 'Mộc',
};

const KE_MAP: Record<FiveElementVi, FiveElementVi> = {
  Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim', Kim: 'Mộc',
};

export interface MenhCucRelation {
  label: string;
  detail: string;
  tone: 'great' | 'good' | 'neutral' | 'caution';
}

/** Đánh giá tương quan Ngũ Hành giữa Bản Mệnh (Nạp Âm) và Ngũ Hành Cục */
export function getMenhCucRelation(menhElement: FiveElementVi, wuxingJu: number): MenhCucRelation {
  const cucElement = juToElement(wuxingJu);
  if (menhElement === cucElement) {
    return {
      label: 'Mệnh Cục Tỷ Hòa',
      detail: `Bản mệnh (${menhElement}) và Cục (${cucElement}) đồng hành, dễ hòa nhập hoàn cảnh và phát triển thuận lợi.`,
      tone: 'good',
    };
  }
  if (SHENG_MAP[cucElement] === menhElement) {
    return {
      label: 'Cục sinh Mệnh (Rất tốt)',
      detail: `Cục (${cucElement}) sinh Bản mệnh (${menhElement}): hoàn cảnh, thời thế nâng đỡ, ít vất vả mà dễ thành tựu.`,
      tone: 'great',
    };
  }
  if (SHENG_MAP[menhElement] === cucElement) {
    return {
      label: 'Mệnh sinh Cục',
      detail: `Bản mệnh (${menhElement}) sinh Cục (${cucElement}): thường phải bỏ tâm sức cống hiến cho hoàn cảnh trước rồi mới gặt hái.`,
      tone: 'neutral',
    };
  }
  if (KE_MAP[menhElement] === cucElement) {
    return {
      label: 'Mệnh khắc Cục',
      detail: `Bản mệnh (${menhElement}) khắc Cục (${cucElement}): có ý chí làm chủ hoàn cảnh, trải qua thử thách rồi tự tạo dựng cơ đồ.`,
      tone: 'neutral',
    };
  }
  return {
    label: 'Cục khắc Mệnh',
    detail: `Cục (${cucElement}) khắc Bản mệnh (${menhElement}): hoàn cảnh hay tạo áp lực, cần bền chí tu dưỡng và chọn môi trường phù hợp.`,
    tone: 'caution',
  };
}

// ─── Vòng Tràng Sinh 12 sao ───────────────────────────────────────────────
export const TRANG_SINH_NAMES = [
  'Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
  'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng',
] as const;

/** Cung khởi Tràng Sinh theo Ngũ Hành Cục (Thủy/Thổ=Thân(8), Mộc=Hợi(11), Kim=Tỵ(5), Hỏa=Dần(2)) */
const TRANG_SINH_START_BY_JU: Record<number, number> = {
  2: 8,  // Thủy Nhị Cục → Thân
  5: 8,  // Thổ Ngũ Cục → Thân
  3: 11, // Mộc Tam Cục → Hợi
  4: 5,  // Kim Tứ Cục → Tỵ
  6: 2,  // Hỏa Lục Cục → Dần
};

/** Trả về mảng 12 phần tử theo chỉ số địa chi 0..11 → tên sao Vòng Tràng Sinh */
export function getTrangSinhMap(
  wuxingJu: number,
  yearStem: number,
  gender: 'male' | 'female',
): Record<number, string> {
  const start = TRANG_SINH_START_BY_JU[wuxingJu] ?? 8;
  const reverse = boshiReverse(yearStem, gender); // Dương Nam Âm Nữ thuận, Âm Nam Dương Nữ nghịch
  const map: Record<number, string> = {};
  for (let i = 0; i < 12; i++) {
    const branch = reverse ? (start - i + 12) % 12 : (start + i) % 12;
    map[branch] = TRANG_SINH_NAMES[i];
  }
  return map;
}

// ─── Vòng Thái Tuế 12 sao (chuẩn Nam Phái Việt Nam) ───────────────────────
export const VONG_THAI_TUE_NAMES = [
  'Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù',
  'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù',
] as const;

export function getVongThaiTueMap(yearBranch: number): Record<number, string> {
  const b = ((Math.trunc(yearBranch) % 12) + 12) % 12;
  const map: Record<number, string> = {};
  for (let i = 0; i < 12; i++) {
    map[(b + i) % 12] = VONG_THAI_TUE_NAMES[i];
  }
  return map;
}

// ─── Vòng Bác Sĩ 12 sao ───────────────────────────────────────────────────
export const VONG_BAC_SI_NAMES = [
  'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư',
  'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ',
] as const;

export function getVongBacSiMap(yearStem: number, gender: 'male' | 'female'): Record<number, string> {
  const indices = boshiShenByStem(yearStem, gender);
  const map: Record<number, string> = {};
  for (let branch = 0; branch < 12; branch++) {
    map[branch] = VONG_BAC_SI_NAMES[indices[branch]];
  }
  return map;
}

// ─── Tuần Trung Không Vong & Triệt Lộ Không Vong ──────────────────────────
export interface TuanTrietInfo {
  tuan: [number, number];  // 2 địa chi bị Tuần án ngữ
  triet: [number, number]; // 2 địa chi bị Triệt án ngữ
}

const TRIET_BY_STEM: Record<number, [number, number]> = {
  0: [8, 9], 5: [8, 9], // Giáp, Kỷ → Thân, Dậu
  1: [6, 7], 6: [6, 7], // Ất, Canh → Ngọ, Mùi
  2: [4, 5], 7: [4, 5], // Bính, Tân → Thìn, Tỵ
  3: [2, 3], 8: [2, 3], // Đinh, Nhâm → Dần, Mão
  4: [0, 1], 9: [0, 1], // Mậu, Quý → Tý, Sửu
};

export function getTuanTriet(yearStem: number, yearBranch: number): TuanTrietInfo {
  const s = ((Math.trunc(yearStem) % 10) + 10) % 10;
  const b = ((Math.trunc(yearBranch) % 12) + 12) % 12;
  // Cung Giáp khởi đầu tuần của năm sinh = (yearBranch - yearStem) mod 12
  // 2 cung Tuần Không Vong là 2 cung cuối tuần = (giapBranch + 10) và (giapBranch + 11)
  const giapBranch = ((b - s) % 12 + 12) % 12;
  const tuan: [number, number] = [(giapBranch + 10) % 12, (giapBranch + 11) % 12];
  const triet: [number, number] = TRIET_BY_STEM[s] ?? [8, 9];
  return { tuan, triet };
}

// ─── Tiểu Hạn & 9 Sao Lưu Niên (Lưu Tinh) ─────────────────────────────────
/**
 * Khởi cung Tiểu Hạn theo Tam Hợp Địa Chi năm sinh (chuẩn Nam Phái):
 * - Dần(2), Ngọ(6), Tuất(10) → khởi Thìn(4)
 * - Thân(8), Tý(0), Thìn(4) → khởi Tuất(10)
 * - Tỵ(5), Dậu(9), Sửu(1) → khởi Mùi(7)
 * - Hợi(11), Mão(3), Mùi(7) → khởi Sửu(1)
 * Nam đi thuận, Nữ đi nghịch từ Chi năm sinh tới Chi năm xem hạn.
 */
export function getTieuHanBranch(
  birthYearBranch: number,
  gender: 'male' | 'female',
  targetYear: number,
): number {
  const birthB = ((Math.trunc(birthYearBranch) % 12) + 12) % 12;
  const targetB = ((Math.trunc(targetYear) - 4) % 12 + 12) % 12;
  let startBranch = 10;
  if (birthB === 2 || birthB === 6 || birthB === 10) startBranch = 4;      // Thìn
  else if (birthB === 8 || birthB === 0 || birthB === 4) startBranch = 10; // Tuất
  else if (birthB === 5 || birthB === 9 || birthB === 1) startBranch = 7;  // Mùi
  else startBranch = 1;                                                    // Sửu

  const steps = ((targetB - birthB) % 12 + 12) % 12;
  return gender === 'male'
    ? (startBranch + steps) % 12
    : ((startBranch - steps) % 12 + 12) % 12;
}

export interface LuuNienStar {
  name: string;
  shortName: string;
  nature: 'lucky' | 'sha' | 'neutral';
}

export interface LuuNienOverlay {
  year: number;
  stem: number;
  branch: number;
  canChi: string;
  luuThaiTueBranch: number;
  tieuHanBranch: number;
  /** branch (0..11) -> danh sách sao lưu đóng tại cung đó */
  starsByBranch: Record<number, LuuNienStar[]>;
}

/** Tính đầy đủ 9 sao Lưu Niên chuẩn Nam Phái Việt Nam cho năm xem hạn */
export function getLuuNienOverlay(
  targetYear: number,
  birthYearBranch: number,
  gender: 'male' | 'female',
): LuuNienOverlay {
  const stem = ((Math.trunc(targetYear) - 4) % 10 + 10) % 10;
  const branch = ((Math.trunc(targetYear) - 4) % 12 + 12) % 12;
  const starsByBranch: Record<number, LuuNienStar[]> = {};
  const add = (b: number, star: LuuNienStar) => {
    const key = ((b % 12) + 12) % 12;
    if (!starsByBranch[key]) starsByBranch[key] = [];
    starsByBranch[key].push(star);
  };

  const locTonBranch = LUCUN_TABLE[stem] ?? 2;
  const thienMaBranch = TIANMA_TABLE[branch] ?? 8;
  const tangMonBranch = (branch + 2) % 12;
  const bachHoBranch = (tangMonBranch + 6) % 12;
  const thienKhocBranch = (6 - branch + 12) % 12; // Ngọ(6) đi nghịch
  const thienHuBranch = (6 + branch) % 12;        // Ngọ(6) đi thuận

  add(branch, { name: 'Lưu Thái Tuế', shortName: 'L.Thái Tuế', nature: 'neutral' });
  add(locTonBranch, { name: 'Lưu Lộc Tồn', shortName: 'L.Lộc Tồn', nature: 'lucky' });
  add((locTonBranch + 1) % 12, { name: 'Lưu Kình Dương', shortName: 'L.Kình Dương', nature: 'sha' });
  add((locTonBranch + 11) % 12, { name: 'Lưu Đà La', shortName: 'L.Đà La', nature: 'sha' });
  add(thienMaBranch, { name: 'Lưu Thiên Mã', shortName: 'L.Thiên Mã', nature: 'lucky' });
  add(tangMonBranch, { name: 'Lưu Tang Môn', shortName: 'L.Tang Môn', nature: 'sha' });
  add(bachHoBranch, { name: 'Lưu Bạch Hổ', shortName: 'L.Bạch Hổ', nature: 'sha' });
  add(thienKhocBranch, { name: 'Lưu Thiên Khốc', shortName: 'L.Thiên Khốc', nature: 'sha' });
  add(thienHuBranch, { name: 'Lưu Thiên Hư', shortName: 'L.Thiên Hư', nature: 'sha' });

  return {
    year: targetYear,
    stem,
    branch,
    canChi: `${translateStem(stem)} ${translateBranch(branch)}`,
    luuThaiTueBranch: branch,
    tieuHanBranch: getTieuHanBranch(birthYearBranch, gender, targetYear),
    starsByBranch,
  };
}

/** Dịch cặp Can Chi tiếng Hán (vd '甲子') sang Tiếng Việt ('Giáp Tý') */
export function translateGanZhi(gz?: string): string {
  if (!gz || gz.length < 2) return gz ?? '';
  return `${translateStem(gz[0])} ${translateBranch(gz[1])}`;
}
