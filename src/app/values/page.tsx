import Navbar from "@/components/public/Navbar";
import Values from "@/components/public/Values";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [valuesData, settingsData] = await Promise.all([
      prisma.value.findMany({ orderBy: { order: "asc" } }),
      prisma.siteSettings.findFirst({
        include: { socialLinks: { orderBy: { order: "asc" } } }
      }),
    ]);
    return { valuesData, settingsData };
  } catch (error) {
    console.error("Failed to load values page data:", error);
    return { valuesData: [], settingsData: null };
  }
}

export default async function ValuesPage() {
  const { valuesData, settingsData } = await getData();

  return (
    <main>
      <Navbar ownerName={settingsData?.ownerName || undefined} />
      <div className="pt-20">
        <Values values={valuesData} />
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
