import Link from 'next/link'

// 作者: Maqingze
// 屏幕 13 — 活动回顾页

const ChevronLeft = ({ size = 20, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
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
const UserIcon = ({ size = 22, color = '#D1D5DB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

// 参与者头像颜色
const avatarColors = ['#8B5CF6', '#14B8A6', '#F472B6', '#F59E0B']

export default function ActivityReviewPage() {
  return (
    <div style={{ width: 375, height: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <Link href="/activity" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', textDecoration: 'none' }}>
          <ChevronLeft />
        </Link>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>活动回顾</span>
        <div style={{ width: 36 }} />
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 活动标题区 */}
        <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ color: '#FFFFFF', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 800 }}>傍晚奥森公园跑步约伴</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: '4px 10px', borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>📅 2026年2月22日</span>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>👥 6人参与</span>
            </div>
            <div style={{ padding: '4px 10px', borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              <span style={{ color: '#E9D5FF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>已结束</span>
            </div>
          </div>
        </div>

        {/* 参与者头像墙 */}
        <div style={{ borderRadius: 20, backgroundColor: '#F4F4F5', padding: '16px 20px' }}>
          <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>参与者</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            {avatarColors.map((c, i) => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c, border: '2px solid #FFFFFF' }} />
            ))}
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginLeft: 4 }}>+2 人</span>
          </div>
        </div>

        {/* AI 回顾卡片 */}
        <div style={{ borderRadius: 20, backgroundColor: '#F9F5FF', border: '1.5px solid #DDD6FE', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>✦ AI 回顾</span>
          </div>
          <p style={{ color: '#4B5563', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: '1.7', margin: 0 }}>
            这是一次愉快的傍晚跑步！6位跑友在奥森公园相聚，沿着湖边绕行了两圈，共约6公里。夕阳下的奥森格外迷人，大家边跑边聊，气氛融洽。活动结束后还在路边小摊补充了能量，约好下次再战！🏃‍♀️✨
          </p>
        </div>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, borderRadius: 100, backgroundColor: '#8B5CF6', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>分享给朋友 🎉</span>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 20 }}>⭐</span>
          </div>
        </div>
      </div>

      {/* tabBar */}
      <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '12px 24px 28px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        {[
          { icon: <LayoutGrid />, label: '广场', href: '/plaza' },
          { icon: <MessageCircle />, label: 'AI助手', href: '/ai' },
          { icon: <Mail />, label: '消息', href: '/chat' },
          { icon: <UserIcon />, label: '我的', href: '/profile' },
        ].map((tab, i) => (
          <Link key={i} href={tab.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
            {tab.icon}
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500 }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
