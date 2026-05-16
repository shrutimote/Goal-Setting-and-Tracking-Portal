import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rules = await prisma.escalationRule.findMany()
    const logs = await prisma.escalationLog.findMany({
      include: {
        user: true,
        rule: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // If no rules exist, create a default one for demo purposes
    if (rules.length === 0) {
      const defaultRule = await prisma.escalationRule.create({
        data: {
          name: 'Goal Submission Deadline',
          conditionType: 'NO_GOAL_SUBMITTED',
          daysThreshold: 14,
          action: 'NOTIFY_MANAGER'
        }
      })
      rules.push(defaultRule)
    }

    return NextResponse.json({ rules, logs })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
