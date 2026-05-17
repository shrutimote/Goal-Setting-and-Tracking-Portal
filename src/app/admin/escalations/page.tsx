"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { Play, CheckCircle2 } from 'lucide-react'

export default function EscalationsDashboard() {
  const [data, setData] = useState<{ rules: any[], logs: any[] }>({ rules: [], logs: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/escalations')
      if (res.ok) {
        setData(await res.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerEngine = async () => {
    setIsRunning(true)
    try {
      const res = await fetch('/api/cron/run-escalations', { method: 'POST' })
      const result = await res.json()
      if (result.success) {
        alert(result.message)
        fetchData() // Refresh logs
      } else {
        alert('Error: ' + result.error)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsRunning(false)
    }
  }

  // Calculations for Issue 2
  const openEscalationsCount = data.logs.filter(l => l.status === 'OPEN').length
  const resolutionRateString = data.logs.length === 0 ? '100%' : `${Math.round((data.logs.filter(l => l.status === 'RESOLVED').length / data.logs.length) * 100)}%`

  return (
    <DashboardLayout>
      <style dangerouslySetInnerHTML={{ __html: `
        .escalation-stat-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important; /* Issue 2: horizontal 3-column */
          gap: 14px !important;
          margin-bottom: 32px !important;
        }
        .escalation-stat-card {
          position: relative !important;
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 20px !important;
          overflow: hidden !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.01) !important;
          box-sizing: border-box !important;
        }
        .escalation-stat-bar {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: 3px !important;
        }
        .escalation-stat-label {
          font-size: 10px !important; /* Issue 2: Label 10px uppercase */
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.07em !important;
          color: #94a3b8 !important;
          margin-bottom: 8px !important;
          margin-top: 4px !important;
        }
        .escalation-stat-value {
          font-size: 28px !important; /* Issue 2: Value 28px bold */
          font-weight: 700 !important;
          margin: 0 !important;
          line-height: 1.25 !important;
        }
        .escalation-stat-subtext {
          font-size: 11px !important; /* Issue 2: Context sub-label */
          color: #94a3b8 !important;
          font-weight: 500 !important;
          margin-top: 4px !important;
        }
        .escalation-main-card {
          background: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 14px !important;
          padding: 24px !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.01) !important;
          box-sizing: border-box !important;
        }
        .rule-card {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 10px !important;
          padding: 14px 16px !important;
          margin-bottom: 16px !important;
          box-sizing: border-box !important;
        }
        .rule-card:last-child {
          margin-bottom: 0 !important;
        }
      `}} />

      {/* Issue 6: Page Header block and thin divider */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Escalation Engine</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Rule-based escalation tracking and resolution logs.</p>
          </div>
          
          {/* Issue 3: Polished Trigger Rules Engine button with Play icon */}
          <button 
            onClick={triggerEngine}
            disabled={isRunning}
            style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              padding: '10px 18px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            <Play className="w-3.5 h-3.5 fill-white text-white" />
            {isRunning ? 'Running Engine...' : 'Trigger Rules Engine'}
          </button>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginTop: '16px', marginBottom: '24px' }} />
      </div>

      {/* Issue 2: Stat Cards Grid */}
      <div className="escalation-stat-grid">
        
        {/* Open Escalations Card */}
        <div className="escalation-stat-card">
          <div className="escalation-stat-bar" style={{ backgroundColor: '#e11d48' }} />
          <h3 className="escalation-stat-label">Open Escalations</h3>
          <p className="escalation-stat-value" style={{ color: openEscalationsCount > 0 ? '#e11d48' : '#0f172a' }}>
            {openEscalationsCount}
          </p>
          <p className="escalation-stat-subtext">no active issues</p>
        </div>

        {/* Active Rules Card */}
        <div className="escalation-stat-card">
          <div className="escalation-stat-bar" style={{ backgroundColor: '#4f46e5' }} />
          <h3 className="escalation-stat-label">Active Rules</h3>
          <p className="escalation-stat-value" style={{ color: '#4f46e5' }}>{data.rules.length}</p>
          <p className="escalation-stat-subtext">rules configured</p>
        </div>

        {/* Resolution Rate Card */}
        <div className="escalation-stat-card">
          <div className="escalation-stat-bar" style={{ backgroundColor: '#16a34a' }} />
          <h3 className="escalation-stat-label">Resolution Rate</h3>
          <p className="escalation-stat-value" style={{ color: '#16a34a' }}>{resolutionRateString}</p>
          <p className="escalation-stat-subtext">all resolved</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        
        {/* Issue 4: Escalation Log Card */}
        <div className="escalation-main-card" style={{ gridColumn: 'span 2 / span 2' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            {/* Title with left indigo border accent, no octagon icon */}
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #4f46e5', paddingLeft: '12px', margin: 0, display: 'flex', alignItems: 'center' }}>
              Escalation Log
              
              {/* Optional dynamic green pill badge */}
              {openEscalationsCount === 0 && (
                <span 
                  style={{
                    backgroundColor: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    marginLeft: '8px',
                    display: 'inline-block'
                  }}
                >
                  All Clear
                </span>
              )}
            </h3>
          </div>

          {isLoading ? (
            <p className="text-slate-500 font-medium animate-pulse">Loading logs...</p>
          ) : data.logs.length === 0 ? (
            
            /* Issue 4: Green checkmark empty state centered */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
              <CheckCircle2 style={{ color: '#16a34a', width: '24px', height: '24px', marginBottom: '12px' }} />
              <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, margin: 0, textAlign: 'center' }}>
                All clear! No active policy violations.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8' }}>Employee</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8' }}>Violation Details</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94a3b8' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover:bg-slate-50/50 transition-colors">
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>{log.user?.name}</td>
                    <td style={{ padding: '14px 16px', color: '#e11d48', fontWeight: 600 }}>{log.details}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontWeight: 500 }}>{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {log.status === 'OPEN' ? (
                        <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', display: 'inline-block' }}>OPEN</span>
                      ) : (
                        <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', display: 'inline-block' }}>RESOLVED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Issue 5: Active Rules Card */}
        <div className="escalation-main-card" style={{ gridColumn: 'span 1 / span 1', height: 'fit-content' }}>
          {/* Card title with left indigo border accent */}
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', borderLeft: '3px solid #4f46e5', paddingLeft: '12px', margin: '0 0 20px 0' }}>
            Active Rules
          </h3>
          
          <div className="flex flex-col gap-4">
            {data.rules.map(rule => (
              <div key={rule.id} className="rule-card">
                {/* Rule Name */}
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px 0' }}>
                  {rule.name}
                </h4>
                
                {/* Condition, Threshold, Action detail lines */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Condition Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Condition</span>
                    <span 
                      style={{ 
                        backgroundColor: '#eef2ff', 
                        color: '#4f46e5', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        padding: '2px 8px', 
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}
                    >
                      {rule.conditionType}
                    </span>
                  </div>

                  {/* Threshold Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Threshold</span>
                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                      {rule.daysThreshold} days
                    </span>
                  </div>

                  {/* Action Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Action</span>
                    <span 
                      style={{ 
                        backgroundColor: '#eef2ff', 
                        color: '#4f46e5', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        padding: '2px 8px', 
                        borderRadius: '6px',
                        display: 'inline-block',
                        textTransform: 'uppercase'
                      }}
                    >
                      {rule.action}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
