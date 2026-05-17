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
  const passwordHash = await bcrypt.hash('demo123', 10)

  console.log('Seeding System Admin...')
  const admin = await prisma.user.create({
    data: {
      name: 'Global Admin',
      email: 'admin@atomberg.com',
      password: passwordHash,
      role: 'ADMIN',
      department: 'HR',
    }
  })

  console.log('Seeding Managers...')
  const salesManager = await prisma.user.create({
    data: {
      name: 'Sarah (Sales Manager)',
      email: 'manager.sales@atomberg.com',
      password: passwordHash,
      role: 'MANAGER',
      department: 'Sales',
    }
  })

  const engManager = await prisma.user.create({
    data: {
      name: 'Erica (Eng Manager)',
      email: 'manager.eng@atomberg.com',
      password: passwordHash,
      role: 'MANAGER',
      department: 'Engineering',
    }
  })

  const opsManager = await prisma.user.create({
    data: {
      name: 'Oscar (Ops Manager)',
      email: 'manager.ops@atomberg.com',
      password: passwordHash,
      role: 'MANAGER',
      department: 'Operations',
    }
  })

  console.log('Seeding Employees...')
  await prisma.user.createMany({
    data: [
      // Sales Team
      {
        name: 'Alice (AE)',
        email: 'employee.sales1@atomberg.com',
        password: passwordHash,
        role: 'EMPLOYEE',
        department: 'Sales',
        managerId: salesManager.id,
      },
      {
        name: 'Alex (SDR)',
        email: 'employee.sales2@atomberg.com',
        password: passwordHash,
        role: 'EMPLOYEE',
        department: 'Sales',
        managerId: salesManager.id,
      },
      // Engineering Team
      {
        name: 'Bob (Frontend)',
        email: 'employee.eng1@atomberg.com',
        password: passwordHash,
        role: 'EMPLOYEE',
        department: 'Engineering',
        managerId: engManager.id,
      },
      {
        name: 'Bella (Backend)',
        email: 'employee.eng2@atomberg.com',
        password: passwordHash,
        role: 'EMPLOYEE',
        department: 'Engineering',
        managerId: engManager.id,
      },
      // Operations Team
      {
        name: 'Charlie (Logistics)',
        email: 'employee.ops1@atomberg.com',
        password: passwordHash,
        role: 'EMPLOYEE',
        department: 'Operations',
        managerId: opsManager.id,
      }
    ]
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

  console.log('Seeding complete! (All passwords are "demo123")')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
