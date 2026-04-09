import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import About from "@/components/public/About";
import Services from "@/components/public/Services";
import Skills from "@/components/public/Skills";
import Values from "@/components/public/Values";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Always fetch fresh data

async function getData() {
  const [heroData, aboutData, valuesData, settingsData] = await Promise.all([
    prisma.heroContent.findFirst(),
    prisma.aboutContent.findFirst(),
    prisma.value.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSettings.findFirst(),
  ]);

  return { heroData, aboutData, valuesData, settingsData };
}

export default async function Home() {
  const { heroData, aboutData, valuesData, settingsData } = await getData();

  return (
    <main>
      <Navbar ownerName={settingsData?.ownerName} />
      <Hero
        headline={heroData?.headline}
        subtitle={heroData?.subtitle}
        ctaText={heroData?.ctaText}
        studentsCount={heroData?.studentsCount || undefined}
        roleTitle={heroData?.roleTitle || undefined}
        roleSubtitle={heroData?.roleSubtitle || undefined}
      />
      <About
        introLine={aboutData?.introLine}
        headline={aboutData?.headline}
        description={aboutData?.description}
        ctaText={aboutData?.ctaText}
      />
      <Services />
      <Skills />
      <Values values={valuesData} />
      <Contact
        contactEmail={settingsData?.contactEmail}
        phoneNumber={settingsData?.phoneNumber || undefined}
        instagramUrl={settingsData?.instagramUrl || undefined}
      />
      <Footer
        ownerName={settingsData?.ownerName}
        contactEmail={settingsData?.contactEmail}
        phoneNumber={settingsData?.phoneNumber || undefined}
        instagramUrl={settingsData?.instagramUrl || undefined}
      />
    </main>
  );
}
