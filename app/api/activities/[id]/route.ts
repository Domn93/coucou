// 作者: Maqingze
// 活动详情 API — GET /api/activities/[id]、DELETE /api/activities/[id]

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


const categoryMap: Record<string, { label: string; emoji: string }> = {
  card: { label: '打牌', emoji: '🃏' },
  sports: { label: '运动', emoji: '🏃' },
  meal: { label: '饭局', emoji: '🍜' },
  hangout: { label: '闲逛', emoji: '🚶' },
  exhibition: { label: '展览', emoji: '🖼' },
  music: { label: '音乐', emoji: '🎵' },
}

function getTimeDisplay(startTime: Date): string {
  const now = new Date()
  const diff = startTime.getTime() - now.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  if (diff < 0) return '已开始'
  if (minutes < 60) return `${minutes}分钟后开始`
  if (hours < 24) return `${hours}小时后开始`
  return startTime.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

// GET /api/activities/[id] — 获取活动详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        initiator: { select: { id: true, name: true, avatar: true, rating: true, eventCount: true } },
        participants: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { joinedAt: 'asc' },
        },
        chatRoom: { select: { id: true } },
      },
    })

    if (!activity) {
      return NextResponse.json({ error: '活动不存在' }, { status: 404 })
    }

    const cat = categoryMap[activity.category] || { label: activity.category, emoji: '✦' }

    return NextResponse.json({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      categoryLabel: cat.label,
      categoryEmoji: cat.emoji,
      location: activity.location,
      distance: activity.distance,
      startTime: activity.startTime.toISOString(),
      timeDisplay: getTimeDisplay(activity.startTime),
      urgency: activity.maxParticipants - activity.participants.length <= 1
        ? `急缺${activity.maxParticipants - activity.participants.length}人`
        : undefined,
      currentParticipants: activity.participants.length,
      maxParticipants: activity.maxParticipants,
      initiator: {
        id: activity.initiator.id,
        name: activity.initiator.name,
        avatar: activity.initiator.avatar || '',
        rating: activity.initiator.rating,
        eventCount: activity.initiator.eventCount,
      },
      participants: activity.participants.map((p) => ({
        id: p.user.id,
        name: p.user.name,
        avatar: p.user.avatar || '',
      })),
      chatRoomId: activity.chatRoom?.id,
      createdAt: activity.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('GET /api/activities/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}

// DELETE /api/activities/[id] — 取消活动（仅发起人可操作）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const { userId } = body

    const activity = await prisma.activity.findUnique({ where: { id } })
    if (!activity) {
      return NextResponse.json({ error: '活动不存在' }, { status: 404 })
    }
    if (activity.initiatorId !== userId) {
      return NextResponse.json({ error: '无权限取消此活动' }, { status: 403 })
    }

    await prisma.activity.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/activities/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 })
  }
}
