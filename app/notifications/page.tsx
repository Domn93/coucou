'use client'

import { useRouter } from 'next/navigation'

// 作者: Maqingze
// 屏幕 15 — 通知中心（二级页，从广场铃铛进入）

const ChevronLeft = ({ size = 24, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

// 通知数据
const notifications = [
  {
    icon: '🙋', bg: '#8B5CF620', iconColor: '#8B5CF6',
    title: '有人参与你的活动', desc: '运动达人Lisa 加入了"傍晚奥森跑步约伴"',
    time: '2分钟前', unread: true, highlight: '#F9F5FF', border: '#DDD6FE',
  },
  {
    icon: '⏰', bg: '#FDF2F8', iconColor: '#EC4899',
    title: '活动即将开始', desc: '"望京德州扑克之夜"将在30分钟后开始',
    time: '28分钟前', unread: true, highlight: '#FDF2F8', border: '#FBCFE8',
  },
  {
    icon: '✦', bg: '#F4F4F5', iconColor: '#8B5CF6',
    title: 'AI 为你推荐新活动', desc: '周末奥森登山约伴，3人已加入，你可能感兴趣',
    time: '1小时前', unread: false, highlight: '#FFFFFF', border: '#F4F4F5',
  },
  {
    icon: '⭐', bg: '#FFFBEB', iconColor: '#F59E0B',
    title: '收到新评价', desc: '吃货小王给你留下了5星好评 🎉',
    time: '昨天', unread: false, highlight: '#FFFFFF', border: '#F4F4F5',
  },
  {
    icon: '🎉', bg: '#F0FDF4', iconColor: '#22C55E',
    title: '活动回顾已生成', desc: '"奥森跑步"的 AI 回顾已生成，快去看看吧',
    time: '昨天', unread: false, highlight: '#FFFFFF', border: '#F4F4F5',
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  return (
    <div style={{ width: '100%', minHeight: '100dvh', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部标题（带返回按钮） */}
      <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'max(8px, env(safe-area-inset-top)) 20px 0 20px', flexShrink: 0 }}>
        <div onClick={() => router.back()} style={{ display: 'flex', cursor: 'pointer' }}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </div>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700 }}>通知</span>
        <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>全部已读</span>
      </div>

      {/* 通知列表 */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 16px 16px 16px' }}>
        {notifications.map((n, i) => (
          <div key={i} style={{
            borderRadius: 18, backgroundColor: n.highlight,
            border: `1.5px solid ${n.border}`,
            padding: '14px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative',
          }}>
            {/* 未读圆点 */}
            {n.unread && (
              <div style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5CF6' }} />
            )}
            {/* 图标 */}
            <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: n.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 20 }}>{n.icon}</span>
            </div>
            {/* 文字 */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, paddingRight: 16 }}>
              <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: n.unread ? 700 : 600 }}>{n.title}</span>
              <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: '1.5' }}>{n.desc}</span>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 2 }}>{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
