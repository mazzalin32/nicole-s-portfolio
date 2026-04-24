import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Updating content to Virtual Assistant...");

  // Update Hero
  await prisma.heroContent.updateMany({
    data: {
      headline: "HI, I'm Nicole",
      subtitle: "Experienced Virtual Assistant dedicated to streamlining your business operations and enhancing productivity through efficient administrative support.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-hero.png",
      secondaryImageUrl: "/nicole-hero-2.png",
      studentsCount: "100+",
      roleTitle: "Expert Virtual Assistant",
      roleSubtitle: "Strategic Business Partner",
    }
  });

  // Update About
  await prisma.aboutContent.updateMany({
    data: {
      introLine: "Hey, I'm Nicole",
      headline: "Expert Virtual Assistant & Strategic Business Partner",
      description: "I specialize in providing high-level administrative support and strategic operations management to help entrepreneurs and businesses scale efficiently.\n\nWhether you need calendar management, process optimization, or executive-level assistance, I'm here to ensure your business runs smoothly so you can focus on your vision.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-about.png",
      secondaryImageUrl: "/nicole-about-2.png",
      quote: "Streamlining your business operations with precision and professional excellence.",
    }
  });

  // Update Services to VA ones
  await prisma.service.deleteMany({});
  const vaServices = [
    {
      id: "va-1",
      title: "Administrative Support",
      description: "Comprehensive executive-level assistance to keep your business running smoothly.",
      iconName: "Calendar",
      order: 1,
      features: ["Calendar Management", "Email Organization", "Travel Planning", "Data Entry"],
    },
    {
      id: "va-2",
      title: "Social Media Management",
      description: "Strategic planning and execution for your social media platforms.",
      iconName: "Share2",
      order: 2,
      features: ["Content Scheduling", "Engagement", "Basic Analytics", "Visual Assets"],
    },
    {
      id: "va-3",
      title: "Process Optimization",
      description: "Building systems and workflows that save you time and money.",
      iconName: "Settings",
      order: 3,
      features: ["Workflow Creation", "Tool Integration", "SOP Development", "Audit & Review"],
    },
    {
      id: "va-4",
      title: "Project Management",
      description: "Overseeing tasks and projects from inception to completion.",
      iconName: "Layout",
      order: 4,
      features: ["Task Tracking", "Team Coordination", "Deadline Monitoring", "Resource Allocation"],
    },
  ];

  for (const s of vaServices) {
    await prisma.service.create({
      data: {
        id: s.id,
        title: s.title,
        description: s.description,
        iconName: s.iconName,
        order: s.order,
        features: {
          create: s.features.map(f => ({ text: f }))
        }
      }
    });
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
