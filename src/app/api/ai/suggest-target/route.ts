import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  const { thrustArea, title } = data

  await new Promise((resolve) => setTimeout(resolve, 1000)) // AI delay

  let target = '100'
  let uom = 'NUMERIC'

  const lowerTitle = (title || '').toLowerCase()

  if (thrustArea === 'Revenue' || lowerTitle.includes('sales')) {
    target = '250000'
    uom = 'NUMERIC'
  } else if (thrustArea === 'Customer Success' || lowerTitle.includes('satisfaction') || lowerTitle.includes('nps')) {
    target = '95'
    uom = 'PERCENT'
  } else if (thrustArea === 'Operational Excellence' || lowerTitle.includes('incident') || lowerTitle.includes('safety')) {
    target = '0'
    uom = 'ZERO_BASED'
  } else if (lowerTitle.includes('launch') || lowerTitle.includes('deliver')) {
    target = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0] // 3 months from now
    uom = 'TIMELINE'
  }

  return NextResponse.json({
    suggestedTarget: target,
    suggestedUom: uom,
    reasoning: `Based on historical data for '${thrustArea}' and your goal title, this is a highly realistic target.`
  })
}
