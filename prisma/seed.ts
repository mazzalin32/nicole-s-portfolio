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
  "headline": "HI, I'm Nicole",
  "subtitle": "Virtual Assistant with hands-on experience in admin support, financial administration, operations management, and stakeholder engagement — helping businesses and brands streamline operations so you can focus on what matters most.",
  "ctaText": "Work With Me",
  "imageUrl": "/uploads/19b2aac9-6ae8-41a2-ac73-c92c06206af6.jpg",
  "secondaryImageUrl": "/uploads/5f4c47d7-6425-4fcf-8b0b-4e4becaa095b.jpg",
  "studentsCount": "3,000+ Stakeholders Served",
  "roleTitle": "Expert Virtual Assistant",
  "roleSubtitle": "Admin & Operations Support Specialist"
},
    create: {
  "id": "hero-1",
  "headline": "HI, I'm Nicole",
  "subtitle": "Virtual Assistant with hands-on experience in admin support, financial administration, operations management, and stakeholder engagement — helping businesses and brands streamline operations so you can focus on what matters most.",
  "ctaText": "Work With Me",
  "imageUrl": "/uploads/19b2aac9-6ae8-41a2-ac73-c92c06206af6.jpg",
  "secondaryImageUrl": "/uploads/5f4c47d7-6425-4fcf-8b0b-4e4becaa095b.jpg",
  "studentsCount": "3,000+ Stakeholders Served",
  "roleTitle": "Expert Virtual Assistant",
  "roleSubtitle": "Admin & Operations Support Specialist"
},
  });

  // 3. About Content
  await prisma.aboutContent.upsert({
    where: { id: "about-1" },
    update: {
  "introLine": "Hey, I'm Nicole",
  "headline": "Virtual Assistant & Administrative Professional",
  "description": "I'm a dedicated Virtual Assistant and Administrative Professional with hands-on experience across hospitality, education, and tourism sectors. Currently serving as Campus Administrator at African Leadership University, I manage front desk operations and support a community of over 3,000 stakeholders, maintaining a 99% SLA compliance rate on ticketing and coordinating end-to-end event logistics.\n\nMy background spans admin support, financial administration, operations coordination, and stakeholder engagement, giving me a well-rounded skill set that I bring to every client I support.\n\nTrilingual in English, French, and Kinyarwanda, I'm well-positioned to support clients across diverse and fast-paced environments.`",
  "ctaText": "Work With Me",
  "imageUrl": "/nicole-about.png",
  "secondaryImageUrl": "",
  "quote": "Every detail managed so you can focus on the bigger picture."
},
    create: {
  "id": "about-1",
  "introLine": "Hey, I'm Nicole",
  "headline": "Virtual Assistant & Administrative Professional",
  "description": "I'm a dedicated Virtual Assistant and Administrative Professional with hands-on experience across hospitality, education, and tourism sectors. Currently serving as Campus Administrator at African Leadership University, I manage front desk operations and support a community of over 3,000 stakeholders, maintaining a 99% SLA compliance rate on ticketing and coordinating end-to-end event logistics.\n\nMy background spans admin support, financial administration, operations coordination, and stakeholder engagement, giving me a well-rounded skill set that I bring to every client I support.\n\nTrilingual in English, French, and Kinyarwanda, I'm well-positioned to support clients across diverse and fast-paced environments.`",
  "ctaText": "Work With Me",
  "imageUrl": "/nicole-about.png",
  "secondaryImageUrl": "",
  "quote": "Every detail managed so you can focus on the bigger picture."
},
  });

  // 4. Services & Features
  const services = [
  {
    "id": "va-1",
    "title": "Administrative Support",
    "description": "Comprehensive administrative assistance to keep your business organised and running smoothly.",
    "iconName": "briefcase",
    "order": 1,
    "features": [
      "Calendar Management",
      "Email Organization",
      "Travel Planning",
      "Data Entry & File Organization"
    ]
  },
  {
    "id": "va-2",
    "title": "Operations & Financial Administration",
    "description": "Hands-on support managing your day-to-day operations and financial processes with accuracy and efficiency.",
    "iconName": "settings",
    "order": 2,
    "features": [
      "Financial Record Management",
      "Invoice & Payment Processing",
      "Vendor Coordination",
      "Reporting & Reconciliation",
      "SLA Monitoring"
    ]
  },
  {
    "id": "va-3",
    "title": "Customer & Stakeholder Support",
    "description": "Professional communication management to maintain excellent relationships with clients, vendors, and stakeholders.",
    "iconName": "users",
    "order": 3,
    "features": [
      "Email Management",
      "Inquiry Handling (Freshdesk, Gmail)",
      "Stakeholder Engagement",
      "Complaint Resolution",
      "Professional Communication"
    ]
  },
  {
    "id": "va-4",
    "title": "Project & Task Management",
    "description": "Overseeing tasks and projects from inception to completion, ensuring deadlines are consistently met.",
    "iconName": "clipboard-list",
    "order": 4,
    "features": [
      "Task Tracking (Jira, Trello)",
      "Team Coordination",
      "Deadline Monitoring",
      "Resource Allocation",
      "Progress Reporting"
    ]
  },
  {
    "id": "cmodlapiw000j04kww6hd7jm7",
    "title": "Process Optimization",
    "description": "Building systems and workflows that save you time, reduce errors, and scale with your business.",
    "iconName": "zap",
    "order": 5,
    "features": [
      "Workflow Creation",
      "Tool Integration",
      "SOP Development",
      "Audit & Review"
    ]
  },
  {
    "id": "cmodlaq45000o04kwrai896nd",
    "title": "Helpdesk & Ticket Management",
    "description": "Responsive helpdesk support that keeps your inbox and ticketing system running efficiently.",
    "iconName": "headphones",
    "order": 6,
    "features": [
      "Freshdesk Ticket Management",
      "SLA Compliance Monitoring",
      "Query Categorisation & Prioritisation",
      "Escalation Handling",
      "Reporting & Analytics"
    ]
  },
  {
    "id": "cmodlaqph000u04kwotr94mdm",
    "title": "Travel & Tourism Administration",
    "description": "End-to-end travel coordination and tourism support for businesses, teams, and clients.",
    "iconName": "map-pin",
    "order": 7,
    "features": [
      "Itinerary Planning & Coordination",
      "Transport & Logistics Management",
      "Hotel & Venue Booking",
      "Tour Package Research",
      "New Feature"
    ]
  }
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
  {
    "id": "skill-1",
    "name": "Communication",
    "description": "Clear, professional, and empathetic interactions across all channels",
    "category": "Creative",
    "level": 0,
    "order": 1
  },
  {
    "id": "skill-2",
    "name": "Problem-Solving",
    "description": "Creative and practical solutions for operational challenges",
    "category": "Creative",
    "level": 0,
    "order": 2
  },
  {
    "id": "skill-3",
    "name": "Adaptability",
    "description": "Flexible approach to changing priorities and environments",
    "category": "Creative",
    "level": 0,
    "order": 3
  },
  {
    "id": "skill-4",
    "name": "Attention to Detail",
    "description": "Precision and accuracy in every task",
    "category": "Creative",
    "level": 0,
    "order": 4
  },
  {
    "id": "skill-5",
    "name": "Organisation",
    "description": "Systematic approach to workflow and records management",
    "category": "Creative",
    "level": 0,
    "order": 5
  },
  {
    "id": "skill-6",
    "name": "Time Management",
    "description": "Efficient prioritisation and consistent deadline delivery",
    "category": "Creative",
    "level": 0,
    "order": 6
  },
  {
    "id": "skill-7",
    "name": "Microsoft Office Suite",
    "description": null,
    "category": "Technical",
    "level": 95,
    "order": 7
  },
  {
    "id": "skill-8",
    "name": "Google Workspace",
    "description": null,
    "category": "Technical",
    "level": 95,
    "order": 8
  },
  {
    "id": "skill-9",
    "name": "Freshdesk",
    "description": null,
    "category": "Technical",
    "level": 95,
    "order": 9
  },
  {
    "id": "skill-10",
    "name": "Trello / Asana",
    "description": null,
    "category": "Technical",
    "level": 90,
    "order": 10
  },
  {
    "id": "skill-11",
    "name": "Jira",
    "description": null,
    "category": "Technical",
    "level": 90,
    "order": 11
  },
  {
    "id": "skill-12",
    "name": "QuickBooks",
    "description": null,
    "category": "Technical",
    "level": 85,
    "order": 12
  },
  {
    "id": "cmoe897fn000004jn6kqmt4uc",
    "name": "Stakeholder Engagement",
    "description": "Building and maintaining professional relationships",
    "category": "Creative",
    "level": 0,
    "order": 13
  },
  {
    "id": "cmoe897to000104jnv6f1zbmb",
    "name": "Zoom / Slack / Teams",
    "description": null,
    "category": "Technical",
    "level": 90,
    "order": 14
  }
];

  for (const sk of skills) {
    await prisma.skill.upsert({
      where: { id: sk.id },
      update: { name: sk.name, description: sk.description, category: sk.category, level: sk.level, order: sk.order },
      create: sk,
    });
  }

  // 6. Platforms
  const platforms = ["Freshdesk","Trello","Asana","Jira","Google Workspace","Microsoft Office","Calendly","QuickBooks","Canva"];
  await prisma.platform.deleteMany({});
  for (let i = 0; i < platforms.length; i++) {
    await prisma.platform.create({
      data: { name: platforms[i], order: i }
    });
  }

  // 7. Values
  const values = [
  {
    "id": "value-1",
    "title": "Professionalism",
    "description": "I hold myself to the highest standards in every interaction, delivering quality work and communicating with clarity and respect.",
    "order": 1
  },
  {
    "id": "value-2",
    "title": "Attention to Detail",
    "description": "I believe precision matters. From data entry to stakeholder communication, I ensure nothing falls through the cracks.",
    "order": 2
  },
  {
    "id": "value-3",
    "title": "Reliability",
    "description": "My clients can rely on me. I fulfil commitments, keep confidentiality, and consistently show up, regardless of the task.",
    "order": 3
  },
  {
    "id": "value-4",
    "title": "Efficiency",
    "description": "I'm always looking for smarter ways to work. I bring structure and process to every project so your time and resources are never wasted.",
    "order": 4
  },
  {
    "id": "cmoe8fa89000304l4zduiwogl",
    "title": "Adaptability",
    "description": "Every client and business is different. I adjust quickly to new environments, tools, and priorities, delivering results regardless of the challenge.",
    "order": 5
  },
  {
    "id": "cmoe8gbws000404l48lho4sht",
    "title": "Integrity",
    "description": "I operate with honesty and transparency in everything I do. You'll always know where things stand and can trust that your business is in good hands.",
    "order": 6
  }
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
    update: { ownerName: "Liliane Nicole", contactEmail: "nicolerwigamba@gmail.com" },
    create: { 
      id: "settings-1", 
      ownerName: "Liliane Nicole", 
      contactEmail: "nicolerwigamba@gmail.com",
      phoneNumber: "+250780465621",
      instagramUrl: ""
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
