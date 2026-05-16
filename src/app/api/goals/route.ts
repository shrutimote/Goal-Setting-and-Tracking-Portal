import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const goals = await prisma.goal.findMany({
    where: { employeeId: userId },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(goals)
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Server-side Validation
    const userGoals = await prisma.goal.findMany({ where: { employeeId: userId } })
    if (userGoals.length >= 8) {
      return NextResponse.json({ error: 'Maximum 8 goals allowed' }, { status: 400 })
    }

    if (data.weightage < 10) {
      return NextResponse.json({ error: 'Minimum weightage is 10%' }, { status: 400 })
    }

    const currentTotalWeightage = userGoals.reduce((sum, g) => sum + g.weightage, 0)
    if (currentTotalWeightage + data.weightage > 100) {
      return NextResponse.json({ error: 'Total weightage cannot exceed 100%' }, { status: 400 })
    }

    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        thrustArea: data.thrustArea,
        uom: data.uom,
        target: data.target,
        weightage: Number(data.weightage),
        employeeId: userId,
      }
    })

    return NextResponse.json(goal)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
