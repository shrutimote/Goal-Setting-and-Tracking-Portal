"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Target, Activity, AlertTriangle, Bell, Check, X } from 'lucide-react'
import { getNotifications, markNotificationsAsRead, Notification } from '@/lib/notifications'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading, activeCycle } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
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
    
    // Listen to custom events for real-time notifications refresh
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

  // Issue 2 dynamic route highlight helpers
  const isDashboardActive = pathname === '/employee' || pathname === '/manager' || pathname === '/admin'
  const isGoalsActive = pathname === '/employee/goals' || pathname === '/dashboard/employee/goals'
  const isAnalyticsActive = pathname === '/admin/analytics'
  const isEscalationsActive = pathname === '/admin/escalations'

  return (
    <div className="flex min-h-screen">
      {/* 
        Issue 2 - Sidebar: 
        Solid white background (#ffffff), 1px solid #e2e8f0 right border, 
        and clean f1f5f9 dividers at the top/bottom boundary zones.
      */}
      <aside 
        className="w-64 flex flex-col z-20 shrink-0"
        style={{ 
          backgroundColor: '#ffffff', 
          borderRight: '1px solid #e2e8f0',
          color: '#64748b'
        }}
      >
        {/* Logo area */}
        <div className="p-6" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#0f172a' }}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            GoalPortal
          </h2>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 mt-4">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Menu
          </div>
          
          {/* Dashboard Link */}
          <Link 
            href={user.role === 'ADMIN' ? '/admin' : user.role === 'MANAGER' ? '/manager' : '/employee'} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              backgroundColor: isDashboardActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: isDashboardActive ? '#6366f1' : '#64748b'
            }}
            className="sidebar-nav-link"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Goals List Link */}
          {user.role === 'EMPLOYEE' && (
            <Link 
              href="/employee/goals" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                backgroundColor: isGoalsActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                color: isGoalsActive ? '#6366f1' : '#64748b'
              }}
              className="sidebar-nav-link"
            >
              <Target className="w-4 h-4" />
              Goals List
            </Link>
          )}

          {/* Admin routes */}
          {user.role === 'ADMIN' && (
            <>
              <Link 
                href="/admin/analytics" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  backgroundColor: isAnalyticsActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  color: isAnalyticsActive ? '#6366f1' : '#64748b'
                }}
                className="sidebar-nav-link"
              >
                <Activity className="w-4 h-4" />
                Analytics
              </Link>
              <Link 
                href="/admin/escalations" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  backgroundColor: isEscalationsActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  color: isEscalationsActive ? '#6366f1' : '#64748b'
                }}
                className="sidebar-nav-link"
              >
                <AlertTriangle className="w-4 h-4" />
                Escalations
              </Link>
            </>
          )}
        </nav>

        {/* User profile section at the bottom */}
        <div 
          className="p-6" 
          style={{ 
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#ffffff'
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md shrink-0">
              <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full justify-center gap-2 px-4 py-2 text-xs font-bold text-rose-500 border border-rose-100 hover:bg-rose-50 rounded-lg transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Style overrides for quiet menu items hover states */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-nav-link:hover {
          color: #0f172a !important;
          background-color: #f8fafc !important;
        }
      `}} />

      {/* 
        Issue 1 — Page background:
        Replaced the flat wash/transparent main wrapper background with
        a clean, ultra-premium off-white (#f8fafc).
      */}
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto" style={{ backgroundColor: '#f8fafc' }}>
        {/* 
          Issue 5 — Top navbar:
          White background (#ffffff), border bottom (1px solid #e2e8f0),
          consistent padding, and bell color configurations.
        */}
        <header 
          className="h-16 flex items-center px-8 justify-between sticky top-0 z-10 shrink-0"
          style={{ 
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0'
          }}
        >
          <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {user.role.toLowerCase()} Dashboard
          </h1>
          <div className="flex items-center gap-6">
            
            {/* Active Cycle Pill Badge */}
            <div 
              style={{ 
                backgroundColor: '#eef2ff', 
                color: '#4f46e5', 
                border: '1px solid #c7d2fe', 
                borderRadius: '999px', 
                fontSize: '12px', 
                fontWeight: 600,
                padding: '4px 14px'
              }}
            >
              Active Cycle: {getCycleLabel(activeCycle)}
            </div>

            {/* Notification Bell Icon */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={handleBellClick}
                className="relative p-2 rounded-full transition-all text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 focus:outline-none"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-sm">
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
        
        {/* Main page content wrapper */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
