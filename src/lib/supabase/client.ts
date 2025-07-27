import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // ビルド時やプリレンダリング時にはダミークライアントを返す
    if (typeof window === 'undefined') {
      return null as any
    }
    throw new Error('Supabase URL and Anon Key are required')
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
