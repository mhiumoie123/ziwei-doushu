import { NextResponse } from 'next/server';
import {
  translateStarName,
  translatePalaceName,
  translateJu,
  translateBranch,
  translateSiHua,
} from '@/lib/ziwei/vietnamese';

export const runtime = 'nodejs';

function formatBriefChart(chart: any, sideName: string): string {
  if (!chart) return `Chưa có thông tin ${sideName}`;
  const name = chart.birth?.name || sideName;
  const gender = chart.birth?.gender === 'female' ? 'Nữ' : 'Nam';
  const solar = `${chart.birth?.year}-${chart.birth?.month}-${chart.birth?.day}`;
  const ju = chart.wuxingJuNameVi || translateJu(chart.wuxingJuName) || chart.wuxingJuName || '';
  const mingBranch = translateBranch(chart.mingGongBranch);

  const mingPalace = (chart.palaces || []).find((p: any) => p.branch === chart.mingGongBranch);
  const phuThePalace = (chart.palaces || []).find((p: any) => p.name === '夫妻宫' || p.nameVi === 'Phu Thê');

  const getStarsStr = (p: any) => {
    if (!p) return 'Không rõ';
    return (p.stars || []).map((s: any) => {
      const sName = s.nameVi || translateStarName(s.name);
      const sihua = s.siHua ? ` [Hóa ${translateSiHua(s.siHua)}]` : '';
      return `${sName}${sihua}`;
    }).join(', ') || 'Vô Chính Diệu';
  };

  const mingStars = getStarsStr(mingPalace);
  const phuTheStars = getStarsStr(phuThePalace);

  return `【${sideName} - ${name} (${gender})】
- Sinh ngày: ${solar} | Cục số: ${ju} | Mệnh tọa tại: ${mingBranch}
- Sao Cung Mệnh: ${mingStars}
- Sao Cung Phu Thê: ${phuTheStars}`;
}

export async function POST(req: Request) {
  try {
    const { chartA, chartB, question } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const aiKey = process.env.AI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!geminiKey && !deepseekKey && !openaiKey && !aiKey && !anthropicKey) {
      const guideText = `**【Chưa Cấu Hình AI API Key Cho Tính Năng Hợp Mệnh】**\n\n` +
        `Để kích hoạt phân tích Hợp Mệnh so đôi bằng AI:\n\n` +
        `1. Lấy Google Gemini API Key miễn phí tại **https://aistudio.google.com/apikey**\n` +
        `2. Thêm biến môi trường \`GEMINI_API_KEY\` vào Vercel (Project Settings → Environment Variables).\n` +
        `3. Hệ thống sẽ tự động kích hoạt tính năng so khớp lá số và phân tích duyên phận!`;

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

    const systemPrompt = `BẠN LÀ CHUYÊN GIA HỢP MỆNH TỬ VI ĐẨU SỐ THEO HỆ THỐNG DANH SƯ NGHÊ HẢI HÀ.
Dựa trên nguyên lý so đôi lá số (tương tác Cung Phu Thê, Cung Mệnh, ngũ hành nạp âm và phi hóa giữa hai bên), hãy phân tích tương quan giữa hai người.

Thông tin hai lá số:
${summaryA}

${summaryB}

${question ? `Yêu cầu cụ thể từ người hỏi: "${question}"` : 'Hãy phân tích toàn diện về độ hòa hợp tình cảm, tính cách tương bổ, điểm cần lưu ý và lời khuyên ứng xử tối ưu.'}

Định dạng trả lời:
- Luận giải bằng Tiếng Việt chuẩn mực, thuật ngữ Hán - Việt Tử Vi chính tông.
- Dùng các đề mục rõ ràng dạng **【Tiêu đề】** ở đầu dòng (ví dụ: **【Tổng Quan Duyên Phận】**, **【Tương Tác Cung Mệnh & Tính Cách】**, **【Phối Ngẫu & Cung Phu Thê】**, **【Điểm Cần Thấu Hiểu & Lưu Ý】**, **【Lời Khuyên Hạnh Phúc】**).
- Đưa ra lời khuyên chân thành, xây dựng, tích cực và hướng thượng.`;

    const encoder = new TextEncoder();

    // 1. NATIVE GEMINI STREAMING (Ưu tiên nếu có GEMINI_API_KEY)
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
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${geminiKey}&alt=sse`;
            const response = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 2048,
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
        const retryNotice = `**【Máy Chủ Google Gemini Đang Bận】**\n\n` +
          `Hệ thống Google Gemini đang trong khung giờ cao điểm chịu tải cao (503). ` +
          `Dữ liệu hai lá số đã được bảo toàn, bạn vui lòng nhấn nút phân tích lại sau vài giây nhé!`;

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
              const dataStr = trimmed.slice(6).trim();
              if (dataStr === '[DONE]') {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
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
