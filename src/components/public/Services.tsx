"use client";

import { motion } from "framer-motion";
import { Camera, Users, Megaphone, Mic } from "lucide-react";

const services = [
    {
        icon: Camera,
        title: "Content Creation",
        description: "High-quality photo and video content for brands looking to connect with their audience authentically.",
        features: ["Photo shoots", "Video content", "Behind-the-scenes", "Product showcases"],
    },
    {
        icon: Users,
        title: "Brand Collaborations",
        description: "Strategic partnerships that align with my values and resonate with my engaged community.",
        features: ["Sponsored posts", "Brand ambassadorship", "Campaign features", "Product launches"],
    },
    {
        icon: Megaphone,
        title: "Social Media Consulting",
        description: "Guidance on building an authentic social media presence that attracts and engages your ideal audience.",
        features: ["Strategy sessions", "Content planning", "Growth tips", "Engagement tactics"],
    },
    {
        icon: Mic,
        title: "Speaking Engagements",
        description: "Inspiring talks on personal branding, authenticity, and building a lifestyle brand.",
        features: ["Keynote speeches", "Panel discussions", "Workshop hosting", "Event appearances"],
    },
];

export default function Services() {
    return (
        <section id="services" className="bg-[var(--color-cream)] py-20 lg:py-32">
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
                        What I Offer
                    </p>
                    <h2
                        className="text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-dark)]"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                        Services & Collaborations
                    </h2>
                </motion.div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-white dark:bg-white/5 p-8 border border-[var(--color-cream-dark)] hover:border-[var(--color-burgundy)] transition-colors group pink:border-[var(--color-burgundy-light)] pink:shadow-sm"
                        >
                            <service.icon
                                className="text-[var(--color-burgundy)] mb-6 group-hover:scale-110 transition-transform"
                                size={36}
                            />
                            <h3
                                className="text-xl mb-3 text-[var(--color-text-dark)]"
                                style={{ fontFamily: "var(--font-serif)" }}
                            >
                                {service.title}
                            </h3>
                            <p className="text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <ul className="space-y-2">
                                {service.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="text-xs text-[var(--color-text-muted)] flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-[var(--color-burgundy)] rounded-full" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <a
                        href="#contact"
                        className="inline-block px-8 py-4 bg-[var(--color-burgundy)] text-white text-xs tracking-[0.2em] uppercase hover:bg-[var(--color-burgundy-dark)] transition-colors"
                    >
                        Let&apos;s Collaborate
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
