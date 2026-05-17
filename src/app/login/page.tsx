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
      {/* 
        Inject raw CSS using dangerouslySetInnerHTML to guarantee perfect injection
        across SSR, Turbopack, and HTML parser rendering boundaries.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        .login-card {
          position: relative !important;
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 20px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 24px 48px rgba(99,102,241,0.06) !important;
          padding: 40px 32px !important;
          width: 100% !important;
          max-width: 380px !important; /* Issue 6: Reduced to 380px */
          overflow: hidden !important; /* Issue 1: Keeps top accent bar perfectly flush */
          transition: all 0.3s ease;
          box-sizing: border-box !important;
        }
        .login-accent-bar {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 3px !important;
          background: linear-gradient(90deg, #6366f1, #818cf8) !important;
          z-index: 10 !important;
        }
        .login-heading {
          font-size: 22px !important; /* Issue 3: Welcome back 22px */
          font-weight: 700 !important;
          color: #0f172a !important;
          margin-top: 8px !important;
          margin-bottom: 4px !important;
        }
        .login-tagline {
          font-size: 12px !important; /* Issue 3: Tagline 12px */
          font-weight: 600 !important;
          color: #6366f1 !important; /* Indigo brand line */
          margin-bottom: 4px !important;
        }
        .login-subtext {
          font-size: 11px !important; /* Issue 3: Subtext 11px */
          color: #94a3b8 !important;
          font-weight: 400 !important;
          white-space: nowrap !important; /* Keep on a single line */
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        .login-input {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 10px !important;
          background-color: #fafbfc !important;
          color: #0f172a !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease !important;
          outline: none !important;
          box-sizing: border-box !important;
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
          font-size: 10px !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.06em !important;
          color: #475569 !important;
          margin-bottom: 6px !important;
        }
        .forgot-password-link {
          font-size: 11px !important; /* Issue 4: Link size 11px */
          font-weight: 500 !important;
          color: #94a3b8 !important; /* Soft subtle gray */
          text-transform: none !important; /* No uppercase */
          letter-spacing: normal !important; /* No letter spacing */
          text-decoration: none !important;
          transition: color 0.2s ease !important;
        }
        .forgot-password-link:hover {
          color: #6366f1 !important;
        }
        .password-input-wrapper {
          position: relative !important; /* Issue 5: Clean absolute relative boundaries */
          width: 100% !important;
        }
        .password-toggle-btn {
          position: absolute !important;
          right: 12px !important;
          top: 50% !important;
          transform: translateY(-50%) !important; /* Perfectly centered inside field */
          background: none !important;
          border: none !important;
          color: #94a3b8 !important;
          cursor: pointer !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          outline: none !important;
          z-index: 10 !important;
        }
        .password-toggle-btn:hover {
          color: #6366f1 !important;
        }
        .login-btn-dark {
          width: 100% !important;
          padding: 12px 16px !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          background-color: #0f172a !important;
          color: #ffffff !important;
          border-radius: 10px !important;
          border: none !important;
          cursor: pointer !important;
          transition: background-color 0.2s ease, transform 0.1s ease !important;
          outline: none !important;
          box-sizing: border-box !important;
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
          background-color: #fafbfc !important;
          color: #334155 !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: background-color 0.2s ease, border-color 0.2s ease !important;
          outline: none !important;
          box-sizing: border-box !important;
        }
        .login-btn-sso:hover {
          background-color: #f8fafc !important;
          border-color: #cbd5e1 !important;
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
      `}} />

      {/* Main Login Card Wrapper */}
      <div className="login-card">
        {/* Issue 2: Top Accent Bar positioned absolutely inside card */}
        <div className="login-accent-bar" />

        {/* Centered Header block */}
        <div className="flex flex-col items-center justify-center mb-5 text-center">
          {/* Logo Name & Icon */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">GoalPortal</span>
          </div>
          
          {/* Issue 3: Highly Calibrated Text Sizing & Colors */}
          <h2 className="login-heading">Welcome back</h2>
          <p className="login-tagline">Empowering Every Step of Your Journey</p>
          <p className="login-subtext">Sign in to manage your executive dashboard</p>
        </div>

        {/* Separator rule */}
        <hr className="w-full border-t border-slate-100 my-5" style={{ borderTop: '1px solid #f1f5f9' }} />

        {error && (
          <div className="flex items-center justify-center p-3 mb-6 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Address Form Field */}
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

          {/* Password Form Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="field-label" style={{ marginBottom: 0 }}>
                Password
              </label>
              {/* Issue 4: Quiet Link Aligned on Left/Right */}
              <a 
                href="#" 
                className="forgot-password-link"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password?
              </a>
            </div>
            {/* Issue 5: Position Relative Input Wrapper */}
            <div className="password-input-wrapper">
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

          {/* Log In Button */}
          <button type="submit" className="login-btn-dark">
            Log In
          </button>
        </form>

        {/* Divider Line */}
        <div className="divider-container">
          <div className="divider-line">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="divider-text-wrapper">
            <span className="bg-white px-2 text-slate-400">OR CONTINUE WITH</span>
          </div>
        </div>

        {/* Single Sign-On SSO Button */}
        <button type="button" className="login-btn-sso">
          <Shield className="w-4 h-4 text-slate-400" />
          Single Sign-On (SSO)
        </button>
      </div>

      {/* Muted Centered Plain Text Below the Card */}
      <p className="text-[11px] text-slate-400 mt-6 text-center font-medium tracking-wide">
        Don't have an account? <span className="text-slate-500 font-semibold">Contact your manager.</span>
      </p>
    </div>
  )
}
