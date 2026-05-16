"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
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

  if (!isClient) return null // Prevent SSR hydration mismatch for Recharts

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          <p className="text-muted-foreground">Organization-wide performance trends and distributions.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* QoQ Trend Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">QoQ Achievement Trends</h3>
          <div style={{ height: '18rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="quarter" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="achievement" name="Actual Achievement %" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="target" name="Target %" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goal Distribution Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Goal Distribution by Thrust Area</h3>
          <div style={{ height: '18rem' }} className="flex items-center justify-center">
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
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Manager Effectiveness Bar Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6">Manager Effectiveness (Check-in Rates)</h3>
        <div style={{ height: '20rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={managerData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
              <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend />
              <Bar dataKey="completion" name="Check-in Completion %" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="onTime" name="On-Time Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  )
}
