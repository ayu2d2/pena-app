'use client'

import { useState } from 'react'
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
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
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

        // 新規登録時の追加チェック
        if (!isLogin) {
          if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません。')
            setLoading(false)
            return
          }
          
          if (!formData.displayName || formData.displayName.trim().length < 2) {
            setError('表示名は2文字以上で入力してください。')
            setLoading(false)
            return
          }
        }

        // ローディングシミュレーション（UX向上）
        await new Promise(resolve => setTimeout(resolve, 800))

        // デモ用: ローカルストレージに簡単な認証情報を保存
        const userInfo = {
          email: formData.email,
          displayName: formData.displayName || 'デモユーザー',
          loginTime: new Date().toISOString(),
          userId: Math.random().toString(36).substr(2, 9)
        }
        
        localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
        
        // 成功フィードバック
        setError('')
        
        // ダッシュボードにリダイレクト
        router.push('/dashboard')
      } else {
        setError('メールアドレスとパスワードを入力してください。')
        setLoading(false)
      }
    } catch (err) {
      console.error('Authentication error:', err)
      setError('予期しないエラーが発生しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="text-4xl transition-transform group-hover:scale-110">🐬</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PenaApp
            </h1>
          </Link>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            {isLogin ? 'おかえりなさい！' : 'ようこそ！'}
          </h2>
          <p className="text-gray-600">
            {isLogin ? 'アカウントにログインしてください' : 'アカウントを作成しましょう'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Mail className="inline w-4 h-4 mr-2 text-blue-500" />
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                placeholder="your@example.com"
                required
                disabled={loading}
                aria-describedby="email-hint"
              />
              <p id="email-hint" className="text-xs text-gray-500">
                任意のメールアドレスが使用できます
              </p>
            </div>

            {/* Display Name Field (Registration only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <User className="inline w-4 h-4 mr-2 text-blue-500" />
                  表示名
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="山田太郎"
                  required
                  disabled={loading}
                  aria-describedby="name-hint"
                />
                <p id="name-hint" className="text-xs text-gray-500">
                  2文字以上で入力してください
                </p>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Lock className="inline w-4 h-4 mr-2 text-blue-500" />
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full p-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="6文字以上"
                  required
                  disabled={loading}
                  aria-describedby="password-hint"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  disabled={loading}
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p id="password-hint" className="text-xs text-gray-500">
                6文字以上で入力してください
              </p>
            </div>

            {/* Confirm Password Field (Registration only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Lock className="inline w-4 h-4 mr-2 text-blue-500" />
                  パスワード確認
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="パスワードを再入力"
                  required
                  disabled={loading}
                  aria-describedby="confirm-hint"
                />
                <p id="confirm-hint" className="text-xs text-gray-500">
                  上記と同じパスワードを入力してください
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
                <div className="text-red-500 mt-0.5">⚠️</div>
                <div>{error}</div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  処理中...
                </div>
              ) : (
                isLogin ? 'ログイン' : '新規登録'
              )}
            </Button>
          </form>

          {/* Toggle Form Mode */}
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
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium"
              disabled={loading}
            >
              {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
            </button>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <div className="text-blue-500 mt-0.5">ℹ️</div>
              <div>
                <p className="font-medium text-blue-800 mb-1">デモモード</p>
                <p className="text-blue-700">
                  任意のメールアドレスとパスワード（6文字以上）でログインできます。
                  <br />
                  例: test@example.com / password123
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
