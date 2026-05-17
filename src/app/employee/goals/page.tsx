"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { Target, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatLocalDate } from '@/lib/date-utils'
import { getGoalProgress, setGoalProgress } from '@/lib/notifications'

export default function EmployeeGoalsPage() {
  const { user, activeCycle } = useAuth()
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [localProgressMap, setLocalProgressMap] = useState<Record<string, number>>({})

  const fetchGoals = async () => {
    try {
      const res = await fetch(`/api/goals?userId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setGoals(data)
        
        // Initialize local progress map for UI state
        const initialMap: Record<string, number> = {}
        data.forEach((g: any) => {
          const seed = g.id.length
          const defaultProgress = seed % 10 === 0 ? 100 : (seed * 7) % 100
          initialMap[g.id] = getGoalProgress(g.id, defaultProgress)
        })
        setLocalProgressMap(initialMap)
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

  const handleSliderChange = (goalId: string, value: number) => {
    setLocalProgressMap(prev => ({ ...prev, [goalId]: value }))
    setGoalProgress(goalId, value)
  }

  const isCycleActive = activeCycle && activeCycle !== 'NONE'

  // Filter goals matching active cycle
  const filteredGoals = goals.filter((goal: any) => {
    const goalCycle = goal.parentId || 'GOAL_SETTING'
    return goalCycle === activeCycle
  })

  // Enrich goals with state
  const enrichedGoals = filteredGoals.map((goal: any) => {
    const progress = localProgressMap[goal.id] !== undefined ? localProgressMap[goal.id] : 0
    
    let uiStatus = 'In Progress'
    if (goal.status === 'SUBMITTED') {
      uiStatus = 'Pending Approval'
    } else if (progress === 0) {
      uiStatus = 'Not Started'
    } else if (progress === 100) {
      uiStatus = 'Completed'
    }

    const seed = goal.id.length
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Goal Portfolio</h2>
        <p className="text-muted-foreground">List of all active goals. Review status and log progress achievements.</p>
      </div>

      {!isCycleActive ? (
        <div className="flex flex-col items-center justify-center py-16 card text-center border-dashed bg-slate-50/50">
          <AlertTriangle className="w-16 h-16 text-slate-400 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-700 mb-1">No Active Performance Cycle</h3>
          <p className="text-sm text-slate-500 max-w-md leading-relaxed">
            There is currently no active performance cycle configured. Contact your manager or HR Administration to unlock.
          </p>
        </div>
      ) : enrichedGoals.length === 0 ? (
        <div className="card text-center py-16 border-dashed">
          <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No Goals in this Cycle</h3>
          <p className="text-sm text-slate-500 mb-6">You haven't added or been assigned any goals for this cycle yet.</p>
          <button 
            className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-500/20"
            onClick={() => window.location.href = '/employee/new-goal'}
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {enrichedGoals.map((goal) => {
            const isPending = goal.status === 'SUBMITTED'

            return (
              <div key={goal.id} className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  {/* Goal Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-800">{goal.title}</h3>
                      {goal.uiStatus === 'Completed' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">Completed</span>}
                      {goal.uiStatus === 'In Progress' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">In Progress</span>}
                      {goal.uiStatus === 'Not Started' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wide">Not Started</span>}
                      {goal.uiStatus === 'Overdue' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wide">Overdue</span>}
                      {goal.uiStatus === 'Pending Approval' && <span className="px-2 py-1 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide animate-pulse">Pending Approval</span>}
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">Weight: {goal.weightage}%</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{goal.description}</p>
                    
                    <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Thrust Area: <strong className="text-slate-700">{goal.thrustArea}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>UOM: <strong className="text-slate-700">{goal.uom}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Progress Controller */}
                  <div className="w-full md:w-72 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3 shrink-0">
                    {isPending ? (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <AlertTriangle className="w-8 h-8 text-amber-500 mb-2 animate-pulse" />
                        <span className="text-xs text-amber-600 font-semibold italic">Awaiting manager approval</span>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">
                          This goal is locked. You can begin logging progress once it has been approved.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700">Update Progress</span>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                            {goal.progress}%
                          </span>
                        </div>
                        
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progress}
                          onChange={(e) => handleSliderChange(goal.id, Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />

                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                          <span>Target: {goal.formattedTarget}</span>
                          <span>{goal.progress === 100 ? '🎉 Goal Completed!' : 'Keep pushing!'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
