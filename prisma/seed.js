const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data (optional, good for resetting)
  await prisma.checkIn.deleteMany()
  await prisma.goal.deleteMany()
  await prisma.systemSetting.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Alice Admin',
      email: 'admin@atomberg.com',
      role: 'ADMIN',
      department: 'HR'
    }
  })

  // 2. Create Manager
  const manager = await prisma.user.create({
    data: {
      name: 'Bob Manager',
      email: 'manager@atomberg.com',
      role: 'MANAGER',
      department: 'Engineering'
    }
  })

  // 3. Create Employee reporting to Manager
  const employee = await prisma.user.create({
    data: {
      name: 'Charlie Employee',
      email: 'employee@atomberg.com',
      role: 'EMPLOYEE',
      department: 'Engineering',
      managerId: manager.id
    }
  })

  // 4. Initial System Setting
  await prisma.systemSetting.create({
    data: {
      activeWindow: 'GOAL_SETTING'
    }
  })

  console.log('Seeding finished.')
  console.log('Admin:', admin.email)
  console.log('Manager:', manager.email)
  console.log('Employee:', employee.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
