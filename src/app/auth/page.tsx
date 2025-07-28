'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
  displayName?: string
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })

  const router = useRouter()

  // URLパラメータからエラーメッセージを取得
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    const welcomeParam = urlParams.get('welcome')
    
    if (errorParam) {
      switch (errorParam) {
        case 'supabase_config':
          setError('Supabase設定に問題があります。デモモードで動作しています。')
          break
        case 'code_exchange_failed':
          setError('認証コードの処理に失敗しました。もう一度お試しください。')
          break
        case 'session_error':
          setError('セッションの取得に失敗しました。')
          break
        case 'unexpected_error':
          setError('予期しないエラーが発生しました。')
          break
        default:
          setError(decodeURIComponent(errorParam))
      }
    }
    
    if (welcomeParam) {
      setSuccess('ログインが完了しました！')
    }
  }, [])

  const fallbackToDemo = () => {
    // デモモード: 簡単な検証のみ
    if (formData.email && formData.password) {
      // メール形式の簡単なチェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('有効なメールアドレスを入力してください。')
        setLoading(false)
        return
      }

      // パスワードの長さチェック
      if (formData.password.length < 6) {
        setError('パスワードは6文字以上で入力してください。')
        setLoading(false)
        return
      }

      // サインアップ時の追加検証
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          setError('パスワードが一致しません。')
          setLoading(false)
          return
        }

        if (!formData.displayName?.trim()) {
          setError('表示名を入力してください。')
          setLoading(false)
          return
        }
      }

      // デモユーザー情報を作成
      const userInfo = {
        id: 'demo-' + Date.now(),
        email: formData.email,
        name: formData.displayName || formData.email.split('@')[0],
        display_name: formData.displayName || formData.email.split('@')[0],
        total_points: 1000
      }

      // ローカルストレージに保存
      localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
      
      // 成功フィードバック
      setError('')
      
      // ダッシュボードにリダイレクト
      router.push('/dashboard')
    } else {
      setError('メールアドレスとパスワードを入力してください。')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 環境変数の確認
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project') || supabaseKey.includes('your-anon')) {
        console.warn('Supabase環境変数が設定されていません。デモモードで動作します。')
        fallbackToDemo()
        return
      }

      // Supabase認証を試行
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      if (supabase) {
        if (isLogin) {
          // ログイン処理
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          })

          if (authError) {
            // 具体的なエラーメッセージを表示
            if (authError.message.includes('Invalid login credentials')) {
              setError('メールアドレスまたはパスワードが正しくありません。')
            } else if (authError.message.includes('Email not confirmed')) {
              setError('メールアドレスの確認が完了していません。確認メールをチェックしてください。')
            } else {
              console.warn('Supabase login failed, falling back to demo mode:', authError.message)
              fallbackToDemo()
              return
            }
            setLoading(false)
            return
          }

          if (data.session) {
            // 認証成功
            const userInfo = {
              id: data.session.user.id,
              email: data.session.user.email,
              name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0],
              display_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name,
              total_points: 1000,
              supabase_user: true // Supabaseユーザーフラグ
            }
            
            localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
            localStorage.setItem('penaapp_session', JSON.stringify(data.session))
            
            // 成功メッセージ
            setError('')
            router.push('/dashboard')
            return
          }
        } else {
          // サインアップ処理
          if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません。')
            setLoading(false)
            return
          }

          if (!formData.displayName?.trim()) {
            setError('表示名を入力してください。')
            setLoading(false)
            return
          }

          const { data, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                name: formData.displayName,
                full_name: formData.displayName,
                display_name: formData.displayName
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          })

          if (authError) {
            // 具体的なエラーメッセージを表示
            if (authError.message.includes('User already registered')) {
              setError('このメールアドレスは既に登録されています。ログインしてください。')
            } else if (authError.message.includes('Password should be at least')) {
              setError('パスワードは6文字以上で入力してください。')
            } else {
              console.warn('Supabase signup failed, falling back to demo mode:', authError.message)
              fallbackToDemo()
              return
            }
            setLoading(false)
            return
          }

          if (data.user) {
            // サインアップ成功
            setError('')
            if (data.user.email_confirmed_at) {
              // 即座に確認された場合
              alert('アカウントが作成されました！ログインしてください。')
            } else {
              // 確認メールが送信された場合
              alert('アカウントが作成されました！確認メールをチェックして、リンクをクリックしてください。')
            }
            setIsLogin(true)
            setLoading(false)
            return
          }
        }
      }

      // Supabaseクライアントが利用できない場合、デモモードを使用
      console.warn('Supabaseクライアントが利用できません。デモモードで動作します。')
      fallbackToDemo()

    } catch (error) {
      console.warn('Authentication error, falling back to demo mode:', error)
      fallbackToDemo()
    }
  }

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 rounded-full mb-4">
            <div className="text-4xl">🐬</div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PenaApp</h1>
          <p className="text-blue-200">
            {isLogin ? 'アカウントにログイン' : '新しいアカウントを作成'}
          </p>
        </div>

        {/* 認証フォーム */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* 表示名（新規登録時のみ） */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  表示名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.displayName || ''}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    placeholder="あなたの名前"
                    required
                  />
                </div>
              </div>
            )}

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  placeholder="6文字以上"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* パスワード確認（新規登録時のみ） */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  パスワード確認
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword || ''}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                    placeholder="パスワードを再入力"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* 成功メッセージ */}
            {success && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-green-200 text-sm">
                {success}
              </div>
            )}

            {/* 送信ボタン */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  処理中...
                </div>
              ) : (
                isLogin ? 'ログイン' : 'アカウント作成'
              )}
            </Button>
          </form>

          {/* モード切り替え */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  displayName: ''
                })
              }}
              className="text-blue-200 hover:text-white transition-colors"
            >
              {isLogin 
                ? 'アカウントをお持ちでない方はこちら' 
                : '既にアカウントをお持ちの方はこちら'
              }
            </button>
          </div>

          {/* デモモード案内 */}
          <div className="mt-4 text-center">
            <p className="text-xs text-blue-200/80">
              💡 現在はデモモードで動作しています
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-blue-200 hover:text-white transition-colors text-sm"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
