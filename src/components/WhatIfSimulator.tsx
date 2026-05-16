import React, { useState } from 'react'

export function WhatIfSimulator({ goals }: { goals: any[] }) {
  const [simulatedActuals, setSimulatedActuals] = useState<Record<string, number>>({})

  // If no goals, return null
  if (!goals || goals.length === 0) return null

  const calculateTotalScore = () => {
    let score = 0
    goals.forEach(g => {
      const targetNum = parseFloat(g.target)
      const weight = g.weightage
      if (isNaN(targetNum)) return // Skip timeline or unparseable

      const actual = simulatedActuals[g.id] || 0
      
      let progress = 0
      if (g.uom === 'ZERO_BASED') {
        progress = actual === 0 ? 1 : 0
      } else {
        progress = targetNum === 0 ? 0 : Math.min(1, actual / targetNum)
      }
      
      score += progress * weight
    })
    return score.toFixed(1)
  }

  return (
    <div className="card bg-indigo-50 border-indigo-200 mb-8 mt-8">
      <h3 className="text-lg font-bold text-indigo-900 mb-2">What-If Simulator</h3>
      <p className="text-sm text-indigo-700 mb-6">Drag the sliders to see how your actual achievements will impact your overall weighted score.</p>
      
      <div className="flex gap-8">
        <div className="flex-1 flex flex-col gap-4">
          {goals.filter(g => g.uom !== 'TIMELINE').map(g => (
            <div key={g.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-indigo-900">{g.title}</span>
                <span className="text-indigo-700">Target: {g.target} (Wt: {g.weightage}%)</span>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  className="w-full"
                  min="0"
                  max={parseFloat(g.target) * 1.5 || 100}
                  value={simulatedActuals[g.id] || 0}
                  onChange={e => setSimulatedActuals({...simulatedActuals, [g.id]: parseFloat(e.target.value)})}
                />
                <span className="font-bold text-indigo-900 w-12 text-right">
                  {simulatedActuals[g.id] || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-48 flex flex-col items-center justify-center bg-white rounded-lg p-4 border border-indigo-100 shadow-sm">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Projected Score</p>
          <div className="text-5xl font-bold text-indigo-600">
            {calculateTotalScore()}%
          </div>
        </div>
      </div>
    </div>
  )
}
