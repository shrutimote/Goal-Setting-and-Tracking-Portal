"use client"

import { useAuth, DEMO_USERS } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Eye, EyeOff, Target, Shield } from 'lucide-react'

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
      setError('Invalid credentials')
    }
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Login Card - Minimal Elevated Card with White Background */}
      <div 
        className="w-full" 
        style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', 
          padding: '32px', 
          maxWidth: '400px' 
        }}
      >
        {/* Top Header Section */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">GoalPortal</h1>
          </div>
          
          {/* Tagline & Subheading centered in correct weights */}
          <p className="text-sm font-semibold text-slate-600 mb-1.5">
            Empowering Every Step of Your Journey
          </p>
          <p className="text-xs text-slate-400">
            Sign in to manage your executive dashboard
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-center p-3 mb-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Address input field */}
          <div>
            <label className="label text-slate-700 font-semibold mb-1.5 block text-xs tracking-wide">
              Email Address
            </label>
            <input 
              type="email" 
              className="input w-full border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 text-sm transition-colors text-slate-800" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field with Forgot Password on the right */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label text-slate-700 font-semibold block text-xs tracking-wide">
                Password
              </label>
              <a 
                href="#" 
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="input w-full border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 pr-10 text-sm transition-colors text-slate-800" 
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
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Log In Button - Solid Dark Button */}
          <button 
            type="submit" 
            className="w-full py-3 mt-2 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            Log In
          </button>
        </form>

        {/* OR Divider section */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
            <span className="bg-white px-2 text-slate-400">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* SSO Outlined Button with Shield Icon */}
        <button 
          type="button" 
          className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none"
        >
          <Shield className="w-4 h-4 text-slate-500" />
          Single Sign-On (SSO)
        </button>
      </div>

      {/* Muted Text Centered Below the Card */}
      <p className="text-[11px] text-slate-400 mt-6 text-center font-medium tracking-wide">
        Don't have an account? <span className="text-slate-500 font-semibold">Contact your manager.</span>
      </p>
    </div>
  )
}
