import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

// The database URL in .env is "file:./dev.db" relative to project root (not prisma folder)
const dbPath = path.join(process.cwd(), "dev.db");
console.log("Using database at:", dbPath);
const db = new Database(dbPath);

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  // Insert admin
  db.prepare(`
    INSERT OR REPLACE INTO Admin (id, email, password, name, createdAt)
    VALUES ('admin-1', 'ashimwegra12@gmail.com', '${hashedPassword}', 'Gracious', datetime('now'))
  `).run();

  // Insert Hero content
  db.prepare(`
    INSERT OR REPLACE INTO HeroContent (id, headline, subtitle, ctaText, studentsCount, roleTitle, roleSubtitle)
    VALUES ('hero-1', 'HI, I''m Gracious', 'Lifestyle Influencer & Content Creator', 'Work With Me', '500K+', 'Your Style & Lifestyle Muse', 'Lifestyle Influencer & Content Creator')
  `).run();

  // Insert About content
  db.prepare(`
    INSERT OR REPLACE INTO AboutContent (id, introLine, headline, description, ctaText)
    VALUES ('about-1', 'Hey, I''m Gracious', 'Influencer, Content Creator, and Your Lifestyle Muse', 'I remember the moment I decided to share my authentic self with the world. That''s when everything changed.

If you''ve ever felt uninspired or stuck in a rut – you''re not alone. I''ve been there. Now, I''m here to inspire you to embrace your unique style, live authentically, and create a life that feels exciting, beautiful, and so you.', 'Work With Me')
  `).run();

  // Insert Values
  const values = [
    { id: "value-1", title: "Authenticity", description: "Being real and genuine in everything I share. I believe in showing up as my true self and inspiring others to do the same – no filters, no facades.", order: 1 },
    { id: "value-2", title: "Creativity", description: "Pushing boundaries and thinking outside the box. Every piece of content is an opportunity to create something beautiful, meaningful, and inspiring.", order: 2 },
    { id: "value-3", title: "Connection", description: "Building genuine relationships with my community. It's not about followers – it's about creating real connections and lifting each other up.", order: 3 },
    { id: "value-4", title: "Inspiration", description: "Empowering others to embrace their unique style and live boldly. My mission is to inspire you to be confident, creative, and unapologetically yourself.", order: 4 },
  ];

  const insertValue = db.prepare(`
    INSERT OR REPLACE INTO Value (id, title, description, "order")
    VALUES (?, ?, ?, ?)
  `);

  for (const value of values) {
    insertValue.run(value.id, value.title, value.description, value.order);
  }

  // Insert Site Settings
  db.prepare(`
    INSERT OR REPLACE INTO SiteSettings (id, ownerName, contactEmail, phoneNumber, instagramUrl)
    VALUES ('settings-1', 'Gracious', 'ashimwegra12@gmail.com', '0792630152', 'https://www.instagram.com/___.ashimwe_?igsh=d291eDF1djE0bjA3')
  `).run();

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    db.close();
  });
