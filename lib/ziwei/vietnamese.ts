/**
 * Hệ thống thuật ngữ và bộ chuyển ngữ Tử Vi Đẩu Số sang Tiếng Việt
 * Chuẩn hóa theo các thư tịch cổ điển: Tử Vi Đẩu Số Toàn Thư, Toàn Tập, Cốt Tủy Phú
 */

// 1. Thập Tứ Chính Tinh (14 Major Stars)
export const VI_MAJOR_STARS: Record<string, string> = {
  '紫微': 'Tử Vi',
  '天机': 'Thiên Cơ',
  '太阳': 'Thái Dương',
  '武曲': 'Vũ Khúc',
  '天同': 'Thiên Đồng',
  '廉贞': 'Liêm Trinh',
  '天府': 'Thiên Phủ',
  '太阴': 'Thái Âm',
  '贪狼': 'Tham Lang',
  '巨门': 'Cự Môn',
  '天相': 'Thiên Tướng',
  '天梁': 'Thiên Lương',
  '七杀': 'Thất Sát',
  '破军': 'Phá Quân',
};

// 2. Phụ Tinh, Cát Tinh, Sát Tinh, Tạp Diệu (Auxiliary, Lucky, Sha, Minor Stars)
export const VI_MINOR_STARS: Record<string, string> = {
  // Lục Cát Tinh & Phụ tinh trọng yếu
  '左辅': 'Tả Phù',
  '右弼': 'Hữu Bật',
  '文昌': 'Văn Xương',
  '文曲': 'Văn Khúc',
  '天魁': 'Thiên Khôi',
  '天钺': 'Thiên Việt',
  '禄存': 'Lộc Tồn',
  '天马': 'Thiên Mã',

  // Lục Sát Tinh
  '擎羊': 'Kình Dương',
  '陀罗': 'Đà La',
  '火星': 'Hỏa Tinh',
  '铃星': 'Linh Tinh',
  '地空': 'Địa Không',
  '地劫': 'Địa Kiếp',

  // Hình, Diêu, Khốc, Hư, Đào, Hồng, Hỷ
  '天刑': 'Thiên Hình',
  '天姚': 'Thiên Diêu',
  '天哭': 'Thiên Khốc',
  '天虚': 'Thiên Hư',
  '红鸾': 'Hồng Loan',
  '天喜': 'Thiên Hỷ',
  '咸池': 'Hàm Trì (Đào Hoa)',
  '天德': 'Thiên Đức',
  '月德': 'Nguyệt Đức',
  '解神': 'Giải Thần',
  '天巫': 'Thiên Vu',
  '天月': 'Thiên Nguyệt',
  '阴煞': 'Âm Sát',
  '劫煞': 'Kiếp Sát',
  '大耗': 'Đại Hao',
  '小耗': 'Tiểu Hao',
  '孤辰': 'Cô Thần',
  '寡宿': 'Quả Tú',
  '蜚廉': 'Phi Liêm',
  '破碎': 'Phá Toái',
  '华盖': 'Hoa Cái',
  '龙池': 'Long Trì',
  '凤阁': 'Phượng Các',
  '天官': 'Thiên Quan',
  '天福': 'Thiên Phúc',
  '天才': 'Thiên Tài',
  '天寿': 'Thiên Thọ',
  '恩光': 'Ân Quang',
  '天贵': 'Thiên Quý',
  '台辅': 'Thai Phụ',
  '封诰': 'Phong Cáo',
  '三台': 'Tam Thai',
  '八座': 'Bát Tọa',
  '旬空': 'Tuần Không',
  '截空': 'Triệt Không',
  '副旬': 'Phó Tuần',
  '副截': 'Phó Triệt',
  '天伤': 'Thiên Thương',
  '天使': 'Thiên Sứ',

  // Bác Sĩ Thập Nhị Thần
  '博士': 'Bác Sĩ',
  '力士': 'Lực Sĩ',
  '青龙': 'Thanh Long',
  '将军': 'Tướng Quân',
  '奏书': 'Tấu Thư',
  '飞廉': 'Phi Liêm',
  '喜神': 'Hỷ Thần',
  '病符': 'Bệnh Phù',
  '伏兵': 'Phục Binh',
  '官府': 'Quan Phủ',

  // Tràng Sinh Thập Nhị Thần
  '长生': 'Tràng Sinh',
  '沐浴': 'Mộc Dục',
  '冠带': 'Quan Đới',
  '临官': 'Lâm Quan',
  '帝旺': 'Đế Vượng',
  '衰': 'Suy',
  '病': 'Bệnh',
  '死': 'Tử',
  '墓': 'Mộ',
  '绝': 'Tuyệt',
  '胎': 'Thai',
  '养': 'Dưỡng',

  // Tướng Tinh / Tuế Tiền Thập Nhị Thần
  '太岁': 'Thái Tuế',
  '晦气': 'Hối Khí',
  '丧门': 'Tang Môn',
  '贯索': 'Quán Sách',
  '官符': 'Quan Phù',
  '龙德': 'Long Đức',
  '白虎': 'Bạch Hổ',
  '吊客': 'Điếu Khách',
  '将星': 'Tướng Tinh',
  '攀鞍': 'Phàn An',
  '岁驾': 'Tuế Giá',
  '息神': 'Tức Thần',
  '灾煞': 'Tai Sát',
  '天煞': 'Thiên Sát',
  '指背': 'Chỉ Bối',
  '月煞': 'Nguyệt Sát',
  '亡神': 'Vong Thần',
  '岁驿': 'Tuế Dịch',
  '岁建': 'Tuế Kiến',
  '岁破': 'Tuế Phá',
};

