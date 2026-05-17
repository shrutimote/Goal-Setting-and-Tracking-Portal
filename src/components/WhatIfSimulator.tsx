import React from 'react'

export function WhatIfSimulator({ goals }: { goals: any[] }) {
  if (!goals || goals.length === 0) return null

  const calculateTotalScore = () => {
    let score = 0
    goals.forEach(g => {
      const weight = g.weightage
      const progress = g.progress || 0
      score += (progress / 100) * weight
    })
    return score.toFixed(1)
  }

  const totalScore = parseFloat(calculateTotalScore())

  // Score color
  const scoreColor = totalScore >= 75 ? '#16a34a' : totalScore >= 40 ? '#4f46e5' : '#d97706'

  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginBottom: '32px',
        marginTop: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#0f172a',
            borderLeft: '3px solid #4f46e5',
            paddingLeft: '12px',
            margin: 0,
          }}
        >
          Goal Progress Overview
        </h3>

        {/* Projected score badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '8px 16px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em' }}>
            Weighted Score
          </span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: scoreColor }}>
            {calculateTotalScore()}%
          </span>
        </div>
      </div>

      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 20px 15px' }}>
        Progress across your active goals weighted by their contribution.
      </p>

      {/* Goal rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {goals
          .filter(g => g.uom !== 'TIMELINE')
          .map(g => {
            const progress = Math.min(100, Math.max(0, g.progress || 0))
            const barColor =
              progress >= 75 ? '#16a34a' :
              progress >= 40 ? '#4f46e5' :
              '#f59e0b'

            return (
              <div key={g.id} style={{ width: '100%', boxSizing: 'border-box' }}>
                {/* Row header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    gap: '8px',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      minWidth: 0,
                    }}
                    title={g.title}
                  >
                    {g.title}
                  </span>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Target</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{g.target}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Wt</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{g.weightage}%</span>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '38px' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Done</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: barColor }}>{progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar track */}
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progress}%`,
                      backgroundColor: barColor,
                      borderRadius: '999px',
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
