'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { 
  Spade, 
  Heart, 
  Diamond, 
  Club, 
  Star, 
  Trophy, 
  User,
  Bot,
  PlayCircle,
  BarChart3
} from 'lucide-react'

interface UserStats {
  games_played: number
  games_won: number
  total_chips_won: number
  win_rate: number
}

export default function PokerPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // デモモード: ローカルストレージから認証情報を確認
      const userInfo = localStorage.getItem('penaapp_user')
      
      if (!userInfo) {
        setLoading(false)
        return
      }
      
      const userData = JSON.parse(userInfo)
      setCurrentUser(userData)

      // ポーカー統計取得（まだテーブルが無いので仮データ）
      setUserStats({
        games_played: 0,
        games_won: 0,
        total_chips_won: 0,
        win_rate: 0
      })
    } catch (error) {
      console.error('認証エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const startCPUGame = (mode: 'casual' | 'realistic') => {
    // CPU対戦ゲームを開始
    window.location.href = `/poker/cpu-game?mode=${mode}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <p className="mb-6">ポーカーゲームを楽しむためにはログインしてください</p>
          <Button onClick={() => window.location.href = '/auth'}>
            ログイン
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
      {/* ヘッダー */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎰</div>
              <div>
                <h1 className="text-3xl font-bold text-white">PenaPoker</h1>
                <p className="text-green-300">ペナルティキック研究会ポーカー</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{currentUser.display_name || currentUser.name || 'ユーザー'}</div>
              <div className="flex items-center gap-1 text-amber-300">
                <Star className="w-4 h-4 fill-current" />
                {currentUser.total_points || 0} ポイント
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインゲームエリア */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <PlayCircle className="w-6 h-6 text-green-400" />
                ゲームを開始
              </h2>
              
              <div className="space-y-4">
                {/* CPU対戦 */}
                                {/* CPU対戦 */}
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-blue-400/30 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">CPU対戦</h3>
                        <p className="text-blue-300">コンピューターとテキサスホールデム</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => startCPUGame('casual')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-semibold"
                      >
                        🎮 カジュアル
                      </Button>
                      <Button
                        onClick={() => startCPUGame('realistic')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 text-sm font-semibold"
                      >
                        🎯 リアル(SB/BB)
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-blue-200">
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <div className="font-semibold text-blue-300 mb-1">🎮 カジュアルモード</div>
                      <div>• 一試合完結型</div>
                      <div>• シンプルなベット</div>
                      <div>• 初心者向け</div>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-3">
                      <div className="font-semibold text-emerald-300 mb-1">🎯 リアルモード</div>
                      <div>• スモールブラインド/ビッグブラインド</div>
                      <div>• 本格的なルール</div>
                      <div>• 上級者向け</div>
                    </div>
                  </div>
                </div>

                {/* マルチプレイヤー（準備中） */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-400/30 opacity-60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">マルチプレイヤー</h3>
                        <p className="text-purple-300">他のプレイヤーとリアルタイム対戦</p>
                        <div className="text-sm text-purple-200 mt-2">
                          🚧 準備中 - 近日公開予定
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled
                      className="bg-gray-600 text-gray-400 px-6 py-3 text-lg font-semibold cursor-not-allowed"
                    >
                      準備中
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ルール説明 */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mt-8">
              <h2 className="text-2xl font-bold text-white mb-6">🃏 ポーカールール</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-400">テキサスホールデム</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• 各プレイヤーに2枚の手札</li>
                    <li>• 5枚のコミュニティカード</li>
                    <li>• 最高の5枚の組み合わせで勝負</li>
                    <li>• ベット、コール、レイズ、フォールド</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-400">ハンドランキング</h3>
                  <ul className="space-y-1 text-sm">
                    <li>1. ロイヤルストレートフラッシュ</li>
                    <li>2. ストレートフラッシュ</li>
                    <li>3. フォーカード</li>
                    <li>4. フルハウス</li>
                    <li>5. フラッシュ</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー - 統計 */}
          <div className="space-y-6">
            {/* プレイヤー統計 */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                あなたの成績
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-white">
                  <span>プレイ回数</span>
                  <span className="font-bold">{userStats?.games_played || 0}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>勝利回数</span>
                  <span className="font-bold text-green-400">{userStats?.games_won || 0}</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>勝率</span>
                  <span className="font-bold text-blue-400">{userStats?.win_rate || 0}%</span>
                </div>
                <div className="flex justify-between items-center text-white">
                  <span>獲得チップ</span>
                  <span className="font-bold text-yellow-400">{userStats?.total_chips_won || 0}</span>
                </div>
              </div>
            </div>

            {/* ランキング（準備中） */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                ランキング
              </h3>
              <div className="text-center text-gray-400 py-8">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>準備中</p>
                <p className="text-sm">近日公開予定</p>
              </div>
            </div>

            {/* カードスーツ装飾 */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="text-red-500">
                  <Heart className="w-8 h-8 mx-auto fill-current" />
                </div>
                <div className="text-red-500">
                  <Diamond className="w-8 h-8 mx-auto fill-current" />
                </div>
                <div className="text-white">
                  <Spade className="w-8 h-8 mx-auto fill-current" />
                </div>
                <div className="text-white">
                  <Club className="w-8 h-8 mx-auto fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
