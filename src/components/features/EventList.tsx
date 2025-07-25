'use client'

import React, { useState } from 'react'
import { Calendar, MapPin, Users, Trophy, Music, Dumbbell, BookOpen, Coffee, Bell } from 'lucide-react'

// 型定義
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
  onNotificationToggle?: (eventId: string, enabled: boolean) => void
  notificationsEnabled?: boolean
}

interface EventListProps {
  events: Event[]
  onJoinEvent?: (eventId: string) => void
  userParticipations?: string[]
  participants?: { [eventId: string]: Participant[] }
  onNotificationToggle?: (eventId: string, enabled: boolean) => void
  userNotifications?: { [eventId: string]: boolean }
}

// イベントタイプの設定
const eventTypeConfig = {
  kpop: {
    label: 'K-POP',
    color: 'bg-pink-500',
    textColor: 'text-white',
    icon: Music
  },
  penalty_kick: {
    label: 'PK',
    color: 'bg-green-500',
    textColor: 'text-white',
    icon: Dumbbell
  },
  study: {
    label: '勉強会',
    color: 'bg-blue-500',
    textColor: 'text-white',
    icon: BookOpen
  },
  social: {
    label: '交流会',
    color: 'bg-purple-500',
    textColor: 'text-white',
    icon: Coffee
  }
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onJoin, 
  userParticipating, 
  participants = [],
  onNotificationToggle,
  notificationsEnabled = false
}) => {
  const [showAllParticipants, setShowAllParticipants] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const typeConfig = eventTypeConfig[event.event_type]
  const IconComponent = typeConfig.icon
  
  const handleParticipantsToggle = () => {
    setShowAllParticipants(!showAllParticipants)
  }

  const handleJoin = async () => {
    if (!onJoin) return
    
    setIsJoining(true)
    try {
      await onJoin(event.id)
      // 参加時に通知を自動で有効化（ユーザーエクスペリエンス向上）
      if (onNotificationToggle) {
        onNotificationToggle(event.id, true)
      }
    } catch (error) {
      console.error('参加に失敗しました:', error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleNotificationToggle = () => {
    if (onNotificationToggle) {
      onNotificationToggle(event.id, !notificationsEnabled)
    }
  }

  const displayedParticipants = showAllParticipants ? participants : participants.slice(0, 6)
  const remainingCount = participants.length - 6

  const isEventFull = event.max_participants && participants.length >= event.max_participants

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* ヘッダー部分 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeConfig.color} ${typeConfig.textColor}`}>
              <IconComponent className="w-4 h-4 mr-1" />
              {typeConfig.label}
            </span>
            <span className="text-sm text-amber-600 font-medium flex items-center">
              <Trophy className="w-4 h-4 mr-1" />
              {event.points_reward}ポイント
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="text-right">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(event.start_date)}
            </div>
            {event.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                {event.location}
              </div>
            )}
          </div>

          {/* 通知設定ボタン */}
          {userParticipating && (
            <button
              onClick={handleNotificationToggle}
              className={`p-2 rounded-full transition-colors ${
                notificationsEnabled 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              title={notificationsEnabled ? '通知をオフにする' : '通知をオンにする'}
            >
              <Bell className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 説明文 */}
      {event.description && (
        <p className="text-gray-700 mb-4 text-sm">{event.description}</p>
      )}

      {/* 参加者可視化セクション */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              参加者 {participants.length}
              {event.max_participants && `/${event.max_participants}`}人
            </span>
          </div>
          {participants.length > 6 && (
            <button
              onClick={handleParticipantsToggle}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {showAllParticipants ? '少なく表示' : 'すべて表示'}
            </button>
          )}
        </div>

        {/* 参加者アバター表示 */}
        {participants.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center flex-wrap gap-2">
              {displayedParticipants.map((participant) => (
                <div 
                  key={participant.id} 
                  className="flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1.5 border hover:bg-gray-100 transition-colors"
                  title={`${participant.user?.display_name || 'ユーザー'} - ${new Date(participant.joined_at).toLocaleDateString('ja-JP')}`}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                    {participant.user?.avatar_url ? (
                      <img
                        src={participant.user.avatar_url}
                        alt={participant.user.display_name || 'ユーザー'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-medium">
                        {participant.user?.display_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {participant.user?.display_name || 'ユーザー'}
                  </span>
                </div>
              ))}
              
              {!showAllParticipants && remainingCount > 0 && (
                <button
                  onClick={handleParticipantsToggle}
                  className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors border"
                >
                  <span className="text-xs text-gray-600 font-medium">+{remainingCount}</span>
                </button>
              )}
            </div>

            {/* 参加状況プログレスバー */}
            {event.max_participants && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isEventFull ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${Math.min((participants.length / event.max_participants) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            )}

            {/* 最近の参加者表示 */}
            {participants.length > 0 && (
              <div className="text-xs text-gray-500">
                最新の参加: {participants[0]?.user?.display_name || 'ユーザー'} 
                ({new Date(participants[0]?.joined_at).toLocaleDateString('ja-JP')})
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">まだ参加者がいません</p>
            <p className="text-xs text-gray-400">最初の参加者になりませんか？</p>
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={handleJoin}
          disabled={userParticipating || isEventFull || isJoining}
          className={`w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
            userParticipating
              ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-200'
              : isEventFull
              ? 'bg-red-100 text-red-700 cursor-not-allowed border border-red-200'
              : isJoining
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed border border-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
          }`}
        >
          {isJoining ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              参加中...
            </span>
          ) : userParticipating ? (
            <span className="flex items-center justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              参加済み
            </span>
          ) : isEventFull ? (
            <span className="flex items-center justify-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              満員
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              参加する
            </span>
          )}
        </button>

        {/* 通知設定の説明 */}
        {userParticipating && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            <Bell className="w-3 h-3 inline mr-1" />
            {notificationsEnabled 
              ? 'イベント開始時に通知が届きます' 
              : '通知をオンにしてリマインダーを受け取る'
            }
          </p>
        )}
      </div>
    </div>
  )
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  onJoinEvent, 
  userParticipations = [],
  participants = {},
  onNotificationToggle,
  userNotifications = {}
}) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">イベントがありません</h3>
        <p className="text-gray-500">新しいイベントが作成されるまでお待ちください。</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onJoin={onJoinEvent}
          userParticipating={userParticipations.includes(event.id)}
          participants={participants[event.id] || []}
          onNotificationToggle={onNotificationToggle}
          notificationsEnabled={userNotifications[event.id] || false}
        />
      ))}
    </div>
  )
}

export default EventList
