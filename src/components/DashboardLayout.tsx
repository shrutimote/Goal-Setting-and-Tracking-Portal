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
      {/* Sidebar - Solid White Theme */}
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

      {/* Style overrides for sidebar & bell active icons */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-nav-link:hover {
          color: #0f172a !important;
          background-color: #f8fafc !important;
        }
        .navbar-bell-btn:hover {
          background-color: #f8fafc !important;
        }
      `}} />

      {/* Main Content panel wrapper with Warm Page Background */}
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto" style={{ backgroundColor: '#f8fafc' }}>
        
        {/* Header Navigation */}
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
            {/* Active Cycle badge */}
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

            {/* 
              Issue 1 & 5 — Notification Bell Container:
              Wrapped with explicit style={{ position: 'relative' }} to prevent dropdown from misaligning.
            */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              
              {/* Issue 4: Bell button and interactive state */}
              <button 
                onClick={handleBellClick}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px', 
                  padding: '6px',
                  color: '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  position: 'relative'
                }}
                className="navbar-bell-btn"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span 
                    style={{ 
                      position: 'absolute', 
                      top: '2px', 
                      right: '2px', 
                      width: '14px', 
                      height: '14px', 
                      borderRadius: '999px', 
                      backgroundColor: '#ef4444', 
                      color: '#ffffff', 
                      fontWeight: 700, 
                      fontSize: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* 
                Issue 1, 2 & 3: 
                Absolutely positioned notification dropdown block anchored to top-right of page.
              */}
              {isOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    minWidth: '280px',
                    padding: '16px',
                    zIndex: 9999, // Issue 2: High floating z-index
                    boxSizing: 'border-box'
                  }}
                  className="animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {/* Dropdown Header section */}
                  <div 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      color: '#475569', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.06em',
                      paddingBottom: '8px',
                      marginBottom: '12px',
                      borderBottom: '1px solid #f1f5f9',
                      textAlign: 'left'
                    }}
                  >
                    Notifications
                  </div>
                  
                  {/* Notifications list or empty state */}
                  <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {notifications.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', padding: '16px 0' }}>
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          style={{ 
                            padding: '10px 12px', 
                            borderRadius: '8px', 
                            backgroundColor: !n.isRead ? 'rgba(99, 102, 241, 0.04)' : '#fafbfc', 
                            border: '1px solid #e2e8f0', 
                            transition: 'background-color 0.2s',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '12px', color: '#0f172a' }}>{n.goalTitle}</span>
                            {!n.isRead && <span style={{ width: '6px', height: '6px', borderRadius: '999px', backgroundColor: '#6366f1' }} />}
                          </div>
                          <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.4, textAlign: 'left' }}>{n.message}</p>
                          <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '6px', textAlign: 'left' }}>
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
        
        {/* Children content page */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
