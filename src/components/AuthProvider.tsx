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

export const DEMO_USERS: (User & { password?: string })[] = [
  {
    id: 'admin-id',
    name: 'Global Admin',
    email: 'admin@atomberg.com',
    password: 'demo123',
    role: 'ADMIN',
    department: 'HR',
    managerId: null
  },
  {
    id: 'manager-sales-id',
    name: 'Sarah (Sales Manager)',
    email: 'manager.sales@atomberg.com',
    password: 'demo123',
    role: 'MANAGER',
    department: 'Sales',
    managerId: null
  },
  {
    id: 'manager-eng-id',
    name: 'Erica (Eng Manager)',
    email: 'manager.eng@atomberg.com',
    password: 'demo123',
    role: 'MANAGER',
    department: 'Engineering',
    managerId: null
  },
  {
    id: 'manager-ops-id',
    name: 'Oscar (Ops Manager)',
    email: 'manager.ops@atomberg.com',
    password: 'demo123',
    role: 'MANAGER',
    department: 'Operations',
    managerId: null
  },
  {
    id: 'employee-sales1-id',
    name: 'Alice (AE)',
    email: 'employee.sales1@atomberg.com',
    password: 'demo123',
    role: 'EMPLOYEE',
    department: 'Sales',
    managerId: 'manager-sales-id'
  },
  {
    id: 'employee-sales2-id',
    name: 'Alex (SDR)',
    email: 'employee.sales2@atomberg.com',
    password: 'demo123',
    role: 'EMPLOYEE',
    department: 'Sales',
    managerId: 'manager-sales-id'
  },
  {
    id: 'employee-eng1-id',
    name: 'Bob (Frontend)',
    email: 'employee.eng1@atomberg.com',
    password: 'demo123',
    role: 'EMPLOYEE',
    department: 'Engineering',
    managerId: 'manager-eng-id'
  },
  {
    id: 'employee-eng2-id',
    name: 'Bella (Backend)',
    email: 'employee.eng2@atomberg.com',
    password: 'demo123',
    role: 'EMPLOYEE',
    department: 'Engineering',
    managerId: 'manager-eng-id'
  },
  {
    id: 'employee-ops1-id',
    name: 'Charlie (Logistics)',
    email: 'employee.ops1@atomberg.com',
    password: 'demo123',
    role: 'EMPLOYEE',
    department: 'Operations',
    managerId: 'manager-ops-id'
  }
]

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
