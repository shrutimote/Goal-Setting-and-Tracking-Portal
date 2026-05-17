"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { GoalHealthCard } from '@/components/GoalHealthCard'
import { WhatIfSimulator } from '@/components/WhatIfSimulator'
import { AlertTriangle } from 'lucide-react'
import { formatLocalDate } from '@/lib/date-utils'
import { getGoalProgress } from '@/lib/notifications'

export default function EmployeeDashboard() {
  const { user, activeCycle } = useAuth()
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const isCycleActive = activeCycle && activeCycle !== 'NONE'

  // Filter employee goals matching the active cycle
  const filteredGoals = goals.filter((goal: any) => {
    const goalCycle = goal.parentId || 'GOAL_SETTING'
    return goalCycle === activeCycle
  })

  // Enrich goals with persistent progress and timezone formatted dates
  const enrichedGoals = filteredGoals.map((goal: any) => {
    const seed = goal.id.length
    const defaultProgress = seed % 10 === 0 ? 100 : (seed * 7) % 100
    const progress = getGoalProgress(goal.id, defaultProgress)
    
    let uiStatus = 'In Progress'
    if (goal.status === 'SUBMITTED') {
      uiStatus = 'Pending Approval'
    } else if (progress === 0) {
      uiStatus = 'Not Started'
    } else if (progress === 100) {
      uiStatus = 'Completed'
    }

    const isOverdue = progress < 100 && seed % 4 === 0 && goal.status !== 'SUBMITTED'
    if (isOverdue) uiStatus = 'Overdue'

    // Secure local timezone-safe date parsing
    const formattedTarget = goal.uom === 'TIMELINE' ? formatLocalDate(goal.target) : goal.target

    return {
      ...goal,
      uiStatus,
      progress,
      formattedTarget,
      isOverdue
    }
  })

  const totalGoals = enrichedGoals.length
  const totalWeightage = enrichedGoals.reduce((acc, g: any) => acc + g.weightage, 0)
  const pendingCount = enrichedGoals.filter((g: any) => g.uiStatus === 'Pending Approval').length

  let statusText = 'Lock & Active'
  if (pendingCount > 0) statusText = 'Awaiting approvals'
  else if (totalGoals === 0) statusText = 'Drafting open'

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
          <p className="text-muted-foreground">Manage your performance objectives and track progress.</p>
        </div>
        <button 
          className={`btn font-bold transition-all shadow-md ${!isCycleActive ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-none shadow-none' : 'btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'}`}
          onClick={() => {
            if (isCycleActive) window.location.href = '/employee/new-goal'
          }}
          disabled={!isCycleActive}
        >
          + Add New Goal
        </button>
      </div>

      {!isCycleActive ? (
        <div className="flex flex-col items-center justify-center py-16 card text-center border-dashed bg-slate-50/50">
          <AlertTriangle className="w-16 h-16 text-slate-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-700 mb-1">No Active Performance Cycle</h3>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            There is currently no active performance cycle configured for check-ins or submissions. Contact your manager or HR Administration.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="card">
              <h3 className="text-sm font-medium text-slate-500 mb-2 font-semibold">Total Goals</h3>
              <p className="text-3xl font-bold text-slate-800">{totalGoals}</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-slate-500 mb-2 font-semibold">Total Weightage</h3>
              <p className="text-3xl font-bold text-slate-800">{totalWeightage}%</p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-slate-500 mb-2 font-semibold">Status</h3>
              <p className={`text-3xl font-bold ${pendingCount > 0 ? 'text-amber-500' : 'text-indigo-600'}`}>{statusText}</p>
            </div>
          </div>

          <WhatIfSimulator goals={enrichedGoals} />

          <h3 className="text-lg font-bold text-slate-800 mb-4 mt-8">Goal Health Tracker</h3>
          {isLoading ? (
            <p className="text-slate-500 font-medium">Loading goals...</p>
          ) : enrichedGoals.length === 0 ? (
            <div className="text-center py-12 card border-dashed">
              <p className="text-slate-500 font-medium mb-4">You haven't set any goals for this cycle yet.</p>
              <button 
                className="btn btn-outline border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold" 
                onClick={() => window.location.href = '/employee/new-goal'}
              >
                Create First Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {enrichedGoals.map((goal: any) => (
                <GoalHealthCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
