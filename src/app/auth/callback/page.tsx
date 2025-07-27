'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// プリレンダリングを無効化
export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          router.push('/auth?error=supabase_config')
          return
        }

        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Authentication error:', error)
          router.push('/auth?error=callback_error')
          return
        }

        if (data.session) {
          // ユーザーが認証された場合、ダッシュボードにリダイレクト
          router.push('/dashboard')
        } else {
          // セッションがない場合、認証ページにリダイレクト
          router.push('/auth')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        router.push('/auth?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🐬</div>
        <h1 className="text-xl font-semibold mb-2">認証処理中...</h1>
        <p className="text-muted-foreground">しばらくお待ちください</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
