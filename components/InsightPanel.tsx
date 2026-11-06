'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import { translateStarName, translatePalaceName, translateSiHua } from '@/lib/ziwei/vietnamese';
import type { TimeView } from './TimeNav';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // don't show user bubble for auto/topic messages
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = [
  { key: 'overview',     label: 'Mệnh Cách' },
  { key: 'love',        label: 'Tình Cảm' },
  { key: 'career',      label: 'Sự Nghiệp' },
  { key: 'wealth',      label: 'Tài Vận' },
  { key: 'health',      label: 'Sức Khỏe' },
  { key: 'personality', label: 'Tính Cách' },
] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Vui lòng tạo bản tổng quan mệnh cách theo cấu trúc sau:

**【Định Tính Mệnh Cách】**
Khái quát ngắn gọn cục diện cốt lõi của lá số và khí chất mệnh chủ.

**【Luận Giải Chính Tinh】**
Đặc tính cốt lõi của chính tinh cung Mệnh, dẫn giải quan điểm của thầy Nghê Hải Hà.

**【Tam Phương Tứ Chính】**
Liên hệ cung Tài Bạch, Quan Lộc, Thiên Di và cục diện tổng thể.

**【Đại Hạn Hiện Tại】**
Định hướng vận trình Đại Hạn hiện tại và những điểm cần lưu tâm nhất.

**【Ưu Thế & Lưu Ý】**
Thiên phú bẩm sinh cùng các rủi ro, bài học cần chú ý.`,

  love: `Vui lòng phân tích chuyên sâu vận trình tình cảm, hôn nhân theo cấu trúc sau:

**【Cục Diện Tình Duyên】**
Một câu định tính cục diện tình cảm hôn nhân.

**【Phân Tích Cung Phu Thê】**
Chính tinh, Tứ Hóa cung Phu Thê và luận giải theo hệ thống Nghê Hải Hà.

**【Tam Phương Tứ Chính Phối Hợp】**
Tác động từ các cung vị liên quan tới tình cảm.

**【Vận Trình Tình Cảm Đại Hạn Hiện Tại】**
Xu hướng tình cảm 10 năm hiện tại và các mốc thời gian then chốt.

**【Lời Khuyên Ứng Xử】**
Gợi ý thực tế, khả thi trong quan hệ tình cảm.`,

  career: `Vui lòng phân tích chuyên sâu vận trình sự nghiệp theo cấu trúc sau:

**【Cục Diện Sự Nghiệp】**
Một câu định tính mệnh cách sự nghiệp: hợp làm công chức, chuyên môn hay khởi nghiệp làm chủ.

**【Phân Tích Cung Quan Lộc】**
Chính tinh, Tứ Hóa cung Quan Lộc và đánh giá theo hệ thống Nghê Hải Hà.

**【Phối Hợp Cung Tài Bạch】**
Mối quan hệ giữa sự nghiệp và tiền tài, nguồn tài lộc đến từ đâu.

**【Vận Trình Sự Nghiệp Đại Hạn Hiện Tại】**
Xu hướng phát triển công danh sự nghiệp trong 10 năm hiện tại.

**【Lời Khuyên Định Hướng】**
Ngành nghề, phương hướng và sách lược hành động phù hợp nhất.`,

  wealth: `Vui lòng phân tích chuyên sâu tài vận theo cấu trúc sau:

**【Cục Diện Tài Vận】**
Một câu định tính mô hình tài lộc: tài chính chủ động hay tài chính thụ động, tích lũy hay khai phá.

**【Phân Tích Cung Tài Bạch】**
Chính tinh, Tứ Hóa cung Tài Bạch, nguồn gốc tiền tài và cách thức luân chuyển tài chính.

**【Cung Điền Trạch (Kho Chứa Tài Sản)】**
Khả năng tụ tài, tích lũy điền sản và vận thế bất động sản.

**【Tài Vận Đại Hạn Hiện Tại】**
Xu hướng tài lộc giai đoạn hiện tại và các rủi ro tài chính cần phòng ngừa.

**【Lời Khuyên Quản Lý Tài Chính】**
Chiến lược quản lý và gia tăng tài sản cụ thể.`,

  health: `Vui lòng phân tích sức khỏe theo cấu trúc sau:

**【Chính Tinh Cung Tật Ách】**
Các sao tọa thủ cung Tật Ách và ý nghĩa đối với thể chất.

**【Rủi Ro Sức Khỏe Tiềm Ẩn】**
Kết hợp lý thuyết Tử Ngọ Lưu Chú của thầy Nghê Hải Hà, phân tích những cơ quan nội tạng hoặc bộ phận cần lưu ý.

**【Xu Hướng Sức Khỏe Đại Hạn】**
Diễn biến sức khỏe trong giai đoạn hiện tại và các thời điểm cần chú ý.

**【Lời Khuyên Dưỡng Sinh & Phòng Ngừa】**
Biện pháp bảo dưỡng sức khỏe và lối sống phù hợp.`,

  personality: `Vui lòng phân tích chiều sâu tính cách theo cấu trúc sau:

**【Tính Cách Chính Tinh Cung Mệnh】**
Đặc tính cốt lõi của chính tinh thủ Mệnh, trích dẫn luận điểm của thầy Nghê Hải Hà.

**【Tổng Hợp Tam Phương】**
Ảnh hưởng từ cung Tài Bạch, Quan Lộc, Thiên Di đến tính cách, phác họa toàn diện chân dung.

