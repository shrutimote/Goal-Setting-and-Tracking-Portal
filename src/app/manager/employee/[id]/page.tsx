"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Target, CheckCircle2, Clock, AlertTriangle, Check } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { formatLocalDate } from '@/lib/date-utils'
import { getGoalProgress, addNotification } from '@/lib/notifications'

export default function EmployeeGoalDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { user: currentUser, activeCycle } = useAuth()
  const [employee, setEmployee] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApprovingMap, setIsApprovingMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (id) {
      fetchEmployeeData()
    }
  }, [id])

  const fetchEmployeeData = async () => {
    try {
      const res = await fetch(`/api/users/${id}`)
      if (res.ok) {
        const data = await res.json()
        setEmployee(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveGoal = async (goalId: string, goalTitle: string) => {
    setIsApprovingMap(prev => ({ ...prev, [goalId]: true }))
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      })
      if (res.ok) {
        // Create unread client notification for employee
        addNotification(
          employee.id,
          goalTitle,
          'Your goal has been approved — you can now begin working on it.'
        )
        // Refresh data
        await fetchEmployeeData()
      } else {
        alert('Failed to approve goal')
      }
    } catch (e) {
      console.error(e)
      alert('An error occurred during goal approval')
    } finally {
      setIsApprovingMap(prev => ({ ...prev, [goalId]: false }))
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500 font-medium animate-pulse">Loading employee data...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
          <button onClick={() => router.push('/manager')} className="btn btn-outline mt-4">
            Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const isCycleActive = activeCycle && activeCycle !== 'NONE'

  // Filter and enrich employee goals matching the active cycle
  const filteredGoals = (employee.goals || []).filter((goal: any) => {
    const goalCycle = goal.parentId || 'GOAL_SETTING'
    return goalCycle === activeCycle
  })

  const enrichedGoals = filteredGoals.map((goal: any) => {
    const seed = goal.id.length
    // Retrieve progress percentage dynamically from localStorage first, fallback to mock seed
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

    // Format target value or due date safely using formatLocalDate if UOM is TIMELINE
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
  const completedCount = enrichedGoals.filter((g: any) => g.uiStatus === 'Completed').length
  const inProgressCount = enrichedGoals.filter((g: any) => g.uiStatus === 'In Progress').length
  const pendingCount = enrichedGoals.filter((g: any) => g.uiStatus === 'Pending Approval').length

  // Derive initials for profile card
  const initials = employee.name.split(' ').map((n: any) => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <DashboardLayout>
      {/* Stylesheet for hover controls */}
      <style dangerouslySetInnerHTML={{ __html: `
        .back-link:hover {
          color: #4f46e5 !important;
        }
        .employee-stat-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important; /* Issue 1: horizontal 4-column */
          gap: 14px !important;
          margin-bottom: 32px !important;
        }
        .employee-stat-card {
          position: relative !important;
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 20px !important;
          overflow: hidden !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.01) !important;
          box-sizing: border-box !important;
        }
        .employee-stat-bar {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 3px !important;
        }
        .employee-stat-label {
          font-size: 10px !important; /* Issue 1: Label style uppercase 10px */
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.07em !important;
          color: #94a3b8 !important;
          margin-bottom: 8px !important;
          margin-top: 4px !important;
        }
        .employee-stat-value {
          font-size: 28px !important; /* Issue 1: Value style 28px bold */
          font-weight: 700 !important;
          color: #0f172a !important;
          margin: 0 !important;
          line-height: 1.25 !important;
        }
      `}} />

      {/* Header and Back Button */}
      <div className="mb-6">
        
        {/* Issue 3: Back Button styled as clean text link with ArrowLeft */}
        <button 
          onClick={() => router.push('/manager')} 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 500,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: 0,
            outline: 'none',
            transition: 'color 0.2s ease',
            marginBottom: '16px'
          }}
          className="back-link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Grid
        </button>
        
        {/* Issue 2: Employee profile header card */}
        <div 
          style={{ 
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '14px', 
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
          }}
        >
          {/* Large Initials circle */}
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: '#eef2ff', 
              color: '#4f46e5', 
              border: '1px solid #c7d2fe',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 700, 
              fontSize: '16px',
              flexShrink: 0
            }}
          >
            {initials}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
              {employee.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              {/* Role pill badge */}
              <span 
                style={{ 
                  backgroundColor: '#eef2ff', 
                  color: '#4f46e5', 
                  border: '1px solid #c7d2fe', 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  padding: '2px 8px', 
                  borderRadius: '999px',
                  display: 'inline-block'
                }}
              >
                {employee.role}
              </span>
              
              {/* Department Text */}
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                {employee.department} Department
              </span>
            </div>
          </div>
        </div>
      </div>

      {!isCycleActive ? (
        <div className="flex flex-col items-center justify-center py-16 text-center" style={{ backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '14px' }}>
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Active Performance Cycle</h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            There is currently no active cycle configured. Contact HR Administration to unlock this view.
          </p>
        </div>
      ) : (
        <>
          {/* Issue 1: Stat cards redesigned into a horizontal 4-column grid */}
          <div className="employee-stat-grid">
            
            {/* Active Goals Card */}
            <div className="employee-stat-card">
              <div className="employee-stat-bar" style={{ backgroundColor: '#4f46e5' }} />
              <h3 className="employee-stat-label">Active Goals</h3>
              <p className="employee-stat-value">{totalGoals}</p>
            </div>

            {/* Completed Card */}
            <div className="employee-stat-card">
              <div className="employee-stat-bar" style={{ backgroundColor: '#16a34a' }} />
              <h3 className="employee-stat-label">Completed</h3>
              <p className="employee-stat-value">{completedCount}</p>
            </div>

            {/* In Progress Card */}
            <div className="employee-stat-card">
              <div className="employee-stat-bar" style={{ backgroundColor: '#d97706' }} />
              <h3 className="employee-stat-label">In Progress</h3>
              <p className="employee-stat-value">{inProgressCount}</p>
            </div>

            {/* Pending Approval Card */}
            <div className="employee-stat-card">
              <div className="employee-stat-bar" style={{ backgroundColor: '#e11d48' }} />
              <h3 className="employee-stat-label">Pending Approval</h3>
              <p className="employee-stat-value">{pendingCount}</p>
            </div>
          </div>

          {/* Goals List */}
          {/* Issue 6: Section title styled consistently with Team Health Grid */}
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
            Goal Portfolio
          </h3>
          
          {totalGoals === 0 ? (
            
            /* Issue 4: Goal Portfolio empty state card redesigned */
            <div 
              style={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '14px', 
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.01)'
              }}
            >
              <Target className="w-10 h-10 text-[#c7d2fe] mb-3" />
              <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, margin: 0, textAlign: 'center' }}>
                No goals have been set for this employee in this cycle yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {enrichedGoals.map((goal: any) => (
                <div key={goal.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-slate-800">{goal.title}</h4>
                        {goal.uiStatus === 'Completed' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">Completed</span>}
                        {goal.uiStatus === 'In Progress' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">In Progress</span>}
                        {goal.uiStatus === 'Not Started' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">Not Started</span>}
                        {goal.uiStatus === 'Overdue' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wide">Overdue</span>}
                        {goal.uiStatus === 'Pending Approval' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide animate-pulse">Pending Approval</span>}
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{goal.description}</p>
                      
                      <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          <span>Thrust Area: <strong className="text-slate-700">{goal.thrustArea}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>UoM: <strong className="text-slate-700">{goal.uom}</strong></span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions and Progress Rings */}
                    <div className="w-64 ml-6 flex flex-col items-end gap-3">
                      {goal.uiStatus === 'Pending Approval' ? (
                        <div className="flex flex-col gap-2 items-end">
                          <span className="text-xs text-amber-600 font-semibold italic">Awaiting manager approval</span>
                          <button 
                            onClick={() => handleApproveGoal(goal.id, goal.title)}
                            disabled={isApprovingMap[goal.id]}
                            className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                          >
                            <Check className="w-4 h-4" />
                            {isApprovingMap[goal.id] ? 'Approving...' : 'Approve Goal'}
                          </button>
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex justify-between w-full mb-1">
                            <span className="text-xs font-bold text-slate-700">Progress</span>
                            <span className="text-xs font-bold text-indigo-600">{goal.progress}%</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                goal.uiStatus === 'Completed' ? 'bg-green-500' : 
                                goal.isOverdue ? 'bg-rose-500' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 text-right">Target Value: {goal.formattedTarget}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
