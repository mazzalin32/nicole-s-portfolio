"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface HeroData {
    id: string;
    headline: string;
    subtitle: string;
    ctaText: string;
    imageUrl: string | null;
    studentsCount: string | null;
    roleTitle: string | null;
    roleSubtitle: string | null;
}

export default function AdminHeroPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<HeroData | null>(null);
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
            const res = await fetch("/api/hero");
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch hero data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/hero", {
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
            {/* Header */}
            <header className="bg-white dark:bg-[var(--color-cream-dark)] border-b border-[var(--color-cream-dark)] px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <h1
                            className="text-xl tracking-widest uppercase text-[var(--color-text-dark)]"
                            style={{ fontFamily: "var(--font-serif)" }}
                        >
                            Edit Hero Section
                        </h1>
                    </div>
                    <motion.button
                        onClick={handleSave}
                        disabled={isSaving}
                        whileHover={{ scale: isSaving ? 1 : 1.02 }}
                        whileTap={{ scale: isSaving ? 1 : 0.98 }}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--color-burgundy)] text-white text-xs tracking-widest uppercase hover:bg-[var(--color-burgundy-dark)] transition-colors disabled:opacity-70"
                    >
                        {isSaving ? (
                            <Loader2 className="animate-spin" size={14} />
                        ) : (
                            <Save size={14} />
                        )}
                        Save Changes
                    </motion.button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {message && (
                    <div
                        className={`mb-6 px-4 py-3 text-sm rounded ${message.includes("success")
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-red-50 border border-red-200 text-red-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <div className="bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] p-8 space-y-6">
                    {/* Headline */}
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                            Headline
                        </label>
                        <input
                            type="text"
                            value={data.headline}
                            onChange={(e) => setData({ ...data, headline: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            value={data.subtitle}
                            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    {/* CTA Text */}
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                            CTA Button Text
                        </label>
                        <input
                            type="text"
                            value={data.ctaText}
                            onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    {/* Students Count */}
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                            Followers Count
                        </label>
                        <input
                            type="text"
                            value={data.studentsCount || ""}
                            onChange={(e) => setData({ ...data, studentsCount: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                            Hero Image URL
                        </label>
                        <input
                            type="text"
                            value={data.imageUrl || ""}
                            onChange={(e) => setData({ ...data, imageUrl: e.target.value })}
                            placeholder="/nicole-hero.png"
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                        <p className="mt-1 text-[10px] text-[var(--color-text-muted)] italic">
                            Tip: You can use a relative path like /nicole-hero.png or a full URL.
                        </p>
                    </div>

                    {/* Role Title */}
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                            Role Title
                        </label>
                        <input
                            type="text"
                            value={data.roleTitle || ""}
                            onChange={(e) => setData({ ...data, roleTitle: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    {/* Role Subtitle */}
                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                            Role Subtitle
                        </label>
                        <input
                            type="text"
                            value={data.roleSubtitle || ""}
                            onChange={(e) => setData({ ...data, roleSubtitle: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
