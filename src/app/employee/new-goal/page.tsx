"use client"

import { DashboardLayout } from '@/components/DashboardLayout'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Activity } from 'lucide-react'

export default function NewGoal() {
  const { user, activeCycle } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thrustArea: 'Revenue',
    uom: 'NUMERIC',
    target: '',
    weightage: 10
  })
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // AI States
  const [aiScore, setAiScore] = useState<any>(null)
  const [isScoring, setIsScoring] = useState(false)
  const [isSuggesting, setIsSuggesting] = useState(false)

  const handleScoreGoal = async () => {
    if (!formData.title && !formData.description) return
    setIsScoring(true)
    try {
      const res = await fetch('/api/ai/score-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, description: formData.description })
      })
      if (res.ok) setAiScore(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setIsScoring(false)
    }
  }

  const handleAutoSuggest = async () => {
    setIsSuggesting(true)
    try {
      const res = await fetch('/api/ai/suggest-target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, thrustArea: formData.thrustArea })
      })
      if (res.ok) {
        const data = await res.json()
        setFormData({ ...formData, target: data.suggestedTarget, uom: data.suggestedUom })
        alert(data.reasoning)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSuggesting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/goals?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: activeCycle || 'GOAL_SETTING'
        })
      })

      if (res.ok) {
        router.push('/employee')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create goal')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Goal</h2>
          <button className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
        </div>

        <div className="card mb-6">
          {error && (
            <div className="p-4 mb-4 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="label">Thrust Area</label>
              <select 
                className="input" 
                value={formData.thrustArea}
                onChange={e => setFormData({...formData, thrustArea: e.target.value})}
              >
                <option value="Revenue">Revenue</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Operational Excellence">Operational Excellence</option>
                <option value="Innovation">Innovation</option>
              </select>
            </div>

            <div>
              <label className="label">Goal Title</label>
              <input 
                type="text" 
                className="input" 
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Increase Q1 Sales by 20%"
              />
            </div>

            <div>
              <label className="label">Description</label>
              <textarea 
                className="input" 
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly describe the objective..."
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={handleScoreGoal}
                disabled={isScoring || (!formData.title && !formData.description)}
                className="btn bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isScoring ? 'Scoring...' : 'AI Quality Scorer'}
              </button>
            </div>

            {aiScore && (
              <div className="p-4 rounded-lg border border-indigo-200 bg-indigo-50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
                    <Activity className="w-5 h-5"/>
                    SMART Score: {aiScore.score}/100
                  </h4>
                  <span className="badge badge-blue">{aiScore.alignment}</span>
                </div>
                <ul className="text-sm text-indigo-800 ml-4 list-disc">
                  {aiScore.feedback.map((f: string, i: number) => <li key={i}>{f}</li>)}
                </ul>
                {aiScore.suggestion && (
                  <div className="mt-2 p-3 bg-white rounded border border-indigo-100 text-sm">
                    <strong>AI Suggestion:</strong> {aiScore.suggestion}
                    <button 
                      type="button"
                      className="text-xs text-indigo-600 font-medium ml-4 underline"
                      onClick={() => setFormData({...formData, title: aiScore.suggestion})}
                    >
                      Use this title
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Unit of Measurement (UoM)</label>
                <select 
                  className="input"
                  value={formData.uom}
                  onChange={e => setFormData({...formData, uom: e.target.value})}
                >
                  <option value="NUMERIC">Numeric</option>
                  <option value="PERCENT">%</option>
                  <option value="TIMELINE">Timeline (Date)</option>
                  <option value="ZERO_BASED">Zero-based (e.g. Incidents)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="label">Target</label>
                  <button 
                    type="button" 
                    onClick={handleAutoSuggest}
                    disabled={isSuggesting}
                    className="text-xs text-indigo-600 flex items-center mb-1"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Auto-Suggest
                  </button>
                </div>
                <input 
                  type={formData.uom === 'TIMELINE' ? 'date' : 'text'}
                  className="input" 
                  required
                  value={formData.target}
                  onChange={e => setFormData({...formData, target: e.target.value})}
                  placeholder="Enter target value"
                />
              </div>
            </div>

            <div>
              <label className="label">Weightage (%)</label>
              <input 
                type="number" 
                className="input" 
                required
                min={10}
                max={100}
                value={formData.weightage}
                onChange={e => setFormData({...formData, weightage: Number(e.target.value)})}
              />
            </div>

            <div className="pt-4 border-t border-border mt-2">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Submit Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
