"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Save, Loader2, GripVertical } from "lucide-react";
import Link from "next/link";

interface Service {
    id: string;
    title: string;
    description: string;
    iconName: string;
    order: number;
    features: { id: string; text: string }[];
}

export default function AdminServicesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
    }, [status, router]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            const data = await res.json();
            setServices(data);
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddService = () => {
        const newService: Service = {
            id: `temp-${Date.now()}`,
            title: "New Service",
            description: "Service description here.",
            iconName: "Camera",
            order: services.length + 1,
            features: [],
        };
        setServices([...services, newService]);
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        
        if (id.startsWith("temp-")) {
            setServices(services.filter((s) => s.id !== id));
            return;
        }

        try {
            const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setServices(services.filter((s) => s.id !== id));
                setMessage("Service deleted successfully!");
            } else {
                setMessage("Failed to delete service.");
            }
        } catch (error) {
            console.error("Failed to delete service:", error);
            setMessage("An error occurred while deleting.");
        }
    };

    const handleUpdateService = (id: string, updates: Partial<Service>) => {
        setServices(services.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    };

    const handleAddFeature = (serviceId: string) => {
        setServices(services.map((s) => {
            if (s.id === serviceId) {
                return {
                    ...s,
                    features: [...s.features, { id: `temp-f-${Date.now()}`, text: "New Feature" }],
                };
            }
            return s;
        }));
    };

    const handleUpdateFeature = (serviceId: string, featureId: string, text: string) => {
        setServices(services.map((s) => {
            if (s.id === serviceId) {
                return {
                    ...s,
                    features: s.features.map((f) => (f.id === featureId ? { ...f, text } : f)),
                };
            }
            return s;
        }));
    };

    const handleDeleteFeature = (serviceId: string, featureId: string) => {
        setServices(services.map((s) => {
            if (s.id === serviceId) {
                return {
                    ...s,
                    features: s.features.filter((f) => f.id !== featureId),
                };
            }
            return s;
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage("");
        try {
            for (const service of services) {
                const method = service.id.startsWith("temp-") ? "POST" : "PUT";
                const body = {
                    ...service,
                    id: service.id.startsWith("temp-") ? undefined : service.id,
                    features: service.features.map((f) => f.text),
                };

                const res = await fetch("/api/services", {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                if (!res.ok) throw new Error("Failed to save");
            }
            setMessage("All changes saved successfully!");
            fetchServices();
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
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-dark)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl tracking-widest uppercase text-[var(--color-text-dark)]" style={{ fontFamily: "var(--font-serif)" }}>
                            Manage Services
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleAddService}
                            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-burgundy)] text-[var(--color-burgundy)] text-xs tracking-widest uppercase hover:bg-[var(--color-burgundy)] hover:text-white transition-colors"
                        >
                            <Plus size={14} />
                            Add Service
                        </button>
                        <motion.button
                            onClick={handleSave}
                            disabled={isSaving}
                            whileHover={{ scale: isSaving ? 1 : 1.02 }}
                            whileTap={{ scale: isSaving ? 1 : 0.98 }}
                            className="flex items-center gap-2 px-6 py-2 bg-[var(--color-burgundy)] text-white text-xs tracking-widest uppercase hover:bg-[var(--color-burgundy-dark)] transition-colors disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                            Save All
                        </motion.button>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {message && (
                    <div className={`mb-6 px-4 py-3 text-sm rounded ${message.includes("success") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                        {message}
                    </div>
                )}

                <div className="space-y-8">
                    <AnimatePresence>
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] p-8 relative group"
                            >
                                <button
                                    onClick={() => handleDeleteService(service.id)}
                                    className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={service.title}
                                                onChange={(e) => handleUpdateService(service.id, { title: e.target.value })}
                                                className="w-full px-4 py-2 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Description</label>
                                            <textarea
                                                value={service.description}
                                                onChange={(e) => handleUpdateService(service.id, { description: e.target.value })}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none bg-transparent resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Icon (Lucide Name)</label>
                                            <input
                                                type="text"
                                                value={service.iconName}
                                                onChange={(e) => handleUpdateService(service.id, { iconName: e.target.value })}
                                                placeholder="Camera, Users, Mic, etc."
                                                className="w-full px-4 py-2 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none bg-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-1">Features</label>
                                        <div className="space-y-2">
                                            {service.features.map((feature) => (
                                                <div key={feature.id} className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={feature.text}
                                                        onChange={(e) => handleUpdateFeature(service.id, feature.id, e.target.value)}
                                                        className="flex-1 px-4 py-1.5 text-sm border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none bg-transparent"
                                                    />
                                                    <button
                                                        onClick={() => handleDeleteFeature(service.id, feature.id)}
                                                        className="p-1.5 text-red-400 hover:text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => handleAddFeature(service.id)}
                                                className="w-full py-2 border border-dashed border-[var(--color-cream-dark)] text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] hover:border-[var(--color-burgundy)] hover:text-[var(--color-burgundy)] transition-colors mt-2"
                                            >
                                                + Add Feature
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
