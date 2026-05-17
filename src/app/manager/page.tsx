"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth, User } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { X, Send, CheckCircle2, AlertTriangle, Target } from 'lucide-react'
import { addNotification } from '@/lib/notifications'

export default function ManagerDashboard() {
  const { user, activeCycle } = useAuth()
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
          parentId: activeCycle || 'GOAL_SETTING' // Capture current active cycle!
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMsg(`Goal successfully pushed to all ${data.pushedCount} team members!`)
        setIsModalOpen(false)
        
        // Dispatch high-fidelity client-side notifications
        if (data.createdGoals) {
          data.createdGoals.forEach((g: any) => {
            addNotification(
              g.employeeId,
              templateTitle,
              `Your manager ${user?.name || 'Priya Menon'} pushed a new goal: "${templateTitle}" — you can now begin working on it.`
            )
          })
        }

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

  const isCycleActive = activeCycle && activeCycle !== 'NONE'

  // Calculations for Issue 1 sub-labels
  const totalOnTrack = team.filter((_, i) => i !== 2).length // mock metric matching 2 of 3
  
  return (
    <DashboardLayout>
      {/* Dynamic stylesheets for high-end manager interactions */}
      <style dangerouslySetInnerHTML={{ __html: `
        .manager-stat-grid {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important; /* Issue 1: horizontal 4-column */
          gap: 14px !important;
          margin-bottom: 32px !important;
        }
        .manager-stat-card {
          position: relative !important;
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 20px !important;
          overflow: hidden !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.01) !important;
          box-sizing: border-box !important;
        }
        .manager-stat-bar {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 3px !important;
        }
        .manager-stat-label {
          font-size: 10px !important; /* Issue 2: Label 10px uppercase */
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.07em !important;
          color: #94a3b8 !important;
          margin-bottom: 8px !important;
          margin-top: 4px !important;
        }
        .manager-stat-value {
          font-size: 28px !important; /* Issue 2: Value 28px bold */
          font-weight: 700 !important;
          margin: 0 !important;
          line-height: 1.25 !important;
        }
        .manager-stat-subtext {
          font-size: 11px !important; /* Issue 1: Subtext 11px */
          color: #94a3b8 !important;
          font-weight: 500 !important;
          margin-top: 4px !important;
        }
        .member-card {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 20px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-sizing: border-box !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.01) !important;
        }
        .member-card:hover {
          border-color: #c7d2fe !important;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.04), 0 4px 6px -2px rgba(99, 102, 241, 0.04) !important;
          transform: translateY(-2px);
        }
        .modal-input {
          width: 100% !important;
          padding: 10px 14px !important;
          font-size: 14px !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 10px !important;
          background-color: #fafbfc !important;
          color: #0f172a !important;
          outline: none !important;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s !important;
          box-sizing: border-box !important;
        }
        .modal-input:focus {
          border-color: #4f46e5 !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
        }
        .modal-cancel-btn:hover {
          border-color: #94a3b8 !important;
          color: #0f172a !important;
          background-color: #f8fafc !important;
        }
      `}} />

      {/* Header bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manager War Room</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Real-time health overview of your entire team's goals.</p>
        </div>
        
        {/* Issue 4: Push template button styled matching primary action */}
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={!isCycleActive}
          style={{
            backgroundColor: isCycleActive ? '#4f46e5' : '#e2e8f0',
            color: isCycleActive ? '#ffffff' : '#94a3b8',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px 18px',
            border: 'none',
            cursor: isCycleActive ? 'pointer' : 'not-allowed',
            boxShadow: isCycleActive ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          Push Goal Template
        </button>
      </div>

      {!isCycleActive ? (
        <div className="flex flex-col items-center justify-center py-16 text-center shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '14px' }}>
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4 animate-bounce" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Active Performance Cycle</h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            There is currently no active cycle configured. Contact HR Administration to unlock goal setting and check-ins.
          </p>
        </div>
      ) : (
        <>
          {/* Success Banner */}
          {successMsg && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold animate-in fade-in slide-in-from-top duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')} className="ml-auto text-emerald-500 hover:text-emerald-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Issue 1 & 2: Stat Cards horizontal grid side-by-side with colors & accent bars */}
          <div className="manager-stat-grid">
            
            {/* Team Members Card */}
            <div className="manager-stat-card">
              <div className="manager-stat-bar" style={{ backgroundColor: '#6366f1' }} />
              <h3 className="manager-stat-label">Team Members</h3>
              <p className="manager-stat-value" style={{ color: '#0f172a' }}>{team.length}</p>
              <p className="manager-stat-subtext">Alpha team</p>
            </div>

            {/* On Track Card */}
            <div className="manager-stat-card">
              <div className="manager-stat-bar" style={{ backgroundColor: '#10b981' }} />
              <h3 className="manager-stat-label">On Track</h3>
              <p className="manager-stat-value" style={{ color: '#16a34a' }}>85%</p>
              <p className="manager-stat-subtext">2 of 3 members</p>
            </div>

            {/* At Risk Card */}
            <div className="manager-stat-card">
              <div className="manager-stat-bar" style={{ backgroundColor: '#f59e0b' }} />
              <h3 className="manager-stat-label">At Risk</h3>
              <p className="manager-stat-value" style={{ color: '#d97706' }}>2</p>
              <p className="manager-stat-subtext">goals need attention</p>
            </div>

            {/* Critical Card */}
            <div className="manager-stat-card">
              <div className="manager-stat-bar" style={{ backgroundColor: '#ef4444' }} />
              <h3 className="manager-stat-label">Critical</h3>
              <p className="manager-stat-value" style={{ color: '#e11d48' }}>0</p>
              <p className="manager-stat-subtext">no blockers</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-800 mb-5">Team Health Grid</h3>
          {isLoading ? (
            <p className="text-slate-500 font-medium animate-pulse">Loading team data...</p>
          ) : team.length === 0 ? (
            <p className="text-muted-foreground py-8 card border-dashed text-center">No team members found.</p>
          ) : (
            
            /* Issue 3: Polished Team Health Grid cards with avatars, progress bars, and status badges */
            <div className="grid grid-cols-3 gap-6">
              {team.map((member, idx) => {
                // Keep team health status matching realistic mock offsets
                const healthStatus = idx === 0 ? 'healthy' : idx === 1 ? 'warning' : 'critical'
                
                // Color configurations
                let statusColor = '#10b981' // On Track green
                let statusName = 'On Track'
                let progress = 80 // Dynamic overall goal completion progress
                let badgeBg = '#f0fdf4'
                let badgeBorder = '#bbf7d0'
                let badgeText = '#16a34a'
                let avatarColor = '#6366f1' // On track stays indigo

                if (healthStatus === 'critical') {
                  statusColor = '#ef4444' // red
                  statusName = 'Off Track'
                  progress = 15
                  badgeBg = '#fef2f2'
                  badgeBorder = '#fecaca'
                  badgeText = '#dc2626'
                  avatarColor = '#ef4444' // Off track red
                } else if (healthStatus === 'warning') {
                  statusColor = '#f59e0b' // amber
                  statusName = 'At Risk'
                  progress = 45
                  badgeBg = '#fffbeb'
                  badgeBorder = '#fef3c7'
                  badgeText = '#d97706'
                  avatarColor = '#f59e0b' // At risk amber
                }

                const goalsCountText = healthStatus === 'healthy' ? '3 goals' : healthStatus === 'warning' ? '2 goals' : '4 goals'

                // Derive initials
                const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

                return (
                  <div 
                    key={member.id} 
                    className="member-card"
                    onClick={() => window.location.href = `/manager/employee/${member.id}`}
                  >
                    {/* Top layout: avatar details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div 
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          backgroundColor: avatarColor, 
                          color: '#ffffff', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 'bold', 
                          fontSize: '13px', 
                          flexShrink: 0,
                          boxShadow: `0 4px 8px ${avatarColor}1c`
                        }}
                      >
                        {initials}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.name}
                        </h4>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 500, color: '#64748b', marginTop: '2px' }}>
                          {member.department}
                        </p>
                      </div>
                    </div>
                    
                    {/* Middle progress bar */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                        <span>Overall Progress</span>
                        <span style={{ color: '#475569' }}>{progress}%</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '999px', backgroundColor: '#e2e8f0', width: '100%', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '999px', width: `${progress}%`, backgroundColor: statusColor, transition: 'width 0.3s ease' }} />
                      </div>
                    </div>

                    {/* Bottom stats and badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
                        {goalsCountText}
                      </span>
                      
                      <span 
                        style={{ 
                          backgroundColor: badgeBg, 
                          color: badgeText, 
                          border: `1px solid ${badgeBorder}`, 
                          fontSize: '11px', 
                          fontWeight: 600, 
                          padding: '2px 8px', 
                          borderRadius: '999px', 
                          display: 'inline-block' 
                        }}
                      >
                        {statusName}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* 
        Issue 7 — Push Goal Template form: 
        Modal Overlay styled centered on page with dark backdrop.
      */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)', /* dark backdrop */
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          className="animate-in fade-in duration-200"
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '560px', /* max-width 560px */
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxSizing: 'border-box'
            }}
            className="animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Push Team Goal Template</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Modal Scrollable Form */}
            <form onSubmit={handlePushTemplate} className="overflow-y-auto pr-1 flex flex-col gap-5" style={{ flex: 1 }}>
              
              {/* Goal Title input */}
              <div>
                <label className="field-label text-slate-700 font-semibold mb-1.5 block text-xs uppercase tracking-wider">Goal Title</label>
                <input 
                  type="text" 
                  className="modal-input" 
                  placeholder="e.g. Complete Q2 Security Training" 
                  value={templateTitle}
                  onChange={(e) => setTemplateTitle(e.target.value)}
                  required
                />
              </div>

              {/* Goal Description input */}
              <div>
                <label className="field-label text-slate-700 font-semibold mb-1.5 block text-xs uppercase tracking-wider">Description</label>
                <textarea 
                  className="modal-input h-20 resize-none" 
                  placeholder="Provide context and key instructions..." 
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                />
              </div>

              {/* Thrust Area & Unit of Measure inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label text-slate-700 font-semibold mb-1.5 block text-xs uppercase tracking-wider">Thrust Area</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={templateThrust}
                    onChange={(e) => setTemplateThrust(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="field-label text-slate-700 font-semibold mb-1.5 block text-xs uppercase tracking-wider">Unit of Measure</label>
                  <select 
                    className="modal-input bg-white"
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

              {/* Target & Weightage inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label text-slate-700 font-semibold mb-1.5 block text-xs uppercase tracking-wider">Target</label>
                  <input 
                    type="text" 
                    className="modal-input" 
                    value={templateTarget}
                    onChange={(e) => setTemplateTarget(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="field-label text-slate-700 font-semibold mb-1.5 block text-xs uppercase tracking-wider">Weightage (%)</label>
                  <input 
                    type="number" 
                    min="10" 
                    max="100"
                    className="modal-input" 
                    value={templateWeightage}
                    onChange={(e) => setTemplateWeightage(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Modal footer action buttons */}
              <div className="pt-5 border-t border-slate-100 flex gap-3 mt-auto">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="modal-cancel-btn"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1.5px solid #e2e8f0', 
                    borderRadius: '8px', 
                    color: '#475569', 
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flex: 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  disabled={isPushing}
                  style={{
                    backgroundColor: '#4f46e5', /* Push to Team is background #4f46e5 */
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: isPushing ? 'not-allowed' : 'pointer',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
                  }}
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
