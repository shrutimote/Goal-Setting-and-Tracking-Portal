import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 1. Fetch active rules
    const rules = await prisma.escalationRule.findMany({
      where: { isActive: true }
    })

    // 2. Fetch all users
    const users = await prisma.user.findMany({
      include: { goals: true, manager: true }
    })

    let escalationsCreated = 0

    // 3. Process rules
    for (const rule of rules) {
      if (rule.conditionType === 'NO_GOAL_SUBMITTED') {
        for (const user of users) {
          if (user.role === 'EMPLOYEE' && user.goals.length === 0) {
            // Check if log already exists
            const existingLog = await prisma.escalationLog.findFirst({
              where: { ruleId: rule.id, userId: user.id, status: 'OPEN' }
            })

            if (!existingLog) {
              await prisma.escalationLog.create({
                data: {
                  ruleId: rule.id,
                  userId: user.id,
                  details: `${user.name} has not submitted goals. Escalate to ${rule.action.replace('NOTIFY_', '')}.`
                }
              })
              escalationsCreated++
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Escalation engine ran successfully. Created ${escalationsCreated} new logs.`,
      escalationsCreated
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