// 3. Thập Nhị Cung (12 Palaces)
export const VI_PALACES: Record<string, string> = {
  '命宫': 'Mệnh Cung',
  '兄弟宫': 'Huynh Đệ',
  '夫妻宫': 'Phu Thê',
  '子女宫': 'Tử Tức',
  '财帛宫': 'Tài Bạch',
  '疾厄宫': 'Tật Ách',
  '迁移宫': 'Thiên Di',
  '交友宫': 'Nô Bộc',
  '官禄宫': 'Quan Lộc',
  '田宅宫': 'Điền Trạch',
  '福德宫': 'Phúc Đức',
  '父母宫': 'Phụ Mẫu',
  '身宫': 'Thân Cung',
};

// 4. Tứ Hóa (Four Mutagens)
export const VI_SIHUA: Record<string, string> = {
  '禄': 'Hóa Lộc',
  '权': 'Hóa Quyền',
  '科': 'Hóa Khoa',
  '忌': 'Hóa Kỵ',
  '化禄': 'Hóa Lộc',
  '化权': 'Hóa Quyền',
  '化科': 'Hóa Khoa',
  '化忌': 'Hóa Kỵ',
};

export const VI_SIHUA_SHORT: Record<string, string> = {
  '禄': 'Lộc',
  '权': 'Quyền',
  '科': 'Khoa',
  '忌': 'Kỵ',
  '化禄': 'Lộc',
  '化权': 'Quyền',
  '化科': 'Khoa',
  '化忌': 'Kỵ',
};

// 5. Ngũ Hành Cục (Five Elements & Bureaus)
export const VI_JU_NAMES: Record<string, string> = {
  '水二局': 'Thủy Nhị Cục (2)',
  '木三局': 'Mộc Tam Cục (3)',
  '金四局': 'Kim Tứ Cục (4)',
  '土五局': 'Thổ Ngũ Cục (5)',
  '火六局': 'Hỏa Lục Cục (6)',
};

// 6. Ngũ Hành (Elements)
export const VI_ELEMENTS: Record<string, string> = {
  '金': 'Kim',
  '木': 'Mộc',
  '水': 'Thủy',
  '火': 'Hỏa',
  '土': 'Thổ',
};

