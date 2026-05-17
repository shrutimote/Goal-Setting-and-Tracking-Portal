import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: any }) {
  // Await params for modern Next.js route handlers compatibility
  const resolvedParams = await params
  const { id } = resolvedParams

  try {
    const data = await request.json()
    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        status: data.status,
        isLocked: data.isLocked !== undefined ? data.isLocked : undefined,
        title: data.title !== undefined ? data.title : undefined,
        description: data.description !== undefined ? data.description : undefined,
        thrustArea: data.thrustArea !== undefined ? data.thrustArea : undefined,
        uom: data.uom !== undefined ? data.uom : undefined,
        target: data.target !== undefined ? data.target : undefined,
        weightage: data.weightage !== undefined ? Number(data.weightage) : undefined,
        parentId: data.parentId !== undefined ? data.parentId : undefined
      }
    })
    return NextResponse.json(updatedGoal)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
