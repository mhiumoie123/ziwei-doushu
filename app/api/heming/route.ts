import { NextResponse } from 'next/server';
import {
  translateStarName,
  translatePalaceName,
  translateJu,
  translateBranch,
  translateSiHua,
  translateBrightness,
} from '@/lib/ziwei/vietnamese';
import {
  getNapAm,
  getMenhCucRelation,
  getTuanTriet,
} from '@/lib/ziwei/vietnamese-accuracy';

export const runtime = 'nodejs';

function formatBriefChart(rawChart: any, sideName: string): string {
  if (!rawChart) return `Chưa có thông tin ${sideName}`;
  const birth = rawChart.birthInfo ?? rawChart.birth ?? {};
  const lunar = rawChart.lunarInfo ?? rawChart.lunar ?? null;

  const name = birth.name || sideName;
  const gender: 'male' | 'female' = birth.gender === 'female' ? 'female' : 'male';
  const genderVi = gender === 'female' ? 'Nữ' : 'Nam';
  const orig = birth.origInput;
  const solar = orig
    ? `${orig.day}/${orig.month}/${orig.year} ${String(orig.clockHour).padStart(2, '0')}:${String(orig.clockMinute).padStart(2, '0')}`
    : (birth.year ? `${birth.day}/${birth.month}/${birth.year}` : 'Không rõ');

  const yearStem = typeof lunar?.yearStem === 'number' ? lunar.yearStem : 0;
  const yearBranch = typeof lunar?.yearBranch === 'number' ? lunar.yearBranch : 0;
  const napAm = getNapAm(yearStem, yearBranch);
  const wuxingJu = typeof rawChart.wuxingJu === 'number' ? rawChart.wuxingJu : 3;
  const menhCuc = getMenhCucRelation(napAm.element, wuxingJu);
  const tuanTriet = getTuanTriet(yearStem, yearBranch);

  const ju = rawChart.wuxingJuNameVi || translateJu(rawChart.wuxingJuName) || rawChart.wuxingJuName || '';
  const mingBranch = translateBranch(rawChart.mingGongBranch);
  const shenBranch = translateBranch(rawChart.shenGongBranch);

  const palaces: any[] = Array.isArray(rawChart.palaces) ? rawChart.palaces : [];
  const findPalace = (names: string[]) =>
    palaces.find((p: any) => names.includes(p.name) || names.includes(p.nameVi));

  const mingPalace = palaces.find((p: any) => p.branch === rawChart.mingGongBranch);
  const phuThePalace = findPalace(['夫妻', '夫妻宫', 'Phu Thê']);
  const phucDucPalace = findPalace(['福德', '福德宫', 'Phúc Đức']);
  const taiBachPalace = findPalace(['财帛', '财帛宫', 'Tài Bạch']);
  const quanLocPalace = findPalace(['官禄', '官禄宫', 'Quan Lộc']);

  const getStarsStr = (p: any) => {
    if (!p) return 'Không rõ';
    const majors = (p.stars || []).filter((s: any) => s.type === 'major');
    const others = (p.stars || []).filter((s: any) => s.type !== 'major');
    const fmt = (s: any) => {
      const sName = s.nameVi || translateStarName(s.name);
      const bright = s.brightnessRaw ? ` (${translateBrightness(s.brightnessRaw)})` : '';
      const sihua = s.siHua ? ` [${translateSiHua(s.siHua)}]` : '';
      return `${sName}${bright}${sihua}`;
    };
    const majorTxt = majors.length > 0
      ? majors.map(fmt).join(', ')
      : `Vô Chính Diệu${Array.isArray(p.borrowedStars) && p.borrowedStars.length > 0 ? ` (Mượn: ${p.borrowedStars.map(translateStarName).join(', ')})` : ''}`;
    const otherTxt = others.map(fmt).join(', ');
    const ttFlags = [
      tuanTriet.tuan.includes(p.branch) ? 'TUẦN' : '',
      tuanTriet.triet.includes(p.branch) ? 'TRIỆT' : '',
    ].filter(Boolean).join('/');
    return `${majorTxt}${otherTxt ? ` | Phụ: ${otherTxt}` : ''}${ttFlags ? ` | ${ttFlags}` : ''}`;
  };

  const dx = rawChart.daXians?.[rawChart.currentDaXianIndex];
  const dxStr = dx ? `${dx.startAge}–${dx.endAge} tuổi (Cung ${dx.palaceNameVi || translatePalaceName(dx.palaceName)})` : '';

  return `【${sideName} - ${name} (${genderVi} · ${napAm.canChi})】
- Dương lịch: ${solar} | Bản Mệnh Nạp Âm: ${napAm.napAm} (${napAm.element})
- Cục số: ${ju} (${menhCuc.label}) | Mệnh tại ${mingBranch} · Thân tại ${shenBranch}${dxStr ? ` | Đại hạn: ${dxStr}` : ''}
- Cung Mệnh: ${getStarsStr(mingPalace)}
- Cung Phu Thê: ${getStarsStr(phuThePalace)}
- Cung Phúc Đức: ${getStarsStr(phucDucPalace)}
- Cung Tài Bạch: ${getStarsStr(taiBachPalace)}
- Cung Quan Lộc: ${getStarsStr(quanLocPalace)}`;
}

