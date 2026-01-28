import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

console.log("Connecting to database...");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("AdminConfial2026!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@confial.it" },
    update: {},
    create: {
      email: "admin@confial.it",
      name: "Amministratore",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);
  console.log("📧 Email: admin@confial.it");
  console.log("🔑 Password: AdminConfial2026!");
  console.log("⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
