import Navbar from "@/components/public/Navbar";
import About from "@/components/public/About";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [aboutData, settingsData] = await Promise.all([
      prisma.aboutContent.findFirst(),
      prisma.siteSettings.findFirst({
        include: { socialLinks: { orderBy: { order: "asc" } } }
      }),
    ]);
    return { aboutData, settingsData };
  } catch (error) {
    console.error("Failed to load about page data:", error);
    return { aboutData: null, settingsData: null };
  }
}

export default async function AboutPage() {
  const { aboutData, settingsData } = await getData();

  return (
    <main>
      <Navbar ownerName={settingsData?.ownerName || undefined} />
      <div className="pt-20"> {/* Add padding for fixed navbar */}
        <About
          introLine={aboutData?.introLine || undefined}
          headline={aboutData?.headline || undefined}
          description={aboutData?.description || undefined}
          ctaText={aboutData?.ctaText || undefined}
          imageUrl={aboutData?.imageUrl || undefined}
          secondaryImageUrl={aboutData?.secondaryImageUrl || undefined}
          quote={aboutData?.quote || undefined}
        />
      </div>
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
