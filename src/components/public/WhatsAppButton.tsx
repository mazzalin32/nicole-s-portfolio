"use client";

import { motion } from "framer-motion";

interface WhatsAppButtonProps {
    phoneNumber?: string;
}

export default function WhatsAppButton({ phoneNumber = "0792630152" }: WhatsAppButtonProps) {
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const message = encodeURIComponent("Hi Nicole, I'm reaching out from your website.");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20ba5a] transition-colors"
            title="Chat with me on WhatsApp"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-message-circle"
            >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
        </motion.a>
    );
}
