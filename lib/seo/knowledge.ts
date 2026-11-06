/**
 * SEO 知识页 — 数据 helper
 *
 * 14 主星 × 13 topic = 182 个独立 SEO URL
 * 每页都是 STAR_DB 中对应字段的 4 段 markers（一句话定调/核心论断/命盘依据/经典出处）
 */

import { STAR_DB } from '@/lib/ziwei/db-analysis';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import { TOPIC_PALACE_NAME, TOPIC_LABEL } from '@/lib/ziwei/db-analysis';

export const ALL_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
];

// 主星名 ↔ 拼音 slug 映射（URL 用 slug，避免中文 URL 在 Vercel/CDN 上的边界问题）
export const STAR_TO_SLUG: Record<string, string> = {
  '紫微': 'ziwei',
  '天机': 'tianji',
  '太阳': 'taiyang',
  '武曲': 'wuqu',
  '天同': 'tiantong',
  '廉贞': 'lianzhen',
  '天府': 'tianfu',
  '太阴': 'taiyin',
  '贪狼': 'tanlang',
  '巨门': 'jumen',
  '天相': 'tianxiang',
  '天梁': 'tianliang',
  '七杀': 'qisha',
  '破军': 'pojun',
};

export const SLUG_TO_STAR: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_TO_SLUG).map(([k, v]) => [v, k])
);

export const ALL_TOPICS: TopicKey[] = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

interface StarContent {
  mingGong: string;
  personality: string;
  xiongDi?: string;
  fuQi: string;
  ziNv?: string;
  caiBo: string;
  jiE: string;
  qianYi?: string;
  jiaoYou?: string;
  guanLu: string;
  tianZhai?: string;
  fuDe?: string;
  fuMu?: string;
}

const TOPIC_TO_FIELD: Record<TopicKey, keyof StarContent> = {
  overview:    'mingGong',
  personality: 'personality',
  love:        'fuQi',
  career:      'guanLu',
  wealth:      'caiBo',
  health:      'jiE',
  family:      'xiongDi' as keyof StarContent,
  children:    'ziNv' as keyof StarContent,
  move:        'qianYi' as keyof StarContent,
  friends:     'jiaoYou' as keyof StarContent,
  home:        'tianZhai' as keyof StarContent,
  spirit:      'fuDe' as keyof StarContent,
  parents:     'fuMu' as keyof StarContent,
};

interface ParsedContent {
  dingdiao: string;
  lundian: string;
  yiju: string;
  chuchu: string;
  raw: string;
  hasMarkers: boolean;
}

function parseStarContent(content: string): ParsedContent {
  const out: ParsedContent = { dingdiao: '', lundian: '', yiju: '', chuchu: '', raw: content, hasMarkers: false };
  if (!content) return out;
  if (!content.includes('**【一句话定调】**') && !content.includes('**【核心论断】**')) {
    out.lundian = content;
    return out;
  }
  out.hasMarkers = true;
  const re = /\*\*【([^】]+)】\*\*/g;
  const parts: { name: string; markerEnd: number; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    parts.push({ name: m[1], start: m.index, markerEnd: m.index + m[0].length });
  }
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const end = i + 1 < parts.length ? parts[i + 1].start : content.length;
    const text = content.slice(p.markerEnd, end).trim();
    if (p.name === '一句话定调') out.dingdiao = text;
    else if (p.name === '核心论断') out.lundian = text;
    else if (p.name === '命盘依据') out.yiju = text;
    else if (p.name === '经典出处') out.chuchu = text;
  }
  return out;
}

export interface KnowledgeData {
  star: string;
  topic: TopicKey;
  topicLabel: string;
  palaceName: string;
  parsed: ParsedContent;
  exists: boolean;
}

export function getKnowledge(star: string, topic: TopicKey): KnowledgeData {
  const profile = STAR_DB[star] as StarContent | undefined;
  const field = TOPIC_TO_FIELD[topic];
  const content = profile && field ? (profile[field] as string | undefined) ?? '' : '';
  return {
    star,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    palaceName: TOPIC_PALACE_NAME[topic],
    parsed: parseStarContent(content),
    exists: Boolean(content),
  };
}

