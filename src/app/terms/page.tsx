import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
    const settingsData = await prisma.siteSettings.findFirst();

    return (
        <main className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto prose dark:prose-invert">
                    <h1 className="text-4xl font-serif text-[var(--color-text-dark)] dark:text-white mb-8">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mb-8">
                        Last Updated: {new Date().toLocaleDateString()}
                    </p>

                    <div className="space-y-6 text-[var(--color-text-dark)] dark:text-gray-300">
                        <section>
                            <h2 className="text-2xl font-serif mb-4">1. Agreement to Terms</h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and {settingsData?.ownerName || "Gracious Portfolio"} ("we," "us" or "our"), concerning your access to and use of our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4">2. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4">3. User Representations</h2>
                            <p>
                                By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms of Service; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Site for any illegal or unauthorized purpose; and (5) your use of the Site will not violate any applicable law or regulation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4">4. Governing Law</h2>
                            <p>
                                These Terms shall be governed by and defined following the laws of Rwanda. {settingsData?.ownerName || "Gracious Portfolio"} and yourself irrevocably consent that the courts of Rwanda shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4">5. Contact Us</h2>
                            <p>
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                            </p>
                            <p className="mt-2 font-medium">
                                Email: <a href={`mailto:${settingsData?.contactEmail}`} className="text-[var(--color-burgundy)] hover:underline">{settingsData?.contactEmail}</a>
                            </p>
                        </section>
                    </div>
                </div>
            </div>

            <Footer
                ownerName={settingsData?.ownerName}
                contactEmail={settingsData?.contactEmail}
                phoneNumber={settingsData?.phoneNumber || undefined}
                instagramUrl={settingsData?.instagramUrl || undefined}
            />
        </main>
    );
}
