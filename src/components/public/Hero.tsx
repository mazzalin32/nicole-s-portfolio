"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface HeroProps {
    headline?: string;
    subtitle?: string;
    ctaText?: string;
    imageUrl?: string;
    secondaryImageUrl?: string | null;
    studentsCount?: string;
    roleTitle?: string;
    roleSubtitle?: string;
}

export default function Hero({
    headline: _headline = "HI, I'm Nicole",
    subtitle: _subtitle = "Experienced Virtual Assistant dedicated to streamlining your business operations and enhancing productivity through efficient administrative support.",
    ctaText = "Work With Me",
    imageUrl = "/nicole-hero.png",
    secondaryImageUrl = "/nicole-hero-2.png",
    studentsCount = "100+",
    roleTitle: _roleTitle = "Expert Virtual Assistant",
    roleSubtitle: _roleSubtitle = "Strategic Business Partner",
}: HeroProps) {
    return (
        <section
            id="home"
            className="min-h-screen bg-[var(--color-cream)] pt-20 relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        {/* Main Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-[1.1] text-[var(--color-text-dark)]" style={{ fontFamily: "var(--font-serif)" }}>
                            {_headline}
                        </h1>

                        {/* Role Labels */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 text-xs tracking-[0.2em] uppercase text-[var(--color-text-dark)]">
                            <div>
                                <p>{_roleSubtitle}</p>
                            </div>
                            <div className="text-right sm:text-left">
                                <p>{_roleTitle}</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-baseline gap-2">
                            <span
                                className="text-4xl md:text-5xl text-[var(--color-burgundy)]"
                                style={{ fontFamily: "var(--font-serif)" }}
                            >
                                {studentsCount}
                            </span>
                            <div className="text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                                <p>Followers</p>
                                <p>Inspired</p>
                            </div>
                        </div>

                        {/* Bio / Description */}
                        {_subtitle && (
                            <p className="text-sm md:text-base text-[var(--color-text-dark)] leading-relaxed max-w-md">
                                {_subtitle}
                            </p>
                        )}

                        {/* CTA Button */}
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-block px-8 py-4 bg-[var(--color-text-dark)] text-white text-xs tracking-[0.2em] uppercase hover:bg-[var(--color-burgundy)] transition-colors"
                        >
                            {ctaText}
                        </motion.a>

                    </motion.div>

                    {/* Right - Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto lg:ml-auto">
                            <div className="relative aspect-[3/4] lg:aspect-[4/5] w-full border border-[var(--color-cream-dark)] shadow-sm">
                                <Image
                                    src={imageUrl}
                                    alt="Nicole - Virtual Assistant"
                                    fill
                                    className="object-cover object-top"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