// 7. Thiên Can (Heavenly Stems)
export const VI_STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const ZH_TO_VI_STEM: Record<string, string> = {
  '甲': 'Giáp', '乙': 'Ất', '丙': 'Bính', '丁': 'Đinh', '戊': 'Mậu',
  '己': 'Kỷ', '庚': 'Canh', '辛': 'Tân', '壬': 'Nhâm', '癸': 'Quý',
};

// 8. Địa Chi (Earthly Branches)
export const VI_BRANCHES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
export const ZH_TO_VI_BRANCH: Record<string, string> = {
  '子': 'Tý', '丑': 'Sửu', '寅': 'Dần', '卯': 'Mão', '辰': 'Thìn', '巳': 'Tỵ',
  '午': 'Ngọ', '未': 'Mùi', '申': 'Thân', '酉': 'Dậu', '戌': 'Tuất', '亥': 'Hợi',
};

// 9. Độ Sáng Tinh Diệu (Star Brightness)
export const VI_BRIGHTNESS: Record<string, { short: string; full: string }> = {
  '庙': { short: 'M', full: 'Miếu địa' },
  '旺': { short: 'V', full: 'Vượng địa' },
  '得': { short: 'Đ', full: 'Đắc địa' },
  '利': { short: 'L', full: 'Lợi địa' },
  '平': { short: 'B', full: 'Bình hòa' },
  '不': { short: 'H', full: 'Bất đắc' },
  '陷': { short: 'H', full: 'Hãm địa' },
};

// 10. Giờ sinh (12 Shichen)
export const VI_SHICHEN = [
  { branch: 0, name: 'Giờ Tý', range: '23:00 - 01:00' },
  { branch: 1, name: 'Giờ Sửu', range: '01:00 - 03:00' },
  { branch: 2, name: 'Giờ Dần', range: '03:00 - 05:00' },
  { branch: 3, name: 'Giờ Mão', range: '05:00 - 07:00' },
  { branch: 4, name: 'Giờ Thìn', range: '07:00 - 09:00' },
  { branch: 5, name: 'Giờ Tỵ', range: '09:00 - 11:00' },
  { branch: 6, name: 'Giờ Ngọ', range: '11:00 - 13:00' },
  { branch: 7, name: 'Giờ Mùi', range: '13:00 - 15:00' },
  { branch: 8, name: 'Giờ Thân', range: '15:00 - 17:00' },
  { branch: 9, name: 'Giờ Dậu', range: '17:00 - 19:00' },
  { branch: 10, name: 'Giờ Tuất', range: '19:00 - 21:00' },
  { branch: 11, name: 'Giờ Hợi', range: '21:00 - 23:00' },
];

// Helper Functions
export function translateStarName(name: string): string {
  return VI_MAJOR_STARS[name] || VI_MINOR_STARS[name] || name;
}

export function translatePalaceName(name: string): string {
  return VI_PALACES[name] || name;
}

export function translateSiHua(sihua?: string, short = false): string {
  if (!sihua) return '';
  return short ? (VI_SIHUA_SHORT[sihua] || sihua) : (VI_SIHUA[sihua] || sihua);
}

export function translateBrightness(b?: string, full = false): string {
  if (!b) return '';
  const item = VI_BRIGHTNESS[b];
  if (!item) return b;
  return full ? item.full : item.short;
}

export function translateStem(stem: string | number): string {
  if (typeof stem === 'number') return VI_STEMS[stem] || String(stem);
  return ZH_TO_VI_STEM[stem] || stem;
}

export function translateBranch(branch: string | number): string {
  if (typeof branch === 'number') return VI_BRANCHES[branch] || String(branch);
  return ZH_TO_VI_BRANCH[branch] || branch;
}

export function translateJu(ju: string): string {
  return VI_JU_NAMES[ju] || ju;
}


