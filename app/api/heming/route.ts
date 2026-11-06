import { NextResponse } from 'next/server';
import {
  translateStarName,
  translatePalaceName,
  translateJu,
  translateBranch,
  translateSiHua,
  translatePatternName,
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

interface AIConfig {
  url: string;
  key: string;
  model: string;
  isAnthropic?: boolean;
}

function resolveAIConfig(): AIConfig | null {
  if (process.env.GEMINI_API_KEY) {
    return {
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      key: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      url: 'https://api.deepseek.com/v1/chat/completions',
      key: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      url: process.env.OPENAI_BASE_URL ? `${process.env.OPENAI_BASE_URL.replace(/\/+$/, '')}/chat/completions` : 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }
  if (process.env.AI_API_KEY && process.env.AI_BASE_URL) {
    return {
      url: `${process.env.AI_BASE_URL.replace(/\/+$/, '')}/chat/completions`,
      key: process.env.AI_API_KEY,
      model: process.env.AI_MODEL || 'gpt-4o-mini',
    };
  }
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
    const { chartA, chartB, question } = await req.json();

    const config = resolveAIConfig();
    if (!config) {
      const guideText = `**【Chưa Cấu Hình AI API Key Cho Tính Năng Hợp Mệnh】**\n\n` +
        `Để kích hoạt phân tích Hợp Mệnh so đôi bằng AI:\n\n` +
        `1. Lấy Google Gemini API Key miễn phí tại **https://aistudio.google.com/apikey**\n` +
        `2. Thêm biến môi trường \`GEMINI_API_KEY\` vào Vercel (Project Settings → Environment Variables) hoặc file \`.env.local\` trên VPS.\n` +
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

    const systemPrompt = `BẠN LÀ CHUYÊN GIA HỢP MỆNH TỬ VI ĐẨU SỐ THEO HỆ THỐNG NGHÊ HẢI HÀ.
Dựa trên nguyên lý so đôi lá số (tương tác Cung Phu Thê, Cung Mệnh, ngũ hành nạp âm và phi hóa giữa hai bên), hãy phân tích tương quan giữa hai người.

Thông tin hai lá số:
${summaryA}

${summaryB}

${question ? `Yêu cầu cụ thể từ người hỏi: "${question}"` : 'Hãy phân tích toàn diện về độ hòa hợp tình cảm, tính cách tương bổ, điểm cần lưu ý và lời khuyên ứng xử tối ưu.'}

Định dạng trả lời:
- Sử dụng Tiếng Việt chuẩn mực.
- Dùng các đề mục rõ ràng dạng **【Tiêu đề】** ở đầu dòng.
- Đưa ra lời khuyên chân thành, xây dựng và tích cực.`;

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
          { role: 'user', content: question || 'Xin hãy phân tích mức độ hòa hợp và tương tác giữa hai lá số trên.' },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      const errText = await response.text();
      console.error('LLM API Error (heming):', response.status, errText);
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
    console.error('Error in /api/heming:', error);
    return NextResponse.json({ error: error.message || 'Lỗi xử lý hợp mệnh AI' }, { status: 500 });
  }
}
