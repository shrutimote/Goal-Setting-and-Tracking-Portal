"use client"

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Target, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const { signup, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Sales'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('') // Clear error on typing
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Inline Validations
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.department) {
      setError('All fields are required.')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      department: formData.department
    })
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="card w-full" style={{ maxWidth: '480px' }}>
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shadow-inner mb-2 border border-indigo-100">
            <UserPlus className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create your account</h1>
          <p className="text-sm text-slate-500 font-medium">Join the Goal Setting & Tracking Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm font-semibold text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup} className="flex flex-col gap-5 mb-8">
          <div>
            <label className="label">Full Name</label>
            <input 
              type="text" 
              name="name"
              className="input" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              name="email"
              className="input" 
              placeholder="name@company.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  className="input pr-10" 
                  placeholder="Min. 8 chars" 
                  value={formData.password}
                  onChange={handleChange}
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
            <div>
              <label className="label">Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword"
                className="input" 
                placeholder="Match password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Department</label>
            <select 
              name="department"
              className="input bg-white" 
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full py-3 mt-4 text-base shadow-indigo-500/30">
            Register as Employee
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-600">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
