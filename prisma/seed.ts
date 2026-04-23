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
    update: {},
    create: {
      id: "hero-1",
      headline: "HI, I'm Nicole",
      subtitle: "Lifestyle Influencer & Content Creator",
      ctaText: "Work With Me",
      imageUrl: "/nicole-hero.png",
      studentsCount: "500K+",
      roleTitle: "Your Style & Lifestyle Muse",
      roleSubtitle: "Lifestyle Influencer & Content Creator",
    },
  });

  // 3. About Content
  await prisma.aboutContent.upsert({
    where: { id: "about-1" },
    update: {},
    create: {
      id: "about-1",
      introLine: "Hey, I'm Nicole",
      headline: "Influencer, Content Creator, and Your Lifestyle Muse",
      description: "I remember the moment I decided to share my authentic self with the world. That's when everything changed.\n\nIf you've ever felt uninspired or stuck in a rut – you're not alone. I've been there. Now, I'm here to inspire you to embrace your unique style, live authentically, and create a life that feels exciting, beautiful, and so you.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-about.png",
      quote: "I inspire others to embrace their authentic style and live their best life with grace.",
    },
  });

  // 4. Services & Features
  const services = [
    {
      id: "service-1",
      title: "Content Creation",
      description: "High-quality photo and video content for brands looking to connect with their audience authentically.",
      iconName: "Camera",
      order: 1,
      features: ["Photo shoots", "Video content", "Behind-the-scenes", "Product showcases"],
    },
    {
      id: "service-2",
      title: "Brand Collaborations",
      description: "Strategic partnerships that align with my values and resonate with my engaged community.",
      iconName: "Users",
      order: 2,
      features: ["Sponsored posts", "Brand ambassadorship", "Campaign features", "Product launches"],
    },
    {
      id: "service-3",
      title: "Social Media Consulting",
      description: "Guidance on building an authentic social media presence that attracts and engages your ideal audience.",
      iconName: "Megaphone",
      order: 3,
      features: ["Strategy sessions", "Content planning", "Growth tips", "Engagement tactics"],
    },
    {
      id: "service-4",
      title: "Speaking Engagements",
      description: "Inspiring talks on personal branding, authenticity, and building a lifestyle brand.",
      iconName: "Mic",
      order: 4,
      features: ["Keynote speeches", "Panel discussions", "Workshop hosting", "Event appearances"],
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
    { id: "skill-1", name: "Storytelling", description: "Crafting compelling narratives that resonate", category: "Creative", level: 0, order: 1 },
    { id: "skill-2", name: "Communication", description: "Clear, authentic, and engaging interactions", category: "Creative", level: 0, order: 2 },
    { id: "skill-3", name: "Creativity", description: "Fresh ideas and unique perspectives", category: "Creative", level: 0, order: 3 },
    { id: "skill-4", name: "Adaptability", description: "Thriving across platforms and trends", category: "Creative", level: 0, order: 4 },
    { id: "skill-5", name: "Connection", description: "Building genuine community relationships", category: "Creative", level: 0, order: 5 },
    { id: "skill-6", name: "Authenticity", description: "Staying true to personal values", category: "Creative", level: 0, order: 6 },
    { id: "skill-7", name: "Photography", description: null, category: "Technical", level: 95, order: 7 },
    { id: "skill-8", name: "Video Editing", description: null, category: "Technical", level: 90, order: 8 },
    { id: "skill-9", name: "Social Media Strategy", description: null, category: "Technical", level: 95, order: 9 },
    { id: "skill-10", name: "Content Planning", description: null, category: "Technical", level: 90, order: 10 },
    { id: "skill-11", name: "Brand Development", description: null, category: "Technical", level: 85, order: 11 },
    { id: "skill-12", name: "Community Management", description: null, category: "Technical", level: 90, order: 12 },
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
