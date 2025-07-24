'use client'

import { useState } from 'react'
import type { Badge, UserBadge, Profile } from '@/types/database'
import { 
  Trophy as TrophyIcon, 
  Star as StarIcon, 
  Award as AwardIcon, 
  TrendingUp as TrendingUpIcon,
  Crown,
  Medal,
  Zap,
  Target,
  Calendar,
  Sparkles,
  ArrowUp,
  Gift,
  Users,
  Flame,
  Clock,
  ChevronRight
} from 'lucide-react'

interface BadgeCardProps {
  badge: Badge
  earned?: boolean
  earnedAt?: string
  progress?: number
}

const BadgeCard = ({ badge, earned, earnedAt, progress = 0 }: BadgeCardProps) => {
  return (
    <div className={`
      group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
      ${earned 
        ? 'bg-gradient-to-br from-white to-gray-50 border-yellow-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300'
      }
    `}>
      {/* Sparkle effect for earned badges */}
      {earned && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {/* Earned indicator */}
      {earned && (
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <StarIcon className="w-4 h-4 text-white fill-current" />
        </div>
      )}
      
      <div className="p-5 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all duration-300
            ${earned 
              ? 'bg-gradient-to-br from-yellow-400 to-orange-500 group-hover:scale-110' 
              : 'bg-gray-300 grayscale'
            }
          `}>
            {badge.icon}
          </div>
          <div className="flex-1">
            <h3 className={`
              font-bold text-lg transition-colors
              ${earned ? 'text-gray-800' : 'text-gray-500'}
            `}>
              {badge.name}
            </h3>
            {earnedAt && (
              <div className="flex items-center gap-1 text-sm text-yellow-600">
                <Calendar className="w-3 h-3" />
                {new Date(earnedAt).toLocaleDateString('ja-JP')} 獲得
              </div>
            )}
          </div>
        </div>

        <p className={`
          text-sm leading-relaxed mb-4
          ${earned ? 'text-gray-600' : 'text-gray-400'}
        `}>
          {badge.description}
        </p>
        
        {!earned && (
          <div className="space-y-3">
            {badge.points_required > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">必要ポイント</span>
                <span className="font-bold text-blue-600">{badge.points_required}pt</span>
              </div>
            )}
            
            {progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>進捗</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface PointsDisplayProps {
  points: number
  rank?: number
  recentGains?: Array<{
    points: number
    reason: string
    date: string
  }>
}

export const PointsDisplay = ({ points, rank, recentGains = [] }: PointsDisplayProps) => {
  const getRankInfo = (rank?: number) => {
    if (!rank) return { title: 'ランク外', icon: Users, color: 'from-gray-400 to-gray-500' }
    if (rank === 1) return { title: '1位', icon: Crown, color: 'from-yellow-400 to-orange-500' }
    if (rank <= 3) return { title: `${rank}位`, icon: Medal, color: 'from-orange-400 to-red-500' }
    if (rank <= 10) return { title: `${rank}位`, icon: Trophy, color: 'from-blue-400 to-purple-500' }
    return { title: `${rank}位`, icon: Target, color: 'from-green-400 to-blue-500' }
  }

  const rankInfo = getRankInfo(rank)
  const RankIcon = rankInfo.icon

  return (
    <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-8 left-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">総ポイント</h3>
              <p className="text-white/80">あなたの活動成果</p>
            </div>
          </div>
          
          {rank && (
            <div className={`px-4 py-2 bg-gradient-to-r ${rankInfo.color} rounded-full flex items-center gap-2 shadow-lg`}>
              <RankIcon className="w-5 h-5" />
              <span className="font-bold">{rankInfo.title}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Points */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <h4 className="text-lg font-semibold">現在のポイント</h4>
            </div>
            <div className="text-4xl font-bold mb-2">{points.toLocaleString()}</div>
            <div className="text-white/80 text-sm">
              次のレベルまで {Math.max(0, Math.ceil(points / 100) * 100 - points)}pt
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-yellow-300 to-orange-400 h-2 rounded-full"
                style={{ width: `${(points % 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUpIcon className="w-6 h-6 text-green-300" />
              <h4 className="text-lg font-semibold">最近の獲得</h4>
            </div>
            {recentGains.length > 0 ? (
              <div className="space-y-3">
                {recentGains.slice(0, 3).map((gain, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{gain.reason}</div>
                      <div className="text-xs text-white/70">
                        {new Date(gain.date).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-green-500/30 px-2 py-1 rounded-full">
                      <ArrowUp className="w-3 h-3" />
                      <span className="text-sm font-bold">+{gain.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/70 text-sm">
                最近の活動がありません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface LeaderboardProps {
  users: Array<{
    id: string
    name: string
    points: number
    avatar?: string
  }>
  currentUserId?: string
}

export const Leaderboard = ({ users, currentUserId }: LeaderboardProps) => {
  const [showAll, setShowAll] = useState(false)
  const displayUsers = showAll ? users : users.slice(0, 10)

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
    if (index === 2) return 'bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800'
    return 'bg-gray-100 text-gray-600'
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return Crown
    if (index <= 2) return Medal
    return Trophy
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-200/50 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">ランキング</h3>
            <p className="text-gray-600">ポイント上位者</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {users.length} 人参加中
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {displayUsers.map((user, index) => {
          const RankIcon = getRankIcon(index)
          const isCurrentUser = user.id === currentUserId
          
          return (
            <div
              key={user.id}
              className={`
                relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:shadow-md
                ${isCurrentUser 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-md' 
                  : 'bg-gray-50 hover:bg-gray-100'
                }
              `}
            >
              {/* Rank */}
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md
                ${getRankStyle(index)}
              `}>
                {index < 3 ? (
                  <RankIcon className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${isCurrentUser ? 'text-blue-700' : 'text-gray-800'}`}>
                    {user.name}
                  </span>
                  {isCurrentUser && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      あなた
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-gray-600 text-sm">{user.points.toLocaleString()} ポイント</span>
                </div>
              </div>

              {/* Achievement indicator */}
              {index < 3 && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {users.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all font-medium text-gray-700"
        >
          {showAll ? '折りたたむ' : `他 ${users.length - 10} 人を表示`}
          <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  )
}

interface GamificationProps {
  userBadges: (UserBadge & { badge: Badge })[]
  availableBadges: Badge[]
  userProfile: Profile
  leaderboardData?: Array<{
    id: string
    name: string
    points: number
  }>
}

export default function Gamification({ 
  userBadges, 
  availableBadges, 
  userProfile,
  leaderboardData = []
}: GamificationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'leaderboard'>('overview')

  const earnedBadgeIds = userBadges.map(ub => ub.badge_id)
  const unlockedBadges = userBadges.map(ub => ub.badge)
  const lockedBadges = availableBadges.filter(badge => !earnedBadgeIds.includes(badge.id))

  const recentGains = [
    { points: 15, reason: 'K-popイベント参加', date: '2025-01-24' },
    { points: 10, reason: 'PK練習参加', date: '2025-01-23' },
    { points: 5, reason: 'イベント作成', date: '2025-01-22' }
  ]

  const userRank = leaderboardData.findIndex(user => user.id === userProfile.id) + 1

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl">
        {[
          { id: 'overview', label: 'オーバービュー', icon: Sparkles },
          { id: 'badges', label: 'バッジ', icon: AwardIcon },
          { id: 'leaderboard', label: 'ランキング', icon: TrophyIcon }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <PointsDisplay 
            points={userProfile.total_points} 
            rank={userRank || undefined}
            recentGains={recentGains}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Badges */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-200/50 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AwardIcon className="w-5 h-5 text-yellow-500" />
                最近獲得したバッジ
              </h3>
              <div className="space-y-3">
                {unlockedBadges.slice(0, 3).map((badge, index) => {
                  const userBadge = userBadges.find(ub => ub.badge_id === badge.id)
                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      earned={true}
                      earnedAt={userBadge?.earned_at}
                    />
                  )
                })}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-200/50 p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                進捗サマリー
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">バッジ獲得率</span>
                  <span className="font-bold text-blue-600">
                    {Math.round((unlockedBadges.length / availableBadges.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    style={{ width: `${(unlockedBadges.length / availableBadges.length) * 100}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{unlockedBadges.length}</div>
                    <div className="text-sm text-gray-600">獲得済み</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{lockedBadges.length}</div>
                    <div className="text-sm text-gray-600">未獲得</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="space-y-6">
          {/* Earned Badges */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AwardIcon className="w-6 h-6 text-yellow-500" />
              獲得済みバッジ ({unlockedBadges.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unlockedBadges.map((badge) => {
                const userBadge = userBadges.find(ub => ub.badge_id === badge.id)
                return (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={true}
                    earnedAt={userBadge?.earned_at}
                  />
                )
              })}
            </div>
          </div>

          {/* Locked Badges */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              未獲得バッジ ({lockedBadges.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedBadges.map((badge) => {
                // Calculate mock progress
                const progress = Math.min(userProfile.total_points / (badge.points_required || 100), 1)
                return (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={false}
                    progress={progress}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <Leaderboard 
          users={leaderboardData} 
          currentUserId={userProfile.id}
        />
      )}
    </div>
  )
}