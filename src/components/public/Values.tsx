"use client";

import { motion } from "framer-motion";

interface Value {
    id: string;
    title: string;
    description: string | null;
}

interface ValuesProps {
    values?: Value[];
}

const defaultValues: Value[] = [
    {
        id: "1",
        title: "Authenticity",
        description:
            "Your business should look and feel like you. I believe in building brands and offers that reflect your personality, style, and values – not what the latest 'guru' says you should do.",
    },
    {
        id: "2",
        title: "Freedom",
        description:
            "I'm here to help you design a business that gives you more life, not less. That means creating systems, boundaries, and offers that support your schedule, your energy, and your dreams - so you can take Fridays off, go for long lunches, or book that trip without stressing.",
    },
    {
        id: "3",
        title: "Impact",
        description:
            "It's not just about making money (though I love helping you do that too). It's about creating real, meaningful results for your clients and yourself. I believe your work can change lives – and I'll help you make sure it does.",
    },
    {
        id: "4",
        title: "Growth Mindset",
        description:
            "Success isn't about getting everything perfect the first time – it's about learning, adapting, and growing through every stage of your business. I'll always encourage my clients to try, test, and evolve.",
    },
];

export default function Values({ values = defaultValues }: ValuesProps) {
    return (
        <section id="values" className="bg-[var(--color-cream)] py-20 lg:py-32 overflow-hidden">
            {/* Scrolling "MY VALUES" Text */}
            <div className="relative mb-16">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...Array(4)].map((_, i) => (
                        <span
                            key={i}
                            className="text-6xl md:text-8xl lg:text-9xl text-[var(--color-cream-dark)] font-bold tracking-wider mx-8"
                            style={{ fontFamily: "var(--font-serif)", WebkitTextStroke: "1px var(--color-text-dark)", color: "transparent" }}
                        >
                            MY VALUES
                        </span>
                    ))}
                </div>
            </div>

            {/* Values Grid */}
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {values.map((value, index) => (
                        <motion.div
                            key={value.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="bg-[var(--color-burgundy)] p-8 lg:p-10 text-white"
                        >
                            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase mb-4">
                                {value.title}
                            </h3>
                            <p className="text-sm leading-relaxed opacity-90">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
