// 作者: Maqingze
// AI 对话 API — POST /api/ai
// 接入火山引擎豆包 doubao-seed-2-0-lite，支持流式输出
// 核心功能：
//   1. 普通 AI 对话（活动推荐、闲聊）
//   2. 自然语言解析活动意图 → 返回结构化表单字段

import { NextRequest, NextResponse } from 'next/server'

const ARK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/responses'
const ARK_MODEL = 'doubao-seed-2-0-lite-260215'

// 系统提示：CouCou AI 助手角色设定
const SYSTEM_PROMPT = `你是 CouCou 的 AI 助手，一个帮助年轻人发现和发起线下活动的智能助理。

你的能力：
1. 帮助用户发现附近的活动（根据他们的兴趣和时间）
2. 帮助用户发起活动（把自然语言转化为结构化活动信息）
3. 提供活动建议和社交互动技巧

当用户想要发起活动时，从他们的描述中提取以下信息并以 JSON 格式返回：
{
  "intent": "create_activity",
  "activity": {
    "title": "活动标题",
    "category": "card|sports|meal|hangout|exhibition|music",
    "location": "地点",
    "startTime": "ISO 8601 格式时间",
    "maxParticipants": 数字,
    "description": "活动描述"
  }
}

当用户只是普通对话时，返回：
{
  "intent": "chat",
  "response": "你的回复内容"
}

回复要简洁、友好、年轻化，多用 emoji。中文回复。`

// 调用火山引擎 Responses API
async function callArk(messages: { role: string; content: string }[], stream: boolean) {
  // 构建 input：系统提示 + 对话历史
  const input = [
    { role: 'system', content: [{ type: 'input_text', text: SYSTEM_PROMPT }] },
    ...messages.map(m => ({
      role: m.role,
      content: [{ type: 'input_text', text: m.content }],
    })),
  ]

  const res = await fetch(ARK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ARK_API_KEY}`,
    },
    body: JSON.stringify({ model: ARK_MODEL, input, stream }),
  })

  return res
}

// POST /api/ai — AI 对话（支持流式输出）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [], stream = false } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: '消息不能为空' }, { status: 400 })
    }

    // 构建对话历史
    const messages = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ]

    // 流式输出模式
    if (stream) {
      const arkRes = await callArk(messages, true)
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const reader = arkRes.body!.getReader()
            const decoder = new TextDecoder()
            let buf = ''
            while (true) {
              const { done, value } = await reader.read()
              if (done) break
              buf += decoder.decode(value, { stream: true })
              const lines = buf.split('\n')
              buf = lines.pop() ?? ''
              for (const line of lines) {
                if (!line.startsWith('data:')) continue
                const data = line.slice(5).trim()
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                  continue
                }
                try {
                  const json = JSON.parse(data)
                  // Responses API 流式结构
                  const text = json.output?.[0]?.content?.[0]?.text ?? ''
                  if (text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
                  }
                } catch {
                  // 忽略非 JSON 行
                }
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (err) {
            controller.error(err)
          }
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // 非流式模式
    const arkRes = await callArk(messages, false)
    const data = await arkRes.json()

    if (!arkRes.ok) {
      console.error('ARK API error:', data)
      throw new Error(data.error?.message ?? 'ARK API 请求失败')
    }

    // 取出文本内容：找 type=message 的那一项
    const messageOutput = data.output?.find((o: { type: string }) => o.type === 'message')
    const rawContent: string = messageOutput?.content?.[0]?.text ?? ''

    // 尝试解析结构化 JSON（活动创建意图）
    let parsed: { intent: string; response?: string; activity?: Record<string, unknown> } | null = null
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      }
    } catch {
      // 不是 JSON，作为普通回复处理
    }

    if (parsed?.intent === 'create_activity' && parsed.activity) {
      return NextResponse.json({
        intent: 'create_activity',
        response: `好的！我帮你整理了活动信息，点击下方按钮跳转填写 🎉`,
        activity: parsed.activity,
      })
    }

    return NextResponse.json({
      intent: 'chat',
      response: parsed?.response || rawContent,
    })
  } catch (error) {
    console.error('POST /api/ai error:', error)
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}
