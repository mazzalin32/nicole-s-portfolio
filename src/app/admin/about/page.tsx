"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";


interface AboutData {
    id: string;
    introLine: string;
    headline: string;
    description: string;
    ctaText: string;
    imageUrl: string | null;
    secondaryImageUrl: string | null;
    quote: string | null;
}

export default function AdminAboutPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<AboutData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
    }, [status, router]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/about");
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch about data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/about", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setMessage("Changes saved successfully!");
            } else {
                setMessage("Failed to save changes.");
            }
        } catch {
            setMessage("An error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-burgundy)]" size={32} />
            </div>
        );
    }

    if (!session || !data) return null;

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <header className="bg-white dark:bg-[var(--color-cream-dark)] border-b border-[var(--color-cream-dark)] px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl tracking-widest uppercase text-[var(--color-text-dark)]" style={{ fontFamily: "var(--font-serif)" }}>
                            Edit About Section
                        </h1>
                    </div>
                    <motion.button
                        onClick={handleSave}
                        disabled={isSaving}
                        whileHover={{ scale: isSaving ? 1 : 1.02 }}
                        whileTap={{ scale: isSaving ? 1 : 0.98 }}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--color-burgundy)] text-white text-xs tracking-widest uppercase hover:bg-[var(--color-burgundy-dark)] transition-colors disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        Save Changes
                    </motion.button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {message && (
                    <div className={`mb-6 px-4 py-3 text-sm rounded ${message.includes("success") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                        {message}
                    </div>
                )}

                <div className="bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Intro Line</label>
                        <input
                            type="text"
                            value={data.introLine}
                            onChange={(e) => setData({ ...data, introLine: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Headline</label>
                        <input
                            type="text"
                            value={data.headline}
                            onChange={(e) => setData({ ...data, headline: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            rows={6}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors resize-none bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">CTA Button Text</label>
                        <input
                            type="text"
                            value={data.ctaText}
                            onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    {/* Image Uploads */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <ImageUpload
                            label="Main About Image"
                            value={data.imageUrl || ""}
                            onChange={(url) => setData({ ...data, imageUrl: url })}
                        />
                        <ImageUpload
                            label="Secondary/Background Image"
                            value={data.secondaryImageUrl || ""}
                            onChange={(url) => setData({ ...data, secondaryImageUrl: url })}
                        />
                    </div>


                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Quote</label>
                        <textarea
                            value={data.quote || ""}
                            onChange={(e) => setData({ ...data, quote: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors resize-none bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
