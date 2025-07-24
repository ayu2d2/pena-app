import { useState, useEffect, useCallback } from 'react'

interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

interface UseNotificationsReturn {
  permission: NotificationPermission
  requestPermission: () => Promise<boolean>
  sendNotification: (title: string, options?: NotificationOptions) => Notification | null
  isSupported: boolean
}

/**
 * ブラウザ通知を管理するカスタムフック
 */
export const useNotifications = (): UseNotificationsReturn => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  })

  const isSupported = typeof window !== 'undefined' && 'Notification' in window

  useEffect(() => {
    if (!isSupported) return

    const currentPermission = Notification.permission
    setPermission({
      granted: currentPermission === 'granted',
      denied: currentPermission === 'denied',
      default: currentPermission === 'default'
    })
  }, [isSupported])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      const granted = result === 'granted'
      
      setPermission({
        granted,
        denied: result === 'denied',
        default: result === 'default'
      })

      return granted
    } catch (error) {
      console.error('通知許可の取得に失敗しました:', error)
      return false
    }
  }, [isSupported])

  const sendNotification = useCallback((
    title: string, 
    options: NotificationOptions & { onclick?: (event: Event) => void } = {}
  ): Notification | null => {
    if (!isSupported || !permission.granted) {
      console.warn('通知が許可されていません')
      return null
    }

    try {
      const { onclick, ...notificationOptions } = options
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...notificationOptions
      })

      // 通知をクリックした時の処理
      notification.onclick = () => {
        window.focus()
        notification.close()
        if (onclick) {
          onclick(new Event('click'))
        }
      }

      return notification
    } catch (error) {
      console.error('通知の送信に失敗しました:', error)
      return null
    }
  }, [isSupported, permission.granted])

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported
  }
}

interface EventNotification {
  eventId: string
  eventTitle: string
  startDate: string
  enabled: boolean
}

interface UseEventNotificationsReturn {
  notifications: EventNotification[]
  addNotification: (eventId: string, eventTitle: string, startDate: string) => void
  removeNotification: (eventId: string) => void
  toggleNotification: (eventId: string, enabled: boolean) => void
  isNotificationEnabled: (eventId: string) => boolean
  scheduleNotifications: () => void
}

/**
 * イベント通知を管理するカスタムフック
 */
export const useEventNotifications = (): UseEventNotificationsReturn => {
  const [notifications, setNotifications] = useState<EventNotification[]>([])
  const { sendNotification, permission } = useNotifications()

  // ローカルストレージから通知設定を読み込み
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem('eventNotifications')
      if (saved) {
        setNotifications(JSON.parse(saved))
      }
    } catch (error) {
      console.error('通知設定の読み込みに失敗しました:', error)
    }
  }, [])

  // 通知設定をローカルストレージに保存
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem('eventNotifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('通知設定の保存に失敗しました:', error)
    }
  }, [notifications])

  const addNotification = useCallback((eventId: string, eventTitle: string, startDate: string) => {
    setNotifications(prev => {
      const exists = prev.find(n => n.eventId === eventId)
      if (exists) return prev

      return [...prev, {
        eventId,
        eventTitle,
        startDate,
        enabled: true
      }]
    })
  }, [])

  const removeNotification = useCallback((eventId: string) => {
    setNotifications(prev => prev.filter(n => n.eventId !== eventId))
  }, [])

  const toggleNotification = useCallback((eventId: string, enabled: boolean) => {
    setNotifications(prev => 
      prev.map(n => 
        n.eventId === eventId ? { ...n, enabled } : n
      )
    )
  }, [])

  const isNotificationEnabled = useCallback((eventId: string): boolean => {
    const notification = notifications.find(n => n.eventId === eventId)
    return notification?.enabled || false
  }, [notifications])

  const scheduleNotifications = useCallback(() => {
    if (!permission.granted) return

    const now = new Date()
    
    notifications.forEach(notification => {
      if (!notification.enabled) return

      const eventDate = new Date(notification.startDate)
      const timeUntilEvent = eventDate.getTime() - now.getTime()

      // イベント1時間前に通知
      const oneHourBefore = timeUntilEvent - (60 * 60 * 1000)
      if (oneHourBefore > 0 && oneHourBefore < 24 * 60 * 60 * 1000) { // 24時間以内
        setTimeout(() => {
          sendNotification(
            `${notification.eventTitle} まもなく開始`,
            {
              body: `1時間後にイベントが開始されます`,
              tag: `event-${notification.eventId}-1hour`,
              requireInteraction: true
            }
          )
        }, oneHourBefore)
      }

      // イベント15分前に通知
      const fifteenMinutesBefore = timeUntilEvent - (15 * 60 * 1000)
      if (fifteenMinutesBefore > 0 && fifteenMinutesBefore < 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          sendNotification(
            `${notification.eventTitle} まもなく開始`,
            {
              body: `15分後にイベントが開始されます`,
              tag: `event-${notification.eventId}-15min`,
              requireInteraction: true
            }
          )
        }, fifteenMinutesBefore)
      }
    })
  }, [notifications, permission.granted, sendNotification])

  // 通知をスケジュール
  useEffect(() => {
    scheduleNotifications()
  }, [scheduleNotifications])

  return {
    notifications,
    addNotification,
    removeNotification,
    toggleNotification,
    isNotificationEnabled,
    scheduleNotifications
  }
}
