"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Mic } from "lucide-react";
import Link from "next/link";

interface Episode {
    id: string;
    title: string;
    description: string;
    createdAt: string;
}

export default function AdminPodcastPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newEpisode, setNewEpisode] = useState({ title: "", description: "", audioUrl: "" });

    useEffect(() => {
        if (status === "unauthenticated") router.push("/admin/login");
        else fetchEpisodes();
    }, [status, router]);

    const fetchEpisodes = async () => {
        try {
            const res = await fetch("/api/podcast");
            const json = await res.json();
            setEpisodes(json);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/podcast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEpisode),
            });
            if (res.ok) {
                setNewEpisode({ title: "", description: "", audioUrl: "" });
                fetchEpisodes();
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (status === "loading" || isLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[var(--color-cream)]">
            <header className="bg-white dark:bg-[var(--color-cream-dark)] border-b border-[var(--color-cream-dark)] px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/admin"><ArrowLeft size={20} /></Link>
                    <h1 className="text-xl tracking-widest uppercase">Manage Podcast</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12 grid gap-12">
                {/* Create Form */}
                <div className="bg-white dark:bg-[var(--color-cream-dark)] p-8 border border-[var(--color-cream-dark)]">
                    <h2 className="text-lg mb-6 uppercase tracking-widest">Add New Episode</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            placeholder="Episode Title"
                            value={newEpisode.title}
                            onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                            className="w-full p-3 border border-[var(--color-cream-dark)]"
                            required
                        />
                        <textarea
                            placeholder="Description"
                            value={newEpisode.description}
                            onChange={(e) => setNewEpisode({ ...newEpisode, description: e.target.value })}
                            className="w-full p-3 border border-[var(--color-cream-dark)] h-24"
                            required
                        />
                        <input
                            placeholder="Audio URL (e.g. Spotify/Soundcloud link)"
                            value={newEpisode.audioUrl}
                            onChange={(e) => setNewEpisode({ ...newEpisode, audioUrl: e.target.value })}
                            className="w-full p-3 border border-[var(--color-cream-dark)]"
                            required
                        />
                        <button disabled={isSaving} className="px-6 py-2 bg-[var(--color-burgundy)] text-white uppercase text-xs tracking-widest">
                            {isSaving ? "Saving..." : "Publish Episode"}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h2 className="text-lg uppercase tracking-widest">Existing Episodes</h2>
                    {episodes.length === 0 ? <p className="text-sm italic text-gray-500">No episodes yet.</p> : (
                        episodes.map(eps => (
                            <div key={eps.id} className="bg-white p-6 border border-[var(--color-cream-dark)] flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{eps.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(eps.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
