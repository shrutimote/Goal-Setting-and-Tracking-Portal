"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { GoalHealthCard } from '@/components/GoalHealthCard'
import { WhatIfSimulator } from '@/components/WhatIfSimulator'
import { AlertTriangle, Target } from 'lucide-react'
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

  // Determine accent bar color dynamically for Issue 1 Status card
  const statusAccentColor = statusText === 'Awaiting approvals' ? '#d97706' : '#16a34a'

  return (
    <DashboardLayout>
      
      {/* Header section with brand colored primary add button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Dashboard</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage your performance objectives and track progress.</p>
        </div>
        
        {/* Issue 4: + Add New Goal button styled cleanly to match primary login page actions */}
        <button 
          className="transition-all"
          style={{ 
            backgroundColor: isCycleActive ? '#4f46e5' : '#e2e8f0', 
            color: isCycleActive ? '#ffffff' : '#94a3b8', 
            borderRadius: '10px', 
            fontSize: '13px', 
            fontWeight: 600, 
            padding: '10px 18px',
            border: 'none',
            cursor: isCycleActive ? 'pointer' : 'not-allowed',
            boxShadow: isCycleActive ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none'
          }}
          onClick={() => {
            if (isCycleActive) window.location.href = '/employee/new-goal'
          }}
          disabled={!isCycleActive}
        >
          + Add New Goal
        </button>
      </div>

      {!isCycleActive ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" style={{ backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '14px' }}>
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Active Performance Cycle</h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            There is currently no active performance cycle configured for check-ins or submissions. Contact your manager or HR Administration.
          </p>
        </div>
      ) : (
        <>
          {/* Issue 1: Stat Cards polished with top accented color bar */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            
            {/* Total Goals Card */}
            <div 
              className="flex flex-col relative overflow-hidden" 
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '14px', 
                padding: '20px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '3px', backgroundColor: '#4f46e5' }} />
              <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '8px', marginTop: '4px' }}>
                Total Goals
              </h3>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {totalGoals}
              </p>
            </div>

            {/* Total Weightage Card */}
            <div 
              className="flex flex-col relative overflow-hidden" 
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '14px', 
                padding: '20px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '3px', backgroundColor: '#7c3aed' }} />
              <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '8px', marginTop: '4px' }}>
                Total Weightage
              </h3>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {totalWeightage}%
              </p>
            </div>

            {/* Status Card */}
            <div 
              className="flex flex-col relative overflow-hidden" 
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '14px', 
                padding: '20px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '3px', backgroundColor: statusAccentColor }} />
              <h3 style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8', marginBottom: '12px', marginTop: '4px' }}>
                Status
              </h3>
              <div className="flex items-center">
                {statusText === 'Drafting open' ? (
                  <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '999px', display: 'inline-block' }}>
                    Drafting open
                  </span>
                ) : statusText === 'Awaiting approvals' ? (
                  <span style={{ backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '999px', display: 'inline-block' }}>
                    Awaiting approvals
                  </span>
                ) : (
                  <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '999px', display: 'inline-block' }}>
                    Lock & Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <WhatIfSimulator goals={enrichedGoals} />

          {/* Issue 6: Section titles consistent styling */}
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', marginTop: '32px' }}>
            Goal Health Tracker
          </h3>
          
          {isLoading ? (
            <p className="text-slate-500 font-medium">Loading goals...</p>
          ) : enrichedGoals.length === 0 ? (
            
            <div 
              className="text-center py-12 flex flex-col items-center justify-center"
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '14px', 
                padding: '40px 24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.01)' 
              }}
            >
              <Target className="w-8 h-8 text-slate-300 mb-3" />
              <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, marginBottom: '16px' }}>
                You haven't set any goals for this cycle yet.
              </p>
              
              <button 
                className="empty-state-btn"
                style={{ 
                  backgroundColor: 'transparent',
                  border: '1.5px solid #e2e8f0', 
                  borderRadius: '8px', 
                  color: '#475569', 
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }} 
                onClick={() => window.location.href = '/employee/new-goal'}
              >
                Create First Goal
              </button>
              
              <style dangerouslySetInnerHTML={{ __html: `
                .empty-state-btn:hover {
                  border-color: #94a3b8 !important;
                  color: #0f172a !important;
                  background-color: #f8fafc !important;
                }
              `}} />
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