export async function POST(req: Request) {
  try {
    const { chartA, chartB, question } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const aiKey = process.env.AI_API_KEY;

    if (!geminiKey && !deepseekKey && !openaiKey && !aiKey) {
      const guideText = `**【Chưa Cấu Hình AI API Key Cho Tính Năng Hợp Mệnh】**\n\n` +
        `Thêm \`GEMINI_API_KEY=your_key\` vào file \`.env.local\` ở thư mục dự án rồi khởi động lại server để kích hoạt tính năng so đôi lá số bằng AI.`;

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

    const summaryA = formatBriefChart(chartA, 'Bên A');
    const summaryB = formatBriefChart(chartB, 'Bên B');

    const systemPrompt = `BẠN LÀ CHUYÊN GIA HỢP MỆNH TỬ VI ĐẨU SỐ THEO HỆ THỐNG DANH SƯ NGHÊ HẢI HÀ KẾT HỢP NAM PHÁI VIỆT NAM.
Dựa chính xác trên dữ liệu hai lá số bên dưới (tương tác Cung Mệnh, Cung Phu Thê, Cung Phúc Đức, Ngũ hành Nạp Âm, Tứ Hóa, Tuần–Triệt và Đại Hạn của hai bên), hãy phân tích tương quan giữa hai người. Tuyệt đối không tự bịa sao không có trên lá số.

Thông tin hai lá số:
${summaryA}

${summaryB}

${question ? `Yêu cầu cụ thể từ người hỏi: "${question}"` : 'Hãy phân tích toàn diện về độ hòa hợp tình cảm, tính cách tương bổ, điểm cần lưu ý và lời khuyên ứng xử tối ưu.'}

Định dạng trả lời:
- Luận giải bằng Tiếng Việt chuẩn mực, thuật ngữ Hán–Việt Tử Vi chính tông.
- Dùng các đề mục rõ ràng dạng **【Tiêu đề】** ở đầu dòng.
- Dẫn chứng cụ thể các sao & cung vị của Bên A và Bên B rồi đưa ra lời khuyên thực tế, xây dựng.`;

    const encoder = new TextEncoder();

    if (geminiKey) {
      const candidateModels = [
        process.env.GEMINI_MODEL,
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-3-flash',
        'gemini-flash-latest',
      ].filter(Boolean) as string[];

      const userMessage = question || 'Xin hãy phân tích mức độ hòa hợp và tương tác giữa hai lá số trên.';
      const contents = [{ role: 'user', parts: [{ text: userMessage }] }];

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
              console.warn(`Gemini heming model ${model} (attempt ${attempt + 1}) failed (${response.status}):`, lastErrorText);
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

      console.error('All Gemini models failed for heming:', lastErrorText);

      if (!deepseekKey && !openaiKey && !aiKey) {
        const isQuota = lastErrorText.includes('RESOURCE_EXHAUSTED') || lastErrorText.includes('429');
        const retryNotice = isQuota
          ? `**【Hạn Mức Truy Vấn Tạm Thời (Rate Limit)】**\n\n` +
            `Bạn vừa gửi nhiều yêu cầu phân tích trong thời gian ngắn. Hạn mức sẽ tự phục hồi sau 1-2 phút.`
          : `**【Máy Chủ Google Gemini Đang Bận】**\n\n` +
            `Hệ thống Google Gemini đang chịu tải cao. Bạn vui lòng bấm phân tích lại sau vài giây nhé!`;

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

    // 2. OPENAI COMPATIBLE PROVIDERS
    const apiUrl = deepseekKey
      ? 'https://api.deepseek.com/v1/chat/completions'
      : (process.env.OPENAI_BASE_URL
        ? `${process.env.OPENAI_BASE_URL.replace(/\/+$/, '')}/chat/completions`
        : (process.env.AI_BASE_URL
          ? `${process.env.AI_BASE_URL.replace(/\/+$/, '')}/chat/completions`
          : 'https://api.openai.com/v1/chat/completions'));

    const apiKey = deepseekKey || openaiKey || aiKey;
    const modelName = process.env.DEEPSEEK_MODEL || process.env.OPENAI_MODEL || process.env.AI_MODEL || (deepseekKey ? 'deepseek-chat' : 'gpt-4o-mini');

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
          { role: 'user', content: question || 'Xin hãy phân tích mức độ hòa hợp và tương tác giữa hai lá số trên.' },
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
    console.error('Error in /api/heming:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xử lý hợp mệnh AI' }, { status: 500 });
  }
}
