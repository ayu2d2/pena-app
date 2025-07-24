'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserBadge, Badge } from '@/types/database'
import { Button } from '@/components/ui/button'
import { 
  User, 
  GraduationCap, 
  Heart, 
  Trophy, 
  Calendar, 
  Edit3, 
  LogOut,
  Star,
  Target,
  Music,
  Award,
  Save,
  X,
  Camera,
  MapPin,
  Clock,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userBadges, setUserBadges] = useState<(UserBadge & { badge: Badge })[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    display_name: '',
    bio: '',
    favorite_kpop_group: '',
    penalty_kick_skill: 1
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      // デモ用の認証チェック
      const storedUser = localStorage.getItem('penaapp_user')
      if (!storedUser) {
        router.push('/auth')
        return
      }

      // デモ用プロフィールデータ
      const demoProfile: Profile = {
        id: 'demo-user-001',
        display_name: '山田太郎',
        student_id: 'S2025001',
        year: 2,
        favorite_kpop_group: 'NewJeans',
        penalty_kick_skill: 7,
        total_points: 850,
        avatar_url: null,
        bio: 'K-pop大好き！みんなで楽しく踊りましょう🎵 PK練習も頑張ってます⚽',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-20T00:00:00Z'
      }

      // デモ用バッジデータ
      const demoBadges: (UserBadge & { badge: Badge })[] = [
        {
          id: 'ub1',
          user_id: 'demo-user-001',
          badge_id: 'b1',
          earned_at: '2025-01-10T00:00:00Z',
          badge: {
            id: 'b1',
            name: '新人ドルフィン',
            description: '初回イベント参加おめでとう！',
            icon: '🐬',
            color: '#0080ff',
            points_required: 0,
            special_condition: null,
            created_at: '2025-01-01T00:00:00Z'
          }
        },
        {
          id: 'ub2',
          user_id: 'demo-user-001',
          badge_id: 'b2',
          earned_at: '2025-01-15T00:00:00Z',
          badge: {
            id: 'b2',
            name: 'K-popファン',
            description: 'K-popイベント5回参加',
            icon: '🎵',
            color: '#ff6b9d',
            points_required: 50,
            special_condition: null,
            created_at: '2025-01-01T00:00:00Z'
          }
        },
        {
          id: 'ub3',
          user_id: 'demo-user-001',
          badge_id: 'b3',
          earned_at: '2025-01-18T00:00:00Z',
          badge: {
            id: 'b3',
            name: 'PK名人',
            description: 'ペナルティキック大会で優勝',
            icon: '⚽',
            color: '#22c55e',
            points_required: 100,
            special_condition: 'penalty_kick_tournament_winner',
            created_at: '2025-01-01T00:00:00Z'
          }
        }
      ]

      setProfile(demoProfile)
      setUserBadges(demoBadges)
      setEditData({
        display_name: demoProfile.display_name,
        bio: demoProfile.bio || '',
        favorite_kpop_group: demoProfile.favorite_kpop_group || '',
        penalty_kick_skill: demoProfile.penalty_kick_skill
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (!profile) return

      // デモ用：ローカルストレージに保存
      const updatedProfile = {
        ...profile,
        ...editData,
        updated_at: new Date().toISOString()
      }

      setProfile(updatedProfile)
      setEditing(false)
      
      // アニメーション用の一時的な保存成功表示
      const successNotification = document.createElement('div')
      successNotification.className = 'fixed top-4 right-4 bg-gradient-to-r from-var(--color-accent-500) to-var(--color-secondary-500) text-white px-6 py-3 rounded-2xl shadow-glass z-50 animate-slideIn'
      successNotification.textContent = '✅ プロフィールを更新しました！'
      document.body.appendChild(successNotification)
      
      setTimeout(() => {
        successNotification.remove()
      }, 3000)

    } catch (error) {
      console.error('Error saving profile:', error)
      alert('更新に失敗しました。もう一度お試しください。')
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('penaapp_user')
    router.push('/auth')
  }

  const getSkillLevel = (skill: number) => {
    if (skill <= 3) return { 
      label: '初心者', 
      color: 'from-gray-500 to-gray-600', 
      emoji: '🔰',
      description: 'これから頑張ろう！'
    }
    if (skill <= 6) return { 
      label: '中級者', 
      color: 'from-blue-600 to-blue-700', 
      emoji: '⭐',
      description: '順調に成長中！'
    }
    if (skill <= 8) return { 
      label: '上級者', 
      color: 'from-green-600 to-green-700', 
      emoji: '🏆',
      description: 'とても上手！'
    }
    return { 
      label: '名人', 
      color: 'from-yellow-500 to-orange-600', 
      emoji: '👑',
      description: '圧倒的な実力！'
    }
  }

  const getYearDisplay = (year: number) => {
    const yearNames = ['1年生', '2年生', '3年生', '4年生', '大学院生']
    return yearNames[year - 1] || `${year}年生`
  }

  const getPointsLevel = (points: number) => {
    if (points < 100) return { level: 'ブロンズ', color: 'from-amber-700 to-yellow-800', emoji: '🥉' }
    if (points < 500) return { level: 'シルバー', color: 'from-gray-500 to-gray-700', emoji: '🥈' }
    if (points < 1000) return { level: 'ゴールド', color: 'from-yellow-600 to-yellow-800', emoji: '🥇' }
    return { level: 'プラチナ', color: 'from-purple-600 to-pink-700', emoji: '💎' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
        {/* 高視認性ローディング背景 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 rounded-full opacity-15 animate-float"></div>
        </div>
        
        <div className="text-center animate-fadeIn z-10">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white backdrop-blur-xl rounded-full flex items-center justify-center text-5xl animate-bounce border-2 border-blue-200 shadow-xl">
              🐬
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 mb-4">
            プロフィールを読み込み中...
          </div>
          <div className="w-48 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="text-8xl mb-6">❌</div>
          <div className="text-2xl font-bold text-gray-800 mb-4">プロフィールが見つかりません</div>
          <Button onClick={() => router.push('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    )
  }

  const skillLevel = getSkillLevel(profile.penalty_kick_skill)
  const pointsLevel = getPointsLevel(profile.total_points)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* 視認性重視の背景 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-500/8 to-indigo-500/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/6 to-blue-500/6 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* 高コントラストヘッダー */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 drop-shadow-lg">🐬</div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 opacity-20 rounded-full blur-lg scale-150"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  PenaApp
                </h1>
                <div className="text-xs font-medium text-gray-600 tracking-wider uppercase">Profile</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white border-gray-300 hover:bg-gray-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-glass-light backdrop-blur-xl rounded-3xl shadow-glass-strong border border-glass-border p-8 sticky top-32">
              {/* Avatar Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-var(--color-primary-400) to-var(--color-secondary-500) rounded-full flex items-center justify-center text-6xl shadow-glass-strong">
                    {profile.display_name.charAt(0)}
                  </div>
                  <button className="absolute bottom-2 right-2 w-10 h-10 bg-var(--color-accent-500) rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300">
                    <Camera className="w-5 h-5" />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-br from-var(--color-primary-400) to-var(--color-secondary-400) opacity-20 rounded-full blur-2xl scale-150"></div>
                </div>
                <h1 className="text-3xl font-black text-var(--color-neutral-800) mt-4 mb-2">
                  {profile.display_name}
                </h1>
                <div className="flex items-center justify-center gap-2 text-var(--color-neutral-600) mb-4">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-semibold">{getYearDisplay(profile.year || 1)}</span>
                </div>
                
                {/* Points Level Badge */}
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r ${pointsLevel.color} text-white font-bold shadow-glass mb-6`}>
                  <span className="text-2xl">{pointsLevel.emoji}</span>
                  <span>{pointsLevel.level}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-var(--color-primary-50) to-var(--color-secondary-50) rounded-2xl border border-var(--color-primary-200)">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-var(--color-primary-500) rounded-lg text-white">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-var(--color-neutral-700)">総ポイント</span>
                  </div>
                  <span className="text-2xl font-black text-var(--color-primary-600)">{profile.total_points}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-var(--color-accent-50) to-var(--color-secondary-50) rounded-2xl border border-var(--color-accent-200)">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-var(--color-accent-500) rounded-lg text-white">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-var(--color-neutral-700)">獲得バッジ</span>
                  </div>
                  <span className="text-2xl font-black text-var(--color-accent-600)">{userBadges.length}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-var(--color-secondary-50) to-var(--color-primary-50) rounded-2xl border border-var(--color-secondary-200)">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-var(--color-secondary-500) rounded-lg text-white">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-var(--color-neutral-700)">PKスキル</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{skillLevel.emoji}</span>
                    <span className="text-xl font-black text-var(--color-secondary-600)">{profile.penalty_kick_skill}/10</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <Button
                onClick={() => setEditing(true)}
                className="w-full mt-6 bg-gradient-to-r from-var(--color-primary-500) to-var(--color-secondary-500) hover:from-var(--color-primary-600) hover:to-var(--color-secondary-600) text-white font-bold py-4 rounded-2xl shadow-glass-strong hover:scale-105 transition-all duration-300"
              >
                <Edit3 className="w-5 h-5 mr-2" />
                プロフィールを編集
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Details */}
            <div className="bg-glass-light backdrop-blur-xl rounded-3xl shadow-glass border border-glass-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-var(--color-primary-500) to-var(--color-secondary-500) rounded-xl text-white">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-var(--color-neutral-800)">プロフィール詳細</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-var(--color-neutral-50) rounded-2xl border border-var(--color-neutral-200)">
                    <div className="text-sm font-semibold text-var(--color-neutral-500) mb-1">学籍番号</div>
                    <div className="text-lg font-bold text-var(--color-neutral-800)">{profile.student_id || 'S2025001'}</div>
                  </div>
                  
                  <div className="p-4 bg-var(--color-neutral-50) rounded-2xl border border-var(--color-neutral-200)">
                    <div className="text-sm font-semibold text-var(--color-neutral-500) mb-1">好きなK-popグループ</div>
                    <div className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-var(--color-accent-500)" />
                      <div className="text-lg font-bold text-var(--color-neutral-800)">
                        {profile.favorite_kpop_group || '未設定'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-var(--color-neutral-50) rounded-2xl border border-var(--color-neutral-200)">
                    <div className="text-sm font-semibold text-var(--color-neutral-500) mb-1">PK スキルレベル</div>
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-xl bg-gradient-to-r ${skillLevel.color} text-white font-bold text-sm`}>
                        {skillLevel.emoji} {skillLevel.label}
                      </div>
                      <span className="text-lg font-bold text-var(--color-neutral-800)">{profile.penalty_kick_skill}/10</span>
                    </div>
                    <div className="mt-2 w-full bg-var(--color-neutral-200) rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${skillLevel.color}`}
                        style={{ width: `${(profile.penalty_kick_skill / 10) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-var(--color-neutral-500) mt-1">{skillLevel.description}</div>
                  </div>
                  
                  <div className="p-4 bg-var(--color-neutral-50) rounded-2xl border border-var(--color-neutral-200)">
                    <div className="text-sm font-semibold text-var(--color-neutral-500) mb-1">登録日</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-var(--color-primary-500)" />
                      <div className="text-lg font-bold text-var(--color-neutral-800)">
                        {new Date(profile.created_at).toLocaleDateString('ja-JP')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {profile.bio && (
                <div className="mt-6 p-6 bg-gradient-to-r from-var(--color-primary-50) to-var(--color-secondary-50) rounded-2xl border border-var(--color-primary-200)">
                  <div className="text-sm font-semibold text-var(--color-neutral-500) mb-2">自己紹介</div>
                  <div className="text-var(--color-neutral-700) leading-relaxed">{profile.bio}</div>
                </div>
              )}
            </div>

            {/* Badges Collection */}
            <div className="bg-glass-light backdrop-blur-xl rounded-3xl shadow-glass border border-glass-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-var(--color-accent-500) to-var(--color-secondary-500) rounded-xl text-white">
                  <Award className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-var(--color-neutral-800)">獲得バッジ</h2>
                <span className="px-3 py-1 bg-var(--color-accent-100) text-var(--color-accent-700) rounded-full text-sm font-bold">
                  {userBadges.length} 個
                </span>
              </div>

              {userBadges.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userBadges.map((userBadge, index) => (
                    <div 
                      key={userBadge.id} 
                      className="p-6 bg-gradient-to-br from-white to-var(--color-neutral-50) rounded-2xl border border-var(--color-neutral-200) hover:scale-105 hover:shadow-glass transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {userBadge.badge.icon}
                        </div>
                        <h3 className="font-bold text-var(--color-neutral-800) mb-2">
                          {userBadge.badge.name}
                        </h3>
                        <p className="text-sm text-var(--color-neutral-600) mb-3">
                          {userBadge.badge.description}
                        </p>
                        <div className="text-xs text-var(--color-neutral-500) flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(userBadge.earned_at).toLocaleDateString('ja-JP')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <div className="text-xl font-bold text-var(--color-neutral-600) mb-2">
                    まだバッジを獲得していません
                  </div>
                  <div className="text-var(--color-neutral-500)">
                    イベントに参加してバッジを集めよう！
                  </div>
                </div>
              )}
            </div>

            {/* Activity Summary */}
            <div className="bg-glass-light backdrop-blur-xl rounded-3xl shadow-glass border border-glass-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-var(--color-secondary-500) to-var(--color-primary-500) rounded-xl text-white">
                  <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-var(--color-neutral-800)">活動サマリー</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-var(--color-primary-50) to-var(--color-secondary-50) rounded-2xl border border-var(--color-primary-200)">
                  <div className="text-3xl mb-3">📅</div>
                  <div className="text-2xl font-black text-var(--color-primary-600) mb-1">12</div>
                  <div className="text-sm font-semibold text-var(--color-neutral-600)">参加イベント</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-var(--color-accent-50) to-var(--color-secondary-50) rounded-2xl border border-var(--color-accent-200)">
                  <div className="text-3xl mb-3">👥</div>
                  <div className="text-2xl font-black text-var(--color-accent-600) mb-1">5</div>
                  <div className="text-sm font-semibold text-var(--color-neutral-600)">主催イベント</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-var(--color-secondary-50) to-var(--color-primary-50) rounded-2xl border border-var(--color-secondary-200)">
                  <div className="text-3xl mb-3">🎯</div>
                  <div className="text-2xl font-black text-var(--color-secondary-600) mb-1">3</div>
                  <div className="text-sm font-semibold text-var(--color-neutral-600)">今月の参加</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-glass-light backdrop-blur-xl rounded-3xl shadow-glass-strong border border-glass-border p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-var(--color-neutral-800)">プロフィール編集</h2>
              <button
                onClick={() => setEditing(false)}
                className="p-2 hover:bg-var(--color-neutral-100) rounded-xl transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-var(--color-neutral-700) mb-2">
                  表示名
                </label>
                <input
                  type="text"
                  value={editData.display_name}
                  onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                  className="w-full px-4 py-3 border border-var(--color-neutral-300) rounded-xl focus:ring-2 focus:ring-var(--color-primary-500) focus:border-transparent transition-all duration-200"
                  placeholder="あなたの名前"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-var(--color-neutral-700) mb-2">
                  好きなK-popグループ
                </label>
                <input
                  type="text"
                  value={editData.favorite_kpop_group}
                  onChange={(e) => setEditData({ ...editData, favorite_kpop_group: e.target.value })}
                  className="w-full px-4 py-3 border border-var(--color-neutral-300) rounded-xl focus:ring-2 focus:ring-var(--color-primary-500) focus:border-transparent transition-all duration-200"
                  placeholder="NewJeans, BTS, BLACKPINK など"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-var(--color-neutral-700) mb-2">
                  PKスキルレベル: {editData.penalty_kick_skill}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editData.penalty_kick_skill}
                  onChange={(e) => setEditData({ ...editData, penalty_kick_skill: Number(e.target.value) })}
                  className="w-full h-3 bg-var(--color-neutral-200) rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-var(--color-neutral-500) mt-1">
                  <span>初心者</span>
                  <span>名人</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-var(--color-neutral-700) mb-2">
                  自己紹介
                </label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-var(--color-neutral-300) rounded-xl focus:ring-2 focus:ring-var(--color-primary-500) focus:border-transparent transition-all duration-200 resize-none"
                  rows={4}
                  placeholder="あなたについて教えてください..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => setEditing(false)}
                variant="outline"
                className="flex-1 py-3 border-var(--color-neutral-300) hover:bg-var(--color-neutral-50)"
              >
                <X className="w-4 h-4 mr-2" />
                キャンセル
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-var(--color-primary-500) to-var(--color-secondary-500) hover:from-var(--color-primary-600) hover:to-var(--color-secondary-600) text-white py-3"
              >
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}