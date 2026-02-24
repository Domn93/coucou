'use client'

// 作者: Maqingze
// 屏幕 5 — 临时聊天室（接入真实 API + Supabase Realtime 实时消息）

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ChatMessage } from '@/lib/types'

const ChevronLeft = ({ size = 24, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const Ellipsis = ({ size = 22, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
  </svg>
)
const MapPinSmall = ({ size = 16, color = '#14B8A6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const Send = ({ size = 20, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const avatarColors = ['#8B5CF6', '#14B8A6', '#F472B6', '#F59E0B', '#3B82F6', '#EC4899']

// 演示用户
const DEMO_USER = { id: 'demo-user-001', name: '演示用户', avatar: '' }

export default function ChatPage() {
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [roomTitle, setRoomTitle] = useState('临时聊天室')
  const [participantCount, setParticipantCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 加载历史消息
  const loadMessages = useCallback(async () => {
    if (!roomId) return
    try {
      const res = await fetch(`/api/chat/${roomId}`)
      const data = await res.json()
      if (data.messages) setMessages(data.messages)
    } catch {
      // 忽略加载错误，继续展示
    }
  }, [roomId])

  // 加载聊天室信息（活动标题等）
  useEffect(() => {
    if (!roomId) return
    loadMessages()

    // Supabase Realtime 订阅新消息
    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          // 收到新消息时重新加载（简单方案，生产可优化为增量更新）
          loadMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, loadMessages])

  const handleSend = async () => {
    if (!input.trim() || sending || !roomId) return
    setSending(true)

    // 先确保演示用户存在
    await fetch('/api/users/ensure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: DEMO_USER.id, name: DEMO_USER.name, email: 'demo@coucou.app' }),
    }).catch(() => null)

    try {
      const res = await fetch(`/api/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: DEMO_USER.id, content: input.trim() }),
      })

      if (res.ok) {
        const msg = await res.json()
        setMessages((prev) => [...prev, msg])
        setInput('')
      }
    } catch {
      // 忽略发送失败
    } finally {
      setSending(false)
    }
  }

  // 没有 roomId 时显示消息落地页（含 TabBar）
  if (!roomId) {
    return (
      <MessagesLandingPage />
    )
  }

  return (
    <div style={{ width: '100%', height: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'max(8px, env(safe-area-inset-top)) 20px 0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex' }}><ChevronLeft /></Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700 }}>{roomTitle}</span>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>实时聊天中</span>
        </div>
        <Ellipsis size={22} color="#1A1A1A" />
      </div>

      {/* 状态横幅 */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#8B5CF610', flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22C55E' }} />
        <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>活动聊天室已开启</span>
      </div>

      {/* 消息区 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 0 16px', overflowY: 'auto' }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>还没有消息，发送第一条吧！</span>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender.id === DEMO_USER.id
          const isSystem = msg.isSystem

          if (isSystem) {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12, textAlign: 'center' }}>
                  {msg.content}
                </span>
              </div>
            )
          }

          if (isMe) {
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ borderRadius: '18px 4px 18px 18px', backgroundColor: '#8B5CF6', padding: 12, maxWidth: 240 }}>
                  <p style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{msg.content}</p>
                </div>
              </div>
            )
          }

          const avatarColor = avatarColors[msg.sender.name.charCodeAt(0) % avatarColors.length]
          return (
            <div key={msg.id} style={{ display: 'flex', gap: 8 }}>
              {msg.sender.avatar ? (
                <img src={msg.sender.avatar} alt={msg.sender.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: avatarColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>
                    {msg.sender.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div style={{ borderRadius: '4px 18px 18px 18px', backgroundColor: '#F4F4F5', padding: 12, display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 240 }}>
                <span style={{ color: avatarColor, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>{msg.sender.name}</span>
                <p style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{msg.content}</p>
              </div>
            </div>
          )
        })}

        {/* 已到达按钮 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            onClick={() => handleSend()}
            style={{ borderRadius: 100, backgroundColor: '#14B8A620', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          >
            <MapPinSmall size={16} color="#14B8A6" />
            <span style={{ color: '#14B8A6', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>我已到达</span>
          </div>
        </div>

        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      {/* 输入栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px calc(10px + env(safe-area-inset-bottom)) 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="发送消息..."
            style={{
              flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A',
            }}
          />
        </div>
        <div
          onClick={handleSend}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: input.trim() && !sending ? '#8B5CF6' : '#D1D5DB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
          }}
        >
          <Send size={20} color="#FFFFFF" />
        </div>
      </div>
    </div>
  )
}

// 无 roomId 时展示的消息落地页（含 TabBar，Tab 4 消息高亮）
const LayoutGrid2 = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
)
const MapIconTab = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
  </svg>
)
const MessageCircleTab2 = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
)
const MailActive = ({ size = 22, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const UserIconTab2 = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

function MessagesLandingPage() {
  return (
    <div style={{ width: '100%', height: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部标题 */}
      <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(8px, env(safe-area-inset-top)) 20px 0 20px', flexShrink: 0 }}>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>消息</span>
      </div>

      {/* 空态内容区 */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 40px' }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MailActive size={32} color="#D1D5DB" />
        </div>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>暂无消息</span>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, textAlign: 'center' }}>
          加入活动后，你可以在活动详情页进入对应的聊天室，与参与者实时交流
        </span>
        <Link href="/plaza" style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '12px 28px', textDecoration: 'none' }}>
          <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>去广场看看</span>
        </Link>
      </div>

      {/* 底部 TabBar（消息 Tab 高亮） */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 24px calc(12px + env(safe-area-inset-bottom)) 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <LayoutGrid2 size={22} color="#D1D5DB" />
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>广场</span>
        </Link>
        <Link href="/map" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <MapIconTab size={22} color="#D1D5DB" />
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>地图</span>
        </Link>
        <Link href="/ai" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <MessageCircleTab2 size={22} color="#D1D5DB" />
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>AI助手</span>
        </Link>
        <Link href="/chat" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <MailActive size={22} color="#8B5CF6" />
          <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600 }}>消息</span>
        </Link>
        <Link href="/profile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <UserIconTab2 size={22} color="#D1D5DB" />
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>我的</span>
        </Link>
      </div>
    </div>
  )
}
