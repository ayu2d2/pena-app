export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_participations: {
        Row: {
          id: string
          user_id: string
          event_id: string
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_notifications: {
        Row: {
          id: string
          user_id: string
          event_id: string
          enabled: boolean
          notification_times: number[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          enabled?: boolean
          notification_times?: number[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          enabled?: boolean
          notification_times?: number[]
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          display_name: string
          student_id: string | null
          year: number | null
          favorite_kpop_group: string | null
          penalty_kick_skill: number
          total_points: number
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          student_id?: string | null
          year?: number | null
          favorite_kpop_group?: string | null
          penalty_kick_skill?: number
          total_points?: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          student_id?: string | null
          year?: number | null
          favorite_kpop_group?: string | null
          penalty_kick_skill?: number
          total_points?: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          display_name: string
          student_id: string | null
          year: number | null
          favorite_kpop_group: string | null
          penalty_kick_skill: number
          total_points: number
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          student_id?: string | null
          year?: number | null
          favorite_kpop_group?: string | null
          penalty_kick_skill?: number
          total_points?: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          student_id?: string | null
          year?: number | null
          favorite_kpop_group?: string | null
          penalty_kick_skill?: number
          total_points?: number
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: 'kpop' | 'penalty_kick' | 'study' | 'social'
          start_date: string
          end_date: string | null
          location: string | null
          max_participants: number | null
          points_reward: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type: 'kpop' | 'penalty_kick' | 'study' | 'social'
          start_date: string
          end_date?: string | null
          location?: string | null
          max_participants?: number | null
          points_reward?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: 'kpop' | 'penalty_kick' | 'study' | 'social'
          start_date?: string
          end_date?: string | null
          location?: string | null
          max_participants?: number | null
          points_reward?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_points: {
        Row: {
          id: string
          user_id: string
          points: number
          reason: string
          event_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points: number
          reason: string
          event_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          reason?: string
          event_id?: string | null
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string
          points_required: number
          special_condition: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string
          points_required?: number
          special_condition?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string
          points_required?: number
          special_condition?: string | null
          created_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventParticipation = Database['public']['Tables']['event_participations']['Row']
export type UserNotification = Database['public']['Tables']['user_notifications']['Row']
export type UserPoints = Database['public']['Tables']['user_points']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']
