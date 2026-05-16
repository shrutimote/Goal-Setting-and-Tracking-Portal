import { NextResponse } from 'next/server'

// Mock AI Service with simulated delay and realistic feedback
export async function POST(request: Request) {
  const data = await request.json()
  const { title, description } = data

  // Simulate AI delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const combinedText = `${title} ${description}`.toLowerCase()
  
  // Basic heuristic mock to feel like real AI
  let score = 50
  let feedback = []
  
  const hasMetric = /\d/.test(combinedText) || combinedText.includes('percent')
  const hasTimeframe = combinedText.includes('q1') || combinedText.includes('q2') || combinedText.includes('q3') || combinedText.includes('q4') || combinedText.includes('month') || combinedText.includes('year')

  if (hasMetric) {
    score += 25
    feedback.push('✓ Measurable target detected.')
  } else {
    feedback.push('⚠ Missing a measurable metric. How will you track success?')
  }

  if (hasTimeframe) {
    score += 25
    feedback.push('✓ Clear timeframe established.')
  } else {
    feedback.push('⚠ No timeframe found. When is this due?')
  }

  // Generate a mock suggestion
  let suggestion = ''
  if (!hasMetric && !hasTimeframe) {
    suggestion = `Increase [Metric] by [X]% by [Quarter] to support [Objective].`
  } else if (!hasMetric) {
    suggestion = `${title || 'Improve process'} by achieving a [X]% increase by the deadline.`
  } else if (!hasTimeframe) {
    suggestion = `${title || 'Reach target'} before the end of Q3.`
  }

  const alignmentMessage = score > 75 
    ? "Great alignment with company objectives!" 
    : "This goal is a bit vague. Try refining it using the SMART framework."

  return NextResponse.json({
    score,
    feedback,
    alignment: alignmentMessage,
    suggestion: suggestion || null
  })
}
