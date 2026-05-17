"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/demo-users'

export type { User } from '@/lib/demo-users'
export { DEMO_USERS } from '@/lib/demo-users'

type AuthContextType = {
  user: User | null
  loginUser: (userData: User) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
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

  const loginUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem('secureUser', JSON.stringify(userData))
    handleRoleRedirect(userData.role)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('secureUser')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, isLoading }}>
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
