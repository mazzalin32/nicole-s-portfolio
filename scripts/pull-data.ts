import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Fetching current data from database...");
  
  const hero = await prisma.heroContent.findFirst();
  const about = await prisma.aboutContent.findFirst();
  const services = await prisma.service.findMany({ include: { features: true }, orderBy: { order: 'asc' } });
  const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
  const platforms = await prisma.platform.findMany({ orderBy: { order: 'asc' } });
  const values = await prisma.value.findMany({ orderBy: { order: 'asc' } });
  const settings = await prisma.siteSettings.findFirst();

  console.log("Generating seed.ts content...");

  const seedContent = `import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "nicolerwigamba@gmail.com";
  const adminName = "Nicole";
  const adminPassword = "admin123";
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // 1. Create/Update Admin
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, name: adminName },
    create: { id: "admin-1", email: adminEmail, password: hashedPassword, name: adminName },
  });

  // 2. Hero Content
  await prisma.heroContent.upsert({
    where: { id: "${hero?.id || 'hero-1'}" },
    update: ${JSON.stringify({
      headline: hero?.headline,
      subtitle: hero?.subtitle,
      ctaText: hero?.ctaText,
      imageUrl: hero?.imageUrl,
      secondaryImageUrl: hero?.secondaryImageUrl,
      studentsCount: hero?.studentsCount,
      roleTitle: hero?.roleTitle,
      roleSubtitle: hero?.roleSubtitle,
    }, null, 2)},
    create: ${JSON.stringify({
      id: hero?.id || 'hero-1',
      headline: hero?.headline,
      subtitle: hero?.subtitle,
      ctaText: hero?.ctaText,
      imageUrl: hero?.imageUrl,
      secondaryImageUrl: hero?.secondaryImageUrl,
      studentsCount: hero?.studentsCount,
      roleTitle: hero?.roleTitle,
      roleSubtitle: hero?.roleSubtitle,
    }, null, 2)},
  });

  // 3. About Content
  await prisma.aboutContent.upsert({
    where: { id: "${about?.id || 'about-1'}" },
    update: ${JSON.stringify({
      introLine: about?.introLine,
      headline: about?.headline,
      description: about?.description,
      ctaText: about?.ctaText,
      imageUrl: about?.imageUrl,
      secondaryImageUrl: about?.secondaryImageUrl,
      quote: about?.quote,
    }, null, 2)},
    create: ${JSON.stringify({
      id: about?.id || 'about-1',
      introLine: about?.introLine,
      headline: about?.headline,
      description: about?.description,
      ctaText: about?.ctaText,
      imageUrl: about?.imageUrl,
      secondaryImageUrl: about?.secondaryImageUrl,
      quote: about?.quote,
    }, null, 2)},
  });

  // 4. Services & Features
  const services = ${JSON.stringify(services.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    iconName: s.iconName,
    order: s.order,
    features: s.features.map(f => f.text)
  })), null, 2)};

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: { title: s.title, description: s.description, iconName: s.iconName, order: s.order },
      create: { id: s.id, title: s.title, description: s.description, iconName: s.iconName, order: s.order },
    });

    await prisma.serviceFeature.deleteMany({ where: { serviceId: s.id } });
    for (const f of s.features) {
      await prisma.serviceFeature.create({
        data: { text: f, serviceId: s.id }
      });
    }
  }

  // 5. Skills
  const skills = ${JSON.stringify(skills.map(sk => ({
    id: sk.id,
    name: sk.name,
    description: sk.description,
    category: sk.category,
    level: sk.level,
    order: sk.order
  })), null, 2)};

  for (const sk of skills) {
    await prisma.skill.upsert({
      where: { id: sk.id },
      update: { name: sk.name, description: sk.description, category: sk.category, level: sk.level, order: sk.order },
      create: sk,
    });
  }

  // 6. Platforms
  const platforms = ${JSON.stringify(platforms.map(p => p.name))};
  await prisma.platform.deleteMany({});
  for (let i = 0; i < platforms.length; i++) {
    await prisma.platform.create({
      data: { name: platforms[i], order: i }
    });
  }

  // 7. Values
  const values = ${JSON.stringify(values.map(v => ({
    id: v.id,
    title: v.title,
    description: v.description,
    order: v.order
  })), null, 2)};

  for (const v of values) {
    await prisma.value.upsert({
      where: { id: v.id },
      update: { title: v.title, description: v.description, order: v.order },
      create: v,
    });
  }

  // 8. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "${settings?.id || 'settings-1'}" },
    update: { ownerName: "${settings?.ownerName || 'Nicole'}", contactEmail: "${settings?.contactEmail || 'nicolerwigamba@gmail.com'}" },
    create: { 
      id: "${settings?.id || 'settings-1'}", 
      ownerName: "${settings?.ownerName || 'Nicole'}", 
      contactEmail: "${settings?.contactEmail || 'nicolerwigamba@gmail.com'}",
      phoneNumber: "${settings?.phoneNumber || ''}",
      instagramUrl: "${settings?.instagramUrl || ''}"
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
`;

  const seedPath = path.join(process.cwd(), "prisma", "seed.ts");
  fs.writeFileSync(seedPath, seedContent);
  console.log("Successfully updated " + seedPath + " with live data!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
