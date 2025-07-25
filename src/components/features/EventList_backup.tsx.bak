'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar as CalendarIcon, 
  MapPin as LocationIcon, 
  Users as UsersIcon, 
  Star as StarIcon, 
  Plus as PlusIcon,
  Clock,
  Heart,
  Music,
  Target,
  BookOpen,
  Coffee,
  Sparkles,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'

// 型定義を直接定義
interface Event {
  id: string
  title: string
  description: string | null
  event_type: 'kpop' | 'penalty_kick' | 'study' | 'social'
  start_date: string
  end_date: string | null
  location: string | null
  max_participants: number | null
  points_reward: number
  created_by: string
  created_at: string
  updated_at: string
  participants?: Participant[]
}

interface Participant {
  id: string
  user_id: string
  event_id: string
  joined_at: string
  user?: {
    id: string
    display_name: string
    avatar_url?: string | null
  }
}

interface EventCardProps {
  event: Event
  onJoin?: (eventId: string) => void
  userParticipating?: boolean
  participants?: Participant[]
  onShowParticipants?: (eventId: string) => void
}

interface EventListProps {
  events: Event[]
  onJoinEvent?: (eventId: string) => void
  userParticipations?: string[]
  participants?: { [eventId: string]: Participant[] }
}

const eventTypeLabels = {
  kpop: 'K-pop',
  penalty_kick: 'ペナルティキック',
  study: '学習',
  social: '交流'
}

const eventTypeColors = {
  kpop: {
    bg: 'bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600',
    text: 'text-white',
    icon: Music,
    accent: 'from-rose-50 via-pink-50 to-fuchsia-100',
    border: 'border-rose-300',
    shadow: 'shadow-pink-200/50',
    glow: 'drop-shadow-lg drop-shadow-pink-200/30'
  },
  penalty_kick: {
    bg: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600',
    text: 'text-white',
    icon: Target,
    accent: 'from-emerald-50 via-green-50 to-teal-100',
    border: 'border-emerald-300',
    shadow: 'shadow-green-200/50',
    glow: 'drop-shadow-lg drop-shadow-green-200/30'
  },
  study: {
    bg: 'bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600',
    text: 'text-white',
    icon: BookOpen,
    accent: 'from-sky-50 via-blue-50 to-indigo-100',
    border: 'border-sky-300',
    shadow: 'shadow-blue-200/50',
    glow: 'drop-shadow-lg drop-shadow-blue-200/30'
  },
  social: {
    bg: 'bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600',
    text: 'text-white',
    icon: Coffee,
    accent: 'from-violet-50 via-purple-50 to-indigo-100',
    border: 'border-violet-300',
    shadow: 'shadow-purple-200/50',
    glow: 'drop-shadow-lg drop-shadow-purple-200/30'
  }
}

