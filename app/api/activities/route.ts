// 作者: Maqingze
// 活动 CRUD API — 连接 Prisma + Supabase PostgreSQL

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'


// 活动类别标签映射
const categoryMap: Record<string, { label: string; emoji: string }> = {
  card: { label: '打牌', emoji: '🃏' },
  sports: { label: '运动', emoji: '🏃' },
  meal: { label: '饭局', emoji: '🍜' },
  hangout: { label: '闲逛', emoji: '🚶' },
  exhibition: { label: '展览', emoji: '🖼' },
  music: { label: '音乐', emoji: '🎵' },
}

// 计算时间显示文本
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

// GET /api/activities — 获取活动列表（支持搜索和分类过滤）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    const activities = await prisma.activity.findMany({
      where: {
        ...(q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { location: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
        ...(category ? { category } : {}),
        // 只显示未来或刚开始的活动
        startTime: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      },
      include: {
        initiator: { select: { id: true, name: true, avatar: true, rating: true, eventCount: true } },
        participants: {
          include: { user: { select: { id: true, avatar: true } } },
        },
      },
      orderBy: { startTime: 'asc' },
      take: limit,
    })

    // 格式化为前端所需结构
    const formatted = activities.map((a) => {
      const cat = categoryMap[a.category] || { label: a.category, emoji: '✦' }
      return {
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category,
        categoryLabel: cat.label,
        categoryEmoji: cat.emoji,
        location: a.location,
        distance: a.distance,
        startTime: a.startTime.toISOString(),
        timeDisplay: getTimeDisplay(a.startTime),
        urgency: a.maxParticipants - a.participants.length <= 1 ? `急缺${a.maxParticipants - a.participants.length}人` : undefined,
        currentParticipants: a.participants.length,
        maxParticipants: a.maxParticipants,
        initiator: {
          id: a.initiator.id,
          name: a.initiator.name,
          avatar: a.initiator.avatar || '',
          rating: a.initiator.rating,
          eventCount: a.initiator.eventCount,
        },
        participants: a.participants.map((p) => ({
          id: p.user.id,
          avatar: p.user.avatar || '',
        })),
        createdAt: a.createdAt.toISOString(),
      }
    })

    return NextResponse.json({ activities: formatted })
  } catch (error) {
    console.error('GET /api/activities error:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

// POST /api/activities — 创建新活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, category, location, distance, startTime, maxParticipants, initiatorId } = body

    // 基础校验
    if (!title || !category || !location || !startTime || !initiatorId) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description: description || '',
        category,
        location,
        distance: distance || '附近',
        startTime: new Date(startTime),
        maxParticipants: maxParticipants || 4,
        initiatorId,
      },
      include: {
        initiator: { select: { id: true, name: true, avatar: true } },
      },
    })

    // 发起人自动加入活动
    await prisma.activityParticipant.create({
      data: { activityId: activity.id, userId: initiatorId },
    })

    // 创建对应聊天室
    await prisma.chatRoom.create({
      data: { activityId: activity.id },
    })

    return NextResponse.json({ id: activity.id, activity }, { status: 201 })
  } catch (error) {
    console.error('POST /api/activities error:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
