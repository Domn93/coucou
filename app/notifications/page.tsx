import Link from 'next/link'

// 作者: Maqingze
// 屏幕 15 — 通知中心

const LayoutGrid = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
)
const MessageCircle = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
)
const Mail = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const BellIcon = ({ size = 22, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
  return (
    <div style={{ width: 375, height: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部标题 */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700 }}>通知</span>
        <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>全部已读</span>
      </div>

      {/* 通知列表 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '8px 16px 16px 16px' }}>
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

      {/* tabBar */}
      <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 24px 28px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        {[
          { icon: <LayoutGrid />, label: '广场', href: '/plaza' },
          { icon: <MessageCircle />, label: 'AI助手', href: '/ai' },
          { icon: <Mail />, label: '消息', href: '/chat' },
          { icon: <BellIcon />, label: '通知', href: '/notifications', active: true },
        ].map((tab, i) => (
          <Link key={i} href={tab.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            {tab.icon}
            <span style={{ color: tab.active ? '#8B5CF6' : '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: tab.active ? 600 : 500 }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
