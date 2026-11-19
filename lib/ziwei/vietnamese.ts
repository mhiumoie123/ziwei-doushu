/**
 * Hệ thống thuật ngữ và bộ chuyển ngữ Tử Vi Đẩu Số sang Tiếng Việt
 * Tên gọi Hán–Việt dùng trên giao diện. Khóa chữ Hán giữ nguyên theo dữ liệu lập số.
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
  '咸池': 'Hàm Trì',
  '桃花': 'Đào Hoa',
  '天空': 'Thiên Không',
  '空亡': 'Không Vong',
  '截路': 'Triệt Lộ',
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
  '命宫': 'Mệnh',
  '命': 'Mệnh',
  '兄弟宫': 'Huynh Đệ',
  '夫妻宫': 'Phu Thê',
  '子女宫': 'Tử Tức',
  '财帛宫': 'Tài Bạch',
  '疾厄宫': 'Tật Ách',
  '迁移宫': 'Thiên Di',
  '交友宫': 'Nô Bộc',
  '仆役宫': 'Nô Bộc',
  '官禄宫': 'Quan Lộc',
  '田宅宫': 'Điền Trạch',
  '福德宫': 'Phúc Đức',
  '父母宫': 'Phụ Mẫu',
  '身宫': 'Thân',
  '身': 'Thân',
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
  '不': { short: 'BĐ', full: 'Bất đắc địa' },
  '闲': { short: 'Nh', full: 'Nhàn địa' },
  '陷': { short: 'H', full: 'Hãm địa' },
  '地': { short: 'Địa', full: 'Địa' },
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
// These aliases cover common traditional-script spellings in imported labels.
const TRADITIONAL_CHARS: Readonly<Record<string, string>> = {
  機: '机', 陽: '阳', 陰: '阴', 貪: '贪', 門: '门', 殺: '杀', 軍: '军',
  貞: '贞', 輔: '辅', 鉞: '钺', 祿: '禄', 馬: '马', 羅: '罗',
  鈴: '铃', 紅: '红', 鸞: '鸾', 虛: '虚', 華: '华', 龍: '龙', 鳳: '凤',
  閣: '阁', 貴: '贵', 臺: '台', 誥: '诰', 傷: '伤', 養: '养', 長: '长',
  帶: '带', 臨: '临', 絕: '绝', 將: '将', 書: '书', 飛: '飞', 歲: '岁',
  喪: '丧', 貫: '贯', 駕: '驾', 災: '灾', 驛: '驿', 宮: '宫', 遷: '迁',
  財: '财', 僕: '仆', 權: '权', 廟: '庙', 閒: '闲', 閑: '闲',
  慶: '庆', 會: '会', 夾: '夹', 隱: '隐', 雙: '双', 數: '数',
  頭: '头', 賦: '赋', 論: '论',
};

function simplifyLabel(value: string): string {
  return Array.from(value, char => TRADITIONAL_CHARS[char] ?? char).join('');
}

function lookup<T>(table: Record<string, T>, key: string): T | undefined {
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

export function translateStarName(name: string): string {
  const key = simplifyLabel(name);
  return lookup(VI_MAJOR_STARS, key) ?? lookup(VI_MINOR_STARS, key) ?? name;
}

export function translatePalaceName(name: string): string {
  const key = simplifyLabel(name);
  return lookup(VI_PALACES, key) ?? lookup(VI_PALACES, `${key}宫`) ?? name;
}

export function translateSiHua(sihua?: string, short = false): string {
  if (!sihua) return '';
  return lookup(short ? VI_SIHUA_SHORT : VI_SIHUA, simplifyLabel(sihua)) ?? sihua;
}

export function translateBrightness(b?: string, full = false): string {
  if (!b) return '';
  const item = lookup(VI_BRIGHTNESS, simplifyLabel(b));
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
    desc: 'Tử Vi và Thiên Phủ đồng cung tại Dần hoặc Thân. Cần xét hai sao thủ Mệnh hay chỉ hội chiếu, cùng các sao phụ tá và sát tinh.',
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
    desc: 'Vũ Khúc và Tham Lang đồng cung tại Sửu hoặc Mùi, hoặc đối cung hội chiếu theo quy tắc của ứng dụng. Đọc điều kiện cụ thể trên lá số để phân biệt hai trường hợp.',
  },
  '杀破狼': {
    name: 'Sát Phá Tham (Sát Phá Lang)',
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
    desc: 'Mệnh vô chính diệu tại Mùi. Xem vị trí Thái Dương và Thái Âm ở mục điều kiện, vì cách an và tiêu chí nhận diện có thể khác giữa các phép luận.',
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
    name: 'Tam Kỳ Gia Hội Cách',
    desc: 'Hóa Lộc, Hóa Quyền, Hóa Khoa đồng hội tại Tam phương tứ chính; chí hướng phi phàm, danh lợi tột đỉnh.',
  },
  '羊陀夹忌': {
    name: 'Kình Đà Giáp Kỵ Cách',
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
  '火贪格': { name: 'Hỏa Tham Cách', desc: 'Hỏa Tinh gặp Tham Lang, đồng cung hoặc hội chiếu theo điều kiện ghi trên lá số. Xét thêm Lộc, Quyền và các yếu tố phá cách.' },
  '铃贪格': { name: 'Linh Tham Cách', desc: 'Linh Tinh gặp Tham Lang, đồng cung hoặc hội chiếu theo điều kiện ghi trên lá số. Xét thêm Lộc, Quyền và các yếu tố phá cách.' },
  '禄存守命': { name: 'Lộc Tồn Thủ Mệnh', desc: 'Lộc Tồn an tại cung Mệnh. Luận phối hợp với chính tinh và các sao đồng cung, hội chiếu.' },
  '禄存守身': { name: 'Lộc Tồn Thủ Thân', desc: 'Lộc Tồn an tại cung có Thân cư. Luận phối hợp với chính tinh và các sao hội chiếu.' },
  '天马入命': { name: 'Thiên Mã Nhập Mệnh', desc: 'Thiên Mã thủ Mệnh. Trong phép luận cổ, cần xét có Lộc Tồn hoặc Hóa Lộc hội hợp hay không.' },
  '天马在迁': { name: 'Thiên Mã Tại Thiên Di', desc: 'Thiên Mã an tại cung Thiên Di. Xem thêm các sao tại cung Di và cung Mệnh đối chiếu.' },
  '化科入命': { name: 'Hóa Khoa Nhập Mệnh', desc: 'Sao mang Hóa Khoa an tại cung Mệnh. Phép luận truyền thống liên hệ Hóa Khoa với văn học và danh tiếng.' },
  '化科入身': { name: 'Hóa Khoa Nhập Thân', desc: 'Sao mang Hóa Khoa an tại cung có Thân cư. Xem sao mang Hóa Khoa và cung tương ứng để luận giải.' },
  '昌曲坐命': { name: 'Xương Khúc Thủ Mệnh', desc: 'Văn Xương và Văn Khúc cùng an tại cung Mệnh. Xét thêm Tứ Hóa và các sao hội chiếu.' },
  '昌曲同会': { name: 'Xương Khúc Đồng Hội', desc: 'Văn Xương và Văn Khúc cùng hội trong tam phương tứ chính của Mệnh. Hai sao có thể ở các cung khác nhau.' },
};

function dynamicPatternName(key: string): string | undefined {
  const match = /^(.+?)(化禄|化忌)入(命|迁)$/.exec(key);
  if (!match) return undefined;
  const [, star, transformation, target] = match;
  const vietnameseStar = translateStarName(star);
  if (vietnameseStar === star) return undefined;
  return `${vietnameseStar} ${translateSiHua(transformation)} nhập ${target === '命' ? 'Mệnh' : 'Thiên Di'}`;
}

export function translatePatternName(name: string): string {
  const key = simplifyLabel(name);
  return lookup(VI_PATTERNS, key)?.name ?? dynamicPatternName(key) ?? name;
}

export function translatePatternDesc(name: string, defaultDesc: string): string {
  const key = simplifyLabel(name);
  const dynamicName = dynamicPatternName(key);
  return lookup(VI_PATTERNS, key)?.desc ?? (dynamicName
    ? `${dynamicName}. Xét sao mang Tứ Hóa cùng các sao đồng cung và hội chiếu.`
    : defaultDesc);
}


const VI_CONDITIONS: Record<string, string> = {
  '紫微入命': 'Tử Vi thủ Mệnh',
  '左辅右弼同会三方四正': 'Tả Phù và Hữu Bật cùng hội trong tam phương tứ chính',
  '再会文昌或文曲': 'Hội thêm Văn Xương hoặc Văn Khúc',
  '魁钺贵人加照': 'Có Khôi Việt hội chiếu',
  '地空地劫双夹会照（紫微忌空劫）': 'Địa Không và Địa Kiếp cùng hội chiếu (Tử Vi kỵ Không Kiếp)',
  '紫微天府同入命宫': 'Tử Vi và Thiên Phủ cùng thủ Mệnh',
  '紫微天府同宫（不在命宫，会照减力）': 'Tử Vi và Thiên Phủ đồng cung ngoài cung Mệnh (sức hội chiếu giảm)',
  '左辅右弼同会': 'Tả Phù và Hữu Bật cùng hội',
  '再会昌曲': 'Hội thêm Xương Khúc',
  '紫府宫坐空劫（破紫府之贵气）': 'Không Kiếp an tại cung Tử Phủ, làm giảm ưu thế của cách',
  '紫府宫见双煞同坐': 'Hai sát tinh cùng an tại cung Tử Phủ',
  '两星不同宫': 'Hai sao không đồng cung',
  '命宫见禄': 'Cung Mệnh có Lộc Tồn hoặc Hóa Lộc',
  '再会左辅': 'Hội thêm Tả Phù',
  '命宫坐煞星': 'Có sát tinh thủ Mệnh',
  '三方四正煞星过多': 'Nhiều sát tinh trong tam phương tứ chính',
  '再会化科': 'Hội thêm Hóa Khoa',
  '太阳落陷（阳梁失辉）': 'Thái Dương hãm địa, làm giảm ưu thế của bộ Dương Lương',
  '三方煞重': 'Nhiều sát tinh tại tam phương',
  '贪狼宫又见羊陀（破横发之力）': 'Cung có Tham Lang lại gặp Kình Đà, làm suy yếu cách',
  '贪狼遇空劫（财来财去）': 'Tham Lang gặp Không Kiếp (tài lộc khó tụ theo phép luận cổ)',
  '武曲贪狼同宫（丑/未）': 'Vũ Khúc và Tham Lang đồng cung tại Sửu hoặc Mùi',
  '武曲贪狼对宫拱照': 'Vũ Khúc và Tham Lang ở hai cung đối chiếu',
  '会照命宫三方': 'Hội chiếu tam phương của cung Mệnh',
  '再遇火星/铃星（火贪/铃贪叠加）': 'Gặp thêm Hỏa Tinh hoặc Linh Tinh, đồng thời có cách Hỏa Tham hoặc Linh Tham',
  '武贪宫见羊陀': 'Cung Vũ Tham gặp Kình Đà',
  '武贪宫遇空劫': 'Cung Vũ Tham gặp Không Kiếp',
  '三方有化禄或化权（动得有力）': 'Tam phương có Hóa Lộc hoặc Hóa Quyền nâng đỡ',
  '辅弼同会（变动中得贵人）': 'Tả Hữu cùng hội, tượng có người trợ giúp khi biến động',
  '煞星过重（动而无成）': 'Sát tinh quá nặng, làm giảm ưu thế của cách',
  '命坐空劫（动得辛苦）': 'Không Kiếp thủ Mệnh',
  '煞星过多（机月同梁忌煞）': 'Nhiều sát tinh, bất lợi cho Cơ Nguyệt Đồng Lương',
  '命宫坐煞': 'Có sát tinh thủ Mệnh',
  '见禄存或廉贞化禄': 'Gặp Lộc Tồn hoặc Liêm Trinh Hóa Lộc',
  '廉相宫坐擎羊（廉杀羊倾向）': 'Kình Dương cùng cung Liêm Trinh và Thiên Tướng, có nét của bộ Liêm Sát Kình',
  '武曲化忌（武曲化忌为财劫之兆）': 'Vũ Khúc Hóa Kỵ, theo phép luận cổ là dấu hiệu tài lộc dễ hao tán',
  '武杀宫煞星过多': 'Cung Vũ Sát có nhiều sát tinh',
  '煞星同坐': 'Sát tinh đồng cung',
  '未宫日月同辉（古书云未宫日月双美）': 'Nhật Nguyệt cùng sáng ở cung Mùi, cổ thư gọi là Nhật Nguyệt song mỹ',
  '昌曲会照': 'Xương Khúc hội chiếu',
  '日月宫煞星同坐': 'Sát tinh cùng cung với Nhật Nguyệt',
  '日月落陷（夹命无光）': 'Nhật Nguyệt hãm địa, thế giáp Mệnh giảm lực',
  '寅宫太阳庙旺，巨门得日光化解是非': 'Thái Dương miếu hoặc vượng ở Dần, ánh Nhật giảm tính ám của Cự Môn theo phép luận cổ',
  '巨门化禄/化权（口才生财）': 'Cự Môn Hóa Lộc hoặc Hóa Quyền, tượng dùng tài ăn nói để sinh tài',
  '巨门化忌（口舌官非）': 'Cự Môn Hóa Kỵ, cổ luận xét đến thị phi và tranh tụng',
  '申宫太阳偏西，巨门暗曜更显': 'Thái Dương ở Thân ngả về Tây, tính ám của Cự Môn rõ hơn theo phép luận cổ',
  '文昌会照（石中隐玉得明）': 'Văn Xương hội chiếu, như ngọc trong đá được soi sáng',
  '巨门化忌（玉藏深泥）': 'Cự Môn Hóa Kỵ, ví như ngọc vùi trong bùn',
  '命坐煞星': 'Có sát tinh thủ Mệnh',
  '命宫在未为空宫': 'Cung Mệnh tại Mùi vô chính diệu',
  '对宫丑宫为太阳太阴同度': 'Đối cung tại Sửu có Thái Dương và Thái Âm đồng cung',
  '辅弼相助': 'Có Tả Hữu trợ lực',
  '煞星会照（珠光黯淡）': 'Sát tinh hội chiếu, làm giảm ưu thế của cách',
  '紫微独坐命宫（无天府同坐）': 'Tử Vi độc tọa cung Mệnh, không có Thiên Phủ đồng cung',
  '文昌文曲同会': 'Văn Xương và Văn Khúc cùng hội',
  '无辅弼（孤君无臣）': 'Không có Tả Hữu phò tá, ví như vua thiếu bề tôi',
  '紫微遇空劫（古书最忌）': 'Tử Vi gặp Không Kiếp, tổ hợp cổ thư xem là bất lợi',
  '再会魁钺': 'Hội thêm Khôi Việt',
  '命坐空劫（双禄遇空，财来财去）': 'Không Kiếp thủ Mệnh, thế Song Lộc khó tụ tài theo phép luận cổ',
  '化禄、化权、化科三吉化齐会命宫三方四正': 'Hóa Lộc, Hóa Quyền và Hóa Khoa cùng hội trong tam phương tứ chính của Mệnh',
  '化忌坐命': 'Hóa Kỵ thủ Mệnh',
  '擎羊于午宫坐命': 'Kình Dương thủ Mệnh tại Ngọ',
  '再会七杀或破军（武职大贵）': 'Hội thêm Thất Sát hoặc Phá Quân, cổ luận liên hệ với võ chức',
  '魁钺加照': 'Có Khôi Việt hội chiếu',
};

// Only translate known condition forms; preserve the original for unrecognized rules.
const CONDITION_TERMS = { ...VI_MAJOR_STARS, ...VI_MINOR_STARS, ...VI_SIHUA };
const TERM_TOKEN = new RegExp(Object.keys(CONDITION_TERMS).sort((a, b) => b.length - a.length).join('|'), 'y');

function conditionStarList(text: string): string | undefined {
  const tokens: string[] = [];
  let cursor = 0;
  while (cursor < text.length) {
    if (text[cursor] === '、') {
      cursor++;
      continue;
    }
    TERM_TOKEN.lastIndex = cursor;
    const match = TERM_TOKEN.exec(text);
    if (!match) return undefined;
    tokens.push(CONDITION_TERMS[match[0]]);
    cursor = TERM_TOKEN.lastIndex;
  }
  return tokens.join(', ');
}

const CONDITION_SUFFIXES: Record<string, string> = {
  分居命宫前后两宫: 'ở hai cung liền kề, giáp Mệnh',
  同会命宫三方四正: 'cùng hội trong tam phương tứ chính của Mệnh',
  三星齐入命宫三方四正: 'cùng hội trong tam phương tứ chính của Mệnh',
  四星齐入命宫三方四正: 'cùng hội trong tam phương tứ chính của Mệnh',
  三星会照三方四正: 'cùng hội chiếu trong tam phương tứ chính',
  四星会照三方四正: 'cùng hội chiếu trong tam phương tứ chính',
  会照命宫三方: 'hội chiếu tam phương của Mệnh',
  会命宫三方: 'hội tại tam phương của Mệnh',
  坐命三方: 'an tại tam phương của Mệnh',
  会照三方四正: 'hội chiếu tam phương tứ chính',
  同宫: 'đồng cung', 会照: 'hội chiếu', 庙旺: 'miếu hoặc vượng địa',
  坐命宫: 'thủ Mệnh', 坐迁宫: 'an tại cung Thiên Di',
  入命宫: 'nhập cung Mệnh', 入身宫: 'an tại cung Thân cư',
  入迁移宫: 'nhập cung Thiên Di', 入财帛宫: 'nhập cung Tài Bạch', 入官禄宫: 'nhập cung Quan Lộc',
};

export function translateCondition(text: string): string {
  const key = simplifyLabel(text);
  const exact = lookup(VI_CONDITIONS, key);
  if (exact) return exact;
  const trio = /^三方四正会(.+)（机月同梁缺(.+)）$/.exec(key);
  if (trio) {
    const present = conditionStarList(trio[1]);
    const missing = conditionStarList(trio[2]);
    if (present && missing) return `Tam phương tứ chính hội ${present} (Cơ Nguyệt Đồng Lương còn thiếu ${missing})`;
  }
  const atBranch = /^(.+?)(同入|入命于)([子丑寅卯辰巳午未申酉戌亥])宫$/.exec(key);
  if (atBranch) {
    const stars = conditionStarList(atBranch[1]);
    if (stars) return `${stars} ${atBranch[2] === '同入' ? 'đồng cung tại' : 'thủ Mệnh tại'} ${translateBranch(atBranch[3])}`;
  }
  for (const [suffix, label] of Object.entries(CONDITION_SUFFIXES)) {
    if (key.endsWith(suffix)) {
      const stars = conditionStarList(key.slice(0, -suffix.length));
      if (stars) return `${stars} ${label}`;
    }
  }
  const relation = /^(.+?)(同宫|会照)(.+)$/.exec(key);
  if (relation) {
    const first = conditionStarList(relation[1]);
    const second = conditionStarList(relation[3]);
    if (first && second) return `${first} ${CONDITION_SUFFIXES[relation[2]]} với ${second}`;
  }
  const transformation = /^(.+?)(化[禄权科忌])(?:\/(化[禄权科忌]))?$/.exec(key);
  if (transformation) {
    const star = conditionStarList(transformation[1]);
    if (star) return `${star} ${translateSiHua(transformation[2])}${transformation[3] ? ` hoặc ${translateSiHua(transformation[3])}` : ''}`;
  }
  return text;
}

const VI_SOURCE_BOOKS = {
  紫微斗数全书: 'Tử Vi Đẩu Số Toàn Thư',
  紫微斗数全集: 'Tử Vi Đẩu Số Toàn Tập',
  紫微斗数骨髓赋: 'Tử Vi Đẩu Số Cốt Tủy Phú',
};

const VI_SOURCE_SECTIONS = {
  禄存星: 'Sao Lộc Tồn', 天马星: 'Sao Thiên Mã', 四化论: 'Luận Tứ Hóa',
  文星论: 'Luận Văn tinh', 辅弼论: 'Luận Tả Phù và Hữu Bật',
  魁钺论: 'Luận Khôi Việt', 四化会照: 'Tứ Hóa hội chiếu',
};

export function translatePatternSource(source: string): string {
  const [title, section] = simplifyLabel(source).replace(/^《|》$/g, '').split('·');
  const book = lookup<string>(VI_SOURCE_BOOKS, title);
  if (!book) return source;
  const sectionName = section && (lookup<string>(VI_SOURCE_SECTIONS, section)
    ?? lookup(VI_PATTERNS, section)?.name ?? lookup(VI_PATTERNS, section.replace(/格$/, ''))?.name);
  return section ? `${book} · ${sectionName ?? (source.match(/·([^》]+)》?$/)?.[1] ?? section)}` : book;
}
