'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar as CalendarIcon, 
  MapPin as LocationIcon, 
  Users as UsersIcon, 
  Star as StarIcon, 
  Plus as PlusIcon 
} from 'lucide-react'

// 型定義を直接定義
interface Event {
  id: string
  title: string
  description: string | null
  event_type: 'kpop' | 'penalty_kick' | 'study' | 'social' | 'volunteer'
  start_date: string
  end_date: string | null
  location: string | null
  max_participants: number | null
  points_reward: number
  created_by: string
  created_at: string
  updated_at: string
}

interface EventCardProps {
  event: Event
  onJoin?: (eventId: string) => void
  userParticipating?: boolean
}

interface EventListProps {
  events: Event[]
  onJoinEvent?: (eventId: string) => void
  userParticipations?: string[]
}

const eventTypeLabels = {
  kpop: 'K-pop',
  penalty_kick: 'ペナルティキック',
  study: '学習',
  social: '交流',
  volunteer: 'ボランティア'
}

const eventTypeColors = {
  kpop: 'bg-pink-100 text-pink-800',
  penalty_kick: 'bg-green-100 text-green-800',
  study: 'bg-blue-100 text-blue-800',
  social: 'bg-purple-100 text-purple-800',
  volunteer: 'bg-orange-100 text-orange-800'
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

  return (
    <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventTypeColors[event.event_type]}`}>
              {eventTypeLabels[event.event_type]}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {formatDate(event.start_date)}
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <LocationIcon className="w-4 h-4" />
                {event.location}
              </div>
            )}
          </div>
          {event.description && (
            <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-yellow-600">
          <StarIcon className="w-4 h-4 fill-current" />
          {event.points_reward}pt
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {event.max_participants && (
            <div className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              最大{event.max_participants}人
            </div>
          )}
        </div>
        
        {onJoin && (
          <Button
            onClick={() => onJoin(event.id)}
            disabled={userParticipating}
            variant={userParticipating ? "secondary" : "default"}
            size="sm"
          >
            {userParticipating ? '参加済み' : '参加する'}
          </Button>
        )}
      </div>
    </div>
  )
}

export function EventList({ events, onJoinEvent, userParticipations = [] }: EventListProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'joined'>('all')

  const filteredEvents = events.filter(event => {
    if (filter === 'joined') {
      return userParticipations.includes(event.id)
    }
    if (filter === 'upcoming') {
      return new Date(event.start_date) > new Date()
    }
    return true
  })

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-lg font-medium mb-2">イベントがありません</h3>
        <p className="text-muted-foreground mb-6">
          新しいイベントが作成されるまでお待ちください
        </p>
        <Button>
          <PlusIcon className="w-4 h-4" />
          イベントを作成
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">イベント一覧</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            すべて
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            今後
          </Button>
          <Button
            variant={filter === 'joined' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('joined')}
          >
            参加済み
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onJoin={onJoinEvent}
            userParticipating={userParticipations.includes(event.id)}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && filter !== 'all' && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {filter === 'joined' ? '参加したイベントがありません' : '今後のイベントがありません'}
          </p>
        </div>
      )}
    </div>
  )
}
