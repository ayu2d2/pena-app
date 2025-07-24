import { createClient } from './client'
import type { Database } from '@/types/database'

type EventParticipation = Database['public']['Tables']['event_participations']['Row']
type UserNotification = Database['public']['Tables']['user_notifications']['Row']

export interface ParticipantDetail {
  id: string
  user_id: string
  event_id: string
  joined_at: string
  user?: {
    id: string
    display_name: string
    avatar_url?: string | null
  }
}

/**
 * イベント参加関連の操作
 */
export class EventParticipationService {
  private supabase = createClient()

  /**
   * イベントに参加する
   */
  async joinEvent(eventId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // まず、イベントの定員を確認
      const { data: event, error: eventError } = await this.supabase
        .from('events')
        .select('max_participants')
        .eq('id', eventId)
        .single()

      if (eventError) {
        throw new Error('イベント情報の取得に失敗しました')
      }

      // 現在の参加者数を確認
      if (event.max_participants) {
        const { count, error: countError } = await this.supabase
          .from('event_participations')
          .select('*', { count: 'exact' })
          .eq('event_id', eventId)

        if (countError) {
          throw new Error('参加者数の確認に失敗しました')
        }

        if (count && count >= event.max_participants) {
          return { success: false, error: 'イベントは満員です' }
        }
      }

      // 参加登録
      const { error: insertError } = await this.supabase
        .from('event_participations')
        .insert({
          user_id: userId,
          event_id: eventId
        })

      if (insertError) {
        // 既に参加している場合のエラーハンドリング
        if (insertError.code === '23505') { // unique constraint violation
          return { success: false, error: '既に参加済みです' }
        }
        throw insertError
      }

      return { success: true }
    } catch (error) {
      console.error('イベント参加エラー:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '参加に失敗しました' 
      }
    }
  }

  /**
   * イベント参加をキャンセルする
   */
  async leaveEvent(eventId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('event_participations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('参加キャンセルエラー:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '参加キャンセルに失敗しました' 
      }
    }
  }

  /**
   * イベントの参加者一覧を取得する
   */
  async getEventParticipants(eventId: string): Promise<ParticipantDetail[]> {
    try {
      const { data, error } = await this.supabase
        .from('event_participations')
        .select(`
          id,
          user_id,
          event_id,
          joined_at,
          users!inner (
            id,
            display_name,
            avatar_url
          )
        `)
        .eq('event_id', eventId)
        .order('joined_at', { ascending: false })

      if (error) throw error

      return data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        event_id: item.event_id,
        joined_at: item.joined_at,
        user: Array.isArray(item.users) && item.users.length > 0 ? {
          id: item.users[0].id,
          display_name: item.users[0].display_name || 'ユーザー',
          avatar_url: item.users[0].avatar_url
        } : undefined
      }))
    } catch (error) {
      console.error('参加者取得エラー:', error)
      return []
    }
  }

  /**
   * ユーザーの参加イベント一覧を取得する
   */
  async getUserParticipations(userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('event_participations')
        .select('event_id')
        .eq('user_id', userId)

      if (error) throw error

      return data.map(item => item.event_id)
    } catch (error) {
      console.error('参加イベント取得エラー:', error)
      return []
    }
  }

  /**
   * 複数イベントの参加者を一括取得する
   */
  async getMultipleEventParticipants(eventIds: string[]): Promise<{ [eventId: string]: ParticipantDetail[] }> {
    try {
      const { data, error } = await this.supabase
        .from('event_participations')
        .select(`
          id,
          user_id,
          event_id,
          joined_at,
          users!inner (
            id,
            display_name,
            avatar_url
          )
        `)
        .in('event_id', eventIds)
        .order('joined_at', { ascending: false })

      if (error) throw error

      const result: { [eventId: string]: ParticipantDetail[] } = {}
      
      data.forEach(item => {
        if (!result[item.event_id]) {
          result[item.event_id] = []
        }
        
        result[item.event_id].push({
          id: item.id,
          user_id: item.user_id,
          event_id: item.event_id,
          joined_at: item.joined_at,
          user: Array.isArray(item.users) && item.users.length > 0 ? {
            id: item.users[0].id,
            display_name: item.users[0].display_name || 'ユーザー',
            avatar_url: item.users[0].avatar_url
          } : undefined
        })
      })

      return result
    } catch (error) {
      console.error('複数イベント参加者取得エラー:', error)
      return {}
    }
  }
}

/**
 * 通知設定関連の操作
 */
export class NotificationService {
  private supabase = createClient()

  /**
   * ユーザーの通知設定を取得する
   */
  async getUserNotifications(userId: string): Promise<{ [eventId: string]: boolean }> {
    try {
      const { data, error } = await this.supabase
        .from('user_notifications')
        .select('event_id, enabled')
        .eq('user_id', userId)

      if (error) throw error

      const result: { [eventId: string]: boolean } = {}
      data.forEach(item => {
        result[item.event_id] = item.enabled
      })

      return result
    } catch (error) {
      console.error('通知設定取得エラー:', error)
      return {}
    }
  }

  /**
   * 通知設定を更新する
   */
  async updateNotificationSetting(
    userId: string, 
    eventId: string, 
    enabled: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('user_notifications')
        .upsert({
          user_id: userId,
          event_id: eventId,
          enabled
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('通知設定更新エラー:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '通知設定の更新に失敗しました' 
      }
    }
  }

  /**
   * イベント参加時に自動で通知設定を有効化
   */
  async enableNotificationForEvent(
    userId: string, 
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateNotificationSetting(userId, eventId, true)
  }

  /**
   * イベント参加キャンセル時に通知設定を削除
   */
  async removeNotificationForEvent(
    userId: string, 
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('user_notifications')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('通知設定削除エラー:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '通知設定の削除に失敗しました' 
      }
    }
  }
}

// サービスインスタンスをエクスポート
export const eventParticipationService = new EventParticipationService()
export const notificationService = new NotificationService()
