"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, UserCircle, Target, CheckCircle2, Clock, AlertTriangle, Check } from 'lucide-react'
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

  return (
    <DashboardLayout>
      {/* Header and Back Button */}
      <div className="mb-8">
        <button 
          onClick={() => router.push('/manager')} 
          className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Team Grid
        </button>
        
        <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{employee.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                {employee.role}
              </span>
              <span className="text-sm font-medium text-slate-500">{employee.department} Department</span>
            </div>
          </div>
        </div>
      </div>

      {!isCycleActive ? (
        <div className="flex flex-col items-center justify-center py-16 card text-center border-dashed bg-slate-50/50">
          <AlertTriangle className="w-16 h-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-1">No Active Performance Cycle</h3>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            There is currently no active cycle configured. Contact HR Administration to unlock this view.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Strip */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-slate-500 font-semibold">Active Goals</h3>
                <Target className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-3xl font-bold text-slate-800">{totalGoals}</p>
            </div>
            <div className="card border-green-200 bg-green-50/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-green-700 font-semibold">Completed</h3>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            </div>
            <div className="card border-blue-200 bg-blue-50/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-blue-700 font-semibold">In Progress</h3>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
            </div>
            <div className="card border-amber-200 bg-amber-50/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-amber-700 font-semibold">Pending Approval</h3>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            </div>
          </div>

          {/* Goals List */}
          <h3 className="text-lg font-bold text-slate-800 mb-4">Goal Portfolio</h3>
          {totalGoals === 0 ? (
            <div className="card text-center py-12 border-dashed">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No goals have been set for this employee in this cycle yet.</p>
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
