import Link from 'next/link'

// 作者: Maqingze
// 屏幕 7 — 发起活动

const ChevronLeft = ({ size = 20, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

// 活动类型选项
const activityTypes = [
  { emoji: '🏃', label: '运动', color: '#14B8A6', bg: '#14B8A620' },
  { emoji: '🍜', label: '饭局', color: '#F472B6', bg: '#F472B620' },
  { emoji: '🃏', label: '打牌', color: '#8B5CF6', bg: '#8B5CF620' },
  { emoji: '🚶', label: '闲逛', color: '#F59E0B', bg: '#F59E0B20' },
  { emoji: '🖼', label: '展览', color: '#3B82F6', bg: '#3B82F620' },
  { emoji: '🎵', label: '音乐', color: '#EC4899', bg: '#EC489920' },
]

export default function CreatePage() {
  return (
    <div style={{ width: 375, minHeight: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* 顶部导航 */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 18, backgroundColor: '#F4F4F5', textDecoration: 'none' }}>
          <ChevronLeft />
        </Link>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>发起活动</span>
        <div style={{ width: 36 }} />
      </div>

      {/* 表单内容 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 20px 24px 20px', overflowY: 'auto' }}>

        {/* 活动类型 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动类型</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {activityTypes.map((t, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                borderRadius: 100, backgroundColor: i === 0 ? t.bg : '#F4F4F5',
                border: i === 0 ? `1.5px solid ${t.color}` : '1.5px solid transparent',
              }}>
                <span style={{ fontSize: 14 }}>{t.emoji}</span>
                <span style={{ color: i === 0 ? t.color : '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 活动名称 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动名称</span>
          <div style={{ borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px' }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>给活动起个名字...</span>
          </div>
        </div>

        {/* 时间 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动时间</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>选择日期</span>
              <span style={{ fontSize: 14 }}>📅</span>
            </div>
            <div style={{ flex: 1, borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>选择时间</span>
              <span style={{ fontSize: 14 }}>⏰</span>
            </div>
          </div>
        </div>

        {/* 地点 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动地点</span>
          <div style={{ borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>搜索地点...</span>
          </div>
        </div>

        {/* 人数限制 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>人数限制</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['2人', '4人', '6人', '10人', '不限'].map((n, i) => (
              <div key={i} style={{
                flex: 1, padding: '10px 0', borderRadius: 100, backgroundColor: i === 1 ? '#8B5CF6' : '#F4F4F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: i === 1 ? '#FFFFFF' : '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 活动描述 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>活动描述</span>
          <div style={{ borderRadius: 14, backgroundColor: '#F4F4F5', padding: '14px 16px', minHeight: 100 }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>介绍一下这个活动，吸引更多人参加...</span>
          </div>
        </div>

        {/* 发布按钮 */}
        <div style={{ borderRadius: 100, backgroundColor: '#8B5CF6', padding: '16px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
          <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>✦ 立即发布</span>
        </div>
      </div>
    </div>
  )
}
