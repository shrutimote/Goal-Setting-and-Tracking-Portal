import React from 'react'

export function GoalHealthCard({ goal }: { goal: any }) {
  // Determine dynamic dot color based on goal status
  let dotColor = '#4f46e5' // default in progress
  if (goal.status === 'SUBMITTED' || goal.uiStatus === 'Pending Approval') {
    dotColor = '#d97706' // amber for pending
  } else if (goal.status === 'APPROVED') {
    dotColor = '#16a34a' // green for approved
  }

  return (
    <div 
      style={{ 
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '190px',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Title & Status Dot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', width: '100%' }}>
        <h3 
          style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: '#0f172a', 
            margin: 0, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap', 
            maxWidth: '85%' 
          }}
          title={goal.title}
        >
          {goal.title}
        </h3>
        <span 
          style={{ 
            color: dotColor, 
            fontSize: '18px', 
            lineHeight: 1, 
            display: 'inline-block',
            marginLeft: '8px',
            flexShrink: 0
          }}
        >
          ●
        </span>
      </div>
      
      {/* 2-line Description Clamping */}
      <p 
        style={{ 
          fontSize: '12px', 
          color: '#94a3b8', 
          margin: '0 0 16px 0', 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          lineHeight: '1.4',
          minHeight: '34px'
        }}
      >
        {goal.description}
      </p>
      
      {/* Bottom KPI aligned row */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginTop: 'auto', 
          paddingTop: '14px', 
          borderTop: '1px solid #f1f5f9' 
        }}
      >
        {/* Target */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 2px 0', letterSpacing: '0.07em' }}>
            Target
          </p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {goal.formattedTarget || goal.target} {goal.uom === 'PERCENT' ? '%' : ''}
          </p>
        </div>
        
        {/* Weight */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 2px 0', letterSpacing: '0.07em' }}>
            Weight
          </p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            {goal.weightage}%
          </p>
        </div>
        
        {/* Circular Progress Ring */}
        <div style={{ position: 'relative', width: '44px', height: '44px', flexShrink: 0 }}>
          <svg viewBox="0 0 36 36" style={{ width: '44px', height: '44px' }}>
            <path
              style={{ color: '#e2e8f0' }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              stroke="#4f46e5"
              strokeDasharray={`${goal.progress || 0}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '12px', 
              fontWeight: 700, 
              color: '#4f46e5' 
            }}
          >
            {goal.progress || 0}%
          </div>
        </div>

      </div>
    </div>
  )
}
