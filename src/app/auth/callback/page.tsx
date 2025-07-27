'use client'

import { useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

// プリレンダリングを無効化
export const dynamic = 'force-dynamic'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          console.error('Supabase client not available')
          router.push('/auth?error=supabase_config')
          return
        }

        // URLから認証コードを処理
        const code = searchParams.get('code')
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Code exchange error:', error)
            router.push('/auth?error=code_exchange_failed')
            return
          }

          if (data.session) {
            // セッション情報をローカルストレージに保存（デモ用）
            const userInfo = {
              id: data.session.user.id,
              email: data.session.user.email,
              name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0],
              display_name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name,
              total_points: 1000 // 初期ポイント
            }
            
            localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
            localStorage.setItem('penaapp_session', JSON.stringify(data.session))
            
            console.log('Authentication successful, redirecting to dashboard')
            router.push('/dashboard')
            return
          }
        }

        // コードがない場合、現在のセッションを確認
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          router.push('/auth?error=session_error')
          return
        }

        if (sessionData.session) {
          // セッション情報をローカルストレージに保存（デモ用）
          const userInfo = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email,
            name: sessionData.session.user.user_metadata?.name || sessionData.session.user.email?.split('@')[0],
            display_name: sessionData.session.user.user_metadata?.full_name || sessionData.session.user.user_metadata?.name,
            total_points: 1000 // 初期ポイント
          }
          
          localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
          localStorage.setItem('penaapp_session', JSON.stringify(sessionData.session))
          
          console.log('Session found, redirecting to dashboard')
          router.push('/dashboard')
        } else {
          console.log('No session found, redirecting to auth')
          router.push('/auth')
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        router.push('/auth?error=unexpected_error')
      }
    }

    // 少し遅延させて確実に処理する
    const timer = setTimeout(handleAuthCallback, 100)
    return () => clearTimeout(timer)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🐬</div>
        <h1 className="text-xl font-semibold mb-2">認証処理中...</h1>
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐬</div>
          <h1 className="text-xl font-semibold mb-2">読み込み中...</h1>
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
