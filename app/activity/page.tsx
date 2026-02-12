import Link from 'next/link'

const ChevronLeft = ({ size = 24, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)
const Share2 = ({ size = 22, color = '#1A1A1A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
)
const MapPinIcon = ({ size = 28, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const Plus = ({ size = 18, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const Sparkles = ({ size = 20, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
  </svg>
)

export default function ActivityPage() {
  return (
    <div style={{ width: 375, height: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <Link href="/plaza" style={{ display: 'flex' }}><ChevronLeft /></Link>
        <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700 }}>活动详情</span>
        <Share2 size={22} color="#1A1A1A" />
      </div>

      {/* body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 20px 0 20px', overflowY: 'auto' }}>
        {/* titleRow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ borderRadius: 12, backgroundColor: '#8B5CF620', padding: '4px 10px' }}>
              <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>🃏 打牌</span>
            </div>
            <div style={{ borderRadius: 12, backgroundColor: '#F472B620', padding: '4px 10px' }}>
              <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>急缺1人</span>
            </div>
          </div>
          <h1 style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, margin: 0 }}>
            三缺一！望京 SOHO 德州扑克
          </h1>
        </div>

        {/* hostRow */}
        <div style={{ borderRadius: 16, backgroundColor: '#F4F4F5', padding: 14, display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#8B5CF6', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
            <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600 }}>小明同学</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>⭐ 4.8 靠谱度</span>
              <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>· 发起过 12 次活动</span>
            </div>
          </div>
        </div>

        {/* mapBox */}
        <div style={{ borderRadius: 16, backgroundColor: '#E5E7EB', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <MapPinIcon size={28} color="#9CA3AF" />
          <span style={{ color: '#6B7280', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, marginLeft: 4 }}>望京SOHO · 步行5分钟</span>
        </div>

        {/* timeSection */}
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <div style={{ flex: 1, borderRadius: 16, backgroundColor: '#F4F4F5', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>开始时间</span>
            <span style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>今天 19:30</span>
          </div>
          <div style={{ flex: 1, borderRadius: 16, backgroundColor: '#F4F4F5', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>倒计时</span>
            <span style={{ color: '#F472B6', fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700 }}>30 分钟</span>
          </div>
        </div>

        {/* pplSection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700 }}>参与者</span>
            <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>3/4 人</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#14B8A6' }} />
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#F472B6' }} />
            <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F4F4F5', border: '2px solid #D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={18} color="#9CA3AF" />
            </div>
          </div>
        </div>
      </div>

      {/* bottomBar */}
      <div style={{ height: 100, display: 'flex', alignItems: 'center', padding: '16px 20px 34px 20px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        <Link href="/chat" style={{
          width: '100%', height: 52, borderRadius: 100, backgroundColor: '#8B5CF6',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
        }}>
          <span style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700 }}>凑一个</span>
          <Sparkles size={20} color="#FFFFFF" />
        </Link>
      </div>
    </div>
  )
}
