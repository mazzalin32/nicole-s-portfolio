import "dotenv/config";
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
    where: { id: "hero-1" },
    update: {
      headline: "HI, I'm Nicole",
      subtitle: "Experienced Virtual Assistant dedicated to streamlining your business operations and enhancing productivity through efficient administrative support.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-hero.png",
      secondaryImageUrl: "/nicole-hero-2.png",
      studentsCount: "100+",
      roleTitle: "Expert Virtual Assistant",
      roleSubtitle: "Strategic Business Partner",
    },
    create: {
      id: "hero-1",
      headline: "HI, I'm Nicole",
      subtitle: "Experienced Virtual Assistant dedicated to streamlining your business operations and enhancing productivity through efficient administrative support.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-hero.png",
      secondaryImageUrl: "/nicole-hero-2.png",
      studentsCount: "100+",
      roleTitle: "Expert Virtual Assistant",
      roleSubtitle: "Strategic Business Partner",
    },
  });

  // 3. About Content
  await prisma.aboutContent.upsert({
    where: { id: "about-1" },
    update: {
      introLine: "Hey, I'm Nicole",
      headline: "Expert Virtual Assistant & Strategic Business Partner",
      description: "I specialize in providing high-level administrative support and strategic operations management to help entrepreneurs and businesses scale efficiently.\n\nWhether you need calendar management, process optimization, or executive-level assistance, I'm here to ensure your business runs smoothly so you can focus on your vision.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-about.png",
      secondaryImageUrl: "/nicole-about-2.png",
      quote: "Streamlining your business operations with precision and professional excellence.",
    },
    create: {
      id: "about-1",
      introLine: "Hey, I'm Nicole",
      headline: "Expert Virtual Assistant & Strategic Business Partner",
      description: "I specialize in providing high-level administrative support and strategic operations management to help entrepreneurs and businesses scale efficiently.\n\nWhether you need calendar management, process optimization, or executive-level assistance, I'm here to ensure your business runs smoothly so you can focus on your vision.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-about.png",
      secondaryImageUrl: "/nicole-about-2.png",
      quote: "Streamlining your business operations with precision and professional excellence.",
    },
  });

  // 4. Services & Features
  const services = [
    {
      id: "service-1",
      title: "Administrative Support",
      description: "Comprehensive executive-level assistance to keep your business running smoothly.",
      iconName: "Calendar",
      order: 1,
      features: ["Calendar Management", "Email Organization", "Travel Planning", "Data Entry"],
    },
    {
      id: "service-2",
      title: "Social Media Management",
      description: "Strategic planning and execution for your social media platforms.",
      iconName: "Share2",
      order: 2,
      features: ["Content Scheduling", "Engagement", "Basic Analytics", "Visual Assets"],
    },
    {
      id: "service-3",
      title: "Process Optimization",
      description: "Building systems and workflows that save you time and money.",
      iconName: "Settings",
      order: 3,
      features: ["Workflow Creation", "Tool Integration", "SOP Development", "Audit & Review"],
    },
    {
      id: "service-4",
      title: "Project Management",
      description: "Overseeing tasks and projects from inception to completion.",
      iconName: "Layout",
      order: 4,
      features: ["Task Tracking", "Team Coordination", "Deadline Monitoring", "Resource Allocation"],
    },
  ];

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
  const skills = [
    { id: "skill-1", name: "Efficiency", description: "Maximizing output while minimizing waste", category: "Creative", level: 0, order: 1 },
    { id: "skill-2", name: "Communication", description: "Clear, professional, and timely interactions", category: "Creative", level: 0, order: 2 },
    { id: "skill-3", name: "Problem Solving", description: "Identifying and resolving operational bottlenecks", category: "Creative", level: 0, order: 3 },
    { id: "skill-4", name: "Adaptability", description: "Thriving in fast-paced business environments", category: "Creative", level: 0, order: 4 },
    { id: "skill-5", name: "Organization", description: "Impeccable management of details and deadlines", category: "Creative", level: 0, order: 5 },
    { id: "skill-6", name: "Discretion", description: "Handling sensitive business information with care", category: "Creative", level: 0, order: 6 },
    { id: "skill-7", name: "CRM Management", description: null, category: "Technical", level: 95, order: 7 },
    { id: "skill-8", name: "Project Tools (Asana/Trello)", description: null, category: "Technical", level: 90, order: 8 },
    { id: "skill-9", name: "Email Marketing Tools", description: null, category: "Technical", level: 95, order: 9 },
    { id: "skill-10", name: "Spreadsheet Proficiency", description: null, category: "Technical", level: 90, order: 10 },
    { id: "skill-11", name: "Tool Integration", description: null, category: "Technical", level: 85, order: 11 },
    { id: "skill-12", name: "Process Automation", description: null, category: "Technical", level: 90, order: 12 },
  ];

  for (const sk of skills) {
    await prisma.skill.upsert({
      where: { id: sk.id },
      update: { name: sk.name, description: sk.description, category: sk.category, level: sk.level, order: sk.order },
      create: sk,
    });
  }

  // 6. Platforms
  const platforms = ["Instagram", "TikTok", "YouTube", "Pinterest", "LinkedIn", "Twitter"];
  await prisma.platform.deleteMany({});
  for (let i = 0; i < platforms.length; i++) {
    await prisma.platform.create({
      data: { name: platforms[i], order: i }
    });
  }

  // 7. Values
  const values = [
    { id: "value-1", title: "Authenticity", description: "Being real and genuine in everything I share. I believe in showing up as my true self and inspiring others to do the same – no filters, no facades.", order: 1 },
    { id: "value-2", title: "Creativity", description: "Pushing boundaries and thinking outside the box. Every piece of content is an opportunity to create something beautiful, meaningful, and inspiring.", order: 2 },
    { id: "value-3", title: "Connection", description: "Building genuine relationships with my community. It's not about followers – it's about creating real connections and lifting each other up.", order: 3 },
    { id: "value-4", title: "Inspiration", description: "Empowering others to embrace their unique style and live boldly. My mission is to inspire you to be confident, creative, and unapologetically yourself.", order: 4 },
  ];

  for (const v of values) {
    await prisma.value.upsert({
      where: { id: v.id },
      update: { title: v.title, description: v.description, order: v.order },
      create: v,
    });
  }

  // 8. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "settings-1" },
    update: { ownerName: adminName, contactEmail: adminEmail },
    create: { id: "settings-1", ownerName: adminName, contactEmail: adminEmail, phoneNumber: "0792630152", instagramUrl: "https://www.instagram.com/___.ashimwe_?igsh=d291eDF1djE0bjA3" },
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
  });
