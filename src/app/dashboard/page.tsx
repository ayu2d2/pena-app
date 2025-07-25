'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import EventList from '@/components/features/EventList'
import { EventForm } from '@/components/features/EventForm'
import Gamification, { PointsDisplay, Leaderboard } from '@/components/features/Gamification'
import Navigation from '@/components/layout/Navigation'
import { useNotifications, useEventNotifications } from '@/hooks/useNotifications'
import { Plus, Trophy, Calendar, Award } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
}

interface Badge {
  id: string
  name: string
  description: string | null
  icon: string | null
  color: string
  points_required: number
  special_condition: string | null
  created_at: string
}

interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
}

interface Profile {
  id: string
  display_name: string
  student_id: string | null
  year: number | null
  favorite_kpop_group: string | null
  penalty_kick_skill: number
  total_points: number
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

type TabType = 'events' | 'create' | 'points' | 'badges'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('events')
  const [events, setEvents] = useState<Event[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [userParticipations, setUserParticipations] = useState<string[]>([])
  const [participants, setParticipants] = useState<{ [eventId: string]: any[] }>({})
  const [userNotifications, setUserNotifications] = useState<{ [eventId: string]: boolean }>({})
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()
  
  // 通知システムのフック
  const { permission, requestPermission } = useNotifications()
  const { 
    addNotification, 
    removeNotification, 
    toggleNotification, 
    isNotificationEnabled 
  } = useEventNotifications()

  // 認証チェック
  useEffect(() => {
    checkAuth()
  }, [])

  // 通知許可を要求
  useEffect(() => {
    if (authChecked && !permission.granted && permission.default) {
      requestPermission()
    }
  }, [authChecked, permission, requestPermission])

  const checkAuth = async () => {
    try {
      // デモモード: ローカルストレージから認証情報を確認
      const userInfo = localStorage.getItem('penaapp_user')
      
      if (!userInfo) {
        router.push('/auth')
        return
      }
      
      const userData = JSON.parse(userInfo)
      setAuthChecked(true)
      loadSampleData(userData)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth')
    }
  }

  const loadSampleData = (userData?: any) => {
    // Sample events
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'K-popダンス練習会',
        description: 'NewJeansの新曲「Get Up」の振り付けを一緒に覚えましょう！',
        event_type: 'kpop',
        start_date: '2025-07-26T14:00:00Z',
        end_date: '2025-07-26T16:00:00Z',
        location: '上智大学体育館',
        max_participants: 20,
        points_reward: 15,
        created_by: 'user1',
        created_at: '2025-07-24T00:00:00Z',
        updated_at: '2025-07-24T00:00:00Z'
      },
      {
        id: '2',
        title: 'ペナルティキック大会',
        description: '月例PK大会！優勝者には特別ポイントボーナス🏆',
        event_type: 'penalty_kick',
        start_date: '2025-07-28T15:00:00Z',
        end_date: '2025-07-28T17:00:00Z',
        location: 'サッカーグラウンド',
        max_participants: 16,
        points_reward: 25,
        created_by: 'user2',
        created_at: '2025-07-24T00:00:00Z',
        updated_at: '2025-07-24T00:00:00Z'
      },
      {
        id: '3',
        title: 'SDGs学習会：海洋保護',
        description: 'ドルフィンらしく海洋保護について学びましょう🐬',
        event_type: 'study',
        start_date: '2025-07-30T13:00:00Z',
        end_date: '2025-07-30T15:00:00Z',
        location: 'オンライン',
        max_participants: null,
        points_reward: 20,
        created_by: 'user3',
        created_at: '2025-07-24T00:00:00Z',
        updated_at: '2025-07-24T00:00:00Z'
      }
    ]

