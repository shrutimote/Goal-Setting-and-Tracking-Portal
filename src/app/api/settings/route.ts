import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const setting = await prisma.systemSetting.findFirst()
  return NextResponse.json(setting)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  const setting = await prisma.systemSetting.findFirst()
  if (setting) {
    const updated = await prisma.systemSetting.update({
      where: { id: setting.id },
      data: { activeWindow: data.activeWindow }
    })
    return NextResponse.json(updated)
  } else {
    const created = await prisma.systemSetting.create({
      data: { activeWindow: data.activeWindow }
    })
    return NextResponse.json(created)
  }
}
