"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { LogOut, LayoutDashboard, Target, Activity, AlertTriangle } from 'lucide-react'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return <div>Loading...</div>

  const handleLogout = () => {
    logout()
    router.push('/')
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
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <header className="h-16 border-b border-border bg-white flex items-center px-8 justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold capitalize">{user.role.toLowerCase()} Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="badge badge-blue">Active Cycle: {user.role === 'ADMIN' ? 'Manage' : 'Q1 Check-in'}</div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
