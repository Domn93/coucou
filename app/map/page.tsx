'use client'

// 作者: Maqingze
// 屏幕 12 — 地图笔记发现页（高德地图 + 附近笔记 + 底部 Sheet）

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { initMap, createNoteMarker, NoteMarkerData, distanceToText, calcDistance } from '@/lib/amap'

// SVG 图标
const LayoutGrid = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)
const MapIcon = ({ size = 22, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
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
const PencilIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const Heart = ({ size = 14, color = '#9CA3AF', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#EF4444' : 'none'} stroke={filled ? '#EF4444' : color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

// 笔记数据类型
interface MapNoteItem extends NoteMarkerData {
  content: string
  tags: string[]
  createdAt: string
  liked: boolean
  activity?: { id: string; title: string } | null
}

// 底部 TabBar
function TabBar() {
  return (
    <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 24px calc(12px + env(safe-area-inset-bottom)) 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
      <Link href="/plaza" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
        <LayoutGrid size={22} color="#D1D5DB" />
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>广场</span>
      </Link>
      <Link href="/map" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
        <MapIcon size={22} color="#8B5CF6" />
        <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600 }}>地图</span>
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

// 笔记详情 Modal
function NoteDetailModal({ note, onClose, onLike }: {
  note: MapNoteItem
  onClose: () => void
  onLike: (id: string) => void
}) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}分钟前`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}小时前`
    return `${Math.floor(hours / 24)}天前`
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', backgroundColor: '#fff', borderRadius: '20px 20px 0 0', padding: 24, paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}
      >
        {/* 作者行 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {note.authorAvatar ? (
              <img src={note.authorAvatar} alt={note.authorName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>{note.authorName[0]}</span>
            )}
          </div>
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{note.authorName}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#9CA3AF' }}>{timeAgo(note.createdAt)}</div>
          </div>
        </div>

        {/* 正文 */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#1A1A1A', lineHeight: 1.6, marginBottom: 16 }}>{note.content}</p>

        {/* 标签 */}
        {note.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {note.tags.map((tag) => (
              <span key={tag} style={{ backgroundColor: '#F3F0FF', color: '#8B5CF6', borderRadius: 100, padding: '4px 10px', fontSize: 12 }}>#{tag}</span>
            ))}
          </div>
        )}

        {/* 关联活动 */}
        {note.activity && (
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#6B7280' }}>
            📍 关联活动：{note.activity.title}
          </div>
        )}

        {/* 点赞按钮 */}
        <button
          onClick={() => onLike(note.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: note.liked ? '#FEF2F2' : '#F4F4F5', border: 'none', borderRadius: 100, padding: '10px 20px', cursor: 'pointer' }}
        >
          <Heart size={16} color={note.liked ? '#EF4444' : '#9CA3AF'} filled={note.liked} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: note.liked ? '#EF4444' : '#6B7280', fontWeight: 600 }}>
            {note.liked ? '已赞' : '点赞'} · {note.likesCount}
          </span>
        </button>
      </div>
    </div>
  )
}

