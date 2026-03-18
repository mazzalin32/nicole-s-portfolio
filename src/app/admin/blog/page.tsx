"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

export default function AdminBlogPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", imageUrl: "" });

    useEffect(() => {
        if (status === "unauthenticated") router.push("/admin/login");
        else fetchPosts();
    }, [status, router]);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/blog");
            const json = await res.json();
            setPosts(json);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPost),
            });
            if (res.ok) {
                setNewPost({ title: "", content: "", imageUrl: "" });
                fetchPosts();
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
                    <h1 className="text-xl tracking-widest uppercase">Manage Blog</h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-12 grid gap-12">
                {/* Create Form */}
                <div className="bg-white dark:bg-[var(--color-cream-dark)] p-8 border border-[var(--color-cream-dark)]">
                    <h2 className="text-lg mb-6 uppercase tracking-widest">Add New Post</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            placeholder="Title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            className="w-full p-3 border border-[var(--color-cream-dark)]"
                            required
                        />
                        <textarea
                            placeholder="Content"
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            className="w-full p-3 border border-[var(--color-cream-dark)] h-32"
                            required
                        />
                        <button disabled={isSaving} className="px-6 py-2 bg-[var(--color-burgundy)] text-white uppercase text-xs tracking-widest">
                            {isSaving ? "Saving..." : "Publish Post"}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h2 className="text-lg uppercase tracking-widest">Existing Posts</h2>
                    {posts.length === 0 ? <p className="text-sm italic text-gray-500">No posts yet.</p> : (
                        posts.map(post => (
                            <div key={post.id} className="bg-white p-6 border border-[var(--color-cream-dark)] flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{post.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                                {/* Add Delete button logic later if needed */}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