/** 生成所有 14×13 组合（用于 generateStaticParams） */
export function getAllKnowledgeRoutes() {
  const routes: { star: string; slug: string; topic: TopicKey }[] = [];
  for (const star of ALL_STARS) {
    for (const topic of ALL_TOPICS) {
      const data = getKnowledge(star, topic);
      if (data.exists) routes.push({ star, slug: STAR_TO_SLUG[star], topic });
    }
  }
  return routes;
}

/** 主星属性简介（用于 SEO 页"了解 XX 星"section） */
export const STAR_BRIEF_SEO: Record<string, string> = {
  '紫微': 'Tử Vi là Đế tinh, chủ tôn quý, hóa khí vi Tôn. Thủ Mệnh chủ có khí chất lãnh đạo uy quyền, thích hợp vị thế tôn quý, đại sự nghiệp.',
  '天机': 'Thiên Cơ là Trí tuệ tinh, chủ linh hoạt biến hóa, hóa khí vi Thiện. Thủ Mệnh chủ thông minh quyền biến, mưu lược, thích hợp vai trò quân sư phò tá, hoạch định.',
  '太阳': 'Thái Dương là Nam quý tinh, chủ danh dự công quyền, hóa khí vi Quý. Thủ Mệnh chủ quang minh chính đại, hào sảng, thích hợp công danh và hoạt động xã hội.',
  '武曲': 'Vũ Khúc là Tài tinh kiêm Võ tướng tinh, chủ cương nghị quyết đoán, hóa khí vi Tài. Thủ Mệnh chủ năng lực tài chính nhạy bén, quả quyết, hợp kinh thương tài chính.',
  '天同': 'Thiên Đồng là Phúc tinh, chủ ôn hòa an nhàn, hóa khí vi Phúc. Thủ Mệnh chủ tính tình nhân hậu, thụ hưởng phúc lộc, quý nhân nâng đỡ.',
  '廉贞': 'Liêm Trinh là Thứ Đào Hoa tinh, văn võ kiêm toàn, hóa khí vi Tù. Thủ Mệnh chủ thông minh đa tài, cá tính rõ nét, cảm xúc phong phú sâu sắc.',
  '天府': 'Thiên Phủ là Nam Đẩu Đế tinh, Lệnh tinh cai quản khố tàng, hóa khí vi Lệnh. Thủ Mệnh chủ trầm tĩnh khoan dung, giỏi tích lũy và gìn giữ cơ nghiệp.',
  '太阴': 'Thái Âm là Mẫu tinh, chủ điền trạch phú quý nhu hòa, hóa khí vi Phú. Thủ Mệnh chủ tình cảm tinh tế, nội tâm sâu lắng, nữ mệnh đắc cách hưởng phúc dồi dào.',
  '贪狼': 'Tham Lang là Chính Đào Hoa tinh kiêm Dục vọng tinh, đa tài đa nghệ, hóa khí vi Đào Hoa. Thủ Mệnh chủ giỏi giao tế, linh hoạt, hoài bão tham vọng lớn.',
  '巨门': 'Cự Môn là Ám tinh, chủ khẩu tài biện luận, hóa khí vi Ám. Thủ Mệnh chủ sắc sảo trong ngôn từ, nghiên cứu chuyên sâu, hợp ngành luật sư, truyền thông, giáo dục.',
  '天相': 'Thiên Tướng là Ấn tinh phò tá, chủ trung hậu thành tín, hóa khí vi Ấn. Thủ Mệnh chủ đoan chính, trọng danh dự lễ nghĩa, phù hợp quản lý hành chính, pháp vụ.',
  '天梁': 'Thiên Lương là Ấm tinh thọ khảo, tiêu tai giải nạn, hóa khí vi Ấm. Thủ Mệnh chủ từ bi độ lượng, phong thái trưởng bối, thích hợp ngành y, pháp luật, trợ giúp người khác.',
  '七杀': 'Thất Sát là Tướng tinh dũng mãnh, chủ cô độc quyết đoán, khai phá mạo hiểm, hóa khí vi Tiêu Sát. Thủ Mệnh chủ kiên nghị quả cảm, hợp quân binh khởi nghiệp.',
  '破军': 'Phá Quân là Dũng tinh, chủ biến động đổi mới, tiền phong xung trận, hóa khí vi Hao. Thủ Mệnh chủ năng lực khai phá sáng tạo, phá cũ lập mới, hợp chuyên môn kỹ thuật.',
};
