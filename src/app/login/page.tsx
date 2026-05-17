"use client"

import { useAuth, DEMO_USERS } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Target, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const { user, loginUser, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'EMPLOYEE') router.push('/employee')
      else if (user.role === 'MANAGER') router.push('/manager')
      else if (user.role === 'ADMIN') router.push('/admin')
    }
  }, [user, isLoading, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const foundUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )

    if (foundUser) {
      const { password: _, ...safeUser } = foundUser
      loginUser(safeUser)
    } else {
      setError('Invalid credentials. Please verify your email and password.')
    }
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="card w-full mb-8 shadow-xl border border-slate-200" style={{ maxWidth: '420px' }}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">GoalPortal</h1>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 mb-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5 mb-8">
          <div>
            <label className="label text-slate-700 font-semibold mb-1.5 block">Email Address</label>
            <input 
              type="email" 
              className="input w-full border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 transition-colors" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label text-slate-700 font-semibold mb-1.5 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input w-full border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 pr-10 transition-colors" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full py-3 mt-2 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            Sign In
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-500">
            Don't have an account? <span className="text-slate-600 font-bold">Contact your manager.</span>
          </p>
        </div>
      </div>
      
      {/* Help Card for Testing */}
      <div className="card w-full bg-slate-50 border border-dashed border-slate-200 text-center" style={{ maxWidth: '420px' }}>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Demo Credentials</p>
        <p className="text-xs font-semibold text-slate-600">
          Admin: <code className="bg-slate-200 px-1 py-0.5 rounded">admin@atomberg.com</code><br/>
          Sales Mgr: <code className="bg-slate-200 px-1 py-0.5 rounded">manager.sales@atomberg.com</code><br/>
          Eng Mgr: <code className="bg-slate-200 px-1 py-0.5 rounded">manager.eng@atomberg.com</code><br/>
          Employee: <code className="bg-slate-200 px-1 py-0.5 rounded">employee.sales1@atomberg.com</code>
        </p>
        <p className="text-[10px] text-slate-400 font-medium mt-2">All passwords are: <code className="bg-slate-200 px-1 py-0.5 rounded">demo123</code></p>
      </div>
    </div>
  )
}
