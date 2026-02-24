'use client'

// 作者: Maqingze
// 屏幕 4 — 活动详情（接入真实 API，支持加入活动 + 倒计时）

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const ChevronLeft = ({ size = 24, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const Share2 = ({ size = 22, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)
const MapPinIcon = ({ size = 28, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const Plus = ({ size = 18, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const Sparkles = ({ size = 20, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
)

const categoryColors: Record<string, { color: string; bg: string }> = {
  card: { color: '#8B5CF6', bg: '#8B5CF620' },
  sports: { color: '#14B8A6', bg: '#14B8A620' },
  meal: { color: '#F472B6', bg: '#F472B620' },
  hangout: { color: '#F59E0B', bg: '#F59E0B20' },
  exhibition: { color: '#3B82F6', bg: '#3B82F620' },
  music: { color: '#EC4899', bg: '#EC489920' },
}

const avatarColors = ['#8B5CF6', '#14B8A6', '#F472B6', '#F59E0B', '#3B82F6', '#EC4899']

// 演示用户 ID（待 NextAuth 接入后替换）
const DEMO_USER_ID = 'demo-user-001'

// 倒计时计算
function useCountdown(startTime: string | undefined) {
  const [countdown, setCountdown] = useState('')
  useEffect(() => {
    if (!startTime) return
    const update = () => {
      const diff = new Date(startTime).getTime() - Date.now()
      if (diff <= 0) { setCountdown('已开始'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      if (h > 0) setCountdown(`${h}h ${m}m`)
      else if (m > 0) setCountdown(`${m}m ${s}s`)
      else setCountdown(`${s}s`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [startTime])
  return countdown
}

interface ActivityDetail {
  id: string
  title: string
  description?: string
  category: string
  categoryLabel: string
  categoryEmoji: string
  location: string
  distance: string
  startTime: string
  timeDisplay: string
  urgency?: string
  currentParticipants: number
  maxParticipants: number
  initiator: { id: string; name: string; avatar: string; rating: number; eventCount: number }
  participants: { id: string; name: string; avatar: string }[]
  chatRoomId?: string
}

export default function ActivityPage() {
  return (
    <Suspense fallback={
      <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>加载中...</span>
      </div>
    }>
      <ActivityContent />
    </Suspense>
  )
}

function ActivityContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activityId = searchParams.get('id')

  const [activity, setActivity] = useState<ActivityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  const countdown = useCountdown(activity?.startTime)

  const fetchActivity = useCallback(async () => {
    if (!activityId) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch(`/api/activities/${activityId}`)
      if (!res.ok) throw new Error('活动不存在')
      const data = await res.json()
      setActivity(data)
      // 检查当前用户是否已加入
      setJoined(data.participants?.some((p: { id: string }) => p.id === DEMO_USER_ID))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [activityId])

  useEffect(() => {
    fetchActivity()
  }, [fetchActivity])

  const handleJoin = async () => {
    if (!activityId || joining) return
    setJoining(true)
    try {
      // 确保演示用户存在
      await fetch('/api/users/ensure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: DEMO_USER_ID, name: '演示用户', email: 'demo@coucou.app' }),
      })

      const res = await fetch(`/api/activities/${activityId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: DEMO_USER_ID }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '加入失败')

      setJoined(true)
      await fetchActivity() // 刷新数据

      // 跳转到聊天室
      if (activity?.chatRoomId) {
        router.push(`/chat?roomId=${activity.chatRoomId}`)
      } else {
        router.push('/chat')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setJoining(false)
    }
  }

  // 加载中
  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>加载中...</span>
      </div>
    )
  }

  // 无 ID 或加载失败时显示静态演示内容
  if (!activity) {
    return (
      <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '0 auto', padding: '0 32px' }}>
        <span style={{ fontSize: 40 }}>😵</span>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textAlign: 'center' }}>
          {error || '活动不存在，请从广场进入'}
        </span>
        <Link href="/plaza" style={{ textDecoration: 'none' }}>
          <div style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '12px 24px' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>返回广场</span>
          </div>
        </Link>
      </div>
    )
  }

  const catColor = categoryColors[activity.category] || { color: '#8B5CF6', bg: '#8B5CF620' }
  const initiatorAvatarColor = avatarColors[activity.initiator.name.charCodeAt(0) % avatarColors.length]
  const startDate = new Date(activity.startTime)
  const timeStr = startDate.toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'max(8px, env(safe-area-inset-top)) 20px 0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex' }}><ChevronLeft /></Link>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>活动详情</span>
        <Share2 size={22} color="#1A1A1A" />
      </div>

      {/* 主体内容 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 20px 0 20px', overflowY: 'auto' }}>

        {/* 标题区 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ borderRadius: 12, backgroundColor: catColor.bg, padding: '4px 10px' }}>
              <span style={{ color: catColor.color, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>
                {activity.categoryEmoji} {activity.categoryLabel}
              </span>
            </div>
            {activity.urgency && (
              <div style={{ borderRadius: 12, backgroundColor: '#F472B620', padding: '4px 10px' }}>
                <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>{activity.urgency}</span>
              </div>
            )}
          </div>
          <h1 style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, margin: 0 }}>
            {activity.title}
          </h1>
          {activity.description && (
            <p style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              {activity.description}
            </p>
          )}
        </div>

        {/* 发起人信息 */}
        <div style={{ borderRadius: 16, backgroundColor: '#F4F4F5', padding: 14, display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          {activity.initiator.avatar ? (
            <img src={activity.initiator.avatar} alt={activity.initiator.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: initiatorAvatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>
                {activity.initiator.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600 }}>{activity.initiator.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>⭐ {activity.initiator.rating.toFixed(1)} 靠谱度</span>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>· 发起过 {activity.initiator.eventCount} 次活动</span>
            </div>
          </div>
        </div>

        {/* 地点展示区 */}
        <div style={{ borderRadius: 16, backgroundColor: '#E5E7EB', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 8 }}>
          <MapPinIcon size={22} color="#9CA3AF" />
          <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
            {activity.location} · {activity.distance}
          </span>
        </div>

        {/* 时间 + 倒计时 */}
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <div style={{ flex: 1, borderRadius: 16, backgroundColor: '#F4F4F5', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>开始时间</span>
            <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700 }}>{timeStr}</span>
          </div>
          <div style={{ flex: 1, borderRadius: 16, backgroundColor: '#F4F4F5', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>倒计时</span>
            <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700 }}>{countdown || activity.timeDisplay}</span>
          </div>
        </div>

        {/* 参与者 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700 }}>参与者</span>
            <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>
              {activity.currentParticipants}/{activity.maxParticipants} 人
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', flexWrap: 'wrap' }}>
            {activity.participants.map((p, i) => (
              p.avatar ? (
                <img key={p.id} src={p.avatar} alt={p.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div key={p.id} style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>
                    {p.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )
            ))}
            {activity.currentParticipants < activity.maxParticipants && (
              <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F4F5', border: '2px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={18} color="#9CA3AF" />
              </div>
            )}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{ borderRadius: 12, backgroundColor: '#FEF2F2', padding: '12px 16px' }}>
            <span style={{ color: '#EF4444', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{error}</span>
          </div>
        )}
      </div>

      {/* 底部操作栏 */}
      <div style={{ minHeight: 100, display: 'flex', alignItems: 'center', padding: '16px 20px calc(16px + env(safe-area-inset-bottom)) 20px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        {joined ? (
          <Link
            href={activity.chatRoomId ? `/chat?roomId=${activity.chatRoomId}` : '/chat'}
            style={{
              width: '100%', height: 52, borderRadius: 100, backgroundColor: '#14B8A6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
            }}
          >
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>进入聊天室 💬</span>
          </Link>
        ) : (
          <div
            onClick={handleJoin}
            style={{
              width: '100%', height: 52, borderRadius: 100,
              backgroundColor: joining || activity.currentParticipants >= activity.maxParticipants ? '#C4B5FD' : '#8B5CF6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: joining || activity.currentParticipants >= activity.maxParticipants ? 'not-allowed' : 'pointer',
            }}
          >
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>
              {joining ? '加入中...' : activity.currentParticipants >= activity.maxParticipants ? '活动已满' : '凑一个'}
            </span>
            {!joining && activity.currentParticipants < activity.maxParticipants && <Sparkles size={20} color="#FFFFFF" />}
          </div>
        )}
      </div>
    </div>
  )
}
