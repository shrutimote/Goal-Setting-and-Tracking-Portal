"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, UserCircle, Target, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'

export default function EmployeeGoalDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [employee, setEmployee] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  // Calculate summary metrics based on mock progression data for the UI
  // Since real progress/due dates aren't in the DB yet, we dynamically generate consistent ones per goal based on ID length
  const enrichedGoals = (employee.goals || []).map((goal: any) => {
    const seed = goal.id.length
    const progress = seed % 10 === 0 ? 100 : (seed * 7) % 100
    let status = 'In Progress'
    if (progress === 0) status = 'Not Started'
    if (progress === 100) status = 'Completed'
    
    // Some overdue logic
    const isOverdue = progress < 100 && seed % 4 === 0
    if (isOverdue) status = 'Overdue'

    // Mock due date
    const date = new Date()
    date.setDate(date.getDate() + ((seed % 30) - 10)) // Between 10 days ago and 20 days in future

    return {
      ...goal,
      uiStatus: status,
      progress,
      dueDate: date.toLocaleDateString(),
      isOverdue
    }
  })

  const totalGoals = enrichedGoals.length
  const completedCount = enrichedGoals.filter((g: any) => g.uiStatus === 'Completed').length
  const inProgressCount = enrichedGoals.filter((g: any) => g.uiStatus === 'In Progress').length
  const overdueCount = enrichedGoals.filter((g: any) => g.isOverdue).length

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

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-slate-500">Total Goals</h3>
            <Target className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{totalGoals}</p>
        </div>
        <div className="card border-green-200 bg-green-50/50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-green-700">Completed</h3>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="card border-blue-200 bg-blue-50/50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-blue-700">In Progress</h3>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
        </div>
        <div className="card border-rose-200 bg-rose-50/50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-rose-700">Overdue</h3>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-bold text-rose-600">{overdueCount}</p>
        </div>
      </div>

      {/* Goals List */}
      <h3 className="text-lg font-bold text-slate-800 mb-4">Goal Portfolio</h3>
      {totalGoals === 0 ? (
        <div className="card text-center py-12 border-dashed">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No goals have been set for this employee yet.</p>
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
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{goal.description}</p>
                  
                  <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>Thrust Area: <strong className="text-slate-700">{goal.thrustArea}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className={goal.isOverdue ? 'text-rose-600 font-bold' : ''}>
                        Due: <strong className={goal.isOverdue ? 'text-rose-600' : 'text-slate-700'}>{goal.dueDate}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Ring / Bar Area */}
                <div className="w-48 ml-6 flex flex-col items-end">
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
                  <p className="text-[10px] text-slate-400 mt-2 text-right">Target: {goal.target} {goal.uom}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
