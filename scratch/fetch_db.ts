import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const hero = await prisma.heroContent.findFirst();
  const about = await prisma.aboutContent.findFirst();
  const services = await prisma.service.findMany({ include: { features: true } });
  const skills = await prisma.skill.findMany();
  
  console.log(JSON.stringify({ hero, about, services, skills }, null, 2));
}

check()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