// 主页面
export default function MapPage() {
  const mapRef = useRef<object | null>(null)
  const markersRef = useRef<object[]>([])
  const [notes, setNotes] = useState<MapNoteItem[]>([])
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedNote, setSelectedNote] = useState<MapNoteItem | null>(null)
  const [mapReady, setMapReady] = useState(false)

  // 获取附近笔记
  const fetchNotes = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`/api/map-notes?lat=${lat}&lng=${lng}&radius=2000`)
      const data = await res.json()
      setNotes(data.notes || [])
    } catch {
      // 静默降级
    }
  }, [])

  // 初始化地图
  useEffect(() => {
    let cancelled = false

    const setup = async () => {
      // 获取 GPS 位置
      const pos = await new Promise<{ lat: number; lng: number }>((resolve) => {
        if (!navigator.geolocation) {
          resolve({ lat: 39.9042, lng: 116.4074 }) // 默认北京
          return
        }
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
          () => resolve({ lat: 39.9042, lng: 116.4074 }),
          { timeout: 8000 }
        )
      })

      if (cancelled) return
      setUserPos(pos)

      // 初始化高德地图
      const map = await initMap('map-container', [pos.lng, pos.lat], 15)
      if (!map || cancelled) return

      mapRef.current = map
      setMapReady(true)

      // 地图缩放/移动后刷新笔记
      ;(map as { on: (e: string, cb: () => void) => void }).on('moveend', () => {
        const bounds = (map as { getBounds: () => { getSouthWest: () => { lat: number; lng: number }; getNorthEast: () => { lat: number; lng: number } } }).getBounds()
        const sw = bounds.getSouthWest()
        const ne = bounds.getNorthEast()
        const centerLat = (sw.lat + ne.lat) / 2
        const centerLng = (sw.lng + ne.lng) / 2
        fetchNotes(centerLat, centerLng)
      })

      await fetchNotes(pos.lat, pos.lng)
    }

    setup()
    return () => { cancelled = true }
  }, [fetchNotes])

  // 笔记更新时重绘 Marker
  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    // 清除旧 Marker
    markersRef.current.forEach((m) => {
      ;(m as { setMap: (v: null) => void }).setMap(null)
    })
    markersRef.current = []

    notes.forEach((note) => {
      const marker = createNoteMarker(
        mapRef.current as Parameters<typeof createNoteMarker>[0],
        note,
        (n) => setSelectedNote(n as MapNoteItem)
      )
      if (marker) markersRef.current.push(marker)
    })
  }, [notes, mapReady])

  // 切换点赞
  const handleLike = async (noteId: string) => {
    const res = await fetch(`/api/map-notes/${noteId}/like`, { method: 'POST' })
    if (!res.ok) return
    const { liked } = await res.json()
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, liked, likesCount: liked ? n.likesCount + 1 : n.likesCount - 1 }
          : n
      )
    )
    if (selectedNote?.id === noteId) {
      setSelectedNote((prev) =>
        prev ? { ...prev, liked, likesCount: liked ? prev.likesCount + 1 : prev.likesCount - 1 } : prev
      )
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}分钟前`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}小时前`
    return `${Math.floor(hours / 24)}天前`
  }

  return (
    <div style={{ width: '100%', height: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>

      {/* 地图容器 */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div id="map-container" style={{ width: '100%', height: '100%' }} />

        {/* 搜索浮层 */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#FFFFFF', boxShadow: '0 2px 12px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px' }}>
            <span style={{ fontSize: 16 }}>🔍</span>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>搜索地点或笔记...</span>
          </div>
        </div>

        {/* 写笔记浮动按钮 */}
        <Link href="/map/write" style={{ textDecoration: 'none', position: 'absolute', right: 20, bottom: 300, zIndex: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}>
            <PencilIcon size={22} color="#FFFFFF" />
          </div>
        </Link>
      </div>

      {/* 底部附近笔记 Sheet */}
      <div style={{ height: 280, backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px 8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>
            附近笔记 {notes.length > 0 && <span style={{ color: '#8B5CF6' }}>{notes.length}</span>}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['全部', '美食', '打卡', '活动'].map((tag) => (
              <span key={tag} style={{ backgroundColor: '#F4F4F5', borderRadius: 100, padding: '4px 10px', fontSize: 12, color: '#6B7280', fontFamily: "'DM Sans', sans-serif" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* 笔记列表 */}
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 16px' }}>
          {notes.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
              附近暂无笔记，去写第一条吧 ✍️
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #F4F4F5', cursor: 'pointer' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {note.authorAvatar ? (
                    <img src={note.authorAvatar} alt={note.authorName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{note.authorName[0]}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{note.authorName}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: '#9CA3AF' }}>
                      {userPos ? distanceToText(calcDistance(userPos.lat, userPos.lng, note.latitude, note.longitude)) : ''} · {timeAgo(note.createdAt)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: '#374151', lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {note.content}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                  <Heart size={13} color={note.liked ? '#EF4444' : '#D1D5DB'} filled={note.liked} />
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{note.likesCount}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TabBar />

      {/* 笔记详情弹窗 */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onLike={handleLike}
        />
      )}
    </div>
  )
}
