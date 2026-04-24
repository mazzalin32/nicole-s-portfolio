"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface SocialLink {
    platform: string;
    url: string;
    iconName?: string | null;
}

interface SettingsData {
    id: string;
    ownerName: string;
    contactEmail: string;
    instagramUrl: string | null;
    phoneNumber: string | null;
    socialLinks: SocialLink[];
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
                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">Instagram URL (Legacy)</label>
                        <input
                            type="url"
                            value={data.instagramUrl || ""}
                            onChange={(e) => setData({ ...data, instagramUrl: e.target.value })}
                            className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)]"
                        />
                    </div>

                    {/* Dynamic Social Links */}
                    <div className="pt-8 border-t border-[var(--color-cream-dark)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-semibold tracking-widest uppercase text-[var(--color-text-dark)]">Social Media Profiles</h3>
                            <button
                                onClick={() => setData({
                                    ...data,
                                    socialLinks: [...(data.socialLinks || []), { platform: "Instagram", url: "" }]
                                })}
                                className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-burgundy)] hover:text-[var(--color-burgundy-dark)] transition-colors"
                            >
                                <Plus size={14} /> Add Social
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(data.socialLinks || []).map((link, index) => (
                                <div key={index} className="flex gap-4 items-end bg-gray-50 dark:bg-black/5 p-4 border border-[var(--color-cream-dark)]">
                                    <div className="flex-1 space-y-4 md:space-y-0 md:flex md:gap-4">
                                        <div className="flex-1">
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Platform</label>
                                            <select
                                                value={link.platform}
                                                onChange={(e) => {
                                                    const newLinks = [...data.socialLinks];
                                                    newLinks[index].platform = e.target.value;
                                                    setData({ ...data, socialLinks: newLinks });
                                                }}
                                                className="w-full px-3 py-2 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)] text-sm"
                                            >
                                                <option value="Instagram">Instagram</option>
                                                <option value="LinkedIn">LinkedIn</option>
                                                <option value="Twitter">Twitter</option>
                                                <option value="Github">Github</option>
                                                <option value="Website">Website</option>
                                                <option value="WhatsApp">WhatsApp</option>
                                            </select>
                                        </div>
                                        <div className="flex-[2]">
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-1">URL</label>
                                            <input
                                                type="url"
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...data.socialLinks];
                                                    newLinks[index].url = e.target.value;
                                                    setData({ ...data, socialLinks: newLinks });
                                                }}
                                                placeholder="https://..."
                                                className="w-full px-3 py-2 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)] text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newLinks = data.socialLinks.filter((_, i) => i !== index);
                                            setData({ ...data, socialLinks: newLinks });
                                        }}
                                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}

                            {(data.socialLinks || []).length === 0 && (
                                <p className="text-xs text-[var(--color-text-muted)] italic text-center py-4">No social profiles added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
