import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const adminEmail = 'admin@example.com';
  const userEmail = 'test@example.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  const existigUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists:', existingAdmin.email);
    return;
  }

  if (existigUser) {
    console.log('Admin user already exists:', existigUser.email);
    return;
  }

  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const userPassword = await bcrypt.hash('Pass@123', 10);

  const admin = await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
      {
        username: 'user1',
        email: userEmail,
        password: userPassword,
        role: 'CUSTOMER',
      },
    ],
  });

  console.log('✅ Admin user created:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
