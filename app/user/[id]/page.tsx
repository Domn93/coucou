import Link from 'next/link'

// 作者: Maqingze
// 屏幕 14 — 他人主页

const ChevronLeft = ({ size = 20, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const MoreHorizontal = ({ size = 20, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
  </svg>
)

// 历史活动
const activities = [
  { emoji: '🏃', title: '奥森公园傍晚跑步约伴', date: '2026.02.20', people: '6人参与' },
  { emoji: '🍜', title: '望京新开的火锅店探店', date: '2026.02.15', people: '4人参与' },
  { emoji: '🃏', title: 'SOHO 德州扑克之夜', date: '2026.02.10', people: '4人参与' },
]

export default function UserProfilePage() {
  return (
    <div style={{ width: 375, height: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', textDecoration: 'none' }}>
          <ChevronLeft />
        </Link>
        <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MoreHorizontal />
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* 用户信息 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '16px 20px 24px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 28, fontWeight: 700 }}>L</span>
          </div>
          <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700 }}>运动达人Lisa</span>
          {/* 星级评分 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ fontSize: 16, color: s <= 4 ? '#F59E0B' : '#D1D5DB' }}>★</span>
              ))}
            </div>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>4.8</span>
          </div>
          <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 14, textAlign: 'center' }}>热爱跑步和户外运动，望京本地人，喜欢约伴一起玩 🏃</span>
        </div>

        {/* 统计栏 */}
        <div style={{ display: 'flex', margin: '0 20px 20px 20px', borderRadius: 18, backgroundColor: '#F4F4F5', overflow: 'hidden' }}>
          {[
            { value: '18', label: '参与活动' },
            { value: '7', label: '发起活动' },
            { value: '4.8', label: '综合评分' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '14px 0', borderRight: i < 2 ? '1px solid #E5E7EB' : 'none' }}>
              <span style={{ color: i === 2 ? '#8B5CF6' : '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 700 }}>{s.value}</span>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* 参与过的活动 */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>参与过的活动</span>
          {activities.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, backgroundColor: '#F4F4F5' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20 }}>{a.emoji}</span>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>{a.title}</span>
                <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{a.date} · {a.people}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 底部按钮 */}
        <div style={{ display: 'flex', gap: 12, padding: '20px 20px 28px 20px' }}>
          <div style={{ flex: 1, borderRadius: 100, backgroundColor: '#8B5CF6', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>发送消息</span>
          </div>
          <div style={{ flex: 1, borderRadius: 100, backgroundColor: '#F4F4F5', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700 }}>邀请活动</span>
          </div>
        </div>
      </div>
    </div>
  )
}
