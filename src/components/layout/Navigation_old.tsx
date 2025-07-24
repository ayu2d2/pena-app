'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Home, 
  Calendar as CalendarNav, 
  Trophy as TrophyNav, 
  User as UserNav, 
  LogOut 
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
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
    { href: '/', label: 'ホーム', icon: Home },
    { href: '/dashboard', label: 'ダッシュボード', icon: CalendarNav },
    { href: '/profile', label: 'プロフィール', icon: UserNav },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          
          <div className="fixed right-0 top-0 h-full w-64 bg-card border-l shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="text-xl">🐬</div>
                <span className="font-bold text-primary">PenaApp</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {currentUser && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    {currentUser.display_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{currentUser.display_name}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrophyNav className="w-3 h-3" />
                      {currentUser.total_points} ポイント
                    </div>
                  </div>
                </div>
              </div>
            )}

            <nav className="p-4">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {currentUser && onLogout && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => {
                      onLogout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    ログアウト
                  </Button>
                </div>
              )}

              {!currentUser && (
                <div className="mt-6 pt-4 border-t">
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      ログイン / 登録
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

interface DesktopNavProps {
  currentUser?: {
    display_name: string
    total_points: number
  } | null
  onLogout?: () => void
}

export const DesktopNav = ({ currentUser, onLogout }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      {currentUser ? (
        <>
          <Link href="/profile">
            <Button variant="ghost" className="gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {currentUser.display_name.charAt(0)}
              </div>
              {currentUser.display_name}
            </Button>
          </Link>
          
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <TrophyNav className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{currentUser.total_points}</span>
          </div>

          {onLogout && (
            <Button variant="outline" onClick={onLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              ログアウト
            </Button>
          )}
        </>
      ) : (
        <Link href="/auth">
          <Button>ログイン / 登録</Button>
        </Link>
      )}
    </div>
  )
}
