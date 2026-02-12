// 活动 API 路由
import { NextRequest, NextResponse } from 'next/server'

// GET /api/activities - 获取附近活动
export async function GET(request: NextRequest) {
  try {
    // TODO: 从数据库获取活动列表
    // 基于用户位置和时间获取附近的活动
    return NextResponse.json({
      activities: [],
      message: 'API 开发中...'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

// POST /api/activities - 创建新活动
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // TODO: 验证输入、保存到数据库
    return NextResponse.json({ id: 'new-activity-id' }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
