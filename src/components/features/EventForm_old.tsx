'use client'

import { useState } from 'react'
import type { EventType } from '@/types/database'
import { Button } from '@/components/ui/button'
import { 
  Calendar as CalendarIcon, 
  MapPin as MapPinIcon, 
  Users as UsersIcon, 
  Star as StarIcon, 
  Clock as ClockIcon 
} from 'lucide-react'

interface EventFormData {
  title: string
  description: string
  event_type: EventType
  start_date: string
  end_date: string
  location: string
  max_participants: number | null
  points_reward: number
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => void
  onCancel: () => void
  loading?: boolean
}

export const EventForm = ({ onSubmit, onCancel, loading }: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    event_type: 'social',
    start_date: '',
    end_date: '',
    location: '',
    max_participants: null,
    points_reward: 10
  })

  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({})

  const eventTypes = [
    { value: 'kpop', label: 'K-popイベント', icon: '🎵', description: 'K-pop関連の活動' },
    { value: 'penalty_kick', label: 'PK練習', icon: '⚽', description: 'ペナルティキック練習' },
    { value: 'study', label: 'SDGs学習', icon: '📚', description: 'SDGs学習会' },
    { value: 'social', label: '交流会', icon: '🎉', description: 'メンバー同士の交流' },
    { value: 'volunteer', label: 'ボランティア', icon: '🌱', description: 'ボランティア活動' }
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です'
    }

    if (!formData.start_date) {
      newErrors.start_date = '開始日時は必須です'
    }

    if (formData.end_date && formData.start_date && new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = '終了日時は開始日時より後に設定してください'
    }

    if (formData.max_participants !== null && formData.max_participants < 1) {
      newErrors.max_participants = '定員は1名以上で設定してください'
    }

    if (formData.points_reward < 0) {
      newErrors.points_reward = 'ポイントは0以上で設定してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const updateField = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-lg border p-6">
      <h2 className="text-2xl font-bold mb-6">新しいイベントを作成</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* タイトル */}
        <div>
          <label className="block text-sm font-medium mb-2">
            イベントタイトル *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.title ? 'border-destructive' : 'border-input'
            }`}
            placeholder="例: K-popダンス練習会"
          />
          {errors.title && (
            <p className="text-destructive text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* イベントタイプ */}
        <div>
          <label className="block text-sm font-medium mb-2">
            イベントタイプ *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {eventTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => updateField('event_type', type.value as EventType)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  formData.event_type === type.value
                    ? 'border-primary bg-primary/10'
                    : 'border-input hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{type.icon}</span>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            イベント説明
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="イベントの詳細を入力してください"
          />
        </div>

        {/* 日時 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <CalendarIcon className="inline w-4 h-4 mr-1" />
              開始日時 *
            </label>
            <input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => updateField('start_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.start_date ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.start_date && (
              <p className="text-destructive text-sm mt-1">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <ClockIcon className="inline w-4 h-4 mr-1" />
              終了日時
            </label>
            <input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => updateField('end_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.end_date ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.end_date && (
              <p className="text-destructive text-sm mt-1">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* 場所 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPinIcon className="inline w-4 h-4 mr-1" />
            開催場所
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="例: 上智大学体育館"
          />
        </div>

        {/* 定員とポイント */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <UsersIcon className="inline w-4 h-4 mr-1" />
              定員
            </label>
            <input
              type="number"
              value={formData.max_participants || ''}
              onChange={(e) => updateField('max_participants', e.target.value ? parseInt(e.target.value) : null)}
              min="1"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.max_participants ? 'border-destructive' : 'border-input'
              }`}
              placeholder="無制限の場合は空欄"
            />
            {errors.max_participants && (
              <p className="text-destructive text-sm mt-1">{errors.max_participants}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <StarIcon className="inline w-4 h-4 mr-1" />
              獲得ポイント
            </label>
            <input
              type="number"
              value={formData.points_reward}
              onChange={(e) => updateField('points_reward', parseInt(e.target.value) || 0)}
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.points_reward ? 'border-destructive' : 'border-input'
              }`}
            />
            {errors.points_reward && (
              <p className="text-destructive text-sm mt-1">{errors.points_reward}</p>
            )}
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? '作成中...' : 'イベントを作成'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  )
}
