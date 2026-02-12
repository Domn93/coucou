import Link from 'next/link'

// Lucide icons as inline SVGs
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
const User = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

// 活动卡片数据
const cards = [
  {
    avatar: '#8B5CF6', name: '小明同学', tag: '🃏 打牌', tagColor: '#8B5CF6', tagBg: '#8B5CF620',
    title: '三缺一！望京 SOHO 德州扑克',
    dist: '步行5分钟', time: '30分钟后开始', timeColor: '#F472B6',
    people: '3/4 人已加入',
  },
  {
    avatar: '#14B8A6', name: '运动达人Lisa', tag: '🏃 运动', tagColor: '#14B8A6', tagBg: '#14B8A620',
    title: '傍晚奥森公园跑步约伴',
    dist: '🚶 步行12分钟', time: '⏰ 1小时后', timeColor: '#F472B6',
    people: '2/6 人已加入', useEmoji: true,
  },
  {
    avatar: '#F472B6', name: '吃货小王', tag: '🍜 饭局', tagColor: '#F472B6', tagBg: '#F472B620',
    title: '新开的川菜馆谁来尝尝',
    dist: '🚶 步行8分钟', time: '⏰ 今晚7点', timeColor: '#F472B6',
    people: '1/4 人已加入', useEmoji: true,
  },
]

export default function PlazaPage() {
  return (
    <div style={{ width: 375, height: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* statusBar */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={16} color="#8B5CF6" />
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>朝阳区·望京</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={18} color="#1A1A1A" />
        </div>
      </div>

      {/* searchBar */}
      <div style={{ height: 48, borderRadius: 24, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', margin: '0 16px', flexShrink: 0 }}>
        <Search size={18} color="#9CA3AF" />
        <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>附近有什么好玩的...</span>
      </div>

      {/* content - 活动卡片流 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: '12px 16px 0 16px', overflowY: 'auto' }}>
        {cards.map((card, i) => (
          <Link href="/activity" key={i} style={{ textDecoration: 'none' }}>
            <div style={{ borderRadius: 20, backgroundColor: '#F4F4F5', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* top */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: card.avatar }} />
                  <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{card.name}</span>
                </div>
                <div style={{ borderRadius: 12, backgroundColor: card.tagBg, padding: '4px 10px' }}>
                  <span style={{ color: card.tagColor, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>{card.tag}</span>
                </div>
              </div>
              {/* title */}
              <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700 }}>{card.title}</span>
              {/* info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                {card.useEmoji ? (
                  <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{card.dist}</span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Footprints size={14} color="#9CA3AF" />
                    <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{card.dist}</span>
                  </div>
                )}
                {card.useEmoji ? (
                  <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{card.time}</span>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} color="#9CA3AF" />
                    <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{card.time}</span>
                  </div>
                )}
              </div>
              {/* bottom */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>{card.people}</span>
                <div style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>凑一个</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* tabBar */}
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
        <Link href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <User size={22} color="#D1D5DB" />
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>我的</span>
        </Link>
      </div>
    </div>
  )
}
