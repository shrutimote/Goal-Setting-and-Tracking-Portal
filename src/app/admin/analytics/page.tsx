"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useState, useEffect } from 'react'

const PIE_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b']

export default function AnalyticsDashboard() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Mock data for Manager Effectiveness
  const managerData = [
    { name: 'Alice (Sales)', completion: 85, onTime: 90 },
    { name: 'Bob (Eng)', completion: 65, onTime: 50 },
    { name: 'Charlie (Ops)', completion: 95, onTime: 100 },
    { name: 'Diana (HR)', completion: 80, onTime: 85 },
  ]

  // Mock data for Goal Distribution
  const distributionData = [
    { name: 'Revenue', value: 40 },
    { name: 'Ops Excellence', value: 30 },
    { name: 'Customer Success', value: 20 },
    { name: 'Innovation', value: 10 },
  ]

  // Mock data for QoQ Trends
  const trendData = [
    { quarter: 'Q1', achievement: 75, target: 80 },
    { quarter: 'Q2', achievement: 82, target: 85 },
    { quarter: 'Q3', achievement: 90, target: 90 },
    { quarter: 'Q4', achievement: 95, target: 95 },
  ]

  // Custom tooltips (Issue 5 tooltip polish)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            zIndex: 50
          }}
        >
          <p style={{ margin: 0, fontWeight: 700, fontSize: '12px', color: '#0f172a', marginBottom: '6px' }}>{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ margin: 0, fontSize: '11px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.fill || p.stroke }} />
              <span>{p.name}: <strong>{p.value}%</strong></span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (!isClient) return null // Prevent SSR hydration mismatch for Recharts

  return (
    <DashboardLayout>
      
      {/* Issue 6: Page Header and thin horizontal rule divider */}
      <div className="mb-6">
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Analytics & Insights</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>Organization-wide performance trends and distributions.</p>
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginTop: '16px', marginBottom: '24px' }} />
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        
        {/* Issue 2 & 3: QoQ Trend Chart Card */}
        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
            boxSizing: 'border-box'
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>QoQ Achievement Trends</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>Quarter over quarter performance</p>
          
          <div style={{ height: '18rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <RechartsTooltip cursor={{ stroke: '#c7d2fe', strokeWidth: 1 }} content={<CustomTooltip />} />
                <Line type="monotone" dataKey="achievement" name="Actual Achievement %" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="target" name="Target %" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Issue 3 Custom Legend: circle indicators below chart */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4f46e5' }} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Actual Achievement %</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Target %</span>
            </div>
          </div>
        </div>

        {/* Issue 2 & 4: Goal Distribution Donut Chart Card */}
        <div 
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
            boxSizing: 'border-box'
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Goal Distribution by Thrust Area</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>Breakdown by focus area</p>
          
          {/* Issue 4: Centered donut left 60%, vertically centered legend right 40% */}
          <div style={{ display: 'flex', alignItems: 'center', height: '18rem' }}>
            <div style={{ width: '60%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend 40% vertical aligned right */}
            <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', paddingLeft: '16px', boxSizing: 'border-box' }}>
              {distributionData.map((item, index) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: PIE_COLORS[index], flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto', paddingRight: '12px' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Issue 5: Manager Effectiveness Bar Chart Card */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
          boxSizing: 'border-box'
        }}
      >
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Manager Effectiveness (Check-in Rates)</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 20px 0' }}>Tracking completion rates and check-in timeliness by department manager</p>
        
        <div style={{ height: '20rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={managerData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              
              {/* Tooltip and cursor config (Issue 5: cursor fill transparent removes background rectangle bleed) */}
              <RechartsTooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
              <Bar dataKey="completion" name="Check-in Completion %" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="onTime" name="On-Time Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issue 5 Custom Legend: circle indicators below chart */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4f46e5' }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Check-in Completion %</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>On-Time Rate %</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
