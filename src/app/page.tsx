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
    const [heroData, settingsData] = await Promise.all([
      prisma.heroContent.findFirst(),
      prisma.siteSettings.findFirst({
        include: { socialLinks: { orderBy: { order: "asc" } } }
      }),
    ]);

    return { heroData, settingsData };
  } catch (error) {
    console.error("Failed to load homepage data from database:", error);
    return {
      heroData: null,
      settingsData: null,
    };
  }
}

import WhatsAppButton from "@/components/public/WhatsAppButton";

export default async function Home() {
  const { heroData, settingsData } = await getData();

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
