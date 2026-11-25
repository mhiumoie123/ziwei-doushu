import { NextResponse } from 'next/server';
import {
  translateStarName,
  translatePalaceName,
  translateJu,
  translateBranch,
  translateStem,
  translateSiHua,
  translatePatternName,
  translatePatternDesc,
  translateCondition,
  translateBrightness,
} from '@/lib/ziwei/vietnamese';
import {
  getNapAm,
  getMenhCucRelation,
  getTrangSinhMap,
  getVongThaiTueMap,
  getTuanTriet,
  getLuuNienOverlay,
  translateGanZhi,
} from '@/lib/ziwei/vietnamese-accuracy';
import { detectPatterns } from '@/lib/ziwei/patterns';
import type { ZiweiChart } from '@/lib/ziwei/types';

export const runtime = 'nodejs';

const MAX_HISTORY_TURNS = 16;

/**
 * Gemini's REST API rejects turns whose parts have empty text, and silently
 * misbehaves on non-alternating roles. Also cap history to prevent context bloat.
 */
function sanitizeForGemini(messages: any[]): { role: string; parts: { text: string }[] }[] {
  const cleaned = messages
    .map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      text: typeof m.content === 'string' ? m.content.trim() : '',
    }))
    .filter((m) => m.text.length > 0);

  const merged: { role: string; text: string }[] = [];
  for (const m of cleaned) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) {
      last.text += '\n' + m.text;
    } else {
      merged.push({ ...m });
    }
  }

  const windowed = merged.slice(-MAX_HISTORY_TURNS);

  // Gemini requires the first turn to be 'user'
  while (windowed.length > 0 && windowed[0].role === 'model') {
    windowed.shift();
  }

  return windowed.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
}

