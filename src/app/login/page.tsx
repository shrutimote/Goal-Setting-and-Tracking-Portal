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
          position: relative !important;
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 20px !important; /* Increased to 20px */
          box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 24px 48px rgba(99,102,241,0.06) !important; /* Softer layered shadow */
          padding: 40px 32px !important;
          width: 100% !important;
          max-width: 400px !important;
          overflow: hidden !important; /* Keeps top accent bar perfectly flush */
          transition: all 0.3s ease;
        }
        .login-accent-bar {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 3px !important;
          background: linear-gradient(90deg, #6366f1, #818cf8) !important;
        }
        .login-input {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
          border: 1.5px solid #e2e8f0 !important; /* 1.5px solid #e2e8f0 */
          border-radius: 10px !important; /* 10px */
          background-color: #fafbfc !important; /* Soft inset feel */
          color: #0f172a !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
          outline: none !important;
        }
        .login-input:focus {
          border-color: #6366f1 !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important;
        }
        .login-input:hover {
          border-color: #cbd5e1 !important;
        }
        .field-label {
          display: block !important;
          font-size: 10px !important; /* 10px */
          font-weight: 600 !important; /* 600 weight */
          text-transform: uppercase !important; /* Small caps */
          letter-spacing: 0.06em !important; /* 0.06em tracking */
          color: #475569 !important; /* Color: #475569 */
          margin-bottom: 6px !important;
        }
        .login-btn-dark {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          background-color: #0f172a !important;
          color: #ffffff !important;
          border-radius: 10px !important; /* Increased to 10px */
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
          background-color: #fafbfc !important; /* Soft bg to match inputs */
          color: #334155 !important;
          border: 1.5px solid #e2e8f0 !important; /* 1.5px solid */
          border-radius: 10px !important; /* 10px */
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
          border-color: #cbd5e1 !important;
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
        {/* Thin Branded Accent Bar at the absolute top flush edge */}
        <div className="login-accent-bar" />

        {/* Centered Header block - Redesigned Hierarchy */}
        <div className="flex flex-col items-center justify-center mb-5 text-center">
          {/* logo & brand name */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">GoalPortal</span>
          </div>
          
          {/* Welcome back heading */}
          <h2 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h2>

          {/* tagline */}
          <p className="text-xs font-semibold text-slate-500 mb-1">
            Empowering Every Step of Your Journey
          </p>

          {/* subtext */}
          <p className="text-[11px] text-slate-400">
            Sign in to manage your executive dashboard
          </p>
        </div>

        {/* Separation Divider Rule */}
        <hr className="w-full border-t border-slate-100 my-5" style={{ borderTop: '1px solid #f1f5f9' }} />

        {error && (
          <div className="flex items-center justify-center p-3 mb-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Address form field */}
          <div>
            <label className="field-label">
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
              <label className="field-label" style={{ marginBottom: 0 }}>
                Password
              </label>
              <a 
                href="#" 
                className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wider"
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