    // Sample badges
    const sampleBadges: Badge[] = [
      {
        id: '1',
        name: '新人ドルフィン',
        description: '初回イベント参加',
        icon: '🐬',
        color: '#0080ff',
        points_required: 0,
        special_condition: null,
        created_at: '2025-07-24T00:00:00Z'
      },
      {
        id: '2',
        name: 'K-popファン',
        description: 'K-popイベント5回参加',
        icon: '🎵',
        color: '#ff6b9d',
        points_required: 50,
        special_condition: null,
        created_at: '2025-07-24T00:00:00Z'
      }
    ]

    // Sample profiles
    const sampleProfiles: Profile[] = [
      {
        id: 'user1',
        display_name: userData?.displayName || '山田太郎',
        student_id: 'S2025001',
        year: 2,
        favorite_kpop_group: 'NewJeans',
        penalty_kick_skill: 7,
        total_points: 150,
        avatar_url: null,
        bio: 'K-pop大好き！',
        created_at: '2025-07-24T00:00:00Z',
        updated_at: '2025-07-24T00:00:00Z'
      }
    ]

    setEvents(sampleEvents)
    setBadges(sampleBadges)
    setProfiles(sampleProfiles)
    setCurrentUser(sampleProfiles[0])
    setUserBadges([{ id: '1', user_id: 'user1', badge_id: '1', earned_at: '2025-07-24T00:00:00Z' }])
    setUserParticipations(['1'])
    
    // サンプル参加者データ
    const sampleParticipants = {
      '1': [
        {
          id: 'p1',
          user_id: 'user1',
          event_id: '1',
          joined_at: '2025-07-24T10:00:00Z',
          user: {
            id: 'user1',
            display_name: '田中太郎',
            avatar_url: null
          }
        },
        {
          id: 'p2',
          user_id: 'user2',
          event_id: '1',
          joined_at: '2025-07-24T11:00:00Z',
          user: {
            id: 'user2',
            display_name: '佐藤花子',
            avatar_url: null
          }
        },
        {
          id: 'p3',
          user_id: 'user3',
          event_id: '1',
          joined_at: '2025-07-24T12:00:00Z',
          user: {
            id: 'user3',
            display_name: '鈴木次郎',
            avatar_url: null
          }
        }
      ],
      '2': [
        {
          id: 'p4',
          user_id: 'user2',
          event_id: '2',
          joined_at: '2025-07-24T09:00:00Z',
          user: {
            id: 'user2',
            display_name: '佐藤花子',
            avatar_url: null
          }
        }
      ]
    }
    
