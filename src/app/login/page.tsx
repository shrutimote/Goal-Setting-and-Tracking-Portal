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
      {/* Custom Premium Styles embedded directly to prevent any Tailwind conflict or outline leaks */}
      <style>{`
        .login-card {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 16px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 16px -8px rgba(0, 0, 0, 0.05) !important;
          padding: 40px 32px !important;
          width: 100% !important;
          max-width: 400px !important;
          transition: all 0.3s ease;
        }
        .login-input {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px !important;
          background-color: #ffffff !important;
          color: #0f172a !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
          outline: none !important;
        }
        .login-input:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
        }
        .login-input:hover {
          border-color: #94a3b8 !important;
        }
        .login-btn-dark {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          background-color: #0f172a !important;
          color: #ffffff !important;
          border-radius: 8px !important;
          border: none !important;
          cursor: pointer !important;
          transition: background-color 0.2s ease, transform 0.1s ease !important;
          outline: none !important;
        }
        .login-btn-dark:hover {
          background-color: #1e293b !important;
        }
        .login-btn-dark:active {
          transform: scale(0.98) !important;
        }
        .login-btn-sso {
          width: 100% !important;
          padding: 10px 16px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          background-color: #ffffff !important;
          color: #334155 !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: background-color 0.2s ease, border-color 0.2s ease !important;
          outline: none !important;
        }
        .login-btn-sso:hover {
          background-color: #f8fafc !important;
          border-color: #94a3b8 !important;
        }
        .password-toggle-btn {
          position: absolute !important;
          right: 12px !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          background: none !important;
          border: none !important;
          color: #94a3b8 !important;
          cursor: pointer !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          outline: none !important;
        }
        .password-toggle-btn:hover {
          color: #6366f1 !important;
        }
        .divider-container {
          position: relative !important;
          margin: 24px 0 !important;
          text-align: center !important;
        }
        .divider-line {
          position: absolute !important;
          inset: 0 !important;
          display: flex !important;
          align-items: center !important;
        }
        .divider-text-wrapper {
          position: relative !important;
          display: flex !important;
          justify-content: center !important;
          font-size: 10px !important;
          text-transform: uppercase !important;
          font-weight: 700 !important;
          letter-spacing: 0.05em !important;
        }
      `}</style>

      {/* Main Login Card Wrapper */}
      <div className="login-card">
        {/* Centered Header block */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">GoalPortal</h1>
          </div>
          
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
          {/* Email Address form field */}
          <div>
            <label className="label text-slate-700 font-semibold mb-1.5 block text-xs tracking-wide">
              Email Address
            </label>
            <input 
              type="email" 
              className="login-input" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password form field with Forgot Password on the same line */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label text-slate-700 font-semibold block text-xs tracking-wide">
                Password
              </label>
              <a 
                href="#" 
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="login-input" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Log In Button - Solid Dark Button */}
          <button type="submit" className="login-btn-dark">
            Log In
          </button>
        </form>

        {/* OR Divider Line */}
        <div className="divider-container">
          <div className="divider-line">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="divider-text-wrapper">
            <span className="bg-white px-2 text-slate-400">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Single Sign-On Outlined Button with Shield Icon */}
        <button type="button" className="login-btn-sso">
          <Shield className="w-4 h-4 text-slate-400" />
          Single Sign-On (SSO)
        </button>
      </div>

      {/* Muted Sub-text Below the Card */}
      <p className="text-[11px] text-slate-400 mt-6 text-center font-medium tracking-wide">
        Don't have an account? <span className="text-slate-500 font-semibold">Contact your manager.</span>
      </p>
    </div>
  )
}
