'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Calendar as CalendarIcon, 
  MapPin as MapPinIcon, 
  Users as UsersIcon, 
  Star as StarIcon, 
  Clock as ClockIcon,
  Music,
  Target,
  BookOpen,
  Coffee,
  Plus,
  X,
  Save,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react'

type EventType = 'practice' | 'competition' | 'social' | 'study'

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
  const [step, setStep] = useState(1)

  const eventTypes = [
    { 
      value: 'kpop', 
      label: 'K-popイベント', 
      icon: Music, 
      emoji: '🎵',
      description: 'K-pop関連の活動・ダンス・歌唱',
      color: 'from-rose-400 via-pink-500 to-fuchsia-600',
      lightColor: 'from-rose-50 via-pink-50 to-fuchsia-100',
      accent: 'bg-gradient-to-r from-rose-500 to-fuchsia-600',
      shadow: 'shadow-pink-300/40'
    },
    { 
      value: 'penalty_kick', 
      label: 'PK練習', 
      icon: Target, 
      emoji: '⚽',
      description: 'ペナルティキック練習・大会',
      color: 'from-emerald-400 via-green-500 to-teal-600',
      lightColor: 'from-emerald-50 via-green-50 to-teal-100',
      accent: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      shadow: 'shadow-green-300/40'
    },
    { 
      value: 'study', 
      label: 'SDGs学習', 
      icon: BookOpen, 
      emoji: '📚',
      description: 'SDGs学習会・勉強会',
      color: 'from-sky-400 via-blue-500 to-indigo-600',
      lightColor: 'from-sky-50 via-blue-50 to-indigo-100',
      accent: 'bg-gradient-to-r from-sky-500 to-indigo-600',
      shadow: 'shadow-blue-300/40'
    },
    { 
      value: 'social', 
      label: '交流会', 
      icon: Coffee, 
      emoji: '🎉',
      description: 'メンバー同士の交流イベント',
      color: 'from-violet-400 via-purple-500 to-indigo-600',
      lightColor: 'from-violet-50 via-purple-50 to-indigo-100',
      accent: 'bg-gradient-to-r from-violet-500 to-indigo-600',
      shadow: 'shadow-purple-300/40'
    }
  ]

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {}
    
    if (stepNumber === 1) {
      if (!formData.title.trim()) {
        newErrors.title = 'イベント名は必須です'
      }
      if (!formData.event_type) {
        newErrors.event_type = 'イベントタイプを選択してください'
      }
    }
    
    if (stepNumber === 2) {
      if (!formData.start_date) {
        newErrors.start_date = '開始日時は必須です'
      }
      if (!formData.location.trim()) {
        newErrors.location = '開催場所は必須です'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(step)) {
      onSubmit(formData)
    }
  }

  const updateFormData = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const selectedEventType = eventTypes.find(type => type.value === formData.event_type)

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-gray-200/50 shadow-2xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">
          新しいイベントを作成
        </h2>
        <p className="text-gray-600">
          魅力的なイベントを企画して、メンバーと一緒に楽しみましょう！
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${step >= num 
                  ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-12 h-1 mx-2 rounded-full transition-all ${
                  step > num ? 'bg-gradient-to-r from-blue-500 to-pink-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">基本情報</h3>
              <p className="text-gray-600">イベントの基本的な情報を入力してください</p>
            </div>

            {/* Event Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                イベントタイプ
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateFormData('event_type', type.value)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-300 text-left
                        ${formData.event_type === type.value
                          ? `bg-gradient-to-r ${type.lightColor} border-blue-300 shadow-lg`
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          p-2 rounded-lg flex items-center justify-center
                          ${formData.event_type === type.value
                            ? `bg-gradient-to-r ${type.color} text-white`
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{type.emoji}</span>
                            <h4 className="font-medium text-gray-800">{type.label}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                      {formData.event_type === type.value && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {errors.event_type && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.event_type}
                </p>
              )}
            </div>

            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                イベント名 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-xl bg-white/80 backdrop-blur-sm transition-all
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${errors.title ? 'border-red-300' : 'border-gray-300'}
                `}
                placeholder="例: K-popダンス練習会"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                イベント説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="イベントの詳細や参加者へのメッセージを入力してください..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Location */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">日時・場所</h3>
              <p className="text-gray-600">イベントの開催日時と場所を設定してください</p>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日時 *
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => updateFormData('start_date', e.target.value)}
                  className={`
                    w-full pl-12 pr-4 py-3 border rounded-xl bg-white/80 backdrop-blur-sm transition-all
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.start_date ? 'border-red-300' : 'border-gray-300'}
                  `}
                />
              </div>
              {errors.start_date && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.start_date}
                </p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了日時（任意）
              </label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => updateFormData('end_date', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開催場所 *
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className={`
                    w-full pl-12 pr-4 py-3 border rounded-xl bg-white/80 backdrop-blur-sm transition-all
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${errors.location ? 'border-red-300' : 'border-gray-300'}
                  `}
                  placeholder="例: 大学体育館、音楽室A、オンライン"
                />
              </div>
              {errors.location && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">詳細設定</h3>
              <p className="text-gray-600">参加者数やポイントなどの設定を行ってください</p>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                定員（任意）
              </label>
              <div className="relative">
                <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.max_participants || ''}
                  onChange={(e) => updateFormData('max_participants', e.target.value ? parseInt(e.target.value) : null)}
                  min="1"
                  max="100"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: 20"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                未設定の場合は定員なしになります
              </p>
            </div>

            {/* Points Reward */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                獲得ポイント
              </label>
              <div className="relative">
                <StarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500 w-5 h-5 fill-current" />
                <input
                  type="number"
                  value={formData.points_reward}
                  onChange={(e) => updateFormData('points_reward', parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((formData.points_reward / 100) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formData.points_reward}/100pt
                </span>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl p-6 border border-blue-200">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                プレビュー
              </h4>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${selectedEventType ? `bg-gradient-to-r ${selectedEventType.color} text-white` : 'bg-gray-100 text-gray-600'}`}>
                    {selectedEventType && <selectedEventType.icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{formData.title || 'イベント名'}</h5>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{formData.start_date ? new Date(formData.start_date).toLocaleDateString('ja-JP') : '日時未設定'}</span>
                      <span>{formData.location || '場所未設定'}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {formData.points_reward}pt
                  </div>
                </div>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-2">{formData.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="bg-white/80 backdrop-blur-sm"
              >
                戻る
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="bg-white/80 backdrop-blur-sm hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <X className="w-4 h-4 mr-2" />
                キャンセル
              </Button>
            )}
          </div>
          
          <div>
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white"
              >
                次へ
                <CalendarIcon className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    作成中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    イベントを作成
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default EventForm