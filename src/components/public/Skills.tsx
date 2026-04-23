"use client";

import { motion } from "framer-motion";

interface SkillProps {
    skills?: {
        id: string;
        name: string;
        description: string | null;
        level: number;
        category: string;
    }[];
    platforms?: {
        id: string;
        name: string;
    }[];
}

const defaultSoftSkills = [
    { name: "Storytelling", description: "Crafting compelling narratives that resonate" },
    { name: "Communication", description: "Clear, authentic, and engaging interactions" },
    { name: "Creativity", description: "Fresh ideas and unique perspectives" },
    { name: "Adaptability", description: "Thriving across platforms and trends" },
    { name: "Connection", description: "Building genuine community relationships" },
    { name: "Authenticity", description: "Staying true to personal values" },
];

const defaultTechnicalSkills = [
    { name: "Photography", level: 95 },
    { name: "Video Editing", level: 90 },
    { name: "Social Media Strategy", level: 95 },
    { name: "Content Planning", level: 90 },
    { name: "Brand Development", level: 85 },
    { name: "Community Management", level: 90 },
];

const defaultPlatforms = [
    "Instagram", "TikTok", "YouTube", "Pinterest", "LinkedIn", "Twitter"
];

export default function Skills({ skills = [], platforms = [] }: SkillProps) {
    const softSkills = skills.length > 0
        ? skills.filter(s => s.category === "Creative")
        : defaultSoftSkills;

    const technicalSkills = skills.length > 0
        ? skills.filter(s => s.category === "Technical")
        : defaultTechnicalSkills;

    const displayPlatforms = platforms.length > 0
        ? platforms.map(p => p.name)
        : defaultPlatforms;
    return (
        <section id="skills" className="bg-[var(--color-cream-dark)] py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p
                        className="text-lg text-[var(--color-brown)] italic mb-4"
                        style={{ fontFamily: "var(--font-script)" }}
                    >
                        My Expertise
                    </p>
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-dark)]"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                        Skills & Expertise
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Soft Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3
                            className="text-xl mb-8 text-[var(--color-text-dark)]"
                            style={{ fontFamily: "var(--font-serif)" }}
                        >
                            Creative Skills
                        </h3>
                        <div className="grid gap-4">
                            {softSkills.map((skill, index) => (
                                <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-white dark:bg-white/5 p-5 border border-[var(--color-cream-dark)] pink:border-[var(--color-burgundy-light)] pink:shadow-sm"
                                >
                                    <h4 className="font-medium text-[var(--color-text-dark)] mb-1">
                                        {skill.name}
                                    </h4>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {skill.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Technical Skills */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3
                            className="text-xl mb-8 text-[var(--color-text-dark)]"
                            style={{ fontFamily: "var(--font-serif)" }}
                        >
                            Technical Expertise
                        </h3>
                        <div className="space-y-6">
                            {technicalSkills.map((skill, index) => (
                                <motion.div
                                    key={skill.name}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-[var(--color-text-dark)]">
                                            {skill.name}
                                        </span>
                                        <span className="text-xs text-[var(--color-text-muted)]">
                                            {skill.level}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[var(--color-cream)] overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className="h-full bg-[var(--color-burgundy)]"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Platforms */}
                        <div className="mt-12">
                            <h4 className="text-sm font-medium text-[var(--color-text-dark)] mb-4 uppercase tracking-widest">
                                Platforms
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {displayPlatforms.map((platform) => (
                                    <span
                                        key={platform}
                                        className="px-4 py-2 bg-white dark:bg-white/5 text-xs text-[var(--color-text-muted)] border border-[var(--color-cream-dark)] pink:border-[var(--color-burgundy-light)]"
                                    >
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
