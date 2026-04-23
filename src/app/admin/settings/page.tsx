"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface SettingsData {
    id: string;
    ownerName: string;
    contactEmail: string;
    instagramUrl: string | null;
    phoneNumber: string | null;
}

export default function AdminSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<SettingsData | null>(null);
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
            const res = await fetch("/api/settings");
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setMessage("Changes saved successfully!");
            } else {
                const errorData = await res.json();
                setMessage(errorData.error || "Failed to save changes.");
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
                            Site Settings
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
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Owner Name</label>
                        <input
                            type="text"
                            value={data.ownerName}
                            onChange={(e) => setData({ ...data, ownerName: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Contact Email</label>
                        <input
                            type="email"
                            value={data.contactEmail}
                            onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>


                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Phone Number</label>
                        <input
                            type="text"
                            value={data.phoneNumber || ""}
                            onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Instagram URL</label>
                        <input
                            type="url"
                            value={data.instagramUrl || ""}
                            onChange={(e) => setData({ ...data, instagramUrl: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
