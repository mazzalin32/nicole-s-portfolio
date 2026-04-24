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
  try {
    const [heroData, aboutData, valuesData, settingsData, servicesData, skillsData, platformsData] = await Promise.all([
      prisma.heroContent.findFirst(),
      prisma.aboutContent.findFirst(),
      prisma.value.findMany({ orderBy: { order: "asc" } }),
      prisma.siteSettings.findFirst({
        include: { socialLinks: { orderBy: { order: "asc" } } }
      }),
      (prisma as any).service?.findMany({ orderBy: { order: "asc" }, include: { features: true } }) || [],
      (prisma as any).skill?.findMany({ orderBy: { order: "asc" } }) || [],
      (prisma as any).platform?.findMany({ orderBy: { order: "asc" } }) || [],
    ]);

    return { heroData, aboutData, valuesData, settingsData, servicesData, skillsData, platformsData };
  } catch (error) {
    console.error("Failed to load homepage data from database:", error);
    return {
      heroData: null,
      aboutData: null,
      valuesData: [],
      settingsData: null,
      servicesData: [],
      skillsData: [],
      platformsData: [],
    };
  }
}

import WhatsAppButton from "@/components/public/WhatsAppButton";

export default async function Home() {
  const { heroData, aboutData, valuesData, settingsData, servicesData, skillsData, platformsData } = await getData();

  return (
    <main>
      <Navbar ownerName={settingsData?.ownerName || undefined} />
      <Hero
        headline={heroData?.headline || undefined}
        subtitle={heroData?.subtitle || undefined}
        ctaText={heroData?.ctaText || undefined}
        imageUrl={heroData?.imageUrl || undefined}
        secondaryImageUrl={heroData?.secondaryImageUrl || undefined}
        studentsCount={heroData?.studentsCount || undefined}
        roleTitle={heroData?.roleTitle || undefined}
        roleSubtitle={heroData?.roleSubtitle || undefined}
      />
      <About
        introLine={aboutData?.introLine || undefined}
        headline={aboutData?.headline || undefined}
        description={aboutData?.description || undefined}
        ctaText={aboutData?.ctaText || undefined}
        imageUrl={aboutData?.imageUrl || undefined}
        secondaryImageUrl={aboutData?.secondaryImageUrl || undefined}
        quote={aboutData?.quote || undefined}
      />
      <Services services={servicesData} />
      <Skills skills={skillsData} platforms={platformsData} />
      <Values values={valuesData} />
      <Contact
        contactEmail={settingsData?.contactEmail || undefined}
        phoneNumber={settingsData?.phoneNumber || undefined}
        instagramUrl={settingsData?.instagramUrl || undefined}
      />
      <Footer
        ownerName={settingsData?.ownerName || undefined}
        contactEmail={settingsData?.contactEmail || undefined}
        phoneNumber={settingsData?.phoneNumber || undefined}
        instagramUrl={settingsData?.instagramUrl || undefined}
        socialLinks={(settingsData as any)?.socialLinks || []}
      />
      <WhatsAppButton phoneNumber={settingsData?.phoneNumber || undefined} />
    </main>
  );
}
