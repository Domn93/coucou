// AI 对话 API 路由
import { NextRequest, NextResponse } from 'next/server'

// POST /api/ai/chat - AI 对话
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId } = body

    // TODO: 调用 AI 模型（如 Claude API）
    // 解析用户意图、推荐附近活动、生成响应

    return NextResponse.json({
      response: 'AI 回复开发中...',
      recommendations: []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}
