import Link from 'next/link'

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

export default function ChatPage() {
  return (
    <div style={{ width: 375, height: 812, backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', margin: '0 auto', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <Link href="/activity" style={{ display: 'flex' }}><ChevronLeft /></Link>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ color: '#1A1A1A', fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 700 }}>德州扑克局</span>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>4 人参与</span>
        </div>
        <Ellipsis size={22} color="#1A1A1A" />
      </div>

      {/* statusBanner */}
      <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#8B5CF610', flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22C55E' }} />
        <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500 }}>活动进行中 · 30分钟后开始</span>
      </div>

      {/* chatBody */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 16px 0 16px', overflowY: 'auto' }}>
        {/* sysMsg */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>你已加入活动群聊</span>
        </div>

        {/* otherRow1 */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#8B5CF6', flexShrink: 0 }} />
          <div style={{ borderRadius: '4px 18px 18px 18px', backgroundColor: '#F4F4F5', padding: 12, display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
            <span style={{ color: '#8B5CF6', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>小明同学</span>
            <p style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              欢迎欢迎！大家到了直接来3楼，我已经订好位子了 🎉
            </p>
          </div>
        </div>

        {/* otherRow2 */}
        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#14B8A6', flexShrink: 0 }} />
          <div style={{ borderRadius: '4px 18px 18px 18px', backgroundColor: '#F4F4F5', padding: 12, display: 'flex', flexDirection: 'column', gap: 4, width: 200 }}>
            <span style={{ color: '#14B8A6', fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>运动达人Lisa</span>
            <p style={{ color: '#1A1A1A', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              太好了！我正在路上，大概还有10分钟
            </p>
          </div>
        </div>

        {/* myRow */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <div style={{ borderRadius: '18px 4px 18px 18px', backgroundColor: '#8B5CF6', padding: 12, width: 160 }}>
            <p style={{ color: '#FFFFFF', fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, margin: 0 }}>
              好的，我马上出发！
            </p>
          </div>
        </div>

        {/* arrivedRow */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ borderRadius: 100, backgroundColor: '#14B8A620', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPinSmall size={16} color="#14B8A6" />
            <span style={{ color: '#14B8A6', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>我已到达</span>
          </div>
        </div>
      </div>

      {/* inputBar */}
      <div style={{ height: 64, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F4F4F5', flexShrink: 0 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F4F4F5', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
          <span style={{ color: '#9CA3AF', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>发送消息...</span>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Send size={20} color="#FFFFFF" />
        </div>
      </div>
    </div>
  )
}
