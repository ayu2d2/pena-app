'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Home, 
  Calendar as CalendarNav, 
  User as UserNav, 
  LogOut,
  Star,
  Bell,
  Settings,
  Sparkles,
  ChevronDown,
  Spade
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  gradient?: string
}

interface MobileNavProps {
  currentUser?: {
    display_name: string
    total_points: number
  } | null
  onLogout?: () => void
}

export const MobileNav = ({ currentUser, onLogout }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { 
      href: '/', 
      label: 'ホーム', 
      icon: Home,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      href: '/dashboard', 
      label: 'ダッシュボード', 
      icon: CalendarNav,
      badge: 3,
      gradient: 'from-green-500 to-blue-600'
    },
    { 
      href: '/poker', 
      label: 'ポーカー', 
      icon: Spade,
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      href: '/profile', 
      label: 'プロフィール', 
      icon: UserNav,
      gradient: 'from-pink-500 to-purple-600'
    },
  ]

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.mobile-nav')) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden relative z-50 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm min-h-[44px] min-w-[44px]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={isOpen}
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </div>
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile menu */}
      <div className={`
        mobile-nav fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white border-l border-gray-300 shadow-2xl z-50 transform transition-transform duration-300 md:hidden overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-pink-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🐬</div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                  PenaApp
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {currentUser && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.display_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{currentUser.display_name}</div>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <Star className="w-3 h-3 fill-current" />
                      {currentUser.total_points} ポイント
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isActive 
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                        : 'hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg transition-all
                      ${isActive 
                        ? 'bg-white/20' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800'
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    
                    {item.badge && (
                      <div className={`
                        ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${isActive ? 'bg-white/20' : 'bg-red-500 text-white'}
                      `}>
                        {item.badge}
                      </div>
                    )}
                    
                    {isActive && (
                      <div className="absolute right-4">
                        <Sparkles className="w-4 h-4 text-white/70" />
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
            
            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">クイックアクション</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white hover:bg-gray-50 border-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Bell className="w-4 h-4 mr-3" />
                  通知設定
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white hover:bg-gray-50 border-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  設定
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          {onLogout && (
            <div className="p-6 border-t border-gray-200">
              <Button
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                variant="outline"
                className="w-full bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-3" />
                ログアウト
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const DesktopNav = ({ currentUser, onLogout }: MobileNavProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  const navItems: NavItem[] = [
    { 
      href: '/', 
      label: 'ホーム', 
      icon: Home,
      gradient: 'from-blue-500 to-purple-600'
    },
    { 
      href: '/dashboard', 
      label: 'ダッシュボード', 
      icon: CalendarNav,
      badge: 3,
      gradient: 'from-green-500 to-blue-600'
    },
    { 
      href: '/poker', 
      label: 'ポーカー', 
      icon: Spade,
      gradient: 'from-purple-500 to-pink-600'
    },
    { 
      href: '/profile', 
      label: 'プロフィール', 
      icon: UserNav,
      gradient: 'from-pink-500 to-purple-600'
    },
  ]

  return (
    <nav className="hidden md:flex items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isActive 
                ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                : 'hover:bg-gray-100 text-gray-700'
              }
            `}
          >
            <div className={`
              p-1 rounded-lg transition-all
              ${isActive 
                ? 'bg-white/20' 
                : `bg-gradient-to-r ${item.gradient} text-white group-hover:shadow-md`
              }
            `}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">{item.label}</span>
            
            {item.badge && (
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm
                ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
              `}>
                {item.badge}
              </div>
            )}
          </Link>
        )
      })}

      {/* User Menu */}
      {currentUser && (
        <div className="relative ml-4 user-menu-container">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="ユーザーメニューを開く"
            aria-expanded={showUserMenu}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {currentUser.display_name.charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-sm font-medium text-gray-900">{currentUser.display_name}</div>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <Star className="w-3 h-3 fill-current" />
                {currentUser.total_points}pt
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.display_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{currentUser.display_name}</div>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <Star className="w-3 h-3 fill-current" />
                      {currentUser.total_points} ポイント
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <UserNav className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-800 font-medium">プロフィール設定</span>
                </Link>
                <button
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-800 font-medium">通知設定</span>
                </button>
                <button
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-800 font-medium">アプリ設定</span>
                </button>
              </div>
              
              {onLogout && (
                <div className="p-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onLogout()
                      setShowUserMenu(false)
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left text-red-600 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">ログアウト</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

// Main Navigation component that includes both mobile and desktop
interface NavigationProps {
  currentUser?: {
    display_name: string
    total_points: number
  } | null
  onLogout?: () => void
}

export default function Navigation({ currentUser, onLogout }: NavigationProps) {
  return (
    <>
      <DesktopNav currentUser={currentUser} onLogout={onLogout} />
      <MobileNav currentUser={currentUser} onLogout={onLogout} />
    </>
  )
}