import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "nicolerwigamba@gmail.com";
  const adminName = "Nicole";
  const adminPassword = "admin123";
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // 1. Admin
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { name: adminName },
    create: { email: adminEmail, password: hashedPassword, name: adminName },
  });

  // 2. Hero
  await prisma.heroContent.upsert({
    where: { id: "hero-1" },
    update: {
      headline: "HI, I'm Nicole",
      subtitle: "Virtual Assistant with hands-on experience in admin support, financial administration, operations management, and stakeholder engagement — helping businesses and brands streamline operations so you can focus on what matters most.",
      ctaText: "Work With Me",
      imageUrl: "https://1drv.ms/i/c/33b88e4274d7fbbd/IQB7jS_dspFUSqDz9uZ_BWUSAehOboUM0h_JFGzZRslT8zQ?e=19asYn",
      secondaryImageUrl: "/nicole-hero-2.png",
      studentsCount: "3,000+ Stakeholders Served",
      roleTitle: "Expert Virtual Assistant",
      roleSubtitle: "Admin & Operations Support Specialist",
    },
    create: {
      id: "hero-1",
      headline: "HI, I'm Nicole",
      subtitle: "Virtual Assistant with hands-on experience in admin support, financial administration, operations management, and stakeholder engagement — helping businesses and brands streamline operations so you can focus on what matters most.",
      ctaText: "Work With Me",
      imageUrl: "https://1drv.ms/i/c/33b88e4274d7fbbd/IQB7jS_dspFUSqDz9uZ_BWUSAehOboUM0h_JFGzZRslT8zQ?e=19asYn",
      secondaryImageUrl: "/nicole-hero-2.png",
      studentsCount: "3,000+ Stakeholders Served",
      roleTitle: "Expert Virtual Assistant",
      roleSubtitle: "Admin & Operations Support Specialist",
    },
  });

  // 3. About
  await prisma.aboutContent.upsert({
    where: { id: "about-1" },
    update: {
      introLine: "Hey, I'm Nicole",
      headline: "Virtual Assistant & Administrative Professional",
      description: "I'm a dedicated Virtual Assistant and Administrative Professional with hands-on experience across hospitality, education, and tourism sectors. Currently serving as Campus Administrator at African Leadership University, I manage front desk operations and support a community of over 3,000 stakeholders, maintaining a 99% SLA compliance rate on ticketing and coordinating end-to-end event logistics.\n\nMy background spans admin support, financial administration, operations coordination, and stakeholder engagement, giving me a well-rounded skill set that I bring to every client I support.\n\nTrilingual in English, French, and Kinyarwanda, I'm well-positioned to support clients across diverse and fast-paced environments.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-about.png",
      secondaryImageUrl: "",
      quote: "Every detail managed so you can focus on the bigger picture.",
    },
    create: {
      id: "about-1",
      introLine: "Hey, I'm Nicole",
      headline: "Virtual Assistant & Administrative Professional",
      description: "I'm a dedicated Virtual Assistant and Administrative Professional with hands-on experience across hospitality, education, and tourism sectors. Currently serving as Campus Administrator at African Leadership University, I manage front desk operations and support a community of over 3,000 stakeholders, maintaining a 99% SLA compliance rate on ticketing and coordinating end-to-end event logistics.\n\nMy background spans admin support, financial administration, operations coordination, and stakeholder engagement, giving me a well-rounded skill set that I bring to every client I support.\n\nTrilingual in English, French, and Kinyarwanda, I'm well-positioned to support clients across diverse and fast-paced environments.",
      ctaText: "Work With Me",
      imageUrl: "/nicole-about.png",
      secondaryImageUrl: "",
      quote: "Every detail managed so you can focus on the bigger picture.",
    },
  });

  // 4. Services
  const services = [
    {
      id: "va-1",
      title: "Administrative Support",
      description: "Comprehensive administrative management to keep your business running smoothly and efficiently.",
      iconName: "briefcase",
      order: 1,
      features: ["Diary & Calendar Management", "Travel & Logistics Planning", "Front Desk & Reception Operations", "Workflow Automation", "Meeting Coordination"]
    },
    {
      id: "va-2",
      title: "Financial & Systems Administration",
      description: "Meticulous financial records and systems management to ensure operational compliance and clarity.",
      iconName: "calculator",
      order: 2,
      features: ["Invoicing & Expense Tracking", "Budget Monitoring", "Financial Record Maintenance", "Compliance Support", "SLA Monitoring"]
    },
    {
      id: "va-3",
      title: "Customer & Stakeholder Support",
      description: "Professional communication management to maintain excellent relationships with clients, vendors, and stakeholders.",
      iconName: "users",
      order: 3,
      features: ["Email Management", "Inquiry Handling (Freshdesk, Gmail)", "Stakeholder Engagement", "Complaint Resolution", "Professional Communication"]
    },
    {
      id: "va-4",
      title: "Project & Task Management",
      description: "Overseeing tasks and projects from inception to completion, ensuring deadlines are consistently met.",
      iconName: "clipboard-list",
      order: 4,
      features: ["Task Tracking (Jira, Trello)", "Team Coordination", "Deadline Monitoring", "Resource Allocation", "Progress Reporting"]
    },
    {
      id: "cmodlapiw000j04kww6hd7jm7",
      title: "Process Optimization",
      description: "Building systems and workflows that save you time, reduce errors, and scale with your business.",
      iconName: "zap",
      order: 5,
      features: ["Workflow Creation", "Tool Integration", "SOP Development", "Audit & Review"]
    }
  ];

  for (const s of services) {
    const service = await prisma.service.upsert({
      where: { id: s.id },
      update: { title: s.title, description: s.description, iconName: s.iconName, order: s.order },
      create: { id: s.id, title: s.title, description: s.description, iconName: s.iconName, order: s.order },
    });

    await prisma.serviceFeature.deleteMany({ where: { serviceId: s.id } });
    for (const text of s.features) {
      await prisma.serviceFeature.create({
        data: { text, serviceId: s.id }
      });
    }
  }

  // 5. Skills
  const skills = [
    { name: "Communication", category: "Creative", level: 0, order: 1 },
    { name: "Problem-Solving", category: "Creative", level: 0, order: 2 },
    { name: "Adaptability", category: "Creative", level: 0, order: 3 },
    { name: "Attention to Detail", category: "Creative", level: 0, order: 4 },
    { name: "Microsoft Office Suite", category: "Technical", level: 95, order: 7 },
    { name: "Google Workspace", category: "Technical", level: 95, order: 8 },
    { name: "Freshdesk", category: "Technical", level: 95, order: 9 },
    { name: "Trello / Asana", category: "Technical", level: 90, order: 10 },
  ];

  for (const sk of skills) {
    await prisma.skill.create({ data: sk });
  }

  // 6. Values
  const values = [
    { id: "val-1", title: "Integrity", description: "Doing the right thing, even when no one is watching.", order: 1 },
    { id: "val-2", title: "Excellence", description: "Striving for the highest quality in every task.", order: 2 },
    { id: "val-3", title: "Reliability", description: "Being the partner you can count on, every time.", order: 3 },
  ];

  for (const v of values) {
    await prisma.value.upsert({
      where: { id: v.id },
      update: { title: v.title, description: v.description, order: v.order },
      create: v,
    });
  }

  console.log("Database seeded successfully with local snapshot!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
