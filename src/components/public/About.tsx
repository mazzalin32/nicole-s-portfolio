"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AboutProps {
    introLine?: string;
    headline?: string;
    description?: string;
    ctaText?: string;
    imageUrl?: string;
    quote?: string;
}

export default function About({
    introLine = "Hey, I'm Nicole",
    headline = "Influencer, Content Creator, and Your Lifestyle Muse",
    description = `I remember the moment I decided to share my authentic self with the world. That's when everything changed.

If you've ever felt uninspired or stuck in a rut – you're not alone. I've been there. Now, I'm here to inspire you to embrace your unique style, live authentically, and create a life that feels exciting, beautiful, and so you.`,
    ctaText = "Work With Me",
    imageUrl = "/nicole-about.png",
    quote = "I inspire others to embrace their authentic style and live their best life with grace.",
}: AboutProps) {
    return (
        <section
            id="about"
            className="bg-[var(--color-cream-dark)] py-20 lg:py-32"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Image Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Main Image with Burgundy Card Overlay */}
                        <div className="relative">
                            <div className="aspect-[3/4] w-full max-w-md relative">
                                <Image
                                    src={imageUrl}
                                    alt="Nicole - About"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                            </div>

                            {/* Overlapping Burgundy Card */}
                            <div className="absolute -bottom-8 -right-8 lg:-right-16 w-48 lg:w-64 bg-[var(--color-burgundy)] p-6 text-white">
                                <p className="text-xs italic leading-relaxed" style={{ fontFamily: 'var(--font-script)' }}>
                                    &ldquo;{quote}&rdquo;
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Intro Line */}
                        <p
                            className="text-xl text-[var(--color-brown)] italic"
                            style={{ fontFamily: "var(--font-script)" }}
                        >
                            {introLine}
                        </p>

                        {/* Headline */}
                        <h2
                            className="text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-dark)] leading-tight"
                            style={{ fontFamily: "var(--font-serif)" }}
                        >
                            {headline.split(",").map((part, i) => (
                                <span key={i}>
                                    {part}
                                    {i < headline.split(",").length - 1 && ","}
                                    <br className="hidden md:block" />
                                </span>
                            ))}
                        </h2>

                        {/* Description */}
                        <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                            {description.split("\n\n").map((paragraph, i) => (
                                <p key={i} className="text-sm md:text-base">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block px-8 py-4 bg-[var(--color-burgundy)] text-white text-xs tracking-[0.2em] uppercase hover:bg-[var(--color-burgundy-dark)] transition-colors"
                        >
                            {ctaText}
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
