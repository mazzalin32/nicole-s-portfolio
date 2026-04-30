import type { Metadata } from "next";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nicole | Virtual Assistant & Administrative Professional",
  description:
    "Expert Virtual Assistant and Administrative Professional providing strategic support in operations, finance, and stakeholder engagement.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${dancingScript.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          defaultTheme="system"
          storageKey="nicole-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
