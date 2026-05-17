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
  const hashedEmployeePassword = await bcrypt.hash('emp123', 10)

  console.log('Seeding Global Admin...')
  await prisma.user.create({
    data: {
      id: 'admin-id',
      name: 'Rajesh Sharma',
      email: 'admin@company.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
      department: 'HR',
    }
  })

  console.log('Seeding Managers...')
  await prisma.user.create({
    data: {
      id: 'manager-alpha-id',
      name: 'Priya Menon',
      email: 'manager.alpha@company.com',
      password: hashedManagerPassword,
      role: 'MANAGER',
      department: 'Alpha',
    }
  })

  await prisma.user.create({
    data: {
      id: 'manager-beta-id',
      name: 'Arjun Desai',
      email: 'manager.beta@company.com',
      password: hashedManagerPassword,
      role: 'MANAGER',
      department: 'Beta',
    }
  })

  console.log('Seeding Employees...')
  
  // Team Alpha (Priya Menon)
  await prisma.user.create({
    data: {
      id: 'emp1-id',
      name: 'Sneha Patil',
      email: 'emp1@company.com',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      department: 'Engineering',
      managerId: 'manager-alpha-id',
    }
  })

  await prisma.user.create({
    data: {
      id: 'emp2-id',
      name: 'Rohit Joshi',
      email: 'emp2@company.com',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      department: 'Engineering',
      managerId: 'manager-alpha-id',
    }
  })

  await prisma.user.create({
    data: {
      id: 'emp3-id',
      name: 'Kavya Nair',
      email: 'emp3@company.com',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      department: 'Design',
      managerId: 'manager-alpha-id',
    }
  })

  // Team Beta (Arjun Desai)
  await prisma.user.create({
    data: {
      id: 'emp4-id',
      name: 'Amit Kulkarni',
      email: 'emp4@company.com',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      department: 'Marketing',
      managerId: 'manager-beta-id',
    }
  })

  await prisma.user.create({
    data: {
      id: 'emp5-id',
      name: 'Divya Rao',
      email: 'emp5@company.com',
      password: hashedEmployeePassword,
      role: 'EMPLOYEE',
      department: 'Sales',
      managerId: 'manager-beta-id',
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

  console.log('Seeding complete! (All demo passwords and accounts are aligned with original requirements)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