// 11. Các Đại Cách Cục Tử Vi Đẩu Số (Classical Patterns)
export const VI_PATTERNS: Record<string, { name: string; desc: string }> = {
  '君臣庆会': {
    name: 'Quân Thần Khánh Hội Cách',
    desc: 'Tử Vi ngộ Tả Phù Hữu Bật, Văn Xương Văn Khúc triều củng; như bậc minh quân có hiền thần phò tá, chủ cực quý hiển đạt.',
  },
  '紫府同宫': {
    name: 'Tử Phủ Đồng Cung Cách',
    desc: 'Tử Vi và Thiên Phủ cùng đóng tại Dần Thân, nhật nguyệt tịnh minh kẹp cung; phúc lộc trọn vẹn, phú quý song toàn.',
  },
  '府相朝垣': {
    name: 'Phủ Tướng Triều Viên Cách',
    desc: 'Thiên Phủ và Thiên Tướng hội chiếu tại Tam phương tứ chính; thực lộc vạn chung, công danh sự nghiệp vững vàng.',
  },
  '阳梁昌禄': {
    name: 'Dương Lương Xương Lộc Cách',
    desc: 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn hội tụ; thi cử đỗ đầu bảng vàng, danh tiếng vang lừng bốn phương.',
  },
  '武贪格': {
    name: 'Vũ Tham Đồng Hành Cách',
    desc: 'Vũ Khúc cùng Tham Lang tại Sửu Mùi; tiền bần hậu phú, trung niên phát đạt vượt bậc, bạo phát tài lộc.',
  },
  '杀破狼': {
    name: 'Sát Phá Tham Cách (Sát Phá Lang)',
    desc: 'Thất Sát, Phá Quân, Tham Lang tương hội; đời người biến động lớn, tính cách quật cường, khai sáng sự nghiệp.',
  },
  '机月同梁': {
    name: 'Cơ Nguyệt Đồng Lương Cách',
    desc: 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội chiếu; phong thái nho nhã, thích hợp phò tá, hành chính sự nghiệp.',
  },
  '廉贞天相格': {
    name: 'Liêm Trinh Thiên Tướng Cách',
    desc: 'Liêm Trinh cùng Thiên Tướng tại Tý Ngọ; hóa hung vi cát, thành cách hành chính ấn thụ, nắm giữ quyền bính.',
  },
  '武曲七杀': {
    name: 'Vũ Khúc Thất Sát Cách',
    desc: 'Vũ Khúc cùng Thất Sát tại Mão Dậu; tướng tài quả cảm, quyền uy hiển hách, thích hợp nghiệp võ, kinh doanh lớn.',
  },
  '天同天梁格': {
    name: 'Thiên Đồng Thiên Lương Cách',
    desc: 'Thiên Đồng cùng Thiên Lương tại Dần Thân; phúc ấm thâm sâu, an nhàn hưởng phúc, đời sống thanh cao.',
  },
  '日月同宫': {
    name: 'Nhật Nguyệt Đồng Cung Cách',
    desc: 'Thái Dương cùng Thái Âm đồng tọa Sửu Mùi; âm dương điều hòa, gặp cát tinh nâng đỡ thì danh lợi song thu.',
  },
  '日月夹命': {
    name: 'Nhật Nguyệt Giáp Mệnh Cách',
    desc: 'Mệnh cung an tại Sửu Mùi, được Thái Dương và Thái Âm kẹp hai bên; chủ một đời vinh hiển, quý nhân nâng đỡ.',
  },
  '巨日同宫': {
    name: 'Cự Nhật Đồng Cung Cách',
    desc: 'Cự Môn cùng Thái Dương tại Dần Thân; chủ danh vang xa xứ, tài hùng biện xuất sắc, phát triển lớn nơi đất khách.',
  },
  '石中隐玉': {
    name: 'Thạch Trung Ẩn Ngọc Cách',
    desc: 'Cự Môn tọa Mệnh tại Tý Ngọ ngộ Hóa Lộc hoặc Hóa Quyền; như ngọc ẩn trong đá, tài hoa phát tiết muộn mà rực rỡ.',
  },
  '明珠出海': {
    name: 'Minh Châu Xuất Hải Cách',
    desc: 'Mệnh Vô Chính Diệu tại Mùi, Nhật Mão Nguyệt Hợi chiếu về; như ngọc sáng nhô lên khỏi mặt biển, đại phú đại quý.',
  },
  '紫微入命': {
    name: 'Tử Vi Độc Tọa Nhập Mệnh',
    desc: 'Đế tinh thủ Mệnh, bẩm sinh có khí phách lãnh đạo; nếu ngộ cát tinh phò tá tất làm nên đại nghiệp.',
  },
  '辅弼夹命': {
    name: 'Tả Hữu Giáp Mệnh Cách',
    desc: 'Tả Phù và Hữu Bật kẹp hai bên cung Mệnh; cả đời đi đâu cũng có quý nhân nâng đỡ, hóa hiểm thành an.',
  },
  '昌曲夹命': {
    name: 'Xương Khúc Giáp Mệnh Cách',
    desc: 'Văn Xương và Văn Khúc kẹp hai bên cung Mệnh; chủ khí chất tao nhã, thông tuệ văn chương, thi cử hanh thông.',
  },
  '魁钺夹命': {
    name: 'Khôi Việt Giáp Mệnh Cách',
    desc: 'Thiên Khôi và Thiên Việt kẹp cung Mệnh; quý khí ngập tràn, thường gặp cấp trên đề bạt, cơ hội rộng mở.',
  },
  '双禄朝垣': {
    name: 'Song Lộc Triều Viên Cách',
    desc: 'Lộc Tồn và Hóa Lộc hội chiếu về cung Mệnh hoặc Tài Quan; tiền tài hanh thông, cự phú chi cách.',
  },
  '三奇加会': {
    name: 'Tam Kỳ Giai Hội Cách',
    desc: 'Hóa Lộc, Hóa Quyền, Hóa Khoa đồng hội tại Tam phương tứ chính; chí hướng phi phàm, danh lợi tột đỉnh.',
  },
  '羊陀夹忌': {
    name: 'Dương Đà Hiệp Kỵ Cách',
    desc: 'Kình Dương và Đà La kẹp sao Hóa Kỵ; gặp nạn khó khăn trắc trở, cần giữ tâm ngay thẳng để vượt qua sóng gió.',
  },
  '火铃夹命': {
    name: 'Hỏa Linh Giáp Mệnh Cách',
    desc: 'Hỏa Tinh và Linh Tinh kẹp cung Mệnh; tính tình nóng vội, phòng tai nạn hoặc trắc trở bất ngờ.',
  },
  '空劫夹命': {
    name: 'Không Kiếp Giáp Mệnh Cách',
    desc: 'Địa Không và Địa Kiếp kẹp cung Mệnh; tài lộc hư hao bất định, nên tu tâm dưỡng tính, hướng về tâm linh triết học.',
  },
  '廉杀羊': {
    name: 'Liêm Sát Kình Cách',
    desc: 'Liêm Trinh, Thất Sát ngộ Kình Dương; tính cách cương liệt, đề phòng hình thương hoặc va chạm kiện tụng.',
  },
  '巨火羊': {
    name: 'Cự Hỏa Kình Cách',
    desc: 'Cự Môn, Hỏa Tinh ngộ Kình Dương; chủ thị phi nóng nảy, cần cẩn trọng ngôn từ đề phòng rắc rối.',
  },
  '铃昌陀武': {
    name: 'Linh Xương Đà Vũ Cách',
    desc: 'Linh Tinh, Văn Xương, Đà La, Vũ Khúc hội hợp; hạn gặp cách này cần cẩn trọng giữ gìn, đề phòng thất bại sông nước.',
  },
  '马头带箭': {
    name: 'Mã Đầu Đới Tiễn Cách',
    desc: 'Kình Dương tọa tại cung Ngọ ngộ Mệnh; uy quyền trấn ngự biên cương, gian khổ lập thân rồi bạo phát thành tựu.',
  },
  '化禄入财': {
    name: 'Hóa Lộc Nhập Tài Cung',
    desc: 'Hóa Lộc tọa thủ cung Tài Bạch; nguồn tiền dồi dào, kiếm tiền thuận lợi, kinh doanh hanh thông.',
  },
  '化权入官': {
    name: 'Hóa Quyền Nhập Quan Cung',
    desc: 'Hóa Quyền tọa thủ cung Quan Lộc; nắm quyền chỉ huy, thăng tiến nhanh chóng trong sự nghiệp tổ chức.',
  },
  '机月同梁三星会': {
    name: 'Cơ Nguyệt Đồng Lương Tam Tinh Hội',
    desc: 'Ba trong bốn tinh tú Cơ Nguyệt Đồng Lương hội hợp; mưu trí vững vàng, thích hợp chuyên môn nghiệp vụ.',
  },
  '辅弼同会': {
    name: 'Tả Hữu Đồng Hội Cách',
    desc: 'Tả Phù và Hữu Bật cùng hội tụ chiếu Mệnh; bè bạn đông đảo, tương trợ đắc lực.',
  },
  '魁钺同会': {
    name: 'Khôi Việt Đồng Hội Cách',
    desc: 'Thiên Khôi và Thiên Việt cùng hội tụ; tôn quý thanh nhã, quý nhân đề bạt liên tục.',
  },
  '科权双会': {
    name: 'Khoa Quyền Song Hội Cách',
    desc: 'Hóa Khoa và Hóa Quyền hội hợp; vừa có tài học danh tiếng, vừa nắm thực quyền điều hành.',
  },
};

