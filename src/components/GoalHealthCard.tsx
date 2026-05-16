import React from 'react'

export function GoalHealthCard({ goal }: { goal: any }) {
  // Mock health logic
  const isHealthy = goal.weightage >= 15
  const isWarning = goal.weightage < 15 && goal.weightage >= 10
  
  const statusColor = isHealthy ? 'text-green-500' : isWarning ? 'text-yellow-500' : 'text-red-500'
  const strokeColor = isHealthy ? '#22c55e' : isWarning ? '#eab308' : '#ef4444'

  return (
    <div className="card flex flex-col justify-between" style={{ minHeight: '200px' }}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg line-clamp-2">{goal.title}</h3>
        <span className={`text-2xl ${statusColor}`}>●</span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{goal.description}</p>
      
      <div className="flex items-end justify-between mt-auto">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Target</p>
          <p className="font-bold text-xl">{goal.target} {goal.uom === 'PERCENT' ? '%' : ''}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Weight</p>
            <p className="font-bold">{goal.weightage}%</p>
          </div>
          
          {/* Progress Arc Simulation */}
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 36 36" className="w-12 h-12">
              <path
                className="text-gray-200"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                stroke={strokeColor}
                strokeDasharray="60, 100" // Mock 60% progress
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              60%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
