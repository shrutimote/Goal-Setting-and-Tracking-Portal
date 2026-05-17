import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const managerId = searchParams.get('managerId')

  if (!managerId) {
    return NextResponse.json({ error: 'Manager ID is required' }, { status: 400 })
  }

  try {
    const data = await request.json()
    
    // Server-side validation
    if (!data.title || data.title.trim() === '') {
      return NextResponse.json({ error: 'Goal title is required' }, { status: 400 })
    }

    const weightage = Number(data.weightage)
    if (isNaN(weightage) || weightage < 10) {
      return NextResponse.json({ error: 'Minimum weightage is 10%' }, { status: 400 })
    }

    // Fetch all employees reporting directly to this manager
    const directReports = await prisma.user.findMany({
      where: { managerId }
    })

    if (directReports.length === 0) {
      return NextResponse.json({ error: 'No team members report to this manager' }, { status: 404 })
    }

    const createdGoals = []

    for (const report of directReports) {
      const userGoals = await prisma.goal.findMany({
        where: { employeeId: report.id }
      })

      // Skip this member if they already have 8 or more goals
      if (userGoals.length >= 8) continue

      // Make sure the total weightage won't exceed 100%
      const currentTotalWeightage = userGoals.reduce((sum, g) => sum + g.weightage, 0)
      let adjustedWeightage = weightage
      if (currentTotalWeightage + adjustedWeightage > 100) {
        adjustedWeightage = 100 - currentTotalWeightage
      }

      // If the employee already has 100% weightage completed, skip
      if (adjustedWeightage <= 0) continue

      const goal = await prisma.goal.create({
        data: {
          title: data.title,
          description: data.description || '',
          thrustArea: data.thrustArea || 'Team KPI',
          uom: data.uom || 'Numeric',
          target: data.target || '100',
          weightage: adjustedWeightage,
          employeeId: report.id,
        }
      })
      createdGoals.push(goal)
    }

    return NextResponse.json({ 
      success: true, 
      pushedCount: createdGoals.length, 
      totalTeam: directReports.length 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