export function translatePatternName(name: string): string {
  return VI_PATTERNS[name]?.name || name;
}

export function translatePatternDesc(name: string, defaultDesc: string): string {
  return VI_PATTERNS[name]?.desc || defaultDesc;
}


export function translateCondition(text: string): string {
  if (!text) return '';
  let res = text;
  const dict: [RegExp, string][] = [
    [/命宫在/g, 'Cung Mệnh tại '],
    [/财帛宫在/g, 'Cung Tài Bạch tại '],
    [/官禄宫在/g, 'Cung Quan Lộc tại '],
    [/迁移宫在/g, 'Cung Thiên Di tại '],
    [/三方四正/g, 'Tam phương tứ chính '],
    [/加会/g, 'hội chiếu '],
    [/见/g, 'thấy '],
    [/无煞星/g, 'không có sát tinh '],
    [/破格/g, 'phá cách '],
    [/加分/g, 'cát hóa thêm '],
    [/化禄/g, 'Hóa Lộc '],
    [/化权/g, 'Hóa Quyền '],
    [/化科/g, 'Hóa Khoa '],
    [/化忌/g, 'Hóa Kỵ '],
    [/擎羊/g, 'Kình Dương '],
    [/陀罗/g, 'Đà La '],
    [/火星/g, 'Hỏa Tinh '],
    [/铃星/g, 'Linh Tinh '],
    [/地空/g, 'Địa Không '],
    [/地劫/g, 'Địa Kiếp '],
    [/左辅/g, 'Tả Phù '],
    [/右弼/g, 'Hữu Bật '],
    [/文昌/g, 'Văn Xương '],
    [/文曲/g, 'Văn Khúc '],
    [/天魁/g, 'Thiên Khôi '],
    [/天钺/g, 'Thiên Việt '],
    [/禄存/g, 'Lộc Tồn '],
    [/天马/g, 'Thiên Mã '],
    [/庙旺/g, 'Miếu Vượng '],
    [/落陷/g, 'Hãm Địa '],
  ];
  for (const [re, rep] of dict) {
    res = res.replace(re, rep);
  }
  return res.trim();
}
