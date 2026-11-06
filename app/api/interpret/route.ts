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

interface AIConfig {
  url: string;
  key: string;
  model: string;
  isAnthropic?: boolean;
}

function resolveAIConfig(): AIConfig | null {
  // 1. Google Gemini (khuyên dùng, có API key miễn phí tại Google AI Studio)
  if (process.env.GEMINI_API_KEY) {
    return {
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      key: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    };
  }

  // 2. DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      url: 'https://api.deepseek.com/v1/chat/completions',
      key: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    };
  }

  // 3. OpenAI
  if (process.env.OPENAI_API_KEY) {
    return {
      url: process.env.OPENAI_BASE_URL ? `${process.env.OPENAI_BASE_URL.replace(/\/+$/, '')}/chat/completions` : 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }

  // 4. Generic OpenAI compatible (Groq, OpenRouter, v.v.)
  if (process.env.AI_API_KEY && process.env.AI_BASE_URL) {
    return {
      url: `${process.env.AI_BASE_URL.replace(/\/+$/, '')}/chat/completions`,
      key: process.env.AI_API_KEY,
      model: process.env.AI_MODEL || 'gpt-4o-mini',
    };
  }

  // 5. Claude (Anthropic)
  if (process.env.ANTHROPIC_API_KEY) {
    return {
      url: 'https://api.anthropic.com/v1/messages',
      key: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022',
      isAnthropic: true,
    };
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { chart, messages = [] } = await req.json();

    const config = resolveAIConfig();
    if (!config) {
      // Chưa cấu hình API Key: trả về stream thông báo hướng dẫn thay vì 404
      const guideText = `**【Chưa Cấu Hình AI API Key】**\n\n` +
        `Để kích hoạt tính năng AI luận giải tự động:\n\n` +
        `1. **Lấy API Key Miễn Phí**: Bạn có thể tạo Google Gemini API Key hoàn toàn miễn phí tại **https://aistudio.google.com/apikey** (hoặc dùng DeepSeek / OpenAI / Claude).\n` +
        `2. **Gắn vào Vercel**: Vào trang quản trị Vercel → Project Settings → **Environment Variables**, thêm biến \`GEMINI_API_KEY\` với giá trị API Key của bạn.\n` +
        `3. **Nếu chạy trên VPS/Local**: Thêm dòng \`GEMINI_API_KEY=your_api_key\` vào file \`.env.local\` rồi khởi động lại ứng dụng.\n\n` +
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

    if (config.isAnthropic) {
      // Anthropic Claude
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.key,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: 2048,
          system: systemPrompt,
          stream: true,
          messages: messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Anthropic API Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

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
                if (line.startsWith('data: ')) {
                  const dataStr = line.slice(6).trim();
                  if (!dataStr) continue;
                  try {
                    const parsed = JSON.parse(dataStr);
                    if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: parsed.delta.text } })}\n\n`));
                    }
                  } catch {}
                }
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
    }

    // OpenAI / Gemini / DeepSeek / Compatible endpoint
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        model: config.model,
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
      console.error('LLM API Error:', response.status, errText);
      throw new Error(`LLM API returned ${response.status}: ${errText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

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
