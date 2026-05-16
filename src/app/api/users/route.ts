import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const managerId = searchParams.get('managerId')

  if (managerId) {
    const team = await prisma.user.findMany({
      where: { managerId }
    })
    return NextResponse.json(team)
  }

  // Admin access to all users
  const users = await prisma.user.findMany()
  return NextResponse.json(users)
}
