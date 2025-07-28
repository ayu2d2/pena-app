import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 環境変数の検証
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase環境変数が設定されていません')
    return null
  }

  // プレースホルダー値の検証
  if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon')) {
    console.warn('Supabase環境変数にプレースホルダー値が設定されています')
    return null
  }

  try {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  } catch (error) {
    console.error('Supabaseクライアントの作成に失敗しました:', error)
    return null
  }
}
