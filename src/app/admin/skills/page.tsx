"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface Skill {
    id: string;
    name: string;
    description: string | null;
    level: number;
    category: string;
    order: number;
}

interface Platform {
    id: string;
    name: string;
    order: number;
}

export default function AdminSkillsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
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
            const res = await fetch("/api/skills");
            const data = await res.json();
            setSkills(data.skills);
            setPlatforms(data.platforms);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = (category: string) => {
        const newSkill: Skill = {
            id: `temp-${Date.now()}`,
            name: "New Skill",
            description: category === "Creative" ? "Short description" : null,
            level: category === "Technical" ? 80 : 0,
            category,
            order: skills.length + 1,
        };
        setSkills([...skills, newSkill]);
    };

    const handleDeleteSkill = async (id: string) => {
        if (!confirm("Delete this skill?")) return;
        if (id.startsWith("temp-")) {
            setSkills(skills.filter((s) => s.id !== id));
            return;
        }
        try {
            const res = await fetch(`/api/skills?id=${id}&type=skill`, { method: "DELETE" });
            if (res.ok) setSkills(skills.filter((s) => s.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateSkill = (id: string, updates: Partial<Skill>) => {
        setSkills(skills.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    };

    const handleAddPlatform = () => {
        const newPlatform: Platform = {
            id: `temp-${Date.now()}`,
            name: "New Platform",
            order: platforms.length + 1,
        };
        setPlatforms([...platforms, newPlatform]);
    };

    const handleDeletePlatform = async (id: string) => {
        if (!confirm("Delete this platform?")) return;
        if (id.startsWith("temp-")) {
            setPlatforms(platforms.filter((p) => p.id !== id));
            return;
        }
        try {
            const res = await fetch(`/api/skills?id=${id}&type=platform`, { method: "DELETE" });
            if (res.ok) setPlatforms(platforms.filter((p) => p.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdatePlatform = (id: string, name: string) => {
        setPlatforms(platforms.map((p) => (p.id === id ? { ...p, name } : p)));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage("");
        try {
            // Save Skills
            for (const skill of skills) {
                const method = skill.id.startsWith("temp-") ? "POST" : "PUT";
                const res = await fetch("/api/skills", {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "skill", data: { ...skill, id: skill.id.startsWith("temp-") ? undefined : skill.id } }),
                });
                if (!res.ok) throw new Error("Skill save failed");
            }

            // Save Platforms
            for (const platform of platforms) {
                const method = platform.id.startsWith("temp-") ? "POST" : "PUT";
                const res = await fetch("/api/skills", {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "platform", data: { ...platform, id: platform.id.startsWith("temp-") ? undefined : platform.id } }),
                });
                if (!res.ok) throw new Error("Platform save failed");
            }

            setMessage("Skills and platforms saved successfully!");
            fetchData();
        } catch (error) {
            setMessage("Failed to save changes.");
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

    if (!session) return null;

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <header className="bg-white dark:bg-[var(--color-cream-dark)] border-b border-[var(--color-cream-dark)] px-6 py-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl tracking-widest uppercase text-[var(--color-text-dark)]" style={{ fontFamily: "var(--font-serif)" }}>
                            Skills & Platforms
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

            <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {message && (
                    <div className={`mb-6 px-4 py-3 text-sm rounded ${message.includes("success") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                        {message}
                    </div>
                )}

                {/* Creative Skills */}
                <section className="bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-text-dark)] mb-1" style={{ fontFamily: "var(--font-serif)" }}>Creative Skills</h2>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Storytelling and soft skills</p>
                        </div>
                        <button 
                            onClick={() => handleAddSkill("Creative")}
                            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-burgundy)] text-[var(--color-burgundy)] text-[10px] tracking-widest uppercase hover:bg-[var(--color-burgundy)] hover:text-white transition-colors"
                        >
                            <Plus size={12} />
                            Add Skill
                        </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {skills.filter(s => s.category === "Creative").map(skill => (
                                <motion.div 
                                    key={skill.id} 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-4 border border-[var(--color-cream-dark)] bg-[var(--color-cream)]/30 relative group"
                                >
                                    <button onClick={() => handleDeleteSkill(skill.id)} className="absolute top-2 right-2 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                    <input
                                        type="text"
                                        value={skill.name}
                                        onChange={(e) => handleUpdateSkill(skill.id, { name: e.target.value })}
                                        className="w-full text-sm font-medium text-[var(--color-text-dark)] bg-transparent focus:outline-none mb-1"
                                        placeholder="Skill Name"
                                    />
                                    <input
                                        type="text"
                                        value={skill.description || ""}
                                        onChange={(e) => handleUpdateSkill(skill.id, { description: e.target.value })}
                                        className="w-full text-[10px] text-[var(--color-text-muted)] bg-transparent focus:outline-none italic"
                                        placeholder="Short description"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Technical Skills */}
                <section className="bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-text-dark)] mb-1" style={{ fontFamily: "var(--font-serif)" }}>Technical Expertise</h2>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Proficiency levels (0-100%)</p>
                        </div>
                        <button 
                            onClick={() => handleAddSkill("Technical")}
                            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-burgundy)] text-[var(--color-burgundy)] text-[10px] tracking-widest uppercase hover:bg-[var(--color-burgundy)] hover:text-white transition-colors"
                        >
                            <Plus size={12} />
                            Add Expertise
                        </button>
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {skills.filter(s => s.category === "Technical").map(skill => (
                                <motion.div 
                                    key={skill.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="p-4 border border-[var(--color-cream-dark)] bg-[var(--color-cream)]/30 flex items-center gap-4 group"
                                >
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={skill.name}
                                            onChange={(e) => handleUpdateSkill(skill.id, { name: e.target.value })}
                                            className="w-full text-sm font-medium text-[var(--color-text-dark)] bg-transparent focus:outline-none"
                                            placeholder="Expertise Name"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={skill.level}
                                            onChange={(e) => handleUpdateSkill(skill.id, { level: parseInt(e.target.value) || 0 })}
                                            className="w-16 px-2 py-1.5 text-xs border border-[var(--color-cream-dark)] text-center bg-[var(--color-cream)] focus:border-[var(--color-burgundy)] focus:outline-none"
                                            min="0" max="100"
                                        />
                                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-tighter">%</span>
                                    </div>
                                    <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* Platforms */}
                <section className="bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-sm tracking-[0.2em] uppercase text-[var(--color-text-dark)] mb-1" style={{ fontFamily: "var(--font-serif)" }}>Platforms</h2>
                            <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Active social channels</p>
                        </div>
                        <button 
                            onClick={handleAddPlatform}
                            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-burgundy)] text-[var(--color-burgundy)] text-[10px] tracking-widest uppercase hover:bg-[var(--color-burgundy)] hover:text-white transition-colors"
                        >
                            <Plus size={12} />
                            Add Platform
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <AnimatePresence>
                            {platforms.map(platform => (
                                <motion.div 
                                    key={platform.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center gap-2 bg-[var(--color-cream)] px-4 py-2 border border-[var(--color-cream-dark)] group"
                                >
                                    <input
                                        type="text"
                                        value={platform.name}
                                        onChange={(e) => handleUpdatePlatform(platform.id, e.target.value)}
                                        className="text-xs font-medium text-[var(--color-text-dark)] bg-transparent focus:outline-none w-24"
                                    />
                                    <button onClick={() => handleDeletePlatform(platform.id)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>
            </div>
        </div>
    );
}
