import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isSupabaseUser: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSupabaseUser, setIsSupabaseUser] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    if (!supabase) {
      // Supabaseが利用できない場合、ローカルストレージから認証情報を取得
      const localUser = localStorage.getItem('penaapp_user')
      const localSession = localStorage.getItem('penaapp_session')
      
      if (localUser) {
        const userData = JSON.parse(localUser)
        setUser(userData as any)
        setIsSupabaseUser(userData.supabase_user || false)
      }
      
      if (localSession) {
        try {
          setSession(JSON.parse(localSession))
        } catch (error) {
          console.warn('ローカルセッション情報の解析に失敗:', error)
        }
      }
      
      setLoading(false)
      return
    }

    // Supabaseが利用可能な場合
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('セッション取得エラー:', error)
          // ローカルストレージからフォールバック
          const localUser = localStorage.getItem('penaapp_user')
          if (localUser) {
            const userData = JSON.parse(localUser)
            setUser(userData as any)
            setIsSupabaseUser(userData.supabase_user || false)
          }
        } else if (session) {
          setSession(session)
          setUser(session.user)
          setIsSupabaseUser(true)
          
          // ローカルストレージも更新
          const userInfo = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            total_points: 1000,
            supabase_user: true
          }
          localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
          localStorage.setItem('penaapp_session', JSON.stringify(session))
        } else {
          // セッションがない場合、ローカルストレージを確認
          const localUser = localStorage.getItem('penaapp_user')
          if (localUser) {
            const userData = JSON.parse(localUser)
            setUser(userData as any)
            setIsSupabaseUser(userData.supabase_user || false)
          }
        }
      } catch (error) {
        console.warn('認証状態の確認に失敗:', error)
        // ローカルストレージからフォールバック
        const localUser = localStorage.getItem('penaapp_user')
        if (localUser) {
          const userData = JSON.parse(localUser)
          setUser(userData as any)
          setIsSupabaseUser(userData.supabase_user || false)
        }
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('認証状態変更:', event, session?.user?.email)
        
        if (session) {
          setSession(session)
          setUser(session.user)
          setIsSupabaseUser(true)
          
          // ローカルストレージも更新
          const userInfo = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            display_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            total_points: 1000,
            supabase_user: true
          }
          localStorage.setItem('penaapp_user', JSON.stringify(userInfo))
          localStorage.setItem('penaapp_session', JSON.stringify(session))
        } else {
          setSession(null)
          setUser(null)
          setIsSupabaseUser(false)
          
          // ログアウト時にローカルストレージをクリア
          if (event === 'SIGNED_OUT') {
            localStorage.removeItem('penaapp_user')
            localStorage.removeItem('penaapp_session')
          }
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, session, loading, isSupabaseUser }
}

export async function signOut() {
  const supabase = createClient()
  
  if (supabase) {
    await supabase.auth.signOut()
  }
  
  // ローカルストレージもクリア
  localStorage.removeItem('penaapp_user')
  localStorage.removeItem('penaapp_session')
}
