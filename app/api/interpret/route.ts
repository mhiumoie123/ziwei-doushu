import { NextResponse } from 'next/server';
import {
  translateStarName,
  translatePalaceName,
  translateJu,
  translateBranch,
  translateSiHua,
  translatePatternName,
  translateBrightness,
} from '@/lib/ziwei/vietnamese';

export const runtime = 'nodejs';

function buildChartSummary(chart: any): string {
  if (!chart) return 'Chưa có thông tin lá số.';

  const name = chart.birth?.name || 'Mệnh chủ';
  const gender = chart.birth?.gender === 'female' ? 'Nữ' : 'Nam';
  const solar = `${chart.birth?.year}-${chart.birth?.month}-${chart.birth?.day}`;
  const lunar = chart.lunar
    ? `Năm ${chart.lunar.lunarYear}, tháng ${chart.lunar.lunarMonth}, ngày ${chart.lunar.lunarDay}`
    : '';
  const ju = chart.wuxingJuNameVi || translateJu(chart.wuxingJuName) || chart.wuxingJuName || 'Chưa định cục';
  const mingBranch = translateBranch(chart.mingGongBranch);
  const shenBranch = translateBranch(chart.shenGongBranch);

  const palacesText = (chart.palaces || []).map((p: any) => {
    const pName = p.nameVi || translatePalaceName(p.name);
    const branch = translateBranch(p.branch);
    const stars = (p.stars || []).map((s: any) => {
      const sName = s.nameVi || translateStarName(s.name);
      const sihua = s.siHua ? ` [Hóa ${translateSiHua(s.siHua)}]` : '';
      const bright = s.brightnessVi || (s.brightnessRaw ? translateBrightness(s.brightnessRaw) : '');
      return `${sName}${bright ? ` (${bright})` : ''}${sihua}`;
    }).join(', ') || 'Vô Chính Diệu';
    return `- Cung ${pName} (tại ${branch}): ${stars}`;
  }).join('\n');

  const patternsText = (chart.patterns || []).map((pat: any) => {
    return `- ${pat.nameVi || translatePatternName(pat.name)}: ${pat.descVi || pat.description || ''}`;
  }).join('\n') || 'Không có cách cục đặc biệt';

  const dx = chart.daXians?.[chart.currentDaXianIndex];
  const dxText = dx ? `Đại hạn hiện tại: ${dx.startAge}-${dx.endAge} tuổi (Cung ${dx.palaceNameVi || translatePalaceName(dx.palaceName)})` : '';

  return `BẠN LÀ CHUYÊN GIA LUẬN GIẢI TỬ VI ĐẨU SỐ THEO HỆ THỐNG CHÍNH TÔNG CỦA DANH SƯ NGHÊ HẢI HÀ («THIÊN KỶ»).
Quan điểm cốt lõi của Thầy Nghê:
- "Mệnh cung vi bản, Tam phương vi dụng, Tứ Hóa vi cương" (Cung Mệnh là gốc rễ tính cách và tài năng; Tam phương Tứ chính là đấu trường thi thố; Tứ Hóa mới là then chốt định đoạt biến động vận thế).
- Cung Vô Chính Diệu nhất định phải mượn chính tinh của Đối Cung để luận giải.
- Tuyệt đối không bói toán thần bí, bi quan hay hù dọa; mục đích của thấu hiểu mệnh lý là để "Tri hành hợp nhất, xu cát tị hung, tu dưỡng bản thân và kiến tạo tương lai tốt đẹp nhất".

THÔNG TIN LÁ SỐ BẢN MỆNH:
- Họ tên: ${name} (${gender})
- Dương lịch: ${solar} | Âm lịch: ${lunar}
- Cục số: ${ju}
- Cung Mệnh tại: ${mingBranch} | Cung Thân tại: ${shenBranch}
${dxText ? `- ${dxText}\n` : ''}
BỐ CỤC 12 CUNG VỊ:
${palacesText}

CÁCH CỤC MỆNH BÀN:
${patternsText}

YÊU CẦU TRÌNH BÀY:
1. Luận giải bằng Tiếng Việt chuẩn mực, tôn trọng thuật ngữ Hán - Việt Tử Vi chính tông.
2. Trình bày rành mạch, sử dụng các tiêu đề đóng khung dạng **【Tiêu đề】** ở đầu dòng (ví dụ: **【Định Tính Mệnh Cách】**, **【Luận Giải Chính Tinh】**, **【Tam Phương Tứ Chính】**, **【Lời Khuyên Hành Động】**) để giao diện hiển thị sang trọng.
3. Luôn đưa ra lời khuyên thực tế, mang tính khai mở trí tuệ và khích lệ mệnh chủ.`;
}

