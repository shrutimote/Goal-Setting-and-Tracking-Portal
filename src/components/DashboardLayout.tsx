"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Target, Activity, AlertTriangle, Bell, Check, X } from 'lucide-react'
import { getNotifications, markNotificationsAsRead, Notification } from '@/lib/notifications'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading, activeCycle } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = () => {
    if (user) {
      setNotifications(getNotifications(user.id))
    }
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    fetchNotifications()
    
    // Listen to custom custom-events for real-time notifications refresh
    window.addEventListener('notifications-updated', fetchNotifications)
    return () => {
      window.removeEventListener('notifications-updated', fetchNotifications)
    }
  }, [user])

  // Handle outside click to close notifications panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (isLoading || !user) return <div>Loading...</div>

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleBellClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      markNotificationsAsRead(user.id)
    }
  }

  const getCycleLabel = (cycle: string | null) => {
    if (!cycle || cycle === 'NONE') return 'No active cycle'
    if (cycle === 'GOAL_SETTING') return 'Goal Setting Window'
    if (cycle === 'Q1') return 'Q1 Check-in'
    if (cycle === 'Q2') return 'Q2 Check-in'
    if (cycle === 'Q3') return 'Q3 Check-in'
    if (cycle === 'Q4') return 'Q4 / Annual Review'
    return cycle
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Premium Dark Theme */}
      <aside className="w-64 bg-[#0f172a] text-slate-300 border-r border-[#1e293b] flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-[#1e293b]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Target className="w-5 h-5 text-white" />
            </div>
            GoalPortal
          </h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 mt-4">
          <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            Main Menu
          </div>
          <Link href={user.role === 'ADMIN' ? '/admin' : user.role === 'MANAGER' ? '/manager' : '/employee'} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all font-medium group">
            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
            Dashboard
          </Link>

          {user.role === 'EMPLOYEE' && (
            <Link href="/employee/goals" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all font-medium group">
              <Target className="w-5 h-5 text-slate-400 group-hover:text-indigo-400" />
              Goals List
            </Link>
          )}

          {user.role === 'ADMIN' && (
            <>
              <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all font-medium group">
                <Activity className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                Analytics
              </Link>
              <Link href="/admin/escalations" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all font-medium group">
                <AlertTriangle className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" />
                Escalations
              </Link>
            </>
          )}
        </nav>
        <div className="p-6 border-t border-[#1e293b] bg-slate-900/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">{user.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-indigo-300 font-medium">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-400 border border-rose-400/20 hover:bg-rose-500/10 hover:border-rose-400/50 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto bg-slate-50/50">
        <header className="h-16 border-b border-border bg-white flex items-center px-8 justify-between sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl font-semibold capitalize text-slate-800">{user.role.toLowerCase()} Dashboard</h1>
          <div className="flex items-center gap-6">
            <div className={`badge ${activeCycle === 'NONE' || !activeCycle ? 'bg-slate-100 text-slate-600' : 'badge-blue'}`}>
              Active Cycle: {getCycleLabel(activeCycle)}
            </div>

            {/* Premium Interactive Notification Bell System */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={handleBellClick}
                className="relative p-2 rounded-full hover:bg-slate-100 transition-all text-slate-600 focus:outline-none"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-bounce shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="font-bold text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto flex flex-col">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-slate-50 transition-colors hover:bg-slate-50/50 ${!n.isRead ? 'bg-indigo-50/20' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm text-slate-800">{n.goalTitle}</span>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 block mt-2">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
