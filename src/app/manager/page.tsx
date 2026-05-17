"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth, User } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [team, setTeam] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manager War Room</h2>
          <p className="text-muted-foreground">Real-time health overview of your entire team's goals.</p>
        </div>
        <button className="btn btn-primary bg-indigo-600 hover:bg-indigo-700">Push Goal Template</button>
      </div>

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
                    {/* Mock goal circles */}
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
    </DashboardLayout>
  )
}
