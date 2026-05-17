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

  console.log('Seeding Global Admin...')
  await prisma.user.create({
    data: {
      id: 'admin-id',
      name: 'Global Admin',
      email: 'admin@atomberg.com',
      password: passwordHash,
      role: 'ADMIN',
      department: 'HR',
    }
  })

  console.log('Seeding Managers...')
  await prisma.user.create({
    data: {
      id: 'manager-sales-id',
      name: 'Sarah (Sales Manager)',
      email: 'manager.sales@atomberg.com',
      password: passwordHash,
      role: 'MANAGER',
      department: 'Sales',
    }
  })

  await prisma.user.create({
    data: {
      id: 'manager-eng-id',
      name: 'Erica (Eng Manager)',
      email: 'manager.eng@atomberg.com',
      password: passwordHash,
      role: 'MANAGER',
      department: 'Engineering',
    }
  })

  await prisma.user.create({
    data: {
      id: 'manager-ops-id',
      name: 'Oscar (Ops Manager)',
      email: 'manager.ops@atomberg.com',
      password: passwordHash,
      role: 'MANAGER',
      department: 'Operations',
    }
  })

  console.log('Seeding Employees...')
  
  // Sales Team
  await prisma.user.create({
    data: {
      id: 'employee-sales1-id',
      name: 'Alice (AE)',
      email: 'employee.sales1@atomberg.com',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Sales',
      managerId: 'manager-sales-id',
    }
  })

  await prisma.user.create({
    data: {
      id: 'employee-sales2-id',
      name: 'Alex (SDR)',
      email: 'employee.sales2@atomberg.com',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Sales',
      managerId: 'manager-sales-id',
    }
  })

  // Engineering Team
  await prisma.user.create({
    data: {
      id: 'employee-eng1-id',
      name: 'Bob (Frontend)',
      email: 'employee.eng1@atomberg.com',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Engineering',
      managerId: 'manager-eng-id',
    }
  })

  await prisma.user.create({
    data: {
      id: 'employee-eng2-id',
      name: 'Bella (Backend)',
      email: 'employee.eng2@atomberg.com',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Engineering',
      managerId: 'manager-eng-id',
    }
  })

  // Operations Team
  await prisma.user.create({
    data: {
      id: 'employee-ops1-id',
      name: 'Charlie (Logistics)',
      email: 'employee.ops1@atomberg.com',
      password: passwordHash,
      role: 'EMPLOYEE',
      department: 'Operations',
      managerId: 'manager-ops-id',
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

  console.log('Seeding complete! (All passwords are "demo123" and IDs are hardcoded)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
