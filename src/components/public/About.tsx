"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AboutProps {
    introLine?: string;
    headline?: string;
    description?: string;
    ctaText?: string;
    imageUrl?: string;
    secondaryImageUrl?: string | null;
    quote?: string;
}

export default function About({
    introLine = "Hey, I'm Nicole",
    headline = "Expert Virtual Assistant & Strategic Business Partner",
    description = `I specialize in providing high-level administrative support and strategic operations management to help entrepreneurs and businesses scale efficiently.

Whether you need calendar management, process optimization, or executive-level assistance, I'm here to ensure your business runs smoothly so you can focus on your vision.`,
    ctaText = "Work With Me",
    imageUrl = "/nicole-about.png",
    secondaryImageUrl = "/nicole-about-2.png",
    quote = "Streamlining your business operations with precision and professional excellence.",
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
                        <div className="relative">
                            <div className="aspect-[3/4] w-full max-w-md relative z-10 border border-[var(--color-cream-dark)] shadow-sm">
                                <Image
                                    src={imageUrl}
                                    alt="Nicole - Virtual Assistant"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                            </div>

                            {/* Real Cloud Shape with flexible text overlay - Minimized size and brown/cream colors */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 1, -1, 0]
                                }}
                                transition={{
                                    duration: 7,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -bottom-16 -right-6 lg:-right-10 w-56 md:w-64 lg:w-72 z-20"
                            >
                                {/* SVG Cloud Shape */}
                                <svg
                                    viewBox="0 0 340 200"
                                    className="w-full h-auto drop-shadow-xl absolute inset-0"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M60,140 C30,140 10,120 10,100 C10,80 25,65 45,62 C42,45 60,28 82,28 C95,18 115,12 135,12 C160,10 180,18 195,32 C210,20 235,18 255,28 C280,40 295,60 290,82 C310,88 330,100 330,120 C330,140 310,155 285,158 L75,158 C65,158 60,150 60,140 Z"
                                        fill="var(--color-burgundy)"
                                        fillOpacity="0.9"
                                    />
                                </svg>
                                {/* Text overlay positioned in the cloud belly */}
                                <div className="relative z-10 flex items-center justify-center px-8 py-10 md:px-10 md:py-12">
                                    <p className="text-[10px] md:text-xs font-medium italic leading-relaxed text-center text-white select-none" style={{ fontFamily: 'var(--font-serif)' }}>
                                        &ldquo;{quote}&rdquo;
                                    </p>
                                </div>
                            </motion.div>
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
                            href="/#contact"
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
