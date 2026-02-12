// 活动类型
export interface Activity {
  id: string
  title: string
  description?: string
  category: 'card' | 'sports' | 'meal' | 'hangout'
  categoryLabel: string
  categoryEmoji: string
  location: string
  distance: string
  startTime: string
  timeDisplay: string
  urgency?: string
  currentParticipants: number
  maxParticipants: number
  initiator: {
    id: string
    name: string
    avatar: string
    rating?: number
    eventCount?: number
  }
  participants: {
    id: string
    avatar: string
  }[]
  createdAt: string
}

// 聊天消息
export interface ChatMessage {
  id: string
  roomId: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  content: string
  isSystem?: boolean
  timestamp: string
}

// 活动聊天室
export interface ChatRoom {
  id: string
  activityId: string
  activityTitle: string
  participantCount: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: string
  messages: ChatMessage[]
}

// 用户
export interface User {
  id: string
  name: string
  avatar: string
  email: string
  rating: number
  eventCount: number
  createdAt: string
}
