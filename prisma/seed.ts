import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// 读取 .env.local
const envFile = readFileSync('.env.local', 'utf-8')
const env: Record<string, string> = {}
envFile.split('\n').forEach(line => {
  const idx = line.indexOf('=')
  if (idx > 0) {
    env[line.substring(0, idx).trim()] = line.substring(idx + 1).trim().replace(/^"|"$/g, '')
  }
})

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseKey) {
  console.error('缺少 Supabase 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

function cuid() {
  return 'c' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

async function main() {
  console.log('开始插入 mock 数据...')

  // 清空旧数据（按依赖顺序）
  await supabase.from('chat_messages').delete().neq('id', '')
  await supabase.from('chat_rooms').delete().neq('id', '')
  await supabase.from('activity_participants').delete().neq('id', '')
  await supabase.from('activities').delete().neq('id', '')
  await supabase.from('users').delete().neq('id', '')
  console.log('  旧数据已清空')

  // 创建用户
  const now = new Date()
  const users = [
    { id: cuid(), email: 'xiaoming@test.com', name: '小明同学', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming', rating: 4.8, eventCount: 12, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: cuid(), email: 'lisa@test.com', name: '运动达人Lisa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', rating: 4.9, eventCount: 8, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: cuid(), email: 'xiaowang@test.com', name: '吃货小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaowang', rating: 4.6, eventCount: 5, createdAt: now.toISOString(), updatedAt: now.toISOString() },
    { id: cuid(), email: 'me@test.com', name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me', rating: 5.0, eventCount: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  ]

  const { error: userErr } = await supabase.from('users').insert(users)
  if (userErr) { console.error('用户插入失败:', userErr); return }
  console.log('  用户: 4')

  const [xiaoming, lisa, xiaowang, me] = users

  // 创建活动
  const activities = [
    {
      id: cuid(), title: '三缺一！望京 SOHO 德州扑克',
      description: '望京SOHO 3楼，已经订好位子了，就差一个人！',
      category: 'card', location: '望京SOHO', distance: '步行5分钟',
      startTime: new Date(now.getTime() + 30 * 60 * 1000).toISOString(),
      maxParticipants: 4, initiatorId: xiaoming.id,
      createdAt: now.toISOString(), updatedAt: now.toISOString(),
    },
    {
      id: cuid(), title: '傍晚奥森公园跑步约伴',
      description: '一起来奥森跑步吧，5公里慢跑，配速随意',
      category: 'sports', location: '奥林匹克森林公园', distance: '步行12分钟',
      startTime: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      maxParticipants: 6, initiatorId: lisa.id,
      createdAt: now.toISOString(), updatedAt: now.toISOString(),
    },
    {
      id: cuid(), title: '新开的川菜馆谁来尝尝',
      description: '望京新开了一家川菜馆，评分很高，有人一起吗',
      category: 'meal', location: '望京新世界百货', distance: '步行8分钟',
      startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0).toISOString(),
      maxParticipants: 4, initiatorId: xiaowang.id,
      createdAt: now.toISOString(), updatedAt: now.toISOString(),
    },
  ]

  const { error: actErr } = await supabase.from('activities').insert(activities)
  if (actErr) { console.error('活动插入失败:', actErr); return }
  console.log('  活动: 3')

  // 活动参与者
  const participants = [
    { id: cuid(), activityId: activities[0].id, userId: xiaoming.id, joinedAt: now.toISOString() },
    { id: cuid(), activityId: activities[0].id, userId: lisa.id, joinedAt: now.toISOString() },
    { id: cuid(), activityId: activities[0].id, userId: xiaowang.id, joinedAt: now.toISOString() },
    { id: cuid(), activityId: activities[1].id, userId: lisa.id, joinedAt: now.toISOString() },
    { id: cuid(), activityId: activities[1].id, userId: xiaoming.id, joinedAt: now.toISOString() },
    { id: cuid(), activityId: activities[2].id, userId: xiaowang.id, joinedAt: now.toISOString() },
  ]

  const { error: partErr } = await supabase.from('activity_participants').insert(participants)
  if (partErr) { console.error('参与者插入失败:', partErr); return }
  console.log('  参与者: 6')

  // 聊天室
  const chatRoom = { id: cuid(), activityId: activities[0].id, status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString() }
  const { error: roomErr } = await supabase.from('chat_rooms').insert(chatRoom)
  if (roomErr) { console.error('聊天室插入失败:', roomErr); return }
  console.log('  聊天室: 1')

  // 聊天消息
  const messages = [
    { id: cuid(), roomId: chatRoom.id, senderId: xiaoming.id, content: '你已加入活动群聊', isSystem: true, createdAt: new Date(now.getTime() - 300000).toISOString() },
    { id: cuid(), roomId: chatRoom.id, senderId: xiaoming.id, content: '欢迎欢迎！大家到了直接来3楼，我已经订好位子了 🎉', isSystem: false, createdAt: new Date(now.getTime() - 240000).toISOString() },
    { id: cuid(), roomId: chatRoom.id, senderId: lisa.id, content: '太好了！我正在路上，大概还有10分钟', isSystem: false, createdAt: new Date(now.getTime() - 120000).toISOString() },
    { id: cuid(), roomId: chatRoom.id, senderId: me.id, content: '好的，我马上出发！', isSystem: false, createdAt: new Date(now.getTime() - 60000).toISOString() },
  ]

  const { error: msgErr } = await supabase.from('chat_messages').insert(messages)
  if (msgErr) { console.error('消息插入失败:', msgErr); return }
  console.log('  消息: 4')

  console.log('\n✅ Mock 数据插入完成！')
  console.log('可以在 Supabase Dashboard 的 Table Editor 中查看数据')
}

main()
