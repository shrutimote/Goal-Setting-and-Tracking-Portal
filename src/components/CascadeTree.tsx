import React from 'react'

export function CascadeTree() {
  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '28px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
        marginTop: '32px',
        overflowX: 'auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Title */}
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
        Goal Alignment Cascade
      </h3>
      
      <div className="flex flex-col items-center min-w-[600px] pb-8">
        
        {/* Company Level OKR Node */}
        <div className="flex flex-col items-center relative">
          <div 
            style={{
              backgroundColor: '#eef2ff',
              border: '2px solid #c7d2fe',
              borderRadius: '14px',
              padding: '16px 24px',
              width: '256px',
              textAlign: 'center',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.05)',
              boxSizing: 'border-box'
            }}
          >
            {/* Initials Circle */}
            <div 
              style={{ 
                width: '28px', 
                height: '28px', 
                borderRadius: '50%', 
                backgroundColor: '#ffffff', 
                color: '#4f46e5', 
                border: '1px solid #c7d2fe',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 700, 
                fontSize: '11px',
                margin: '0 auto 8px auto'
              }}
            >
              CO
            </div>
            
            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#4f46e5', margin: '0 0 4px 0', letterSpacing: '0.06em' }}>
              Company OKR
            </p>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
              Increase ARR by 50% in FY24
            </p>
          </div>
          
          {/* Connector Line - stroke: #c7d2fe, stroke-width: 1.5 */}
          <div style={{ width: '1.5px', height: '32px', backgroundColor: '#c7d2fe' }}></div>
        </div>

        {/* Department Level */}
        <div className="flex w-full justify-center relative">
          
          {/* Horizontal connecting line - stroke: #c7d2fe, stroke-width: 1.5 */}
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '1.5px', backgroundColor: '#c7d2fe', zIndex: 0 }}></div>
          
          {/* Dept 1 - Sales */}
          <div className="flex flex-col items-center flex-1 z-10">
            {/* Vertical connector to horizontal header line */}
            <div style={{ width: '1.5px', height: '32px', backgroundColor: '#c7d2fe', marginTop: '-32px' }}></div>
            
            <div 
              style={{
                backgroundColor: '#f5f3ff',
                border: '1px solid #ddd6fe',
                borderRadius: '12px',
                padding: '16px',
                width: '224px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.03)',
                boxSizing: 'border-box'
              }}
            >
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  backgroundColor: '#ffffff', 
                  color: '#7c3aed', 
                  border: '1px solid #ddd6fe',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: '11px',
                  margin: '0 auto 8px auto'
                }}
              >
                SD
              </div>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#7c3aed', margin: '0 0 4px 0', letterSpacing: '0.06em' }}>
                Sales Dept
              </p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                Close $5M in New Enterprise Deals
              </p>
            </div>
            
            {/* Connector Line to Individuals */}
            <div style={{ width: '1.5px', height: '32px', backgroundColor: '#c7d2fe' }}></div>
            
            {/* Individuals under Dept 1 */}
            <div className="flex gap-4">
              
              {/* Alice OKR node */}
              <div className="flex flex-col items-center relative">
                <div style={{ position: 'absolute', top: 0, left: '50%', right: 0, height: '1.5px', backgroundColor: '#c7d2fe', zIndex: -1 }}></div>
                <div style={{ width: '1.5px', height: '16px', backgroundColor: '#c7d2fe', marginTop: '-16px' }}></div>
                
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                    width: '136px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                    boxSizing: 'border-box'
                  }}
                >
                  <div 
                    style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f8fafc', 
                      color: '#475569', 
                      border: '1px solid #e2e8f0',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '10px',
                      margin: '0 auto 6px auto'
                    }}
                  >
                    AL
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Alice (AE)</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0', fontWeight: 500 }}>$1M Quota</p>
                </div>
              </div>

              {/* Bob OKR node */}
              <div className="flex flex-col items-center relative">
                <div style={{ position: 'absolute', top: 0, left: 0, right: '50%', height: '1.5px', backgroundColor: '#c7d2fe', zIndex: -1 }}></div>
                <div style={{ width: '1.5px', height: '16px', backgroundColor: '#c7d2fe', marginTop: '-16px' }}></div>
                
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                    width: '136px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                    boxSizing: 'border-box'
                  }}
                >
                  <div 
                    style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f8fafc', 
                      color: '#475569', 
                      border: '1px solid #e2e8f0',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '10px',
                      margin: '0 auto 6px auto'
                    }}
                  >
                    BO
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Bob (AE)</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0', fontWeight: 500 }}>$1.5M Quota</p>
                </div>
              </div>

            </div>
          </div>

          {/* Dept 2 - Engineering */}
          <div className="flex flex-col items-center flex-1 z-10">
            {/* Vertical connector to horizontal header line */}
            <div style={{ width: '1.5px', height: '32px', backgroundColor: '#c7d2fe', marginTop: '-32px' }}></div>
            
            <div 
              style={{
                backgroundColor: '#f5f3ff',
                border: '1px solid #ddd6fe',
                borderRadius: '12px',
                padding: '16px',
                width: '224px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.03)',
                boxSizing: 'border-box'
              }}
            >
              <div 
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  backgroundColor: '#ffffff', 
                  color: '#7c3aed', 
                  border: '1px solid #ddd6fe',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 700, 
                  fontSize: '11px',
                  margin: '0 auto 8px auto'
                }}
              >
                ED
              </div>
              <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#7c3aed', margin: '0 0 4px 0', letterSpacing: '0.06em' }}>
                Engineering Dept
              </p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                Launch V2 Platform by Q3
              </p>
            </div>
            
            {/* Connector Line to Individuals */}
            <div style={{ width: '1.5px', height: '32px', backgroundColor: '#c7d2fe' }}></div>
            
            {/* Individuals under Dept 2 */}
            <div className="flex gap-4">
              
              {/* Charlie OKR node */}
              <div className="flex flex-col items-center relative">
                <div style={{ position: 'absolute', top: 0, left: '50%', right: 0, height: '1.5px', backgroundColor: '#c7d2fe', zIndex: -1 }}></div>
                <div style={{ width: '1.5px', height: '16px', backgroundColor: '#c7d2fe', marginTop: '-16px' }}></div>
                
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                    width: '136px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                    boxSizing: 'border-box'
                  }}
                >
                  <div 
                    style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f8fafc', 
                      color: '#475569', 
                      border: '1px solid #e2e8f0',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '10px',
                      margin: '0 auto 6px auto'
                    }}
                  >
                    CH
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Charlie (Dev)</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0', fontWeight: 500 }}>Deliver API Docs</p>
                </div>
              </div>

              {/* Dave OKR node */}
              <div className="flex flex-col items-center relative">
                <div style={{ position: 'absolute', top: 0, left: 0, right: '50%', height: '1.5px', backgroundColor: '#c7d2fe', zIndex: -1 }}></div>
                <div style={{ width: '1.5px', height: '16px', backgroundColor: '#c7d2fe', marginTop: '-16px' }}></div>
                
                <div 
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                    width: '136px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                    boxSizing: 'border-box'
                  }}
                >
                  <div 
                    style={{ 
                      width: '26px', 
                      height: '26px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f8fafc', 
                      color: '#475569', 
                      border: '1px solid #e2e8f0',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontWeight: 700, 
                      fontSize: '10px',
                      margin: '0 auto 6px auto'
                    }}
                  >
                    DA
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Dave (QA)</p>
                  <p style={{ fontSize: '10px', color: '#94a3b8', margin: '2px 0 0 0', fontWeight: 500 }}>Zero P0 Bugs</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
