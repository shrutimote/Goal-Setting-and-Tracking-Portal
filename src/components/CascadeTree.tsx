import React from 'react'
import { Target, Users, UserCircle } from 'lucide-react'

export function CascadeTree() {
  return (
    <div className="card mt-8 overflow-x-auto bg-slate-50 border-slate-200">
      <h3 className="text-lg font-bold mb-6 text-slate-800">Goal Alignment Cascade</h3>
      
      <div className="flex flex-col items-center min-w-[600px] pb-8">
        {/* Company Level */}
        <div className="flex flex-col items-center relative">
          <div className="card border-primary/30 bg-primary/5 shadow-sm w-64 text-center z-10">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-xs font-bold text-primary uppercase">Company OKR</p>
            <p className="font-semibold text-sm">Increase ARR by 50% in FY24</p>
          </div>
          {/* Connector Line */}
          <div className="w-px h-8 bg-slate-300"></div>
        </div>

        {/* Department Level */}
        <div className="flex w-full justify-center relative">
          {/* Horizontal connecting line */}
          <div className="absolute top-0 w-[60%] h-px bg-slate-300 z-0"></div>
          
          {/* Dept 1 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-px h-8 bg-slate-300 -mt-8"></div>
            <div className="card border-blue-200 bg-blue-50 shadow-sm w-56 text-center">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-blue-700 uppercase">Sales Dept</p>
              <p className="font-semibold text-sm">Close $5M in New Enterprise Deals</p>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            
            {/* Individuals under Dept 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center relative">
                <div className="absolute top-0 w-full h-px bg-slate-300 -z-10 translate-x-1/2"></div>
                <div className="w-px h-4 bg-slate-300 -mt-4"></div>
                <div className="card border-slate-200 shadow-sm w-40 p-3 text-center bg-white">
                  <UserCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium">Alice (AE)</p>
                  <p className="text-[10px] text-muted-foreground">$1M Quota</p>
                </div>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="absolute top-0 w-full h-px bg-slate-300 -z-10 -translate-x-1/2"></div>
                <div className="w-px h-4 bg-slate-300 -mt-4"></div>
                <div className="card border-slate-200 shadow-sm w-40 p-3 text-center bg-white">
                  <UserCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium">Bob (AE)</p>
                  <p className="text-[10px] text-muted-foreground">$1.5M Quota</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dept 2 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className="w-px h-8 bg-slate-300 -mt-8"></div>
            <div className="card border-green-200 bg-green-50 shadow-sm w-56 text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-green-700 uppercase">Engineering Dept</p>
              <p className="font-semibold text-sm">Launch V2 Platform by Q3</p>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            
            {/* Individuals under Dept 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center relative">
                <div className="absolute top-0 w-full h-px bg-slate-300 -z-10 translate-x-1/2"></div>
                <div className="w-px h-4 bg-slate-300 -mt-4"></div>
                <div className="card border-slate-200 shadow-sm w-40 p-3 text-center bg-white">
                  <UserCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium">Charlie (Dev)</p>
                  <p className="text-[10px] text-muted-foreground">Deliver API Docs</p>
                </div>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="absolute top-0 w-full h-px bg-slate-300 -z-10 -translate-x-1/2"></div>
                <div className="w-px h-4 bg-slate-300 -mt-4"></div>
                <div className="card border-slate-200 shadow-sm w-40 p-3 text-center bg-white">
                  <UserCircle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium">Dave (QA)</p>
                  <p className="text-[10px] text-muted-foreground">Zero P0 Bugs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