const EventCard = ({ event, onJoin, userParticipating }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const getTimeUntilEvent = (dateString: string) => {
    const now = new Date()
    const eventDate = new Date(dateString)
    const diffMs = eventDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return '終了'
    if (diffDays === 0) return '今日'
    if (diffDays === 1) return '明日'
    return `${diffDays}日後`
  }

  const typeConfig = eventTypeColors[event.event_type]
  const IconComponent = typeConfig.icon
  const timeUntil = getTimeUntilEvent(event.start_date)
  const isUpcoming = timeUntil !== '終了'

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1">
      {/* Gradient Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${typeConfig.bg} rounded-t-2xl`}></div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 ${typeConfig.bg} rounded-xl ${typeConfig.text} shadow-lg`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 bg-gradient-to-r ${typeConfig.accent} text-gray-700 rounded-full text-xs font-medium border ${typeConfig.border}`}>
                {eventTypeLabels[event.event_type]}
              </span>
              {isUpcoming && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                  {timeUntil}
                </span>
              )}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
            {event.title}
          </h3>
          
          {event.description && (
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            <StarIcon className="w-4 h-4 fill-current" />
            {event.points_reward}pt
          </div>
        </div>
      </div>
      
      {/* Event Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-gray-600">
          <CalendarIcon className="w-4 h-4 text-blue-500" />
          <div>
            <div className="font-medium text-gray-800">{formatDate(event.start_date)}</div>
            <div className="text-xs text-gray-500">{formatFullDate(event.start_date)}</div>
          </div>
        </div>
        
        {event.location && (
          <div className="flex items-center gap-3 text-gray-600">
            <LocationIcon className="w-4 h-4 text-green-500" />
            <span className="font-medium">{event.location}</span>
          </div>
        )}
        
        {event.max_participants && (
          <div className="flex items-center gap-3 text-gray-600">
            <UsersIcon className="w-4 h-4 text-purple-500" />
            <span>定員 {event.max_participants}名</span>
          </div>
        )}
      </div>
      
      {/* Action Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>作成: {new Date(event.created_at).toLocaleDateString('ja-JP')}</span>
        </div>
        
        {onJoin && (
          <Button
            onClick={() => onJoin(event.id)}
            disabled={userParticipating || !isUpcoming}
            className={`
              transition-all duration-300 
              ${userParticipating 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : isUpcoming
                  ? `${typeConfig.bg} hover:shadow-lg hover:shadow-gray-300/50 text-white font-medium`
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {userParticipating ? (
              <>
                <StarIcon className="w-4 h-4 mr-2 fill-current" />
                参加済み
              </>
            ) : !isUpcoming ? (
              '終了済み'
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                参加する
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}

export default function EventList({ events, onJoinEvent, userParticipations = [] }: EventListProps) {
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false)

  useEffect(() => {
    let filtered = [...events]

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.event_type === filterType)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Upcoming filter
    if (showUpcomingOnly) {
      const now = new Date()
      filtered = filtered.filter(event => new Date(event.start_date) > now)
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

    setFilteredEvents(filtered)
  }, [events, filterType, searchQuery, showUpcomingOnly])

  const getEventTypeCount = (type: string) => {
    if (type === 'all') return events.length
    return events.filter(event => event.event_type === type).length
  }

  const upcomingEventsCount = events.filter(event => new Date(event.start_date) > new Date()).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            イベント一覧
          </h2>
          <p className="text-gray-600 mt-1">
            全 {events.length} 件のイベント（うち {upcomingEventsCount} 件が開催予定）
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="イベントを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <Button
            variant={showUpcomingOnly ? "default" : "outline"}
            onClick={() => setShowUpcomingOnly(!showUpcomingOnly)}
            className="gap-2 bg-white/80 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            開催予定のみ
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filterType === 'all'
              ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
              : 'bg-white/80 text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          すべて ({getEventTypeCount('all')})
        </button>
        
        {Object.entries(eventTypeLabels).map(([type, label]) => {
          const config = eventTypeColors[type as keyof typeof eventTypeColors]
          const IconComponent = config.icon
          const count = getEventTypeCount(type)
          
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                filterType === type
                  ? `${config.bg} text-white shadow-lg`
                  : 'bg-white/80 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {label} ({count})
            </button>
          )
        })}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onJoin={onJoinEvent}
              userParticipating={userParticipations.includes(event.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {searchQuery || filterType !== 'all' || showUpcomingOnly
              ? '条件に一致するイベントが見つかりません'
              : 'まだイベントがありません'
            }
          </h3>
          <p className="text-gray-600">
            {searchQuery || filterType !== 'all' || showUpcomingOnly
              ? 'フィルターを変更して再度お試しください'
              : '新しいイベントが作成されるまでお待ちください'
            }
          </p>
          {(searchQuery || filterType !== 'all' || showUpcomingOnly) && (
            <Button
              onClick={() => {
                setSearchQuery('')
                setFilterType('all')
                setShowUpcomingOnly(false)
              }}
              variant="outline"
              className="mt-4"
            >
              フィルターをリセット
            </Button>
          )}
        </div>
      )}
    </div>
  )
}