export async function POST(req: Request) {
  try {
    const { chart, messages = [] } = await req.json();

    const geminiKey = process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const aiKey = process.env.AI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!geminiKey && !deepseekKey && !openaiKey && !aiKey && !anthropicKey) {
      const guideText = `**【Chưa Cấu Hình AI API Key】**\n\n` +
        `Để kích hoạt tính năng AI luận giải tự động:\n\n` +
        `1. **Lấy API Key Miễn Phí**: Bạn có thể tạo Google Gemini API Key hoàn toàn miễn phí tại **https://aistudio.google.com/apikey**\n` +
        `2. **Gắn vào Vercel**: Vào Settings → **Environment Variables**, thêm biến \`GEMINI_API_KEY\` với giá trị mã khóa của bạn.\n\n` +
        `Sau khi thêm, tính năng luận giải AI và hỏi đáp tương tác sẽ hoạt động tức thì!`;

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

    // 1. NATIVE GEMINI STREAMING (Ưu tiên số 1 nếu có GEMINI_API_KEY)
    if (geminiKey) {
      // Danh sách các model đang hoạt động chuẩn 2026 của Google
      const candidateModels = [
        process.env.GEMINI_MODEL,
        'gemini-3.5-flash-lite',
        'gemini-3.8-flash',
        'gemini-3-flash',
        'gemini-flash-latest',
      ].filter(Boolean) as string[];

      // Chuẩn bị contents theo chuẩn Gemini REST API
      const contents = [
        ...messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
      ];
      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Xin hãy tổng quan luận giải lá số của tôi.' }] });
      }

      let lastErrorText = '';
      for (const model of candidateModels) {
        // Thử tối đa 2 lần cho mỗi model nếu gặp 503 (quá tải đột xuất)
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
              console.warn(`Gemini model ${model} (attempt ${attempt + 1}) failed (${response.status}):`, lastErrorText);
              if (response.status === 503 && attempt === 0) {
                // Đợi 1 giây rồi thử lại model này
                await new Promise(r => setTimeout(r, 1000));
                continue;
              }
              break; // Chuyển sang model tiếp theo
            }

            // Kết nối thành công, đọc SSE từ Gemini và map sang định dạng client
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

      // Nếu chỉ có Gemini Key mà không có OpenAI/DeepSeek key thì trả về thông báo thân thiện
      if (!deepseekKey && !openaiKey && !aiKey) {
        const retryNotice = `**【Máy Chủ Google Gemini Đang Bận】**\n\n` +
          `Hệ thống Google Gemini đang trong khung giờ cao điểm chịu tải cao (503). ` +
          `Lá số của bạn đã được lưu trữ, bạn vui lòng nhấn nút **"Hỏi tiếp"** hoặc bấm lại chủ đề luận giải sau ít giây nhé!`;

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

    // 2. OPENAI COMPATIBLE PROVIDERS (DeepSeek / OpenAI / Groq / OpenAI Compatible)
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
          ...messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
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
    console.error('Error in /api/interpret:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xử lý luận giải AI' }, { status: 500 });
  }
}
