'use client'

// 作者: Maqingze
// 屏幕 3 — AI 助手对话（接入真实 Claude API，支持创建活动意图解析）

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ChevronLeft = ({ size = 24, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const SendIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

interface Message {
  role: 'user' | 'assistant'
  content: string
  activity?: Record<string, unknown> // 如果 AI 解析出创建活动意图
}

// 快捷问题建议
const quickSuggestions = [
  '附近有什么好玩的活动？',
  '帮我发起一个打牌活动',
  '今晚8点约人吃饭怎么发起？',
]

export default function AIPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '嗨！我是凑凑 AI 助手 👋\n\n有什么我可以帮你的吗？比如：\n\n- 发现附近好玩的活动\n- 帮你发起一个活动\n- 推荐适合你的社交场景' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim()
    if (!content || loading) return

    const userMsg: Message = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      const assistantMsg: Message = {
        role: 'assistant',
        content: data.response || '抱歉，我暂时无法回复 😅',
        activity: data.activity,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '网络出错了，请稍后重试 😵',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateActivity = (activity: Record<string, unknown>) => {
    const prefill = encodeURIComponent(JSON.stringify(activity))
    router.push(`/create?prefill=${prefill}`)
  }

  return (
    <div style={{ width: 375, minHeight: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex', textDecoration: 'none' }}><ChevronLeft size={24} color="#1A1A1A" /></Link>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>AI 助手</span>
        <div style={{ width: 24, height: 24 }} />
      </div>

      {/* 对话区 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 0 16px', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'assistant' ? (
              <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                {/* AI 头像 */}
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#8B5CF6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14 }}>✦</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 280 }}>
                  {/* 消息气泡 */}
                  <div style={{ borderRadius: '4px 18px 18px 18px', backgroundColor: '#F4F4F5', padding: 14 }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, margin: '0 0 6px 0' }}>{children}</p>
                        ),
                        strong: ({ children }) => (
                          <strong style={{ fontWeight: 700, color: '#1A1A1A' }}>{children}</strong>
                        ),
                        em: ({ children }) => (
                          <em style={{ fontStyle: 'italic', color: '#4B5563' }}>{children}</em>
                        ),
                        code: ({ children }) => (
                          <code style={{ backgroundColor: '#E9D5FF', color: '#7C3AED', borderRadius: 4, padding: '1px 5px', fontSize: 12, fontFamily: 'monospace' }}>{children}</code>
                        ),
                        ul: ({ children }) => (
                          <ul style={{ margin: '4px 0', paddingLeft: 16, color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6 }}>{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol style={{ margin: '4px 0', paddingLeft: 16, color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6 }}>{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li style={{ marginBottom: 2 }}>{children}</li>
                        ),
                        h1: ({ children }) => (
                          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', margin: '8px 0 4px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '6px 0 4px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', margin: '4px 0 2px' }}>{children}</h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote style={{ borderLeft: '3px solid #8B5CF6', paddingLeft: 10, margin: '6px 0', color: '#6B7280', fontStyle: 'italic' }}>{children}</blockquote>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} style={{ color: '#8B5CF6', textDecoration: 'underline' }}>{children}</a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {/* 活动创建意图卡片 */}
                  {msg.activity && (
                    <div style={{ borderRadius: 16, backgroundColor: '#8B5CF610', border: '1.5px solid #8B5CF640', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>📋 已解析活动信息</span>
                      {typeof msg.activity.title === 'string' && msg.activity.title && (
                        <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{msg.activity.title}</span>
                      )}
                      <div
                        onClick={() => handleCreateActivity(msg.activity!)}
                        style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>跳转填写发布 →</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <div style={{ borderRadius: '18px 4px 18px 18px', backgroundColor: '#8B5CF6', padding: 14, maxWidth: 240 }}>
                  <p style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
                    {msg.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 加载指示器 */}
        {loading && (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#8B5CF6', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14 }}>✦</span>
            </div>
            <div style={{ borderRadius: '4px 18px 18px 18px', backgroundColor: '#F4F4F5', padding: '14px 20px', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map((j) => (
                <div key={j} style={{
                  width: 7, height: 7, borderRadius: '50%', backgroundColor: '#9CA3AF',
                  animation: 'bounce 1.2s ease-in-out infinite',
                  animationDelay: `${j * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* 快捷建议（仅初始状态显示） */}
        {messages.length === 1 && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {quickSuggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => sendMessage(s)}
                style={{ borderRadius: 100, border: '1.5px solid #E5E7EB', padding: '10px 16px', cursor: 'pointer', alignSelf: 'flex-start' }}
              >
                <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} style={{ height: 1 }} />
      </div>

      {/* 输入栏 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px 24px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="说点什么..."
            style={{
              flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: '#1A1A1A',
            }}
          />
        </div>
        <div
          onClick={() => sendMessage()}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: input.trim() && !loading ? '#8B5CF6' : '#D1D5DB',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          <SendIcon size={18} color="#FFFFFF" />
        </div>
      </div>

      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
    </div>
  )
}
