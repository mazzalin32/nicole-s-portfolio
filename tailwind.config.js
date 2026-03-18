/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ["var(--font-serif)", "serif"],
                sans: ["var(--font-sans)", "sans-serif"],
                script: ["var(--font-script)", "cursive"],
            },
            colors: {
                cream: "var(--color-cream)",
                "cream-dark": "var(--color-cream-dark)",
                burgundy: "var(--color-burgundy)",
                "burgundy-dark": "var(--color-burgundy-dark)",
                "burgundy-light": "var(--color-burgundy-light)",
                brown: "var(--color-brown)",
                "brown-light": "var(--color-brown-light)",
                "text-dark": "var(--color-text-dark)",
                "text-muted": "var(--color-text-muted)",
            },
        },
    },
    plugins: [],
};
