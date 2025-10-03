import prisma from '../src/prisma/client.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const username = process.env.SUPERADMIN_USERNAME;
  const password = process.env.SUPERADMIN_PASSWORD;
  const role = process.env.SUPERADMIN_ROLE;

  const existing = await prisma.admin.findUnique({ where: { username } });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
    console.log(`✅ Superadmin created: ${admin.username}`);
  } else {
    console.log(`ℹ️ Superadmin already exists: ${existing.username}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
