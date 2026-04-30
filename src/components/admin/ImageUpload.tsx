"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onChange(data.url);
            } else {
                console.error("Upload failed");
                alert("Failed to upload image. Please try again.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {label && (
                <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                    {label}
                </label>
            )}
            
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="relative w-40 aspect-[3/4] border border-[var(--color-cream-dark)] bg-gray-50 overflow-hidden">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => onChange("")}
                            className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <label className="w-40 aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-cream-dark)] hover:border-[var(--color-burgundy)] cursor-pointer transition-colors bg-gray-50 text-[var(--color-text-muted)] hover:text-[var(--color-burgundy)]">
                        {isUploading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <Upload size={24} className="mb-2" />
                                <span className="text-[10px] uppercase tracking-widest">Upload Image</span>
                            </>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                )}

                <div className="flex-1">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Or enter URL manually..."
                        className="w-full px-4 py-3 border border-[var(--color-cream-dark)] focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white dark:bg-[var(--color-cream)] text-sm"
                    />
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)] italic">
                        Recommended: Portrait aspect ratio (3:4)
                    </p>
                </div>
            </div>
        </div>
    );
}
