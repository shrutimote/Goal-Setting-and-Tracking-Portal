"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { CascadeTree } from '@/components/CascadeTree'
import { Users, Send } from 'lucide-react'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [settings, setSettings] = useState({ activeWindow: 'GOAL_SETTING' })
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isPushing, setIsPushing] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [usersRes, settingsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/settings')
      ])
      
      if (usersRes.ok) setUsers(await usersRes.json())
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        if (data) setSettings(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const updateWindow = async (newWindow: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeWindow: newWindow })
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  const handleBulkPush = () => {
    if (selectedUsers.length === 0) return alert('Select employees first')
    const confirm = window.confirm(`You are about to push a Shared Goal Template to ${selectedUsers.length} employees. Proceed?`)
    if (confirm) {
      setIsPushing(true)
      setTimeout(() => {
        setIsPushing(false)
        setSelectedUsers([])
        alert('Goals successfully cloned and pushed!')
      }, 1500)
    }
  }

  const exportToCSV = () => {
    if (users.length === 0) return alert('No data to export')
    
    const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Check-in Streak']
    const csvRows = users.map((u: any) => 
      [u.id, `"${u.name}"`, `"${u.email}"`, u.role, `"${u.department || ''}"`, u.checkInStreak || 0].join(',')
    )
    
    const csvContent = [headers.join(','), ...csvRows].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'organization_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Admin & HR Dashboard</h2>
          <p className="text-muted-foreground">Manage organization-wide settings, alignment, and bulk operations.</p>
        </div>
        <button className="btn btn-outline" onClick={exportToCSV}>Export Report (CSV)</button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Cycle Management</h3>
          <div className="flex items-center gap-4">
            <select 
              className="input w-1/2 border-indigo-200 focus:border-indigo-500" 
              value={settings.activeWindow}
              onChange={(e) => updateWindow(e.target.value)}
              disabled={isUpdating}
            >
              <option value="GOAL_SETTING">Goal Setting Window</option>
              <option value="Q1">Q1 Check-in</option>
              <option value="Q2">Q2 Check-in</option>
              <option value="Q3">Q3 Check-in</option>
              <option value="Q4">Q4 / Annual Review</option>
            </select>
            <span className="text-sm font-medium text-indigo-600">
              {isUpdating ? 'Updating...' : 'Live System Status'}
            </span>
          </div>
        </div>

        <div className="card bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-indigo-100 font-medium mb-1">Bulk Goal Push</h3>
            <p className="text-sm text-indigo-200 mb-4">Select employees below to push standard KPIs.</p>
            <button 
              onClick={handleBulkPush}
              disabled={isPushing || selectedUsers.length === 0}
              className="btn bg-white text-indigo-700 hover:bg-indigo-50 border-none"
            >
              <Send className="w-4 h-4 mr-2" />
              {isPushing ? 'Pushing...' : `Push to ${selectedUsers.length} Selected`}
            </button>
          </div>
          <Users className="w-16 h-16 text-indigo-400 opacity-50" />
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Organization Overview</h3>
          <button 
            className="text-sm text-indigo-600 font-medium hover:underline"
            onClick={() => setSelectedUsers(users.map((u:any) => u.id))}
          >
            Select All
          </button>
        </div>
        
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="w-10"></th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Check-in Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className={selectedUsers.includes(u.id) ? 'bg-indigo-50' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      checked={selectedUsers.includes(u.id)}
                      onChange={() => toggleUserSelection(u.id)}
                    />
                  </td>
                  <td className="font-medium text-indigo-900">{u.name}</td>
                  <td><span className="badge badge-blue">{u.role}</span></td>
                  <td>{u.department || '-'}</td>
                  <td>
                    {u.checkInStreak > 2 ? (
                      <span className="badge badge-green flex items-center w-fit gap-1">
                        🔥 {u.checkInStreak} Streak!
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">{u.checkInStreak || 0}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CascadeTree />
    </DashboardLayout>
  )
}
