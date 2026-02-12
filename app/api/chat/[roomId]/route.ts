// 聊天 API 路由
import { NextRequest, NextResponse } from 'next/server'

// GET /api/chat/[roomId] - 获取聊天消息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    // TODO: 从数据库获取聊天消息
    return NextResponse.json({
      messages: [],
      message: 'API 开发中...'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/chat/[roomId] - 发送聊天消息
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const body = await request.json()
    // TODO: 验证输入、保存消息、发送 Realtime 事件
    return NextResponse.json({ id: 'new-message-id' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
