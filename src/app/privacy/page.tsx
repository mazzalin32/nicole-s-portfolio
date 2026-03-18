import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
    const settingsData = await prisma.siteSettings.findFirst();

    return (
        <main className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-grow pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto prose dark:prose-invert">
                    <h1 className="text-4xl font-serif text-[var(--color-text-dark)] dark:text-white mb-8">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-[var(--color-text-muted)] mb-8">
                        Last Updated: {new Date().toLocaleDateString()}
                    </p>

                    <div className="space-y-6 text-[var(--color-text-dark)] dark:text-gray-300">
                        <section>
                            <h2 className="text-2xl font-serif mb-4">1. Introduction</h2>
                            <p>
                                Welcome to {settingsData?.ownerName || "Gracious Portfolio"}. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4">2. Information We Collect</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4">3. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                <li>Where we need to comply with a legal or regulatory obligation.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif mb-4">4. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
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
