const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  await prisma.escalationLog.deleteMany()
  await prisma.escalationRule.deleteMany()
  await prisma.checkIn.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.user.deleteMany()

  console.log('Hashing passwords...')
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const hashedManagerPassword = await bcrypt.hash('manager123', 10)
  const hashedEmployeePassword = await bcrypt.hash('employee123', 10)

  console.log('Seeding users...')
  
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@atomberg.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
      department: 'HR',
    }
  })

  const manager = await prisma.user.create({
    data: {
      name: 'Sales Manager',
      email: 'manager@atomberg.com',
      password: hashedManagerPassword,
      role: 'MANAGER',
      department: 'Sales',
    }
  })

  const employee = await prisma.user.create({
    data: {
      name: 'Test Employee',
      email: 'employee@atomberg.com',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      department: 'Sales',
      managerId: manager.id,
    }
  })

  console.log('Seeding default escalation rule...')
  await prisma.escalationRule.create({
    data: {
      name: 'Goal Submission Deadline',
      conditionType: 'NO_GOAL_SUBMITTED',
      daysThreshold: 14,
      action: 'NOTIFY_MANAGER'
    }
  })

  console.log('Seeding complete!')
  console.log('--- TEST CREDENTIALS ---')
  console.log('Admin: admin@atomberg.com / admin123')
  console.log('Manager: manager@atomberg.com / manager123')
  console.log('Employee: employee@atomberg.com / employee123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