**【Phong Cách Đối Nhân Xử Thế】**
Cách thức tương tác xã hội, giao tiếp và ứng xử với các mối quan hệ.

**【Thế Mạnh & Bài Học Cuộc Đời】**
Ưu thế thiên bẩm và những bài học cuộc đời cần tu dưỡng.`,
};

const PALACE_ROLES: Record<string, string> = {
  '命宫':   'Bản thân, tính cách, cách cục tiên thiên',
  '兄弟宫': 'Quan hệ anh em, tri kỷ, cộng sự',
  '夫妻宫': 'Tình duyên, phối ngẫu, hôn nhân',
  '子女宫': 'Duyên con cái, hậu bối, cấp dưới',
  '财帛宫': 'Tài lộc, nguồn thu, phong cách quản lý tiền bạc',
  '疾厄宫': 'Sức khỏe thể chất, bệnh tật, ách nạn',
  '迁移宫': 'Cơ hội xuất hành, giao tế xã hội, đối ngoại',
  '交友宫': 'Bạn bè, mạng lưới giao thiệp, quý nhân và tiểu nhân',
  '官禄宫': 'Sự nghiệp, danh vọng, địa vị xã hội',
  '田宅宫': 'Bất động sản, điền sản, gia đạo, cội nguồn gia đình',
  '福德宫': 'Đời sống tinh thần, nội tâm, phúc đức',
  '父母宫': 'Phụ mẫu, trưởng bối, giấy tờ văn bản pháp lý',
  'Mệnh':   'Bản thân, tính cách, cách cục tiên thiên',
  'Huynh Đệ': 'Quan hệ anh em, tri kỷ, cộng sự',
  'Phu Thê': 'Tình duyên, phối ngẫu, hôn nhân',
  'Tử Tức': 'Duyên con cái, hậu bối, cấp dưới',
  'Tài Bạch': 'Tài lộc, nguồn thu, phong cách quản lý tiền bạc',
  'Tật Ách': 'Sức khỏe thể chất, bệnh tật, ách nạn',
  'Thiên Di': 'Cơ hội xuất hành, giao tế xã hội, đối ngoại',
  'Nô Bộc': 'Bạn bè, mạng lưới giao thiệp, quý nhân và tiểu nhân',
  'Quan Lộc': 'Sự nghiệp, danh vọng, địa vị xã hội',
  'Điền Trạch': 'Bất động sản, điền sản, gia đạo, cội nguồn gia đình',
  'Phúc Đức': 'Đời sống tinh thần, nội tâm, phúc đức',
  'Phụ Mẫu': 'Phụ mẫu, trưởng bối, giấy tờ văn bản pháp lý',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate 命格总览 on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${s.name}${s.siHua ? '化' + s.siHua : ''}`).join('、')
      : '空宫（借对宫）';
    const role = PALACE_ROLES[selectedPalace.name] ?? '';

    const prompt = `请重点分析【${selectedPalace.name}】（主管：${role}），该宫主星为${starDesc}，按以下结构输出：

**【宫位定性】**
${selectedPalace.name}在命盘中的意义，以及这种星曜配置的整体判断。

**【主星解读】**
主星在此宫的倪海厦体系解读，引用具体观点。

**【三方四正联动】**
三方四正宫位对此宫的影响。

**【实际建议】**
基于此宫的具体建议。`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // 注入四化飞化分析
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // 找出该星所在宫位
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? '未知宫位';
    const viewLabel = selectedSiHua.view === 'daxian' ? '大限' : '流年';

    const prompt = `请分析【${viewLabel}${selectedSiHua.starName}化${selectedSiHua.siHua}】的飞化影响，按以下结构输出：

**【化${selectedSiHua.siHua}基本含义】**
化${selectedSiHua.siHua}在倪海厦体系中的核心含义，以及${selectedSiHua.starName}化${selectedSiHua.siHua}的特殊含义。

**【落宫影响】**
${selectedSiHua.starName}化${selectedSiHua.siHua}落在【${palaceName}】，该宫主管的领域受到何种影响，倪师如何解读。

**【三方四正飞化路径】**
化${selectedSiHua.siHua}入${palaceName}后，对其三方四正（对宫、两个三合宫）的联动影响。

**【当前运势影响】**
在${viewLabel}时间维度下，此化${selectedSiHua.siHua}对命主近期运势的具体影响。

**【实际建议】**
基于此四化的具体可操作建议。`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('Yêu cầu thất bại');
      if (!res.body) throw new Error('Không có luồng phản hồi');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let buffer = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6).trim();
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            if (delta) {
              assistantText += delta;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantText };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'api-missing';
      setMessages(prev => [...prev, { role: 'assistant', content: missing ? 'Bản mã nguồn mở không kèm sẵn AI API (/api/interpret). Phần an sao và lập lá số hoạt động 100% độc lập không cần API Key.' : 'Luận giải tạm thời gián đoạn do máy chủ bận, bạn vui lòng nhấn "Hỏi tiếp" để thử lại nhé.' }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Capture current messages synchronously via ref (avoids stale closure)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1">
          {TOPICS.map(t => {
            const isActive = activeTopic === t.key;
            return (
              <button
                key={t.key}
                onClick={() => handleTopicClick(t.key)}
                disabled={loading}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>Đang khởi tạo luận giải mệnh cách…</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Assistant message
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  LUẬN GIẢI MỆNH LÝ
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Đặt câu hỏi, ví dụ: Năm nay công danh thế nào?..."
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : 'Hỏi tiếp'}
          </button>
        </div>
      </div>

    </div>
  );
}
