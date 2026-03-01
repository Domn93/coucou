'use client'

// 作者: Maqingze
// 屏幕 7 — 发起活动（受控表单，POST 到 /api/activities，集成高德POI搜索）

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { searchPoi, PoiResult } from '@/lib/amap'

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

function CreateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  // 表单状态
  const [category, setCategory] = useState('sports')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [locationLat, setLocationLat] = useState<number | null>(null)
  const [locationLng, setLocationLng] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(4)
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // POI搜索状态
  const [poiResults, setPoiResults] = useState<PoiResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // 地点输入防抖POI搜索
  const handleLocationInput = useCallback((val: string) => {
    setLocation(val)
    setLocationLat(null)
    setLocationLng(null)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (!val.trim()) {
      setPoiResults([])
      return
    }
    setSearchLoading(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const results = await searchPoi(val)
        setPoiResults(results)
      } catch {
        setPoiResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 400)
  }, [])

  // 选择POI候选项
  const handleSelectPoi = useCallback((poi: PoiResult) => {
    setLocation(poi.name)
    setLocationLat(poi.location.lat)
    setLocationLng(poi.location.lng)
    setPoiResults([])
  }, [])

  const selectedType = activityTypes.find((t) => t.value === category) || activityTypes[0]

  const handleSubmit = async () => {
    if (!title.trim()) { setError('请填写活动名称'); return }
    if (!location.trim()) { setError('请填写活动地点'); return }
    if (!date || !time) { setError('请选择活动时间'); return }

    setSubmitting(true)
    setError('')

    try {
      const startTime = new Date(`${date}T${time}:00`).toISOString()

      // 获取当前登录用户ID，若无则使用演示用户
      const userId = (session?.user as { id?: string })?.id || DEMO_INITIATOR_ID

      // 先确保演示用户存在（仅在使用演示ID时）
      if (userId === DEMO_INITIATOR_ID) {
        await fetch('/api/users/ensure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: DEMO_INITIATOR_ID, name: '演示用户', email: 'demo@coucou.app' }),
        }).catch(() => null)
      }

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          location: location.trim(),
          latitude: locationLat,
          longitude: locationLng,
          distance: '附近',
          startTime,
          maxParticipants,
          initiatorId: userId,
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
    <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#F8F7FF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'max(8px, env(safe-area-inset-top)) 20px 0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', border: '1px solid #EDE9FE', textDecoration: 'none' }}>
          <ChevronLeft />
        </Link>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>发起活动</span>
        <div style={{ width: 36 }} />
      </div>

      {/* 表单内容 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 20px 24px 20px', overflowY: 'auto' }}>

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
                  borderRadius: 100, backgroundColor: category === t.value ? t.bg : '#FFFFFF',
                  border: category === t.value ? `1.5px solid ${t.color}` : '1.5px solid #EDE9FE',
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
              borderRadius: 14, backgroundColor: '#FFFFFF', border: '1.5px solid #EDE9FE', padding: '14px 16px',
              outline: 'none', fontSize: 15, fontFamily: "'DM Sans', sans-serif",
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
                  width: '100%', borderRadius: 14, backgroundColor: '#FFFFFF', border: '1.5px solid #EDE9FE', padding: '14px 16px',
                  outline: 'none', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
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
                  width: '100%', borderRadius: 14, backgroundColor: '#FFFFFF', border: '1.5px solid #EDE9FE', padding: '14px 16px',
                  outline: 'none', fontSize: 14, fontFamily: "'DM Sans', sans-serif",
                  color: time ? '#1A1A1A' : '#9CA3AF', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>

        {/* 活动地点 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动地点</span>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 14, backgroundColor: '#FFFFFF', border: '1.5px solid #EDE9FE', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>📍</span>
              <input
                value={location}
                onChange={(e) => handleLocationInput(e.target.value)}
                placeholder="搜索地点..."
                style={{
                  flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
                  fontSize: 15, fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A',
                }}
              />
              {searchLoading && (
                <div style={{ width: 14, height: 14, border: '2px solid #E5E7EB', borderTopColor: '#8B5CF6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              )}
            </div>
            {/* POI候选下拉 */}
            {poiResults.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                backgroundColor: '#FFFFFF', borderRadius: 14, marginTop: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                overflow: 'hidden',
              }}>
                {poiResults.map((poi) => (
                  <div
                    key={poi.id}
                    onClick={() => handleSelectPoi(poi)}
                    style={{
                      padding: '12px 16px', borderBottom: '1px solid #F4F4F5',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 2,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12 }}>📍</span>
                      <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>{poi.name}</span>
                    </div>
                    {poi.address && (
                      <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12, paddingLeft: 18 }}>{poi.address}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 已选坐标提示 */}
          {locationLat && (
            <span style={{ color: '#10B981', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
              ✓ 已获取精确坐标
            </span>
          )}
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
                  background: maxParticipants === opt.value ? 'linear-gradient(135deg, #6D28D9, #8B5CF6)' : '#FFFFFF',
                  border: maxParticipants === opt.value ? 'none' : '1px solid #EDE9FE',
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
              borderRadius: 14, backgroundColor: '#FFFFFF', border: '1.5px solid #EDE9FE', padding: '14px 16px',
              outline: 'none', fontSize: 15, fontFamily: "'DM Sans', sans-serif",
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
            borderRadius: 100, background: submitting ? '#C4B5FD' : 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
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

export default function CreatePage() {
  return (
    <Suspense fallback={
    <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#F8F7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>加载中...</span>
      </div>
    }>
      <CreateContent />
    </Suspense>
  )
}
