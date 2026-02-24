'use client'

// 作者: Maqingze
// 屏幕 7 — 发起活动（受控表单，POST 到 /api/activities）

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ChevronLeft = ({ size = 20, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

// 活动类型选项（value 对应数据库 category 字段）
const activityTypes = [
  { emoji: '🏃', label: '运动', value: 'sports', color: '#14B8A6', bg: '#14B8A620' },
  { emoji: '🍜', label: '饭局', value: 'meal', color: '#F472B6', bg: '#F472B620' },
  { emoji: '🃏', label: '打牌', value: 'card', color: '#8B5CF6', bg: '#8B5CF620' },
  { emoji: '🚶', label: '闲逛', value: 'hangout', color: '#F59E0B', bg: '#F59E0B20' },
  { emoji: '🖼', label: '展览', value: 'exhibition', color: '#3B82F6', bg: '#3B82F620' },
  { emoji: '🎵', label: '音乐', value: 'music', color: '#EC4899', bg: '#EC489920' },
]

const maxParticipantOptions = [
  { label: '2人', value: 2 },
  { label: '4人', value: 4 },
  { label: '6人', value: 6 },
  { label: '10人', value: 10 },
  { label: '不限', value: 99 },
]

// 演示用固定发起人（待接入 NextAuth session 后替换）
const DEMO_INITIATOR_ID = 'demo-user-001'

export default function CreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 表单状态
  const [category, setCategory] = useState('sports')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(4)
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // AI 预填支持：从 query 参数读取预填数据
  useEffect(() => {
    const prefill = searchParams.get('prefill')
    if (!prefill) return
    try {
      const data = JSON.parse(decodeURIComponent(prefill))
      if (data.title) setTitle(data.title)
      if (data.category) setCategory(data.category)
      if (data.location) setLocation(data.location)
      if (data.description) setDescription(data.description)
      if (data.maxParticipants) setMaxParticipants(data.maxParticipants)
      if (data.startTime) {
        const dt = new Date(data.startTime)
        setDate(dt.toISOString().split('T')[0])
        setTime(dt.toTimeString().slice(0, 5))
      }
    } catch {
      // 忽略解析错误
    }
  }, [searchParams])

  const selectedType = activityTypes.find((t) => t.value === category) || activityTypes[0]

  const handleSubmit = async () => {
    if (!title.trim()) { setError('请填写活动名称'); return }
    if (!location.trim()) { setError('请填写活动地点'); return }
    if (!date || !time) { setError('请选择活动时间'); return }

    setSubmitting(true)
    setError('')

    try {
      const startTime = new Date(`${date}T${time}:00`).toISOString()

      // 先确保演示用户存在
      await fetch('/api/users/ensure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: DEMO_INITIATOR_ID, name: '演示用户', email: 'demo@coucou.app' }),
      }).catch(() => null) // 忽略错误，用户可能已存在

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
          distance: '附近',
          startTime,
          maxParticipants,
          initiatorId: DEMO_INITIATOR_ID,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '发布失败')
      }

      const { id } = await res.json()
      // 跳转到活动详情页
      router.push(`/activity?id=${id}`)
    } catch (err) {
      setError((err as Error).message || '发布失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ width: 375, minHeight: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', textDecoration: 'none' }}>
          <ChevronLeft />
        </Link>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>发起活动</span>
        <div style={{ width: 36 }} />
      </div>

      {/* 表单内容 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 20px 24px 20px', overflowY: 'auto' }}>

        {/* 活动类型 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动类型</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {activityTypes.map((t) => (
              <div
                key={t.value}
                onClick={() => setCategory(t.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                  borderRadius: 100, backgroundColor: category === t.value ? t.bg : '#F4F4F5',
                  border: category === t.value ? `1.5px solid ${t.color}` : '1.5px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 14 }}>{t.emoji}</span>
                <span style={{ color: category === t.value ? t.color : '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 活动名称 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动名称</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给活动起个名字..."
            style={{
              borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px',
              border: 'none', outline: 'none', fontSize: 15, fontFamily: "'DM Sans', sans-serif",
              color: '#1A1A1A', width: '100%', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 活动时间 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动时间</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%', borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px',
                  border: 'none', outline: 'none', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  color: date ? '#1A1A1A' : '#9CA3AF', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  width: '100%', borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px',
                  border: 'none', outline: 'none', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  color: time ? '#1A1A1A' : '#9CA3AF', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* 活动地点 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动地点</span>
          <div style={{ borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="搜索地点..."
              style={{
                flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
                fontSize: 15, fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A',
              }}
            />
          </div>
        </div>

        {/* 人数限制 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>人数限制</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {maxParticipantOptions.map((opt) => (
              <div
                key={opt.value}
                onClick={() => setMaxParticipants(opt.value)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 100,
                  backgroundColor: maxParticipants === opt.value ? '#8B5CF6' : '#F4F4F5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <span style={{ color: maxParticipants === opt.value ? '#FFFFFF' : '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 活动描述 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动描述</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="介绍一下这个活动，吸引更多人参加..."
            rows={4}
            style={{
              borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px',
              border: 'none', outline: 'none', fontSize: 15, fontFamily: "'DM Sans', sans-serif",
              color: '#1A1A1A', width: '100%', boxSizing: 'border-box', resize: 'none',
            }}
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{ borderRadius: 12, backgroundColor: '#FEF2F2', padding: '12px 16px' }}>
            <span style={{ color: '#EF4444', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{error}</span>
          </div>
        )}

        {/* 发布按钮 */}
        <div
          onClick={!submitting ? handleSubmit : undefined}
          style={{
            borderRadius: 100, backgroundColor: submitting ? '#C4B5FD' : '#8B5CF6',
            padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 8, cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>
            {submitting ? '发布中...' : '✦ 立即发布'}
          </span>
        </div>
      </div>
    </div>
  )
}
