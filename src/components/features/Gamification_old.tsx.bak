'use client'

import type { Badge, UserBadge, Profile } from '@/types/database'
import { 
  Trophy as TrophyIcon, 
  Star as StarIcon, 
  Award as AwardIcon, 
  TrendingUp as TrendingUpIcon 
} from 'lucide-react'

interface BadgeCardProps {
  badge: Badge
  earned?: boolean
  earnedAt?: string
}

const BadgeCard = ({ badge, earned, earnedAt }: BadgeCardProps) => {
  return (
    <div className={`relative p-4 rounded-lg border transition-all ${
      earned 
        ? 'bg-card shadow-sm border-primary/20' 
        : 'bg-muted/50 border-muted opacity-60'
    }`}>
      {earned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <StarIcon className="w-3 h-3 text-white fill-current" />
        </div>
      )}
      
      <div className="flex items-center gap-3 mb-3">
        <div 
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            earned ? '' : 'grayscale'
          }`}
          style={{ backgroundColor: earned ? badge.color : '#9ca3af' }}
        >
          {badge.icon}
        </div>
        <div>
          <h3 className={`font-semibold ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
            {badge.name}
          </h3>
          {earnedAt && (
            <p className="text-xs text-muted-foreground">
              {new Date(earnedAt).toLocaleDateString('ja-JP')} 獲得
            </p>
          )}
        </div>
      </div>

      <p className={`text-sm ${earned ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
        {badge.description}
      </p>
      
      {!earned && badge.points_required > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          必要ポイント: {badge.points_required}
        </div>
      )}
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

export const PointsDisplay = ({ points, rank, recentGains }: PointsDisplayProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">{points.toLocaleString()}</h2>
            <p className="text-sm text-muted-foreground">総獲得ポイント</p>
          </div>
        </div>
        {rank && (
          <div className="text-right">
            <div className="text-lg font-semibold text-accent">#{rank}</div>
            <p className="text-xs text-muted-foreground">ランキング</p>
          </div>
        )}
      </div>

      {recentGains && recentGains.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4" />
            最近の獲得
          </h3>
          {recentGains.slice(0, 3).map((gain, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{gain.reason}</span>
              <div className="flex items-center gap-2">
                <span className="text-success font-medium">+{gain.points}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(gain.date).toLocaleDateString('ja-JP')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface BadgeCollectionProps {
  badges: Badge[]
  userBadges: UserBadge[]
  userPoints?: number
}

export const BadgeCollection = ({ badges, userBadges, userPoints = 0 }: BadgeCollectionProps) => {
  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id))
  
  const earnedBadges = badges.filter(badge => earnedBadgeIds.has(badge.id))
  const availableBadges = badges.filter(badge => 
    !earnedBadgeIds.has(badge.id) && badge.points_required <= userPoints
  )
  const lockedBadges = badges.filter(badge => 
    !earnedBadgeIds.has(badge.id) && badge.points_required > userPoints
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AwardIcon className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">バッジコレクション</h2>
        <div className="bg-primary/10 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-primary">
            {earnedBadges.length}/{badges.length}
          </span>
        </div>
      </div>

      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-success">獲得済みバッジ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => {
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
      )}

      {availableBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-accent">獲得可能バッジ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned={false} />
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">未解放バッジ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} earned={false} />
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium mb-2">バッジがありません</h3>
          <p className="text-muted-foreground">イベントに参加してバッジを獲得しよう！</p>
        </div>
      )}
    </div>
  )
}

interface LeaderboardProps {
  profiles: (Profile & { rank: number })[]
  currentUserId?: string
}

export const Leaderboard = ({ profiles, currentUserId }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏅'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <TrophyIcon className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">ランキング</h2>
      </div>

      <div className="space-y-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              profile.id === currentUserId
                ? 'bg-primary/10 border-primary/30'
                : 'bg-card hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl">{getRankIcon(profile.rank)}</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                  {profile.display_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold">{profile.display_name}</h3>
                  {profile.favorite_kpop_group && (
                    <p className="text-sm text-muted-foreground">
                      推し: {profile.favorite_kpop_group}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                {profile.total_points.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">ポイント</div>
            </div>
          </div>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium mb-2">ランキングデータがありません</h3>
          <p className="text-muted-foreground">イベントに参加してポイントを獲得しよう！</p>
        </div>
      )}
    </div>
  )
}
