const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const defaultManager = await prisma.user.findFirst({
    where: { role: 'MANAGER' }
  })
  
  if (defaultManager) {
    const res = await prisma.user.updateMany({
      where: { role: 'EMPLOYEE', managerId: null },
      data: { managerId: defaultManager.id }
    })
    console.log(`Updated ${res.count} employees with missing managerIds`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
