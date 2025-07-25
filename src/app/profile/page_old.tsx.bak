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
  X
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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      // サンプルデータを使用（実際のアプリではSupabaseから取得）
      const sampleProfile: Profile = {
        id: user.id,
        display_name: '山田太郎',
        student_id: 'S2025001',
        year: 2,
        favorite_kpop_group: 'NewJeans',
        penalty_kick_skill: 7,
        total_points: 150,
        avatar_url: null,
        bio: 'K-pop大好き！特にNewJeansが推しです🐰\nペナルティキックも練習中⚽',
        created_at: '2025-07-24T00:00:00Z',
        updated_at: '2025-07-24T00:00:00Z'
      }

      const sampleBadges = [
        {
          id: '1',
          user_id: user.id,
          badge_id: '1',
          earned_at: '2025-07-24T00:00:00Z',
          badge: {
            id: '1',
            name: '新人ドルフィン',
            description: '初回イベント参加',
            icon: '🐬',
            color: '#0080ff',
            points_required: 0,
            special_condition: null,
            created_at: '2025-07-24T00:00:00Z'
          }
        },
        {
          id: '2',
          user_id: user.id,
          badge_id: '2',
          earned_at: '2025-07-20T00:00:00Z',
          badge: {
            id: '2',
            name: 'K-popファン',
            description: 'K-popイベント5回参加',
            icon: '🎵',
            color: '#ff6b9d',
            points_required: 50,
            special_condition: null,
            created_at: '2025-07-24T00:00:00Z'
          }
        }
      ]

      setProfile(sampleProfile)
      setUserBadges(sampleBadges)
      setEditData({
        display_name: sampleProfile.display_name,
        bio: sampleProfile.bio || '',
        favorite_kpop_group: sampleProfile.favorite_kpop_group || '',
        penalty_kick_skill: sampleProfile.penalty_kick_skill
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    try {
      // 実際のアプリではSupabaseに保存
      setProfile({
        ...profile,
        ...editData,
        updated_at: new Date().toISOString()
      })
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getSkillLevel = (skill: number) => {
    if (skill <= 3) return { label: '初心者', color: 'bg-gray-500' }
    if (skill <= 6) return { label: '中級者', color: 'bg-accent' }
    if (skill <= 8) return { label: '上級者', color: 'bg-success' }
    return { label: '名人', color: 'bg-yellow-500' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-pink-400 rounded-full flex items-center justify-center text-3xl animate-pulse">
              🐬
            </div>
          </div>
          <div className="text-lg font-medium text-gray-700">プロフィールを読み込み中...</div>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full mx-auto mt-4 animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-lg text-gray-700">プロフィールが見つかりません</div>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            ダッシュボードに戻る
          </Button>
        </div>
      </div>
    )
  }

  const skillLevel = getSkillLevel(profile.penalty_kick_skill)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="text-2xl">🐬</div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">PenaApp</h1>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Profile Card */}
            <div className="relative bg-white/70 backdrop-blur-lg rounded-3xl border border-gray-200/50 p-8 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                    プロフィール
                  </h2>
                  <Button
                    variant={editing ? "default" : "outline"}
                    onClick={() => editing ? handleSave() : setEditing(true)}
                    className={`gap-2 transition-all duration-300 ${
                      editing 
                        ? 'bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white' 
                        : 'bg-white/80 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                  <Edit3 className="w-4 h-4" />
                  {editing ? '保存' : '編集'}
                </Button>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile.display_name.charAt(0)}
                </div>
                <div className="flex-1">
                  {editing ? (
                    <input
                      type="text"
                      value={editData.display_name}
                      onChange={(e) => setEditData({...editData, display_name: e.target.value})}
                      className="text-2xl font-bold bg-transparent border-b border-primary focus:outline-none"
                    />
                  ) : (
                    <h3 className="text-2xl font-bold">{profile.display_name}</h3>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {profile.student_id}
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {profile.year}年生
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">自己紹介</label>
                  {editing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      rows={3}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="自己紹介を入力してください"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {profile.bio || '自己紹介が設定されていません'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Heart className="inline w-4 h-4 mr-1" />
                      推しK-popグループ
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={editData.favorite_kpop_group}
                        onChange={(e) => setEditData({...editData, favorite_kpop_group: e.target.value})}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="NewJeans"
                      />
                    ) : (
                      <p className="text-lg">{profile.favorite_kpop_group || '未設定'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ⚽ PKスキルレベル
                    </label>
                    {editing ? (
                      <select
                        value={editData.penalty_kick_skill}
                        onChange={(e) => setEditData({...editData, penalty_kick_skill: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} - {getSkillLevel(i + 1).label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">{profile.penalty_kick_skill}/10</span>
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${skillLevel.color}`}>
                          {skillLevel.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 獲得バッジ */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                獲得バッジ
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userBadges.map((userBadge) => (
                  <div key={userBadge.id} className="text-center p-4 bg-muted/50 rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl"
                      style={{ backgroundColor: userBadge.badge.color }}
                    >
                      {userBadge.badge.icon}
                    </div>
                    <h3 className="font-semibold text-sm">{userBadge.badge.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(userBadge.earned_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* ポイント表示 */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary mb-1">
                  {profile.total_points.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">総獲得ポイント</p>
              </div>
            </div>

            {/* アカウント作成日 */}
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm">参加日</p>
                  <p className="font-medium text-foreground">
                    {new Date(profile.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>

            {/* ナビゲーション */}
            <div className="bg-card rounded-lg border p-4">
              <nav className="space-y-2">
                <Link href="/dashboard" className="block w-full text-left p-2 rounded hover:bg-muted transition-colors">
                  📅 ダッシュボード
                </Link>
                <Link href="/" className="block w-full text-left p-2 rounded hover:bg-muted transition-colors">
                  � ホーム
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
