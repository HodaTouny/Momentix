const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123@', 10);
  const existing = await prisma.user.findUnique({ where: { email: 'admin1@gmail.com' } });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Dummy Admin',
        email: 'admin1@gmail.com',
        password: hashedPassword,
        role: 'Admin',
      },
    });
    console.log('Dummy admin created');
  } else {
    console.log('Admin already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
