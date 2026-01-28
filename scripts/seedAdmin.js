const { PrismaClient, Role } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Hash password
  const password = await bcrypt.hash('admin123', 10)

  // Create Admin User + Admin Profile
  const admin = await prisma.user.create({
    data: {
      firstName:"admin1",
      lastName:"1",
      email: 'admin@bms.com',
      password: password,
      role: Role.ADMIN,
      status: true,

      // Create related Admin record
      admin: {
        create: {
          position: 'Main Admin',
          phone: '0712345678',
          status: true,
        },
      },
    },

    include: {
      admin: true,
    },
  })

  console.log('✅ Admin created:', admin)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
