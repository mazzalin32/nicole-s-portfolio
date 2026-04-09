"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Instagram, Send, Check } from "lucide-react";

interface ContactProps {
    contactEmail?: string;
    phoneNumber?: string;
    instagramUrl?: string;
}

export default function Contact({
    contactEmail = "ashimwegra12@gmail.com",
    phoneNumber = "0792630152",
    instagramUrl = "https://www.instagram.com/___.ashimwe_?igsh=d291eDF1djE0bjA3",
}: ContactProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to send message");

            setIsSubmitted(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setIsSubmitted(false), 5000);
        } catch (error) {
            console.error(error);
            alert("Failed to send message. Please try again or email directly.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="bg-[var(--color-cream)] py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Left - Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p
                            className="text-lg text-[var(--color-brown)] italic mb-4"
                            style={{ fontFamily: "var(--font-script)" }}
                        >
                            Get In Touch
                        </p>
                        <h2
                            className="text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-dark)] mb-6"
                            style={{ fontFamily: "var(--font-serif)" }}
                        >
                            Let&apos;s Create Together
                        </h2>
                        <p className="text-[var(--color-text-muted)] mb-8 leading-relaxed">
                            Interested in collaborating? Whether it&apos;s a brand partnership,
                            speaking engagement, or creative project, I&apos;d love to hear from you.
                            Let&apos;s create something beautiful together.
                        </p>

                        {/* Contact Methods */}
                        <div className="space-y-6">
                            <a
                                href={`mailto:${contactEmail}`}
                                className="flex items-center gap-4 text-[var(--color-text-dark)] hover:text-[var(--color-burgundy)] transition-colors group"
                            >
                                <div className="w-12 h-12 bg-[var(--color-cream-dark)] flex items-center justify-center group-hover:bg-[var(--color-burgundy)] group-hover:text-white transition-all">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Email
                                    </p>
                                    <p className="font-medium">{contactEmail}</p>
                                </div>
                            </a>

                            <a
                                href={`tel:${phoneNumber}`}
                                className="flex items-center gap-4 text-[var(--color-text-dark)] hover:text-[var(--color-burgundy)] transition-colors group"
                            >
                                <div className="w-12 h-12 bg-[var(--color-cream-dark)] flex items-center justify-center group-hover:bg-[var(--color-burgundy)] group-hover:text-white transition-all">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-phone"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Phone
                                    </p>
                                    <p className="font-medium">{phoneNumber}</p>
                                </div>
                            </a>

                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 text-[var(--color-text-dark)] hover:text-[var(--color-burgundy)] transition-colors group"
                            >
                                <div className="w-12 h-12 bg-[var(--color-cream-dark)] flex items-center justify-center group-hover:bg-[var(--color-burgundy)] group-hover:text-white transition-all">
                                    <Instagram size={20} />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                        Instagram
                                    </p>
                                    <p className="font-medium">@___.ashimwe_</p>
                                </div>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-white dark:bg-white/5 border border-[var(--color-cream-dark)] p-8 shadow-sm dark:shadow-none pink:border-[var(--color-burgundy)] [.pink_&]:bg-[#FFE4E1]">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white [.pink_&]:bg-white [.pink_&]:text-[#420815] [.pink_&]:placeholder-[#A32A48] [.pink_&]:border-[#D1476B]"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white [.pink_&]:bg-white [.pink_&]:text-[#420815] [.pink_&]:placeholder-[#A32A48] [.pink_&]:border-[#D1476B]"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                                        Subject
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-[var(--color-burgundy)] focus:outline-none transition-colors bg-white text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white [.pink_&]:bg-white [.pink_&]:text-[#420815] [.pink_&]:border-[#D1476B]"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="brand-collaboration">Brand Collaboration</option>
                                        <option value="speaking">Speaking Engagement</option>
                                        <option value="consulting">Social Media Consulting</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-[var(--color-burgundy)] focus:outline-none transition-colors resize-none bg-white text-zinc-900 placeholder:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white [.pink_&]:bg-white [.pink_&]:text-[#420815] [.pink_&]:placeholder-[#A32A48] [.pink_&]:border-[#D1476B]"
                                        placeholder="Tell me about your project or idea..."
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting || isSubmitted}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-burgundy)] text-white text-xs tracking-[0.2em] uppercase hover:bg-[var(--color-burgundy-dark)] transition-colors disabled:opacity-70"
                                >
                                    {isSubmitted ? (
                                        <>
                                            <Check size={16} />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            {isSubmitting ? "Sending..." : "Send Message"}
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section >
    );
}
