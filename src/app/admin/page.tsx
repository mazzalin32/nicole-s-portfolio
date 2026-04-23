"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Home,
    FileText,
    User,
    Heart,
    Settings,
    LogOut,
    Loader2,
    Mic
} from "lucide-react";

const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/hero", label: "Hero Section", icon: FileText },
    { href: "/admin/about", label: "About Section", icon: User },
    { href: "/admin/values", label: "Values", icon: Heart },
    { href: "/admin/services", label: "Services", icon: FileText },
    { href: "/admin/skills", label: "Skills", icon: Settings },
    { href: "/admin/blog", label: "Blog Posts", icon: FileText },
    { href: "/admin/podcast", label: "Podcast Episodes", icon: Mic },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-burgundy)]" size={32} />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            {/* Header */}
            <header className="bg-white dark:bg-[var(--color-cream-dark)] border-b border-[var(--color-cream-dark)] px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1
                        className="text-xl tracking-widest uppercase text-[var(--color-text-dark)]"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                        Admin Dashboard
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--color-text-muted)]">
                            {session.user?.email}
                        </span>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex items-center gap-2 text-sm text-[var(--color-burgundy)] hover:text-[var(--color-burgundy-dark)] transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Welcome Message */}
                <div className="mb-12">
                    <h2
                        className="text-3xl mb-2 text-[var(--color-text-dark)]"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                        Welcome back, {session.user?.name || "Admin"}
                    </h2>
                    <p className="text-[var(--color-text-muted)]">
                        Manage your website content from here.
                    </p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.slice(1).map((item, index) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Link
                                href={item.href}
                                className="block p-6 bg-white dark:bg-[var(--color-cream-dark)] border border-[var(--color-cream-dark)] hover:border-[var(--color-burgundy)] transition-colors group"
                            >
                                <item.icon
                                    className="text-[var(--color-burgundy)] mb-4 group-hover:scale-110 transition-transform"
                                    size={28}
                                />
                                <h3
                                    className="text-lg mb-2 text-[var(--color-text-dark)]"
                                    style={{ fontFamily: "var(--font-serif)" }}
                                >
                                    {item.label}
                                </h3>
                                <p className="text-sm text-[var(--color-text-muted)]">
                                    Edit your {item.label.toLowerCase()} content
                                </p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View Site Link */}
                <div className="mt-12 text-center">
                    <Link
                        href="/"
                        target="_blank"
                        className="inline-block px-8 py-3 border border-[var(--color-text-dark)] text-[var(--color-text-dark)] text-xs tracking-[0.2em] uppercase hover:bg-[var(--color-text-dark)] hover:text-white transition-colors"
                    >
                        View Live Site
                    </Link>
                </div>
            </div>
        </div>
    );
}
