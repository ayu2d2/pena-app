'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
  displayName?: string
  studentId?: string
  year?: number
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
    displayName: '',
    studentId: '',
    year: undefined
  })

  const router = useRouter()
  const supabase = createClient()

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('メールアドレスとパスワードは必須です')
      return false
    }

    // メールアドレスの基本的な形式チェックのみ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('有効なメールアドレスを入力してください')
      return false
    }

    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return false
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('パスワードが一致しません')
        return false
      }

      if (!formData.displayName?.trim()) {
        setError('表示名は必須です')
        return false
      }

      if (!formData.studentId?.trim()) {
        setError('学籍番号は必須です')
        return false
      }

      if (!formData.year || formData.year < 1 || formData.year > 6) {
        setError('学年を正しく入力してください（1-6）')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) {
          console.error('Login error:', error)
          setError(`ログインに失敗しました: ${error.message}`)
          return
        }

        if (data?.user) {
          router.push('/dashboard')
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              display_name: formData.displayName,
              student_id: formData.studentId,
              year: formData.year
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) {
          setError('アカウント作成に失敗しました。' + error.message)
        } else {
          setError('')
          alert('確認メールを送信しました。メールを確認してアカウントを有効化してください。')
        }
      }
    } catch (err) {
      console.error('Authentication error:', err)
      setError('予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof AuthFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 text-2xl font-bold text-primary mb-2">
            <span className="text-3xl">🐬</span>
            PenaApp
          </Link>
          <p className="text-muted-foreground">
            上智大学KpopSDGsペナルティキック研究会ドルフィンズ
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-xl border shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              {isLogin ? 'ログイン' : 'アカウント作成'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? 'アカウントにログインしてください' : '新しいアカウントを作成しましょう'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium mb-1">
                メールアドレス
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* 表示名（サインアップ時のみ） */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  表示名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.displayName || ''}
                    onChange={(e) => updateField('displayName', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="山田太郎"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* 学籍番号・学年（サインアップ時のみ） */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    学籍番号
                  </label>
                  <input
                    type="text"
                    value={formData.studentId || ''}
                    onChange={(e) => updateField('studentId', e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="S2025001"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    学年
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      value={formData.year || ''}
                      onChange={(e) => updateField('year', parseInt(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                      disabled={loading}
                    >
                      <option value="">選択</option>
                      <option value="1">1年</option>
                      <option value="2">2年</option>
                      <option value="3">3年</option>
                      <option value="4">4年</option>
                      <option value="5">M1</option>
                      <option value="6">M2</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium mb-1">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="6文字以上"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* パスワード確認（サインアップ時のみ） */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  パスワード確認
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword || ''}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="パスワードを再入力"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {/* 送信ボタン */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isLogin ? 'ログイン中...' : 'アカウント作成中...'}
                </div>
              ) : (
                isLogin ? 'ログイン' : 'アカウント作成'
              )}
            </Button>
          </form>

          {/* 切り替えリンク */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              {isLogin ? 'アカウントをお持ちでない方は' : 'すでにアカウントをお持ちの方は'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium ml-1 hover:underline"
                disabled={loading}
              >
                {isLogin ? '新規登録' : 'ログイン'}
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
