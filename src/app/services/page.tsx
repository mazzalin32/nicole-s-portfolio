import Navbar from "@/components/public/Navbar";
import Services from "@/components/public/Services";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import WhatsAppButton from "@/components/public/WhatsAppButton";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    const [servicesData, settingsData] = await Promise.all([
      (prisma as any).service?.findMany({ orderBy: { order: "asc" }, include: { features: true } }) || [],
      prisma.siteSettings.findFirst({
        include: { socialLinks: { orderBy: { order: "asc" } } }
      }),
    ]);
    return { servicesData, settingsData };
  } catch (error) {
    console.error("Failed to load services page data:", error);
    return { servicesData: [], settingsData: null };
  }
}

export default async function ServicesPage() {
  const { servicesData, settingsData } = await getData();

  return (
    <main>
      <Navbar ownerName={settingsData?.ownerName || undefined} />
      <div className="pt-20">
        <Services services={servicesData} />
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
