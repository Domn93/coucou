// 作者: Maqingze
// 参与活动 API — POST /api/activities/[id]/join

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


// POST /api/activities/[id]/join — 加入活动
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 })
    }

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { participants: true },
    })

    if (!activity) {
      return NextResponse.json({ error: '活动不存在' }, { status: 404 })
    }

    // 检查人数上限
    if (activity.participants.length >= activity.maxParticipants) {
      return NextResponse.json({ error: '活动人数已满' }, { status: 400 })
    }

    // 检查是否已加入
    const alreadyJoined = activity.participants.some((p) => p.userId === userId)
    if (alreadyJoined) {
      return NextResponse.json({ error: '已加入该活动' }, { status: 400 })
    }

    // 加入活动
    await prisma.activityParticipant.create({
      data: { activityId: id, userId },
    })

    // 发送系统消息到聊天室
    const chatRoom = await prisma.chatRoom.findUnique({ where: { activityId: id } })
    if (chatRoom) {
      const user = await prisma.user.findUnique({ where: { id: userId } })
      await prisma.chatMessage.create({
        data: {
          roomId: chatRoom.id,
          senderId: userId,
          content: `${user?.name || '新成员'} 加入了活动 🎉`,
          isSystem: true,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/activities/[id]/join error:', error)
    return NextResponse.json({ error: 'Failed to join activity' }, { status: 500 })
  }
}

// DELETE /api/activities/[id]/join — 退出活动
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: '需要登录' }, { status: 401 })
    }

    await prisma.activityParticipant.deleteMany({
      where: { activityId: id, userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/activities/[id]/join error:', error)
    return NextResponse.json({ error: 'Failed to leave activity' }, { status: 500 })
  }
}
