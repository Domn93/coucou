'use client'

// 作者: Maqingze
// 写笔记页面 — 填写内容、选标签、确认位置后提交

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const ArrowLeft = ({ size = 20, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
)
const MapPinIcon = ({ size = 16, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)

// 预设标签
const PRESET_TAGS = ['美食', '打卡', '风景', '咖啡', '活动', '购物', '运动', '文化']

export default function WriteNotePage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState('正在定位...')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 获取当前位置
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName('无法获取位置')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude })
        setLocationName(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`)
      },
      () => setLocationName('位置获取失败'),
      { timeout: 8000 }
    )
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async () => {
    if (!content.trim()) { setError('请填写笔记内容'); return }
    if (!pos) { setError('无法获取位置，请刷新重试'); return }

    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/map-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          latitude: pos.lat,
          longitude: pos.lng,
          tags: selectedTags,
        }),
      })

      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || '提交失败')
      }

      router.push('/map')
    } catch (e) {
      setError(e instanceof Error ? e.message : '提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 */}
      <div style={{ padding: '16px 16px 0 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button
          onClick={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          <ArrowLeft size={18} />
        </button>
        <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>写笔记</span>
      </div>

      <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 文本输入区 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里留下你的足迹、感受或推荐..."
            maxLength={500}
            style={{
              width: '100%',
              minHeight: 160,
              borderRadius: 16,
              border: '1.5px solid #E5E7EB',
              padding: 16,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: '#1A1A1A',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ textAlign: 'right', marginTop: 4, fontSize: 12, color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif" }}>
            {content.length}/500
          </div>
        </div>

        {/* 标签选择 */}
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 10 }}>选择标签（可多选）</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PRESET_TAGS.map((tag) => {
              const active = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    borderRadius: 100,
                    padding: '8px 16px',
                    border: active ? '1.5px solid #8B5CF6' : '1.5px solid #E5E7EB',
                    backgroundColor: active ? '#F3F0FF' : '#FFFFFF',
                    color: active ? '#8B5CF6' : '#6B7280',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  #{tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* 位置信息 */}
        <div style={{ backgroundColor: '#F9FAFB', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <MapPinIcon size={18} color="#8B5CF6" />
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#374151' }}>当前位置</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9CA3AF' }}>{locationName}</div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{ backgroundColor: '#FEF2F2', borderRadius: 12, padding: '10px 16px', color: '#EF4444', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
            {error}
          </div>
        )}
      </div>

      {/* 提交按钮（固定底部） */}
      <div style={{ padding: '16px 16px calc(16px + env(safe-area-inset-bottom)) 16px', flexShrink: 0 }}>
        <button
          onClick={handleSubmit}
          disabled={submitting || !content.trim() || !pos}
          style={{
            width: '100%',
            height: 52,
            borderRadius: 100,
            backgroundColor: submitting || !content.trim() || !pos ? '#D1D5DB' : '#8B5CF6',
            border: 'none',
            color: '#FFFFFF',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 16,
            fontWeight: 700,
            cursor: submitting || !content.trim() || !pos ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? '发布中...' : '📍 发布笔记'}
        </button>
      </div>
    </div>
  )
}
