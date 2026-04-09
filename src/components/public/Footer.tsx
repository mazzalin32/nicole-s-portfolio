"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

interface FooterProps {
    ownerName?: string;
    contactEmail?: string;
    phoneNumber?: string;
    instagramUrl?: string;
}

export default function Footer({
    ownerName = "Nicole",
    contactEmail = "ashimwegra12@gmail.com",
    phoneNumber = "0792630152",
    instagramUrl = "https://www.instagram.com/___.ashimwe_?igsh=d291eDF1djE0bjA3",
}: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1A1A1A] dark:bg-black text-white py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link
                            href="/"
                            className="text-2xl tracking-widest uppercase mb-6 block"
                            style={{ fontFamily: "var(--font-serif)" }}
                        >
                            {ownerName}
                        </Link>
                        <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                            Lifestyle influencer and content creator inspiring you to live your
                            best life with style, authenticity, and grace.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                            Quick Links
                        </h4>
                        <nav className="flex flex-col gap-3">
                            {["About", "Work With Me", "Contact"].map((link) => (
                                <Link
                                    key={link}
                                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    {link}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                            Get In Touch
                        </h4>
                        <div className="flex flex-col gap-4 mb-6">
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <Mail size={16} />
                                {contactEmail}
                            </a>
                            {phoneNumber && (
                                <a
                                    href={`tel:${phoneNumber}`}
                                    className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
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
                                    {phoneNumber}
                                </a>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {instagramUrl && (
                                <motion.a
                                    href={instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-[var(--color-burgundy)] transition-colors"
                                >
                                    <Instagram size={18} />
                                </motion.a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-white/50">
                        © {currentYear} {ownerName}. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-xs text-white/50 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-xs text-white/50 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
