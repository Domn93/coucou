// 作者: Maqingze
// 高德地图工具函数 — POI搜索、逆地理编码、距离计算

// 高德地图JS API加载状态
let amapLoaded = false
let loadPromise: Promise<void> | null = null

// 加载高德地图JS API
export function loadAmap(): Promise<void> {
  if (amapLoaded) return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_AMAP_KEY
    const securityCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE

    if (!key) {
      // 未配置Key时静默降级
      console.warn('[amap] NEXT_PUBLIC_AMAP_KEY 未配置，地图功能不可用')
      resolve()
      return
    }

    // 注入安全密钥
    if (securityCode) {
      (window as Window & { _AMapSecurityConfig?: { securityJsCode: string } })._AMapSecurityConfig = {
        securityJsCode: securityCode,
      }
    }

    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}&plugin=AMap.PlaceSearch,AMap.Geocoder`
    script.onload = () => {
      amapLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error('高德地图加载失败'))
    document.head.appendChild(script)
  })

  return loadPromise
}

// POI搜索结果
export interface PoiResult {
  id: string
  name: string
  address: string
  district: string
  location: { lat: number; lng: number }
}

// 高德POI搜索（输入关键字返回候选地点列表）
export async function searchPoi(keyword: string, city = ''): Promise<PoiResult[]> {
  await loadAmap()

  const AMap = (window as Window & { AMap?: { PlaceSearch: new (opts: object) => { search: (kw: string, cb: (status: string, result: { poiList?: { pois: Array<{ id: string; name: string; formattedAddress?: string; address?: string; adname?: string; location?: { lat: number; lng: number } }> } }) => void ) => void } } })?.AMap
  if (!AMap) return []

  return new Promise((resolve) => {
    const placeSearch = new AMap.PlaceSearch({
      city: city || '全国',
      pageSize: 8,
      pageIndex: 1,
    })

    placeSearch.search(keyword, (status: string, result: { poiList?: { pois: Array<{ id: string; name: string; formattedAddress?: string; address?: string; adname?: string; location?: { lat: number; lng: number } }> } }) => {
      if (status !== 'complete' || !result.poiList?.pois) {
        resolve([])
        return
      }

      const pois = result.poiList.pois.map(poi => ({
        id: poi.id,
        name: poi.name,
        address: poi.formattedAddress || poi.address || '',
        district: poi.adname || '',
        location: poi.location ? {
          lat: poi.location.lat,
          lng: poi.location.lng,
        } : { lat: 0, lng: 0 },
      }))

      resolve(pois)
    })
  })
}

// Haversine公式计算两点间距离（单位：米）
export function calcDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000 // 地球半径（米）
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLng = (lng2 - lng1) * rad
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// 距离转换为友好文本（步行速度约 5km/h）
export function distanceToText(meters: number): string {
  if (meters < 100) return '就在附近'
  if (meters < 500) return `${Math.round(meters / 10) * 10}m`
  if (meters < 1000) return `${Math.round(meters / 50) * 50}m`
  const km = meters / 1000
  if (km < 3) return `${km.toFixed(1)}km`
  // 超过3km显示步行时间（5km/h）
  const minutes = Math.round((meters / 5000) * 60)
  if (minutes < 60) return `步行${minutes}分钟`
  return `${km.toFixed(0)}km`
}

// 高德地图实例类型简化声明
type AMapInstance = {
  Map: new (container: string | HTMLElement, opts: object) => AMapMap
  Marker: new (opts: object) => AMapMarker
}

type AMapMap = {
  setCenter: (lnglat: [number, number]) => void
  getZoom: () => number
  getBounds: () => { getSouthWest: () => { lng: number; lat: number }; getNorthEast: () => { lng: number; lat: number } }
  on: (event: string, handler: () => void) => void
}

type AMapMarker = {
  setMap: (map: AMapMap | null) => void
  on: (event: string, handler: () => void) => void
}

// 初始化高德地图实例
export async function initMap(
  containerId: string,
  center: [number, number],
  zoom = 14
): Promise<AMapMap | null> {
  await loadAmap()
  const AMap = (window as Window & { AMap?: AMapInstance }).AMap
  if (!AMap) return null

  const map = new AMap.Map(containerId, {
    center,
    zoom,
    mapStyle: 'amap://styles/whitesmoke',
  })
  return map
}

// 地图笔记数据结构（用于创建 Marker）
export interface NoteMarkerData {
  id: string
  content: string
  authorName: string
  authorAvatar?: string
  latitude: number
  longitude: number
  likesCount: number
}

// 创建笔记气泡 Marker
export function createNoteMarker(
  map: AMapMap,
  note: NoteMarkerData,
  onClick?: (note: NoteMarkerData) => void
): AMapMarker | null {
  const AMap = (window as Window & { AMap?: AMapInstance }).AMap
  if (!AMap) return null

  // 自定义紫色气泡内容
  const content = `
    <div style="
      background: #8B5CF6;
      color: #fff;
      border-radius: 12px;
      padding: 6px 10px;
      font-size: 12px;
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 8px rgba(139,92,246,0.4);
      cursor: pointer;
      position: relative;
    ">
      ${note.content.slice(0, 15)}${note.content.length > 15 ? '…' : ''}
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #8B5CF6;
      "></div>
    </div>
  `

  const marker = new AMap.Marker({
    position: [note.longitude, note.latitude],
    content,
    offset: [0, -20],
  })

  marker.setMap(map as AMapMap)

  if (onClick) {
    marker.on('click', () => onClick(note))
  }

  return marker
}
