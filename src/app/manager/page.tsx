"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth, User } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { X, Send, CheckCircle2, AlertTriangle, Target } from 'lucide-react'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [team, setTeam] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Push Template Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [templateTitle, setTemplateTitle] = useState('')
  const [templateDesc, setTemplateDesc] = useState('')
  const [templateThrust, setTemplateThrust] = useState('Core KPI')
  const [templateUom, setTemplateUom] = useState('Percent')
  const [templateTarget, setTemplateTarget] = useState('100')
  const [templateWeightage, setTemplateWeightage] = useState('15')
  const [isPushing, setIsPushing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (user) {
      fetchTeam()
    }
  }, [user])

  const fetchTeam = async () => {
    try {
      const res = await fetch(`/api/users?managerId=${user?.id}`)
      if (res.ok) {
        const data = await res.json()
        setTeam(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePushTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setIsPushing(true)

    try {
      const res = await fetch(`/api/goals/template?managerId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: templateTitle,
          description: templateDesc,
          thrustArea: templateThrust,
          uom: templateUom,
          target: templateTarget,
          weightage: templateWeightage,
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMsg(`Goal successfully pushed to all ${data.pushedCount} team members!`)
        setIsModalOpen(false)
        // Reset fields
        setTemplateTitle('')
        setTemplateDesc('')
        setTemplateTarget('100')
        setTemplateWeightage('15')
      } else {
        setErrorMsg(data.error || 'Failed to push goal template')
      }
    } catch (err: any) {
      setErrorMsg('An error occurred. Please try again.')
    } finally {
      setIsPushing(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manager War Room</h2>
          <p className="text-muted-foreground">Real-time health overview of your entire team's goals.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 font-bold transition-all shadow-md shadow-indigo-500/20"
        >
          Push Goal Template
        </button>
      </div>

      {/* Dynamic Success Alert Banner */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="ml-auto text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Team Members</h3>
          <p className="text-3xl font-bold">{team.length}</p>
        </div>
        <div className="card border-green-200 bg-green-50">
          <h3 className="text-sm font-medium text-green-700 mb-2">On Track</h3>
          <p className="text-3xl font-bold text-green-600">85%</p>
        </div>
        <div className="card border-yellow-200 bg-yellow-50">
          <h3 className="text-sm font-medium text-yellow-700 mb-2">At Risk</h3>
          <p className="text-3xl font-bold text-yellow-600">2</p>
        </div>
        <div className="card border-red-200 bg-red-50">
          <h3 className="text-sm font-medium text-red-700 mb-2">Critical</h3>
          <p className="text-3xl font-bold text-red-600">0</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">Team Health Grid</h3>
      {isLoading ? (
        <p>Loading team data...</p>
      ) : team.length === 0 ? (
        <p className="text-muted-foreground py-4 card">No team members found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {team.map((member) => {
            // Mock a health status per member to showcase the War Room tile concept
            const randomHealth = Math.random()
            const healthStatus = randomHealth > 0.8 ? 'critical' : randomHealth > 0.5 ? 'warning' : 'healthy'
            
            let bgClass = 'bg-green-100 border-green-300'
            let textClass = 'text-green-800'
            let indicator = 'bg-green-500'
            
            if (healthStatus === 'critical') {
              bgClass = 'bg-red-100 border-red-300'
              textClass = 'text-red-800'
              indicator = 'bg-red-500'
            } else if (healthStatus === 'warning') {
              bgClass = 'bg-yellow-100 border-yellow-300'
              textClass = 'text-yellow-800'
              indicator = 'bg-yellow-500'
            }

            return (
              <div 
                key={member.id} 
                className={`card cursor-pointer border-2 transition-all hover:shadow-lg ${bgClass}`}
                onClick={() => window.location.href = `/manager/employee/${member.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className={`font-bold text-lg ${textClass}`}>{member.name}</h4>
                    <p className={`text-sm ${textClass} opacity-80`}>{member.department}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${indicator} animate-pulse`}></div>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-black/10">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-white/60 border border-black/10 flex items-center justify-center text-[10px]">1</div>
                    <div className="w-6 h-6 rounded-full bg-white/60 border border-black/10 flex items-center justify-center text-[10px]">2</div>
                    <div className="w-6 h-6 rounded-full bg-white/60 border border-black/10 flex items-center justify-center text-[10px]">3</div>
                  </div>
                  <span className={`text-sm font-semibold ${textClass}`}>
                    {healthStatus === 'healthy' ? 'On Track' : healthStatus === 'warning' ? 'Needs Review' : 'Off Track'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Push Goal Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-lg border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">Push Team Goal Template</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 mt-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePushTemplate} className="flex-1 overflow-y-auto py-4 flex flex-col gap-4">
              <div>
                <label className="label text-slate-700 font-semibold mb-1 block">Goal Title</label>
                <input 
                  type="text" 
                  className="input w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5" 
                  placeholder="e.g. Complete Q2 Security Training" 
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="label text-slate-700 font-semibold mb-1 block">Description</label>
                <textarea 
                  className="input w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 h-20 resize-none" 
                  placeholder="Provide context and key instructions..." 
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-slate-700 font-semibold mb-1 block">Thrust Area</label>
                  <input 
                    type="text" 
                    className="input w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5" 
                    value={templateThrust}
                    onChange={(e) => setTemplateThrust(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label text-slate-700 font-semibold mb-1 block">Unit of Measure</label>
                  <select 
                    className="input w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 bg-white"
                    value={templateUom}
                    onChange={(e) => setTemplateUom(e.target.value)}
                  >
                    <option value="Numeric">Numeric</option>
                    <option value="Percent">Percent</option>
                    <option value="Timeline">Timeline</option>
                    <option value="Zero-Based">Zero-Based</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-slate-700 font-semibold mb-1 block">Target</label>
                  <input 
                    type="text" 
                    className="input w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5" 
                    value={templateTarget}
                    onChange={(e) => setTemplateTarget(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label text-slate-700 font-semibold mb-1 block">Weightage (%)</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="100"
                    className="input w-full border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5" 
                    value={templateWeightage}
                    onChange={(e) => setTemplateWeightage(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3 mt-auto">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg flex-1 font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPushing}
                  className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex-1 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Send className="w-4 h-4" />
                  {isPushing ? 'Pushing...' : 'Push to Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
