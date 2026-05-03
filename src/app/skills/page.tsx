import Navbar from "@/components/public/Navbar";
import Skills from "@/components/public/Skills";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [skillsData, platformsData, settingsData] = await Promise.all([
      (prisma as any).skill?.findMany({ orderBy: { order: "asc" } }) || [],
      (prisma as any).platform?.findMany({ orderBy: { order: "asc" } }) || [],
      prisma.siteSettings.findFirst({
        include: { socialLinks: { orderBy: { order: "asc" } } }
      }),
    ]);
    return { skillsData, platformsData, settingsData };
  } catch (error) {
    console.error("Failed to load skills page data:", error);
    return { skillsData: [], platformsData: [], settingsData: null };
  }
}

export default async function SkillsPage() {
  const { skillsData, platformsData, settingsData } = await getData();

  return (
    <main>
      <Navbar ownerName={settingsData?.ownerName || undefined} />
      <div className="pt-20">
        <Skills skills={skillsData} platforms={platformsData} />
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
