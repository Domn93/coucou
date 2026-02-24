// 作者: Maqingze
// 聊天消息 API — GET /api/chat/[roomId]、POST /api/chat/[roomId]

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// GET /api/chat/[roomId] — 获取聊天消息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') // 用于分页

    const messages = await prisma.chatMessage.findMany({
      where: {
        roomId,
        ...(before ? { createdAt: { lt: new Date(before) } } : {}),
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    })

    const formatted = messages.map((m) => ({
      id: m.id,
      roomId: m.roomId,
      sender: {
        id: m.sender.id,
        name: m.sender.name,
        avatar: m.sender.avatar || '',
      },
      content: m.content,
      isSystem: m.isSystem,
      timestamp: m.createdAt.toISOString(),
    }))

    return NextResponse.json({ messages: formatted })
  } catch (error) {
    console.error('GET /api/chat/[roomId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST /api/chat/[roomId] — 发送聊天消息
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const body = await request.json()
    const { senderId, content } = body

    if (!senderId || !content?.trim()) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    // 验证聊天室存在
    const chatRoom = await prisma.chatRoom.findUnique({ where: { id: roomId } })
    if (!chatRoom) {
      return NextResponse.json({ error: '聊天室不存在' }, { status: 404 })
    }

    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        content: content.trim(),
        isSystem: false,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    })

    return NextResponse.json({
      id: message.id,
      roomId: message.roomId,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        avatar: message.sender.avatar || '',
      },
      content: message.content,
      isSystem: message.isSystem,
      timestamp: message.createdAt.toISOString(),
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/chat/[roomId] error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
