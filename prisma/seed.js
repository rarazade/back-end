import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const username = process.env.SUPERADMIN_USERNAME || "superadmin";
  const password = process.env.SUPERADMIN_PASSWORD || "supersecret123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingSuperadmin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!existingSuperadmin) {
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        role: "superadmin",
      },
    });
    console.log(`✅ Superadmin created: ${username}`);
  } else {
    console.log(`ℹ️ Superadmin already exists: ${username}`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
