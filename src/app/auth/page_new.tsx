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
          return
        }

        // パスワードの長さチェック
        if (formData.password.length < 6) {
          setError('パスワードは6文字以上で入力してください。')
          return
        }

        // 新規登録時の追加チェック
        if (!isLogin) {
          if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません。')
            return
          }
          
          if (!formData.displayName) {
            setError('表示名を入力してください。')
            return
          }
        }

        // デモ用: ローカルストレージに簡単な認証情報を保存
        const userInfo = {
          email: formData.email,
          displayName: formData.displayName || 'デモユーザー',
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
        
        // ダッシュボードにリダイレクト
        router.push('/dashboard')
      } else {
        setError('メールアドレスとパスワードを入力してください。')
      }
    } catch (err) {
      console.error('Authentication error:', err)
      setError('予期しないエラーが発生しました。')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="text-4xl">🐬</div>
            <h1 className="text-3xl font-bold text-primary">PenaApp</h1>
          </Link>
          <h2 className="text-2xl font-bold mb-2">
            {isLogin ? 'おかえりなさい！' : 'ようこそ！'}
          </h2>
          <p className="text-muted-foreground">
            {isLogin ? 'アカウントにログインしてください' : 'アカウントを作成しましょう'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@example.com"
                required
              />
            </div>

            {/* Display Name Field (Registration only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  表示名
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="山田太郎"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                  placeholder="6文字以上"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Registration only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Lock className="inline w-4 h-4 mr-1" />
                  パスワード確認
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="パスワードを再入力"
                  required
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? '処理中...' : (isLogin ? 'ログイン' : '新規登録')}
            </Button>
          </form>

          {/* Toggle Form Mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'アカウントをお持ちでない方はこちら' : 'すでにアカウントをお持ちの方はこちら'}
            </button>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
            <p className="font-medium mb-1">デモモード</p>
            <p>任意のメールアドレスとパスワード（6文字以上）でログインできます。</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
