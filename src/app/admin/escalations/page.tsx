"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useState, useEffect } from 'react'
import { Play, AlertOctagon, CheckCircle2 } from 'lucide-react'

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

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Escalation Engine</h2>
          <p className="text-muted-foreground">Rule-based escalation tracking and resolution logs.</p>
        </div>
        <button 
          onClick={triggerEngine}
          disabled={isRunning}
          className="btn bg-rose-600 text-white hover:bg-rose-700 border-none shadow-lg shadow-rose-500/30"
        >
          <Play className="w-4 h-4 mr-2 fill-white" />
          {isRunning ? 'Running Engine...' : 'Trigger Rules Engine'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card border-rose-200 bg-rose-50/50">
          <h3 className="text-sm font-medium text-rose-700 mb-2">Open Escalations</h3>
          <p className="text-4xl font-bold text-rose-600">
            {data.logs.filter(l => l.status === 'OPEN').length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Active Rules</h3>
          <p className="text-4xl font-bold text-slate-800">{data.rules.length}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Resolution Rate</h3>
          <p className="text-4xl font-bold text-slate-800">
            {data.logs.length === 0 ? '100%' : `${Math.round((data.logs.filter(l => l.status === 'RESOLVED').length / data.logs.length) * 100)}%`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="card" style={{ gridColumn: 'span 2 / span 2' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            Escalation Log
          </h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : data.logs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">All clear! No active policy violations.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-slate-600">Employee</th>
                  <th className="py-3 px-4 text-left font-semibold text-slate-600">Violation Details</th>
                  <th className="py-3 px-4 text-left font-semibold text-slate-600">Date</th>
                  <th className="py-3 px-4 text-left font-semibold text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.logs.map(log => (
                  <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{log.user?.name}</td>
                    <td className="py-3 px-4 text-rose-600 font-medium">{log.details}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      {log.status === 'OPEN' ? (
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">OPEN</span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">RESOLVED</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card" style={{ gridColumn: 'span 1 / span 1', height: 'fit-content' }}>
          <h3 className="text-lg font-semibold mb-4">Active Rules</h3>
          <div className="flex flex-col gap-4">
            {data.rules.map(rule => (
              <div key={rule.id} className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-indigo-900">{rule.name}</h4>
                  <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></span>
                </div>
                <p className="text-xs font-medium text-indigo-600 mb-1">Condition: <span className="text-indigo-800">{rule.conditionType}</span></p>
                <p className="text-xs font-medium text-indigo-600 mb-1">Threshold: <span className="text-indigo-800">{rule.daysThreshold} days</span></p>
                <p className="text-xs font-medium text-indigo-600">Action: <span className="text-indigo-800 uppercase">{rule.action}</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
