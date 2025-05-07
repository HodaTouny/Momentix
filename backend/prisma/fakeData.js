
const {PrismaClient} = new PrismaClient();
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: 'Dummy Admin',
      email: 'admin1@example.com',
      password: await bcrypt.hash('Admin123@', 10),
      role: 'Admin',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Dummy User',
      email: 'user@example.com',
      password: await bcrypt.hash('User123@', 10),
      role: 'User',
    },
  });

  await prisma.event.create({
    data: {
      title: 'Tech Conference 2025',
      description: 'A full-day event about modern tech stacks.',
      category: 'Tech',
      date: new Date('2025-07-01T10:00:00Z'),
      venue: 'Online',
      price: 0,
      image: 'https://via.placeholder.com/600x400',
      created_by: 1, 
    },
  });
}

main()
  .then(() => console.log('dummy data created successfully'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }).finally(() => prisma.$disconnect());
