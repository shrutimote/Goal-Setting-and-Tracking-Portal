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
    <div 
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
        marginBottom: '32px',
        marginTop: '32px',
        boxSizing: 'border-box'
      }}
    >
      {/* Header section with left accent indigo border */}
      <h3 
        style={{ 
          fontSize: '15px', 
          fontWeight: 700, 
          color: '#0f172a', 
          borderLeft: '3px solid #4f46e5', 
          paddingLeft: '12px', 
          margin: 0 
        }}
      >
        What-If Simulator
      </h3>
      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 20px 0' }}>
        Drag the sliders to see how your actual achievements will impact your overall weighted score.
      </p>
      
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {goals.filter(g => g.uom !== 'TIMELINE').map(g => (
            <div key={g.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              
              {/* Slider header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: '#475569', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap', 
                    maxWidth: '70%',
                    display: 'inline-block' 
                  }}
                  title={g.title}
                >
                  {g.title}
                </span>
                
                {/* Target & Wt small double labeled rows */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Target</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{g.target}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Wt</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{g.weightage}%</span>
                  </div>
                </div>
              </div>

              {/* Slider line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input 
                  type="range" 
                  style={{ 
                    width: '100%', 
                    accentColor: '#4f46e5',
                    cursor: 'pointer'
                  }}
                  min="0"
                  max={parseFloat(g.target) * 1.5 || 100}
                  value={simulatedActuals[g.id] || 0}
                  onChange={e => setSimulatedActuals({...simulatedActuals, [g.id]: parseFloat(e.target.value)})}
                />
                
                {/* Current Value */}
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 700, 
                    color: '#0f172a', 
                    width: '48px', 
                    textAlign: 'right',
                    flexShrink: 0
                  }}
                >
                  {simulatedActuals[g.id] || 0}
                </span>
              </div>

            </div>
          ))}
        </div>
        
        {/* Projected Score card right block */}
        <div 
          style={{ 
            width: '192px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#fafbfc', 
            borderRadius: '10px', 
            padding: '20px', 
            border: '1px solid #e2e8f0', 
            flexShrink: 0,
            boxSizing: 'border-box'
          }}
        >
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px 0', letterSpacing: '0.07em' }}>
            PROJECTED SCORE
          </p>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#4f46e5' }}>
            {calculateTotalScore()}%
          </div>
        </div>
      </div>
    </div>
  )
}
