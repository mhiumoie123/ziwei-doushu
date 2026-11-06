/**
 * Danh sách lá số danh nhân thế giới & phương Đông
 * Căn cứ theo ngày sinh ghi chép lịch sử, giờ sinh ước lượng hoặc có tư liệu khảo chứng
 */

import 'server-only';

export interface FamousPerson {
  id: string;
  name: string;
  nameEn: string;
  nameVi?: string;
  category: '商业' | '文艺' | '历史' | '体育' | '科技';
  description: string;
  descriptionEn: string;
  descriptionVi?: string;
  year: number;
  month: number;
  day: number;
  hour: number;                  // 时辰地支索引 0-11
  gender: 'male' | 'female';
  notable: string;
  notableEn: string;
  notableVi?: string;
}

export const FAMOUS_PERSONS: FamousPerson[] = [
  // ─── Thương trường ─────────────────────────────────────────────
  {
    id: 'ma-yun',
    name: '马云',
    nameEn: 'Jack Ma',
    nameVi: 'Jack Ma (Mã Vân)',
    category: '商业',
    description: '阿里巴巴创始人',
    descriptionEn: 'Founder of Alibaba',
    descriptionVi: 'Nhà sáng lập tập đoàn Alibaba',
    year: 1964, month: 9, day: 10, hour: 5,  // Giờ Tỵ
    gender: 'male',
    notable: '命盘显示极强的破格重建之力，官禄宫星曜与互联网商业帝国高度对应',
    notableEn: 'The chart shows an exceptional ability to break established patterns and rebuild, while the Career Palace closely parallels the rise of an internet business empire.',
    notableVi: 'Lá số biểu thị năng lực phá cách và tái thiết cực mạnh, cung Quan Lộc tương ứng hoàn hảo với sự trỗi dậy của đế chế thương mại điện tử.',
  },
  {
    id: 'li-jiacheng',
    name: '李嘉诚',
    nameEn: 'Li Ka-shing',
    nameVi: 'Lý Gia Thành',
    category: '商业',
    description: '香港超级富豪，长和系创始人',
    descriptionEn: 'Hong Kong billionaire and founder of the CK Hutchison business empire',
    descriptionVi: 'Đại tỷ phú Hồng Kông, người sáng lập tập đoàn Trường Hòa',
    year: 1928, month: 7, day: 29, hour: 3,  // Giờ Mão
    gender: 'male',
    notable: '财帛宫四化是研究东方首富命盘的绝佳案例，禄存守财，越积越厚',
    notableEn: 'The Four Transformations in the Wealth Palace make this a compelling case study of extraordinary wealth; Lu Cun preserves assets and supports steady accumulation.',
    notableVi: 'Tứ Hóa tại cung Tài Bạch là ví dụ kinh điển về cách cục cự phú; Lộc Tồn thủ tài, tiền bạc càng tích lũy càng dồi dào vững chắc.',
  },
  {
    id: 'ren-zhengfei',
    name: '任正非',
    nameEn: 'Ren Zhengfei',
    nameVi: 'Nhậm Chính Phi',
    category: '商业',
    description: '华为创始人',
    descriptionEn: 'Founder of Huawei',
    descriptionVi: 'Nhà sáng lập tập đoàn công nghệ Huawei',
    year: 1944, month: 10, day: 25, hour: 3, // Giờ Mão
    gender: 'male',
    notable: '七杀入命格局，一生逆风而行，越打压越强大，倪师七杀理论的活教材',
    notableEn: 'Qi Sha in the Life Palace points to a life strengthened by adversity—the greater the pressure, the stronger the response—making this a vivid case study of traditional Qi Sha theory.',
    notableVi: 'Thất Sát nhập Mệnh, một đời dấn thân nghênh đón nghịch cảnh, áp lực càng lớn ý chí càng kiên cường dũng mãnh.',
  },

  // ─── Văn nghệ ─────────────────────────────────────────────
  {
    id: 'zhang-ailing',
    name: '张爱玲',
    nameEn: 'Eileen Chang',
    nameVi: 'Trương Ái Linh',
    category: '文艺',
    description: '中国现代文学巨匠',
    descriptionEn: 'A master of modern Chinese literature',
    descriptionVi: 'Đại văn hào văn học hiện đại',
    year: 1920, month: 9, day: 30, hour: 1, // Giờ Sửu
    gender: 'female',
    notable: '命盘孤独星曜组合与其传奇感情经历、文学成就形成神奇对照',
    notableEn: 'The chart’s combination of solitary stars forms a striking parallel with her celebrated romantic history and literary achievements.',
    notableVi: 'Tổ hợp tinh diệu cô độc đối chiếu kỳ lạ với đường tình duyên trắc trở và văn phong trác tuyệt lừng lẫy của bà.',
  },
  {
    id: 'jay-chou',
    name: '周杰伦',
    nameEn: 'Jay Chou',
    nameVi: 'Châu Kiệt Luân (Jay Chou)',
    category: '文艺',
    description: '华语流行音乐天王',
    descriptionEn: 'Mandopop singer-songwriter and cultural icon',
    descriptionVi: 'Thiên vương âm nhạc châu Á',
    year: 1979, month: 1, day: 18, hour: 1,  // Giờ Sửu
    gender: 'male',
    notable: '文曲星与贪狼的组合，天生才艺之命，命盘解释了他为何能横跨音乐各风格',
    notableEn: 'The combination of Wen Qu and Tan Lang suggests natural artistic talent and helps explain his ability to move across musical styles.',
    notableVi: 'Tổ hợp Văn Khúc ngộ Tham Lang tạo nên thiên phú nghệ thuật dị biệt, dung hợp mọi phong cách âm nhạc sáng tạo.',
  },
  {
    id: 'wang-fei',
    name: '王菲',
    nameEn: 'Faye Wong',
    nameVi: 'Vương Phi (Faye Wong)',
    category: '文艺',
    description: '华语乐坛最具传奇色彩的女歌手',
    descriptionEn: 'One of the most iconic singers in Chinese pop',
    descriptionVi: 'Diva huyền thoại âm nhạc châu Á',
    year: 1969, month: 8, day: 8, hour: 4,   // Giờ Thìn
    gender: 'female',
    notable: '夫妻宫星曜与其两段传奇婚姻高度对应，感情格局极具研究价值',
    notableEn: 'The stars in the Marriage Palace closely parallel her two high-profile marriages, making the relationship pattern especially valuable for study.',
    notableVi: 'Cung Phu Thê phản ánh rõ nét hai cuộc hôn nhân danh tiếng, cách cục tình cảm tiêu biểu cho giới nghiên cứu mệnh lý.',
  },
  {
    id: 'lin-zhiling',
    name: '林志玲',
    nameEn: 'Lin Chi-ling',
    nameVi: 'Lâm Chí Linh',
    category: '文艺',
    description: '台湾名模、演员',
    descriptionEn: 'Taiwanese model and actress',
    descriptionVi: 'Siêu mẫu, diễn viên nổi tiếng',
    year: 1974, month: 11, day: 29, hour: 5, // Giờ Tỵ
    gender: 'female',
    notable: '太阴守命的女性美貌典范，命盘完美印证倪师"太阴入命女孩最漂亮"的论断',
    notableEn: 'Tai Yin guarding the Life Palace is a classic symbol of feminine grace, closely echoing the traditional view that this placement bestows exceptional beauty.',
    notableVi: 'Thái Âm thủ Mệnh là điển hình cho vẻ đẹp dịu dàng đoan trang, đúng như cổ quyết nhận định về sự nhu mỹ thanh tú.',
  },

  // ─── Công nghệ ─────────────────────────────────────────────
  {
    id: 'steve-jobs',
    name: '乔布斯',
    nameEn: 'Steve Jobs',
    nameVi: 'Steve Jobs',
    category: '科技',
    description: '苹果公司联合创始人',
    descriptionEn: 'Co-founder of Apple',
    descriptionVi: 'Nhà đồng sáng lập tập đoàn Apple',
    year: 1955, month: 2, day: 24, hour: 6,  // Giờ Ngọ
    gender: 'male',
    notable: '破军入命格局，被亲生父母遗弃又创建苹果帝国，破而后立的命盘典范',
    notableEn: 'Po Jun in the Life Palace, adoption at birth, and the creation of the Apple empire make this an archetypal chart of renewal after disruption.',
    notableVi: 'Phá Quân nhập Mệnh, cuộc đời trải qua nhiều thăng trầm chia cắt để rồi kiến tạo đế chế công nghệ đỉnh cao thế giới.',
  },
  {
    id: 'elon-musk',
    name: '马斯克',
    nameEn: 'Elon Musk',
    nameVi: 'Elon Musk',
    category: '科技',
    description: '特斯拉、SpaceX创始人',
    descriptionEn: 'Founder of SpaceX and CEO of Tesla',
    descriptionVi: 'CEO Tesla, nhà sáng lập SpaceX',
    year: 1971, month: 6, day: 28, hour: 4,  // Giờ Thìn
    gender: 'male',
    notable: '杀破狼格局的极致体现，命盘中驿马星旺盛，一生在改变人类未来边界',
    notableEn: 'An intense expression of the Sha Po Lang pattern, with a powerful Travel Horse star and a life devoted to pushing the boundaries of humanity’s future.',
    notableVi: 'Hiện thân mãnh liệt của cách cục Sát Phá Tham, Thiên Mã miếu vượng bôn ba không ngừng mở rộng ranh giới tương lai nhân loại.',
  },

  // ─── Thể thao ─────────────────────────────────────────────
  {
    id: 'yao-ming',
    name: '姚明',
    nameEn: 'Yao Ming',
    nameVi: 'Diêu Minh (Yao Ming)',
    category: '体育',
    description: 'NBA传奇中锋，中国篮球代言人',
    descriptionEn: 'Legendary NBA center and ambassador for Chinese basketball',
    descriptionVi: 'Huyền thoại bóng rổ NBA',
    year: 1980, month: 9, day: 12, hour: 5,  // Giờ Tỵ
    gender: 'male',
    notable: '天梁守命，高大威严，官禄宫星象与其职业成就高度吻合',
    notableEn: 'Tian Liang guarding the Life Palace suggests stature and dignity, while the Career Palace closely aligns with his professional achievements.',
    notableVi: 'Thiên Lương thủ Mệnh đĩnh đạc uy nghiêm, cung Quan Lộc tương hợp chuẩn xác với sự nghiệp thi đấu thể thao đỉnh cao.',
  },
  {
    id: 'li-na',
    name: '李娜',
    nameEn: 'Li Na',
    nameVi: 'Lý Na (Li Na)',
    category: '体育',
    description: '中国网球大满贯得主',
    descriptionEn: 'Chinese Grand Slam tennis champion',
    descriptionVi: 'Nhà vô địch quần vợt Grand Slam',
    year: 1982, month: 2, day: 26, hour: 2,  // Giờ Dần
    gender: 'female',
    notable: '七杀化气，命中注定与人竞争，大限流年与法网夺冠时间点精准对应',
    notableEn: 'Qi Sha channels a powerful competitive drive, while the major periods and annual cycles closely align with the timing of her French Open victory.',
    notableVi: 'Thất Sát hóa khí vi dũng, ý chí ganh đua quyết liệt; vận trình Đại Hạn và Lưu Niên khớp chuẩn xác với thời điểm vô địch Roland Garros.',
  },
];

/** 按分类获取名人 */
export function getFamousByCategory(category: FamousPerson['category']): FamousPerson[] {
  return FAMOUS_PERSONS.filter(p => p.category === category);
}

/** 获取所有分类 */
export const FAMOUS_CATEGORIES: FamousPerson['category'][] = [
  '商业', '文艺', '科技', '体育',
];