function buildChartSummary(rawChart: any): string {
  if (!rawChart) return 'Chưa có thông tin lá số.';

  // Tương thích cả schema chuẩn (birthInfo / lunarInfo) lẫn dữ liệu cũ (birth / lunar)
  const birth = rawChart.birthInfo ?? rawChart.birth ?? {};
  const lunar = rawChart.lunarInfo ?? rawChart.lunar ?? null;

  const name = birth.name || 'Mệnh chủ';
  const gender: 'male' | 'female' = birth.gender === 'female' ? 'female' : 'male';
  const genderVi = gender === 'female' ? 'Nữ' : 'Nam';

  const orig = birth.origInput;
  const solar = orig
    ? `${orig.day}/${orig.month}/${orig.year} lúc ${String(orig.clockHour).padStart(2, '0')}:${String(orig.clockMinute).padStart(2, '0')}`
    : (birth.year ? `${birth.day}/${birth.month}/${birth.year}` : 'Không rõ');
  const hourBranchVi = typeof birth.hour === 'number' ? `Giờ ${translateBranch(birth.hour)}` : '';
  const placeVi = [birth.city, birth.province].filter(Boolean).join(', ');

  const yearStem = typeof lunar?.yearStem === 'number' ? lunar.yearStem : 0;
  const yearBranch = typeof lunar?.yearBranch === 'number' ? lunar.yearBranch : 0;
  const napAm = getNapAm(yearStem, yearBranch);
  const wuxingJu = typeof rawChart.wuxingJu === 'number' ? rawChart.wuxingJu : 3;
  const menhCuc = getMenhCucRelation(napAm.element, wuxingJu);
  const yinYangGenderVi = `${yearStem % 2 === 0 ? 'Dương' : 'Âm'} ${genderVi}`;

  const lunarText = lunar
    ? `Ngày ${lunar.lunarDay} tháng ${lunar.isLeapMonth ? 'Nhuận ' : ''}${lunar.lunarMonth} năm ${napAm.canChi} (${lunar.lunarYear})`
    : 'Không rõ';

  const pillarsRaw: string[] | undefined = lunar?.fourPillarsLunar ?? lunar?.fourPillars;
  const pillarsText = pillarsRaw?.length === 4
    ? `Năm ${translateGanZhi(pillarsRaw[0])}, Tháng ${translateGanZhi(pillarsRaw[1])}, Ngày ${translateGanZhi(pillarsRaw[2])}, Giờ ${translateGanZhi(pillarsRaw[3])}`
    : '';

  const ju = rawChart.wuxingJuNameVi || translateJu(rawChart.wuxingJuName) || rawChart.wuxingJuName || 'Chưa định cục';
  const mingBranch = translateBranch(rawChart.mingGongBranch);
  const shenBranch = translateBranch(rawChart.shenGongBranch);
  const mingZhuVi = rawChart.mingZhu ? translateStarName(rawChart.mingZhu) : '';
  const shenZhuVi = rawChart.shenZhu ? translateStarName(rawChart.shenZhu) : '';

  const trangSinhMap = getTrangSinhMap(wuxingJu, yearStem, gender);
  const thaiTueMap = getVongThaiTueMap(yearBranch);
  const tuanTriet = getTuanTriet(yearStem, yearBranch);

  const currentYear = new Date().getFullYear();
  const luuNien = getLuuNienOverlay(currentYear, yearBranch, gender);

  const palaces: any[] = Array.isArray(rawChart.palaces) ? rawChart.palaces : [];
  const palaceByBranch = new Map<number, any>();
  palaces.forEach(p => palaceByBranch.set(p.branch, p));

  const palacesText = palaces.map((p: any) => {
    const pName = p.nameVi || translatePalaceName(p.name);
    const ganZhi = `${translateStem(p.stem)} ${translateBranch(p.branch)}`;
    const flags: string[] = [];
    if (p.isMingGong) flags.push('CUNG MỆNH');
    if (p.isShenGong) flags.push('CUNG THÂN');
    if (p.isCurrentDaXian) flags.push('ĐẠI HẠN HIỆN TẠI');
    if (tuanTriet.tuan.includes(p.branch)) flags.push('TUẦN');
    if (tuanTriet.triet.includes(p.branch)) flags.push('TRIỆT');
    if (luuNien.tieuHanBranch === p.branch) flags.push(`TIỂU HẠN ${currentYear}`);
    if (luuNien.luuThaiTueBranch === p.branch) flags.push(`LƯU THÁI TUẾ ${currentYear}`);

    const majorStars = (p.stars || []).filter((s: any) => s.type === 'major');
    const otherStars = (p.stars || []).filter((s: any) => s.type !== 'major');

    const formatStar = (s: any) => {
      const sName = s.nameVi || translateStarName(s.name);
      const sihua = s.siHua ? ` [${translateSiHua(s.siHua)}]` : '';
      const bright = s.brightnessRaw ? translateBrightness(s.brightnessRaw, true) : (s.brightnessVi || '');
      return `${sName}${bright ? ` (${bright})` : ''}${sihua}`;
    };

    const majorStr = majorStars.length > 0
      ? majorStars.map(formatStar).join(', ')
      : `Vô Chính Diệu${Array.isArray(p.borrowedStars) && p.borrowedStars.length > 0 ? ` (Mượn đối cung: ${p.borrowedStars.map(translateStarName).join(', ')})` : ''}`;
    const otherStr = otherStars.map(formatStar).join(', ');
    const luuStars = (luuNien.starsByBranch[p.branch] ?? []).map(ls => ls.name).join(', ');
    const daXianStr = p.daXianAge ? `Đại hạn ${p.daXianAge[0]}-${p.daXianAge[1]}` : '';

    return `- Cung ${pName} (${ganZhi}${flags.length ? ` | ${flags.join(', ')}` : ''}${daXianStr ? ` | ${daXianStr}` : ''}): Chính tinh: ${majorStr}${otherStr ? ` | Phụ/Sát tinh: ${otherStr}` : ''} | Tràng Sinh: ${trangSinhMap[p.branch] ?? ''}, Thái Tuế: ${thaiTueMap[p.branch] ?? ''}${luuStars ? ` | Sao Lưu ${currentYear}: ${luuStars}` : ''}`;
  }).join('\n');

  // Chạy bộ nhận diện cách cục chuẩn cổ thư trực tiếp trên dữ liệu lá số thật
  let detectedPatterns: ReturnType<typeof detectPatterns> = [];
  try {
    if (palaces.length === 12) {
      detectedPatterns = detectPatterns(rawChart as ZiweiChart);
    }
  } catch { /* ignore if malformed */ }

  const patternsText = detectedPatterns.length > 0
    ? detectedPatterns.map((pat) => {
        const nameVi = translatePatternName(pat.name);
        const descVi = translatePatternDesc(pat.name, pat.description);
        const bonus = pat.conditions?.bonus?.length ? ` | Trợ cách: ${pat.conditions.bonus.map(translateCondition).join(', ')}` : '';
        const breaking = pat.conditions?.breaking?.length ? ` | Phá cách: ${pat.conditions.breaking.map(translateCondition).join(', ')}` : '';
        return `- [${pat.level.toUpperCase()}] ${nameVi}: ${descVi}${bonus}${breaking}`;
      }).join('\n')
    : 'Không có cách cục đặc biệt nổi trội, luận theo chính tinh và Tam phương Tứ chính.';

  const dx = rawChart.daXians?.[rawChart.currentDaXianIndex];
  const dxText = dx
    ? `Đại hạn hiện tại (${rawChart.currentAge ?? ''} tuổi mụ): ${dx.startAge}–${dx.endAge} tuổi tại Cung ${dx.palaceNameVi || translatePalaceName(dx.palaceName)} (${translateBranch(dx.palaceBranch)})`
    : '';
  const tieuHanPalace = palaceByBranch.get(luuNien.tieuHanBranch);
  const tieuHanText = `Lưu Niên ${currentYear} (${luuNien.canChi}): Lưu Thái Tuế tại ${translateBranch(luuNien.luuThaiTueBranch)}, Tiểu Hạn tại ${translateBranch(luuNien.tieuHanBranch)} (Cung ${translatePalaceName(tieuHanPalace?.name || '')})`;

  return `BẠN LÀ CHUYÊN GIA LUẬN GIẢI TỬ VI ĐẨU SỐ CHÍNH TÔNG THEO HỆ THỐNG DANH SƯ NGHÊ HẢI HÀ («THIÊN KỶ») KẾT HỢP NAM PHÁI VIỆT NAM.
Nguyên tắc luận giải bắt buộc:
1. "Mệnh cung vi bản, Tam phương vi dụng, Tứ Hóa vi cương": Phải bám chính xác 100% vị trí các sao, độ sáng Miếu/Vượng/Đắc/Hãm, Tuần–Triệt, Tứ Hóa và Tam phương Tứ chính trong dữ liệu lá số bên dưới — TUYỆT ĐỐI KHÔNG tự bịa sao hoặc đặt nhầm cung.
2. Cung Vô Chính Diệu phải luận mượn chính tinh Đối Cung kết hợp Tuần/Triệt và phụ tinh bản cung.
3. Đối chiếu Giới tính (${genderVi}, ${yinYangGenderVi}), Bản Mệnh Nạp Âm (${napAm.napAm}) và tương quan Mệnh–Cục (${menhCuc.label}) để luận chuẩn sắc thái Nam/Nữ mệnh.
4. Không thần bí hù dọa; mục đích thấu hiểu lá số là "Tri hành hợp nhất, xu cát tị hung, tu dưỡng bản thân".

HỒ SƠ LÁ SỐ CHÍNH XÁC:
- Mệnh chủ: ${name} (${genderVi} · ${yinYangGenderVi})
- Dương lịch: ${solar}${hourBranchVi ? ` (${hourBranchVi})` : ''}${placeVi ? ` · Nơi sinh: ${placeVi}` : ''}
- Âm lịch: ${lunarText}
${pillarsText ? `- Tứ Trụ Can Chi: ${pillarsText}\n` : ''}- Bản Mệnh Nạp Âm: ${napAm.napAm} (${napAm.meaning} — hành ${napAm.element})
- Ngũ Hành Cục: ${ju} → ${menhCuc.label} (${menhCuc.detail})
- Cung Mệnh tại: ${mingBranch} | Cung Thân tại: ${shenBranch}${mingZhuVi ? ` | Mệnh Chủ: ${mingZhuVi} | Thân Chủ: ${shenZhuVi}` : ''}
- Tuần Trung Không Vong: ${tuanTriet.tuan.map(translateBranch).join('–')} | Triệt Lộ Không Vong: ${tuanTriet.triet.map(translateBranch).join('–')}
${dxText ? `- ${dxText}\n` : ''}- ${tieuHanText}

CHI TIẾT 12 CUNG VỊ:
${palacesText}

CÁC CÁCH CỤC ĐÃ XÁC ĐỊNH TRÊN LÁ SỐ:
${patternsText}

YÊU CẦU TRÌNH BÀY:
1. Luận giải bằng Tiếng Việt chuẩn mực, dùng thuật ngữ Hán–Việt Tử Vi chính xác.
2. Dùng tiêu đề đóng khung dạng **【Tiêu đề】** ở đầu dòng để giao diện hiển thị đẹp và rõ ràng.
3. Dẫn chứng trực tiếp tên cung, sao, độ sáng, Tứ Hóa, Tuần/Triệt có thật trên lá số rồi mới đưa ra nhận định và lời khuyên hành động thực tế.`;
}

