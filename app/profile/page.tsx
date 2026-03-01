import Link from 'next/link'

const ChevronRight = ({ size = 18, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
)
const LayoutGrid = ({ size = 22, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
)
const MessageCircle = ({ size = 22, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
)
const Mail = ({ size = 22, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
const UserIcon = ({ size = 22, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)
const MapIcon = ({ size = 22, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
  </svg>
)

const menuItems = [
  { emoji: '📅', label: '我的活动', bgColor: '#8B5CF620' },
  { emoji: '⭐', label: '我的评价', bgColor: '#14B8A620' },
  { emoji: '💬', label: '消息通知', bgColor: '#F472B620' },
  { emoji: '⚙️', label: '设置', bgColor: '#F4F4F5', border: true },
]

export default function ProfilePage() {
  return (
    <div style={{ width: '100%', height: '100dvh', backgroundColor: '#F8F7FF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(8px, env(safe-area-inset-top)) 20px 0 20px', flexShrink: 0 }}>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>我的</span>
      </div>

      {/* profileSection */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '20px 20px 24px 20px', flexShrink: 0 }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700 }}>我</span>
        </div>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700 }}>我</span>
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>me@test.com</span>
      </div>

      {/* statsRow */}
      <div style={{ display: 'flex', gap: 12, padding: '0 20px', flexShrink: 0 }}>
        {[
          { value: '5.0', label: '靠谱度', color: '#8B5CF6' },
          { value: '0', label: '参与活动', color: '#1A1A1A' },
          { value: '0', label: '发起活动', color: '#1A1A1A' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, backgroundColor: i === 0 ? '#F5F3FF' : '#FFFFFF', border: `1px solid ${i === 0 ? '#DDD6FE' : '#EDE9FE'}`, borderRadius: 16, padding: 16 }}>
            <span style={{ color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700 }}>{s.value}</span>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* menuSection */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '20px 20px 0 20px' }}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #EDE9FE', borderRadius: 20, overflow: 'hidden' }}>
          {menuItems.map((item, i) => (
            <div key={i}>
              {i > 0 && <div style={{ height: 1, backgroundColor: '#E5E7EB', width: '100%' }} />}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 12, backgroundColor: item.bgColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    ...(item.border ? { border: '1px solid #E5E7EB' } : {}),
                  }}>
                    <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  </div>
                  <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600 }}>{item.label}</span>
                </div>
                <ChevronRight />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tabBar */}
      <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 24px calc(12px + env(safe-area-inset-bottom)) 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #EDE9FE', flexShrink: 0 }}>
        {[
          { icon: <LayoutGrid />, label: '广场', active: false, href: '/plaza' },
          { icon: <MapIcon />, label: '地图', active: false, href: '/map' },
          { icon: <MessageCircle />, label: 'AI助手', active: false, href: '/ai' },
          { icon: <Mail />, label: '消息', active: false, href: '/chat' },
          { icon: <UserIcon />, label: '我的', active: true, href: '/profile' },
        ].map((tab, i) => (
          <Link key={i} href={tab.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            {tab.icon}
            <span style={{ color: tab.active ? '#8B5CF6' : '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: tab.active ? 600 : 500 }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
