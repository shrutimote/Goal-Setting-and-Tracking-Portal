"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { GoalHealthCard } from '@/components/GoalHealthCard'
import { WhatIfSimulator } from '@/components/WhatIfSimulator'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    try {
      const res = await fetch(`/api/goals?userId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setGoals(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">My Goals</h2>
          <p className="text-muted-foreground">Manage your performance objectives and track progress.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = '/employee/new-goal'}
        >
          + Add New Goal
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Goals</h3>
          <p className="text-3xl font-bold">{goals.length}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Weightage</h3>
          <p className="text-3xl font-bold">{goals.reduce((acc, g: any) => acc + g.weightage, 0)}%</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Status</h3>
          <p className="text-3xl font-bold text-accent">Draft</p>
        </div>
      </div>

      <WhatIfSimulator goals={goals} />

      <h3 className="text-lg font-semibold mb-4">Goal Health Tracker</h3>
      {isLoading ? (
        <p>Loading goals...</p>
      ) : goals.length === 0 ? (
        <div className="text-center py-8 card">
          <p className="text-muted-foreground mb-4">You haven't set any goals yet.</p>
          <button className="btn btn-outline" onClick={() => window.location.href = '/employee/new-goal'}>Create First Goal</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {goals.map((goal: any) => (
            <GoalHealthCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