export async function POST(req: Request) {
  try {
    const { chart, messages = [] } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const aiKey = process.env.AI_API_KEY;

    if (!geminiKey && !deepseekKey && !openaiKey && !aiKey) {
      const guideText = `**【Chưa Cấu Hình AI API Key】**\n\n` +
        `Để kích hoạt tính năng AI luận giải tự động trên máy local:\n\n` +
        `1. Tạo Google Gemini API Key miễn phí tại **https://aistudio.google.com/apikey**\n` +
        `2. Thêm \`GEMINI_API_KEY=your_key\` vào file \`.env.local\` ở thư mục dự án rồi khởi động lại \`npm run dev\`.`;

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: guideText } })}\n\n`));
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const systemPrompt = buildChartSummary(chart);
    const encoder = new TextEncoder();

    // 1. NATIVE GEMINI STREAMING
    if (geminiKey) {
      const candidateModels = [
        process.env.GEMINI_MODEL,
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-3-flash',
        'gemini-flash-latest',
      ].filter(Boolean) as string[];

      const contents = sanitizeForGemini(messages);
      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Xin hãy tổng quan luận giải lá số của tôi.' }] });
      }

      let lastErrorText = '';
      for (const model of candidateModels) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`;
            const response = await fetch(geminiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': geminiKey,
              },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: {
                  temperature: 0.65,
                  maxOutputTokens: 4096,
                },
              }),
            });

            if (!response.ok || !response.body) {
              lastErrorText = await response.text();
              console.warn(`Gemini model ${model} (attempt ${attempt + 1}) failed (${response.status}):`, lastErrorText);
              if (response.status === 503 && attempt === 0) {
                await new Promise(r => setTimeout(r, 1000));
                continue;
              }
              break;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const stream = new ReadableStream({
              async start(controller) {
                let buffer = '';
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';
                    for (const line of lines) {
                      const trimmed = line.trim();
                      if (!trimmed.startsWith('data: ')) continue;
                      const jsonStr = trimmed.slice(6).trim();
                      if (!jsonStr) continue;
                      try {
                        const data = JSON.parse(jsonStr);
                        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                        if (text) {
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text } })}\n\n`));
                        }
                      } catch {}
                    }
                  }
                  controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                } catch (err) {
                  controller.error(err);
                } finally {
                  controller.close();
                }
              },
            });

            return new Response(stream, {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
              },
            });
          } catch (e: any) {
            lastErrorText = e.message;
            break;
          }
        }
      }

      console.error('All Gemini models failed:', lastErrorText);

      if (!deepseekKey && !openaiKey && !aiKey) {
        const isQuota = lastErrorText.includes('RESOURCE_EXHAUSTED') || lastErrorText.includes('429');
        const retryNotice = isQuota
          ? `**【Hạn Mức Truy Vấn Tạm Thời (Rate Limit)】**\n\n` +
            `Bạn vừa gửi nhiều câu hỏi trong thời gian ngắn nên tài khoản Google Gemini tạm thời chạm giới hạn tốc độ. ` +
            `Hạn mức sẽ tự hồi phục sau 1-2 phút, bạn vui lòng thử lại sau ít lát nhé!`
          : `**【Máy Chủ Google Gemini Đang Bận】**\n\n` +
            `Hệ thống Google Gemini đang chịu tải cao. Lá số của bạn đã được lưu an toàn, bạn vui lòng bấm **"Hỏi tiếp"** sau ít giây nhé!`;

        const readable = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: retryNotice } })}\n\n`));
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
            controller.close();
          },
        });

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
    }

    // 2. OPENAI COMPATIBLE PROVIDERS (DeepSeek / OpenAI / Compatible)
    const apiUrl = deepseekKey
      ? 'https://api.deepseek.com/v1/chat/completions'
      : (process.env.OPENAI_BASE_URL
        ? `${process.env.OPENAI_BASE_URL.replace(/\/+$/, '')}/chat/completions`
        : (process.env.AI_BASE_URL
          ? `${process.env.AI_BASE_URL.replace(/\/+$/, '')}/chat/completions`
          : 'https://api.openai.com/v1/chat/completions'));

    const apiKey = deepseekKey || openaiKey || aiKey;
    const modelName = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || process.env.AI_MODEL || (deepseekKey ? 'deepseek-chat' : 'gpt-4o-mini');

    const trimmedMessages = (messages as any[])
      .filter((m) => typeof m?.content === 'string' && m.content.trim().length > 0)
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...trimmedMessages,
        ],
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      throw new Error(`AI API returned ${response.status}: ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        let sentDone = false;
        try {
          while (!sentDone) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data: ')) continue;
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === '[DONE]') {
                sentDone = true;
                try { reader.cancel(); } catch {}
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                const text = parsed.choices?.[0]?.delta?.content ?? '';
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text } })}\n\n`));
                }
              } catch {}
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/interpret:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xử lý luận giải AI' }, { status: 500 });
  }
}
