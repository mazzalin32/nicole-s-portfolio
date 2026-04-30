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
    "Expert Virtual Assistant and Administrative Professional providing strategic support in operations, finance, and stakeholder engagement. Specializing in hospitality, education, and tourism sectors.",
  keywords: ["Virtual Assistant", "Administrative Professional", "Operations Management", "Financial Administration", "Stakeholder Engagement", "Nicole Portfolio"],
  authors: [{ name: "Nicole" }],
  creator: "Nicole",
  metadataBase: new URL("https://nicole-portfolio.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Nicole | Virtual Assistant & Administrative Professional",
    description: "Expert Virtual Assistant and Administrative Professional providing strategic support in operations, finance, and stakeholder engagement.",
    url: "https://nicole-portfolio.vercel.app",
    siteName: "Nicole Portfolio",
    images: [
      {
        url: "/nicole-hero.png",
        width: 1200,
        height: 630,
        alt: "Nicole - Virtual Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicole | Virtual Assistant & Administrative Professional",
    description: "Expert Virtual Assistant and Administrative Professional providing strategic support in operations, finance, and stakeholder engagement.",
    images: ["/nicole-hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${dancingScript.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Nicole",
              "url": "https://nicole-portfolio.vercel.app",
              "jobTitle": "Virtual Assistant & Administrative Professional",
              "description": "Expert Virtual Assistant providing strategic support in operations, finance, and stakeholder engagement.",
              "sameAs": [
                "https://www.instagram.com/___.ashimwe_?igsh=d291eDF1djE0bjA3"
              ]
            })
          }}
        />
      </head>
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
