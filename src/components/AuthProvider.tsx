"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export type User = {
  id: string
  name: string
  email: string
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN'
  department: string | null
  managerId: string | null
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Note: In a real app, validate an httpOnly session cookie instead.
    const storedUser = localStorage.getItem('secureUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const handleRoleRedirect = (role: string) => {
    if (role === 'EMPLOYEE') router.push('/employee')
    if (role === 'MANAGER') router.push('/manager')
    if (role === 'ADMIN') router.push('/admin')
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setUser(data)
        localStorage.setItem('secureUser', JSON.stringify(data))
        handleRoleRedirect(data.role)
      } else {
        alert(data.error || 'Invalid credentials')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: any) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setUser(data)
        localStorage.setItem('secureUser', JSON.stringify(data))
        router.push('/employee')
      } else {
        alert(data.error || 'Signup failed')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('secureUser')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
