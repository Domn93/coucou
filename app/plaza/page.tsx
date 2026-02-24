'use client'

// 作者: Maqingze
// 屏幕 2 — 实时广场（含空态/骨架屏，接入真实 API 数据）

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { Activity } from '@/lib/types'

const MapPin = ({ size = 16, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const Bell = ({ size = 18, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const Search = ({ size = 18, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const Footprints = ({ size = 14, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5 10 7.89 8 10 8 12h3c0-2-2-4.11-2-6.5C9 3.8 9.63 2 11.5 2c3.01 0 4.47 3.28 4.5 6 .03 2.5-1 3.5-1 5.62V16" />
    <path d="M4 21v-1.38c0-2.12-1.03-3.12-1-5.62.03-2.72 1.49-6 4.5-6C9.37 8 10 9.8 10 11.5c0 2.39-2 4.5-2 6.5h3c0-2-2-4.11-2-6.5C9 9.8 9.63 8 11.5 8c3.01 0 4.47 3.28 4.5 6 .03 2.5-1 3.5-1 5.62V21" />
  </svg>
)
const Clock = ({ size = 14, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
)
const LayoutGrid = ({ size = 22, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)
const MessageCircle = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)
const Mail = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
)
const UserIcon = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

// 类别颜色映射
const categoryColors: Record<string, { color: string; bg: string }> = {
  card: { color: '#8B5CF6', bg: '#8B5CF620' },
  sports: { color: '#14B8A6', bg: '#14B8A620' },
  meal: { color: '#F472B6', bg: '#F472B620' },
  hangout: { color: '#F59E0B', bg: '#F59E0B20' },
  exhibition: { color: '#3B82F6', bg: '#3B82F620' },
  music: { color: '#EC4899', bg: '#EC489920' },
}

// 骨架屏卡片占位
function SkeletonCard() {
  return (
    <div style={{ borderRadius: 20, backgroundColor: '#F4F4F5', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#E5E7EB' }} />
          <div style={{ width: 80, height: 13, borderRadius: 6, backgroundColor: '#E5E7EB' }} />
        </div>
        <div style={{ width: 56, height: 22, borderRadius: 12, backgroundColor: '#E5E7EB' }} />
      </div>
      <div style={{ width: '80%', height: 16, borderRadius: 6, backgroundColor: '#E5E7EB' }} />
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 80, height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' }} />
        <div style={{ width: 60, height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: 90, height: 13, borderRadius: 6, backgroundColor: '#E5E7EB' }} />
        <div style={{ width: 72, height: 32, borderRadius: 100, backgroundColor: '#E5E7EB' }} />
      </div>
    </div>
  )
}

// 顶部导航和搜索栏
function TopBar({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <>
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={16} color="#8B5CF6" />
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>朝阳区·望京</span>
        </div>
        <Link href="/notifications" style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
          <Bell size={18} color="#1A1A1A" />
        </Link>
      </div>
      <div
        onClick={onSearchClick}
        style={{ height: 48, borderRadius: 24, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', margin: '0 16px', flexShrink: 0, cursor: 'pointer' }}
      >
        <Search size={18} color="#9CA3AF" />
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>附近有什么好玩的...</span>
      </div>
    </>
  )
}

// 底部导航栏
function TabBar() {
  return (
    <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 24px 28px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
      <Link href="/plaza" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
        <LayoutGrid size={22} color="#8B5CF6" />
        <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600 }}>广场</span>
      </Link>
      <Link href="/ai" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
        <MessageCircle size={22} color="#D1D5DB" />
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>AI助手</span>
      </Link>
      <Link href="/chat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
        <Mail size={22} color="#D1D5DB" />
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>消息</span>
      </Link>
      <Link href="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
        <UserIcon size={22} color="#D1D5DB" />
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>我的</span>
      </Link>
    </div>
  )
}

// 单张活动卡片
function ActivityCard({ activity }: { activity: Activity }) {
  const catColor = categoryColors[activity.category] || { color: '#8B5CF6', bg: '#8B5CF620' }
  const avatarColors = ['#8B5CF6', '#14B8A6', '#F472B6', '#F59E0B', '#3B82F6']
  const avatarColor = avatarColors[activity.initiator.name.charCodeAt(0) % avatarColors.length]

  return (
    <Link href={`/activity?id=${activity.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ borderRadius: 20, backgroundColor: '#F4F4F5', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 头像 + 昵称 + 类别标签 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {activity.initiator.avatar ? (
              <img src={activity.initiator.avatar} alt={activity.initiator.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>
                  {activity.initiator.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{activity.initiator.name}</span>
          </div>
          <div style={{ borderRadius: 12, backgroundColor: catColor.bg, padding: '4px 10px' }}>
            <span style={{ color: catColor.color, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>
              {activity.categoryEmoji} {activity.categoryLabel}
            </span>
          </div>
        </div>

        {/* 活动标题 */}
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700 }}>{activity.title}</span>

        {/* 距离 + 时间 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Footprints size={14} color="#9CA3AF" />
            <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{activity.distance}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={14} color="#9CA3AF" />
            <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{activity.timeDisplay}</span>
          </div>
        </div>

        {/* 人数 + 加入按钮 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>
            {activity.currentParticipants}/{activity.maxParticipants} 人已加入
            {activity.urgency && <span style={{ color: '#F472B6', marginLeft: 6 }}>· {activity.urgency}</span>}
          </span>
          <div style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>凑一个</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function PlazaPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchActivities = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/activities')
      const data = await res.json()
      setActivities(data.activities || [])
    } catch {
      setError('加载失败，请下拉刷新重试')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const handleSearchClick = () => {
    window.location.href = '/search'
  }

  return (
    <div style={{ width: 375, minHeight: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      <TopBar onSearchClick={handleSearchClick} />

      {/* 加载骨架屏 */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 16px 0 16px', overflowY: 'auto' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* 错误提示 */}
      {!loading && error && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 32px' }}>
          <span style={{ fontSize: 40 }}>😵</span>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textAlign: 'center' }}>{error}</span>
          <div onClick={fetchActivities} style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '12px 24px', cursor: 'pointer' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>重新加载</span>
          </div>
        </div>
      )}

      {/* 空态 */}
      {!loading && !error && activities.length === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: 16 }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 52 }}>🏙</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700 }}>附近暂无活动</span>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textAlign: 'center' }}>成为第一个发起活动的人，让有趣的事情发生！</span>
          </div>
          <Link href="/create" style={{ textDecoration: 'none', width: '100%' }}>
            <div style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>✦ 发起第一个活动</span>
            </div>
          </Link>
        </div>
      )}

      {/* 活动卡片列表 */}
      {!loading && !error && activities.length > 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 16px 0 16px', overflowY: 'auto' }}>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
          {/* 底部发起活动入口 */}
          <Link href="/create" style={{ textDecoration: 'none', marginBottom: 16 }}>
            <div style={{ borderRadius: 20, border: '1.5px dashed #E5E7EB', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>✦</span>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>发起新活动</span>
            </div>
          </Link>
        </div>
      )}

      <TabBar />
    </div>
  )
}
