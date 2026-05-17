"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { CascadeTree } from '@/components/CascadeTree'
import { Users, Send } from 'lucide-react'
import { addNotification } from '@/lib/notifications'

export default function AdminDashboard() {
  const { user, activeCycle, updateActiveCycle } = useAuth()
  const [users, setUsers] = useState([])
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
      const usersRes = await fetch('/api/users')
      if (usersRes.ok) {
        setUsers(await usersRes.json())
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
      await updateActiveCycle(newWindow)
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

  const handleBulkPush = async () => {
    if (selectedUsers.length === 0) return alert('Select employees first')
    const confirm = window.confirm(`You are about to push a Shared Goal Template to ${selectedUsers.length} employees. Proceed?`)
    if (confirm) {
      setIsPushing(true)
      try {
        // Push template API for each selected user
        for (const userId of selectedUsers) {
          const res = await fetch(`/api/goals?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'Organization Core Goal KPI',
              description: 'Standard operational excellence KPI pushed by HR Administration.',
              thrustArea: 'Operational Excellence',
              uom: 'PERCENT',
              target: '100',
              weightage: 15,
              parentId: activeCycle || 'GOAL_SETTING'
            })
          })
          if (res.ok) {
            // Push client notification for employee
            addNotification(
              userId,
              'Organization Core Goal KPI',
              'A standard HR organization goal template has been pushed to your active list.'
            )
          }
        }
        alert('Goals successfully cloned and pushed to all selected employees!')
        setSelectedUsers([])
      } catch (e) {
        console.error(e)
        alert('An error occurred while pushing bulk goals.')
      } finally {
        setIsPushing(false)
      }
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
      {styleTag}
      
      {/* Header section with brand colored export buttons */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin & HR Dashboard</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Manage organization-wide settings, alignment, and bulk operations.</p>
        </div>
        
        {/* Issue 3: Polished export button styling matching corporate buttons */}
        <button 
          style={{
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px 18px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onClick={exportToCSV}
        >
          Export Report (CSV)
        </button>
      </div>

      {/* Issue 2: Side-by-side white cards layout */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        
        {/* Cycle Management Card */}
        <div className="admin-top-card">
          <h3 className="admin-card-label">Cycle Management</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Configure the current system active cycle window.</p>
          <div className="flex items-center gap-4">
            <select 
              className="admin-select w-1/2" 
              value={activeCycle || 'GOAL_SETTING'}
              onChange={(e) => updateWindow(e.target.value)}
              disabled={isUpdating}
            >
              <option value="GOAL_SETTING">Goal Setting Window</option>
              <option value="Q1">Q1 Check-in</option>
              <option value="Q2">Q2 Check-in</option>
              <option value="Q3">Q3 Check-in</option>
              <option value="Q4">Q4 / Annual Review</option>
              <option value="NONE">No Active Cycle</option>
            </select>
            
            {/* Live System Status green pill badge */}
            <span 
              style={{
                backgroundColor: '#f0fdf4',
                color: '#16a34a',
                border: '1px solid #bbf7d0',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 12px',
                display: 'inline-block'
              }}
            >
              {isUpdating ? 'Updating...' : 'Live System Status'}
            </span>
          </div>
        </div>

        {/* Bulk Goal Push Card */}
        <div className="admin-top-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Bulk Goal Push</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>Select employees below to push standard KPIs.</p>
            <button 
              onClick={handleBulkPush}
              disabled={isPushing || selectedUsers.length === 0}
              style={{
                backgroundColor: selectedUsers.length > 0 ? '#4f46e5' : '#e2e8f0',
                color: selectedUsers.length > 0 ? '#ffffff' : '#94a3b8',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                padding: '10px 18px',
                border: 'none',
                cursor: selectedUsers.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                boxShadow: selectedUsers.length > 0 ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none'
              }}
            >
              <Send className={`w-4 h-4 mr-2 inline-block ${selectedUsers.length > 0 ? 'text-white' : 'text-slate-400'}`} />
              {isPushing ? 'Pushing...' : `Push to ${selectedUsers.length} Selected`}
            </button>
          </div>
          <Users className="w-14 h-14 text-indigo-100/80 ml-4 flex-shrink-0" />
        </div>
      </div>

      {/* Issue 4: Organization Overview wrapped in white border card */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Organization Overview</h3>
          
          {/* Outlined Select All button */}
          <button 
            className="select-all-btn"
            style={{
              border: '1.5px solid #e2e8f0', 
              borderRadius: '8px', 
              fontSize: '12px', 
              fontWeight: 600, 
              color: '#475569',
              padding: '6px 12px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setSelectedUsers(users.map((u:any) => u.id))}
          >
            Select All
          </button>
        </div>
        
        {isLoading ? (
          <div style={{ padding: '24px' }}>
            <p className="text-slate-500 font-medium animate-pulse">Loading organization data...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ width: '40px', padding: '12px 20px', textAlign: 'left' }}></th>
                <th className="admin-th">Name</th>
                <th className="admin-th">Role</th>
                <th className="admin-th">Department</th>
                <th className="admin-th">Check-in Streak</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => {
                const rowInitials = u.name.split(' ').map((n: any) => n[0]).slice(0, 2).join('').toUpperCase()
                
                // Color code roles
                let badgeBg = '#f8fafc'
                let badgeColor = '#475569'
                let badgeBorder = '#e2e8f0'
                let avatarBg = '#f8fafc'
                let avatarColor = '#475569'
                
                if (u.role === 'ADMIN') {
                  badgeBg = '#eef2ff'
                  badgeColor = '#4f46e5'
                  badgeBorder = '#c7d2fe'
                  avatarBg = '#eef2ff'
                  avatarColor = '#4f46e5'
                } else if (u.role === 'MANAGER') {
                  badgeBg = '#f5f3ff'
                  badgeColor = '#7c3aed'
                  badgeBorder = '#ddd6fe'
                  avatarBg = '#f5f3ff'
                  avatarColor = '#7c3aed'
                }

                return (
                  <tr key={u.id} className={`admin-tr ${selectedUsers.includes(u.id) ? 'bg-indigo-50/15' : ''}`}>
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <input 
                        type="checkbox" 
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#4f46e5',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        checked={selectedUsers.includes(u.id)}
                        onChange={() => toggleUserSelection(u.id)}
                      />
                    </td>
                    
                    {/* Name column with initials avatar */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: avatarBg,
                            color: avatarColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '11px',
                            border: `1px solid ${badgeBorder}`,
                            flexShrink: 0
                          }}
                        >
                          {rowInitials}
                        </div>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{u.name}</span>
                      </div>
                    </td>
                    
                    {/* Role capsules */}
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      <span 
                        style={{
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeBorder}`,
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          display: 'inline-block'
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    
                    <td style={{ padding: '14px 20px', color: '#475569', fontSize: '13px', fontWeight: 500, verticalAlign: 'middle' }}>
                      {u.department || '-'}
                    </td>
                    
                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                      {u.checkInStreak > 2 ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', gap: '4px' }}>
                          🔥 {u.checkInStreak} Streak!
                        </span>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
                          {u.checkInStreak || 0}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <CascadeTree />
    </DashboardLayout>
  )
}

const styleTag = (
  <style dangerouslySetInnerHTML={{ __html: `
    .admin-top-card {
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 14px !important;
      padding: 24px !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.01) !important;
      box-sizing: border-box !important;
    }
    .admin-card-label {
      font-size: 10px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.07em !important;
      color: #94a3b8 !important;
      margin-bottom: 4px !important;
    }
    .admin-select {
      border: 1.5px solid #e2e8f0 !important;
      border-radius: 10px !important;
      background: #fafbfc !important;
      font-size: 13px !important;
      padding: 10px 14px !important;
      outline: none !important;
      color: #0f172a !important;
      transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s !important;
      box-sizing: border-box !important;
      cursor: pointer !important;
    }
    .admin-select:focus {
      border-color: #4f46e5 !important;
      background-color: #ffffff !important;
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
    }
    .select-all-btn:hover {
      border-color: #94a3b8 !important;
      color: #0f172a !important;
      background-color: #f8fafc !important;
    }
    .admin-table {
      width: 100% !important;
      border-collapse: collapse !important;
    }
    .admin-th {
      font-size: 10px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.07em !important;
      color: #94a3b8 !important;
      padding: 12px 20px !important;
      text-align: left !important;
    }
    .admin-tr {
      border-bottom: 1px solid #f1f5f9 !important;
      transition: background-color 0.15s ease !important;
    }
    .admin-tr:hover {
      background-color: #fafbfc !important;
    }
    .admin-tr:last-child {
      border-bottom: none !important;
    }
  `}} />
)
