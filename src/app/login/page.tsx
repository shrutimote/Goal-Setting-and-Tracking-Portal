"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Target } from 'lucide-react'

export default function LoginPage() {
  const { user, login, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'EMPLOYEE') router.push('/employee')
      else if (user.role === 'MANAGER') router.push('/manager')
      else if (user.role === 'ADMIN') router.push('/admin')
    }
  }, [user, isLoading, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
  }

  const demoLogin = (role: string) => {
    if (role === 'admin') login('admin@atomberg.com', 'admin123')
    if (role === 'manager') login('manager@atomberg.com', 'manager123')
    if (role === 'employee') login('employee@atomberg.com', 'employee123')
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="card w-full mb-8" style={{ maxWidth: '420px' }}>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Target className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">GoalPortal</h1>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5 mb-8">
          <div>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input pr-10" 
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
          <button type="submit" className="btn btn-primary w-full py-3 mt-2 text-base shadow-indigo-500/30">Sign In</button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600">
            Don't have an account? <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      <div className="card w-full bg-slate-50 border-dashed" style={{ maxWidth: '420px' }}>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-4">Quick Demo Login</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => demoLogin('employee')} className="btn btn-outline text-xs py-2">Demo Employee</button>
          <button onClick={() => demoLogin('manager')} className="btn btn-outline text-xs py-2">Demo Manager</button>
          <button onClick={() => demoLogin('admin')} className="btn btn-outline text-xs py-2">Demo Admin (HR)</button>
        </div>
      </div>
    </div>
  )
}
