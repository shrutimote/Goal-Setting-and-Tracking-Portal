"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Target, Users, UserCircle, ShieldAlert } from 'lucide-react'

export default function LoginPage() {
  const { user, login, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'EMPLOYEE') router.push('/employee')
      else if (user.role === 'MANAGER') router.push('/manager')
      else if (user.role === 'ADMIN') router.push('/admin')
    }
  }, [user, isLoading, router])

  const handleDemoLogin = (email: string) => {
    login(email, 'demo123')
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-4xl px-4">
        
        <div className="flex flex-col items-center justify-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Target className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">GoalPortal</h1>
            <p className="text-slate-500 font-medium text-lg">Interactive Demonstration Environment</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Admin Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-indigo-100">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Administration</h2>
            </div>
            <button onClick={() => handleDemoLogin('admin@atomberg.com')} className="card border-2 border-transparent hover:border-indigo-400 hover:shadow-md transition-all text-left flex flex-col group">
              <span className="font-bold text-slate-800 group-hover:text-indigo-700">Global Admin (HR)</span>
              <span className="text-xs text-slate-500 font-medium">admin@atomberg.com</span>
            </button>
          </div>

          {/* Managers Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-blue-100">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Managers</h2>
            </div>
            <button onClick={() => handleDemoLogin('manager.sales@atomberg.com')} className="card border-2 border-transparent hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col group">
              <span className="font-bold text-slate-800 group-hover:text-blue-700">Sarah (Sales Dept)</span>
              <span className="text-xs text-slate-500 font-medium">manager.sales@atomberg.com</span>
            </button>
            <button onClick={() => handleDemoLogin('manager.eng@atomberg.com')} className="card border-2 border-transparent hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col group">
              <span className="font-bold text-slate-800 group-hover:text-blue-700">Erica (Engineering Dept)</span>
              <span className="text-xs text-slate-500 font-medium">manager.eng@atomberg.com</span>
            </button>
            <button onClick={() => handleDemoLogin('manager.ops@atomberg.com')} className="card border-2 border-transparent hover:border-blue-400 hover:shadow-md transition-all text-left flex flex-col group">
              <span className="font-bold text-slate-800 group-hover:text-blue-700">Oscar (Operations Dept)</span>
              <span className="text-xs text-slate-500 font-medium">manager.ops@atomberg.com</span>
            </button>
          </div>

          {/* Employees Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b-2 border-green-100">
              <UserCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wider">Employees</h2>
            </div>
            
            {/* Sales Team */}
            <div className="mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Sales Team</span>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleDemoLogin('employee.sales1@atomberg.com')} className="card py-3 border-2 border-transparent hover:border-green-400 hover:shadow-md transition-all text-left flex flex-col group">
                  <span className="font-bold text-sm text-slate-800 group-hover:text-green-700">Alice (AE)</span>
                </button>
                <button onClick={() => handleDemoLogin('employee.sales2@atomberg.com')} className="card py-3 border-2 border-transparent hover:border-green-400 hover:shadow-md transition-all text-left flex flex-col group">
                  <span className="font-bold text-sm text-slate-800 group-hover:text-green-700">Alex (SDR)</span>
                </button>
              </div>
            </div>

            {/* Eng Team */}
            <div className="mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Engineering Team</span>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleDemoLogin('employee.eng1@atomberg.com')} className="card py-3 border-2 border-transparent hover:border-green-400 hover:shadow-md transition-all text-left flex flex-col group">
                  <span className="font-bold text-sm text-slate-800 group-hover:text-green-700">Bob (Frontend)</span>
                </button>
                <button onClick={() => handleDemoLogin('employee.eng2@atomberg.com')} className="card py-3 border-2 border-transparent hover:border-green-400 hover:shadow-md transition-all text-left flex flex-col group">
                  <span className="font-bold text-sm text-slate-800 group-hover:text-green-700">Bella (Backend)</span>
                </button>
              </div>
            </div>

            {/* Ops Team */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Operations Team</span>
              <button onClick={() => handleDemoLogin('employee.ops1@atomberg.com')} className="card py-3 border-2 border-transparent hover:border-green-400 hover:shadow-md transition-all text-left flex flex-col group">
                <span className="font-bold text-sm text-slate-800 group-hover:text-green-700">Charlie (Logistics)</span>
              </button>
            </div>
          </div>

        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm font-medium text-slate-400">All demo accounts share the same secure password constraint for testing purposes.</p>
        </div>
      </div>
    </div>
  )
}