    setParticipants(sampleParticipants)
    setUserNotifications({ '1': true, '2': false })
    setLoading(false)
  }

  const handleCreateEvent = (eventData: any) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      created_by: currentUser?.id || 'unknown',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setEvents(prev => [newEvent, ...prev])
    setActiveTab('events')
  }

  const handleJoinEvent = async (eventId: string) => {
    if (!currentUser || userParticipations.includes(eventId)) return

    try {
      // 実際のアプリでは、eventParticipationService.joinEvent を使用
      // const result = await eventParticipationService.joinEvent(eventId, currentUser.id)
      // if (result.success) {
      
      // デモ用：即座に参加状態を更新
      setUserParticipations(prev => [...prev, eventId])
      
      // イベント情報を取得して通知設定に追加
      const event = events.find(e => e.id === eventId)
      if (event) {
        addNotification(eventId, event.title, event.start_date)
        setUserNotifications(prev => ({ ...prev, [eventId]: true }))
      }
      
      // 参加者情報をモック（実際のアプリでは eventParticipationService.getEventParticipants を使用）
      setParticipants(prev => ({
        ...prev,
        [eventId]: [
          ...(prev[eventId] || []),
          {
            id: Math.random().toString(36).substr(2, 9),
            user_id: currentUser.id,
            event_id: eventId,
            joined_at: new Date().toISOString(),
            user: {
              id: currentUser.id,
              display_name: currentUser.display_name,
              avatar_url: currentUser.avatar_url
            }
          }
        ]
      }))
      
    } catch (error) {
      console.error('参加エラー:', error)
    }
  }

  const handleNotificationToggle = async (eventId: string, enabled: boolean) => {
    try {
      // 実際のアプリでは、notificationService.updateNotificationSetting を使用
      // await notificationService.updateNotificationSetting(currentUser?.id || '', eventId, enabled)
      
      // デモ用：即座に通知設定を更新
      setUserNotifications(prev => ({ ...prev, [eventId]: enabled }))
      toggleNotification(eventId, enabled)
      
    } catch (error) {
      console.error('通知設定エラー:', error)
    }
  }

  const handleLogout = async () => {
    // デモモード: ローカルストレージから認証情報を削除
    localStorage.removeItem('penaapp_user')
    router.push('/')
  }

  const profilesWithRanks = profiles
    .sort((a, b) => b.total_points - a.total_points)
    .map((profile, index) => ({ ...profile, rank: index + 1 }))

  const recentGains = [
    { points: 15, reason: 'K-popダンス練習会参加', date: '2025-07-20T00:00:00Z' },
    { points: 10, reason: 'プロフィール設定完了', date: '2025-07-19T00:00:00Z' }
  ]

  const tabs = [
    { id: 'events', label: 'イベント', shortLabel: 'イベント', icon: Calendar },
    { id: 'create', label: '作成', shortLabel: '作成', icon: Plus },
    { id: 'points', label: 'ポイント', shortLabel: 'Pt', icon: Trophy },
    { id: 'badges', label: 'バッジ', shortLabel: 'バッジ', icon: Award }
  ]

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* 高視認性ローディング背景 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 rounded-full opacity-15 animate-float"></div>
        </div>
        
        <div className="text-center z-10">
          <div className="relative mb-12">
            <div className="w-32 h-32 bg-white backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border-2 border-blue-200 shadow-xl">
              <div className="text-6xl animate-bounce">🐬</div>
            </div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-20 rounded-full blur-2xl scale-150"></div>
          </div>
          <div className="space-y-4">
            <div className="text-3xl font-black text-gray-900">
              PenaAppを読み込み中...
            </div>
            <div className="text-lg text-gray-700 font-medium">
              少々お待ちください ✨
            </div>
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* 視認性重視のアニメーション背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/8 to-indigo-500/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/6 to-blue-500/6 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* 高コントラストヘッダー */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
              <div className="relative">
                <div className="text-2xl sm:text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-lg">🐬</div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-20 rounded-full blur-lg scale-150"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  PenaApp
                </h1>
                <div className="text-xs font-medium text-gray-600 tracking-wider uppercase">Dashboard</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Navigation currentUser={currentUser} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </div>

      {/* 高視認性ウェルカムバナー */}
      {currentUser && (
        <div className="relative bg-blue-600 text-white overflow-hidden">
          {/* バナー背景パターン */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-4 right-8 w-24 h-24 bg-white/15 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="text-2xl sm:text-4xl">👋</div>
                  <h2 className="text-xl sm:text-3xl font-black tracking-tight">
                    おかえりなさい、
                    <span className="block sm:inline">{currentUser.display_name}さん！</span>
                  </h2>
                </div>
                <p className="text-sm sm:text-lg text-blue-100 font-medium">
                  今日も素晴らしい一日にしましょう ✨
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-200">
                  <span>学年: {currentUser.year}年</span>
                  <span className="hidden sm:block">•</span>
                  <span>好きなグループ: {currentUser.favorite_kpop_group || 'まだ設定なし'}</span>
                </div>
              </div>
              
              <div className="flex flex-row sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-white/30 shadow-lg hover:scale-105 transition-all duration-300 flex-1 sm:flex-none">
                  <div className="text-2xl sm:text-3xl font-black text-white mb-1">{currentUser.total_points}</div>
                  <div className="text-xs sm:text-sm text-blue-100 font-medium">総ポイント</div>
                  <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-white/30 shadow-lg hover:scale-105 transition-all duration-300 flex-1 sm:flex-none">
                  <div className="text-3xl font-black text-white mb-1">#{profilesWithRanks.find(p => p.id === currentUser.id)?.rank || '-'}</div>
                  <div className="text-sm text-blue-100 font-medium">ランキング</div>
                  <div className="mt-2 flex justify-center">
                    <div className="text-xl">🏆</div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border border-white/30 shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-black text-white mb-1">{userBadges.length}</div>
                  <div className="text-sm text-blue-100 font-medium">獲得バッジ</div>
                  <div className="mt-2 flex justify-center">
                    <div className="text-xl">🏅</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 高視認性ナビゲーションタブ */}
      <div className="bg-white border-b border-gray-300 shadow-sm relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab, index) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 group whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.shortLabel || tab.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-blue-500 opacity-20 rounded-xl blur-lg scale-110"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 高視認性メインコンテンツ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="animate-fadeIn">
          {activeTab === 'events' && (
            <div className="space-y-6 sm:space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2">イベント一覧</h2>
                  <p className="text-sm sm:text-lg text-gray-700 font-medium">参加したいイベントを見つけよう</p>
                </div>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl group text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 sm:mr-3 transition-transform group-hover:rotate-90" />
                  新しいイベント
                </button>
              </div>
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-300 p-4 sm:p-8">
                <EventList
                  events={events}
                  onJoinEvent={handleJoinEvent}
                  userParticipations={userParticipations}
                  participants={participants}
                  onNotificationToggle={handleNotificationToggle}
                  userNotifications={userNotifications}
                />
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">新しいイベントを作成</h2>
                  <p className="text-lg text-gray-700 font-medium">みんなが楽しめるイベントを企画しよう</p>
                </div>
                <EventForm
                  onSubmit={handleCreateEvent}
                  onCancel={() => setActiveTab('events')}
                />
              </div>
            </div>
          )}

          {activeTab === 'points' && currentUser && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-gray-900 mb-4">ポイント & ランキング</h2>
                <p className="text-lg text-gray-700 font-medium">あなたの活動を確認しよう</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 p-8">
                  <PointsDisplay
                    points={currentUser.total_points}
                    rank={profilesWithRanks.find(p => p.id === currentUser.id)?.rank}
                    recentGains={recentGains}
                  />
                </div>
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl text-white">
                      📊
                    </div>
                    クイック統計
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">📅</div>
                        <span className="font-bold text-gray-800">参加イベント数</span>
                      </div>
                      <span className="text-2xl font-black text-blue-700">{userParticipations.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">🏅</div>
                        <span className="font-bold text-gray-800">獲得バッジ数</span>
                      </div>
                      <span className="text-2xl font-black text-indigo-700">{userBadges.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-cyan-50 rounded-2xl border border-cyan-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-600 rounded-lg text-white">🏆</div>
                        <span className="font-bold text-gray-800">現在のランキング</span>
                      </div>
                      <span className="text-2xl font-black text-cyan-700">
                        #{profilesWithRanks.find(p => p.id === currentUser.id)?.rank || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 p-8">
                <Leaderboard
                  users={profilesWithRanks.map(p => ({
                    id: p.id,
                    name: p.display_name,
                    points: p.total_points
                  }))}
                  currentUserId={currentUser.id}
                />
              </div>
            </div>
          )}

          {activeTab === 'badges' && currentUser && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 p-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black text-gray-900 mb-4">バッジコレクション</h2>
                <p className="text-lg text-gray-700 font-medium">あなたの成果を確認しよう</p>
              </div>
              <Gamification
                userBadges={userBadges.map(ub => ({
                  ...ub,
                  badge: badges.find(b => b.id === ub.badge_id)!
                }))}
                availableBadges={badges}
                userProfile={currentUser}
                leaderboardData={profilesWithRanks.map(p => ({
                  id: p.id,
                  name: p.display_name,
                  points: p.total_points
                }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
