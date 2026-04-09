"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#skills", label: "Skills" },
    { href: "#values", label: "Values" },
    { href: "#contact", label: "Contact" },
];

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Heart } from "lucide-react";

interface NavbarProps {
    ownerName?: string;
}

export default function Navbar({ ownerName = "Nicole" }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);




    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-transparent dark:border-[var(--color-cream-dark)] transition-colors duration-300">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="font-[var(--font-serif)] text-lg tracking-widest uppercase text-[var(--color-text-dark)]"
                    style={{ fontFamily: 'var(--font-serif)' }}
                >
                    {ownerName}
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-xs tracking-widest uppercase text-[var(--color-text-dark)] hover:text-[var(--color-burgundy)] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "pink" : theme === "pink" ? "light" : "dark")}
                        className="p-2 text-[var(--color-text-dark)] hover:text-[var(--color-burgundy)] transition-colors"
                        aria-label="Toggle theme"
                    >
                        {!mounted ? <Sun size={18} /> : theme === "dark" ? <Moon size={18} /> : theme === "pink" ? <Heart size={18} /> : <Sun size={18} />}
                    </button>
                </div>

                {/* Mobile Controls */}
                <div className="lg:hidden flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "pink" : theme === "pink" ? "light" : "dark")}
                        className="p-2 text-[var(--color-text-dark)]"
                        aria-label="Toggle theme"
                    >
                        {!mounted ? <Sun size={20} /> : theme === "dark" ? <Moon size={20} /> : theme === "pink" ? <Heart size={20} /> : <Sun size={20} />}
                    </button>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-[var(--color-text-dark)]"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>


            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-[var(--color-cream)] border-t border-[var(--color-cream-dark)]"
                    >
                        <div className="flex flex-col px-6 py-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm tracking-widest uppercase text-[var(--color-text-dark)] hover:text-[var(--color-burgundy)] transition-colors py-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="#contact"
                                onClick={() => setIsOpen(false)}
                                className="mt-4 px-6 py-3 text-center text-xs tracking-widest uppercase bg-[var(--color-burgundy)] text-white"
                            >
                                Start Working With Me
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
}
