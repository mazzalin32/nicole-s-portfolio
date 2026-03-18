"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

interface Value {
    id: string;
    title: string;
    description: string | null;
    order: number;
}

export default function AdminValuesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [values, setValues] = useState<Value[]>([]);
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
            const res = await fetch("/api/values");
            const json = await res.json();
            setValues(json);
        } catch (error) {
            console.error("Failed to fetch values:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (value: Value) => {
        setIsSaving(true);
        setMessage("");

        try {
            const res = await fetch("/api/values", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(value),
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

    const handleAdd = async () => {
        try {
            const res = await fetch("/api/values", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "New Value",
                    description: "Description here...",
                    order: values.length + 1,
                }),
            });

            if (res.ok) {
                const newValue = await res.json();
                setValues([...values, newValue]);
            }
        } catch (error) {
            console.error("Failed to add value:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this value?")) return;

        try {
            const res = await fetch(`/api/values?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setValues(values.filter((v) => v.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete value:", error);
        }
    };

    const updateValue = (id: string, field: string, value: string | number) => {
        setValues(values.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
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
            <header className="bg-white dark:bg-[var(--color-cream-dark)] border-b border-[var(--color-cream-dark)] px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl tracking-widest uppercase text-[var(--color-text-dark)]" style={{ fontFamily: "var(--font-serif)" }}>
                            Edit Values
                        </h1>
                    </div>
                    <motion.button
                        onClick={handleAdd}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-2 bg-[var(--color-burgundy)] text-white text-xs tracking-widest uppercase hover:bg-[var(--color-burgundy-dark)] transition-colors"
                    >
                        <Plus size={14} />
                        Add Value
                    </motion.button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {message && (
                    <div className={`mb-6 px-4 py-3 text-sm rounded ${message.includes("success") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    {values.map((value) => (
                        <div key={value.id} className="bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <input
                                    type="text"
                                    value={value.title}
                                    onChange={(e) => updateValue(value.id, "title", e.target.value)}
                                    className="text-lg font-medium px-0 py-1 border-b border-transparent focus:border-[var(--color-burgundy)] focus:outline-none bg-transparent"
                                    style={{ fontFamily: "var(--font-serif)" }}
                                />
                                <div className="flex items-center gap-2">
                                    <motion.button
                                        onClick={() => handleSave(value)}
                                        disabled={isSaving}
                                        whileHover={{ scale: 1.05 }}
                                        className="p-2 text-[var(--color-burgundy)] hover:bg-[var(--color-cream-dark)] rounded transition-colors"
                                    >
                                        <Save size={16} />
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleDelete(value.id)}
                                        whileHover={{ scale: 1.05 }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </motion.button>
                                </div>
                            </div>
                            <textarea
                                value={value.description || ""}
                                onChange={(e) => updateValue(value.id, "description", e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors resize-none text-sm bg-white dark:bg-[var(--color-cream)]"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
