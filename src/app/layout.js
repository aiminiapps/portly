import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  // Basic Metadata
  title: {
    default: "Portly - Intelligent Crypto Portfolio & Wealth AI",
    template: "%s | Portly"
  },
  description: "Transform blockchain data into wealth intelligence. Connect your wallet to visualize assets across chains, get instant AI risk analysis, and earn PTLY tokens by completing missions.",
  keywords: [
    "Portly",
    "PTLY token",
    "crypto portfolio tracker",
    "AI wealth manager",
    "DeFi analytics",
    "crypto risk score",
    "wallet health",
    "blockchain intelligence",
    "Ethereum",
    "Binance Smart Chain",
    "automated insights"
  ],
  authors: [{ name: "Portly Team", url: "https://portly.xyz" }],
  creator: "Portly",
  publisher: "Portly",
  
  // Canonical URL
  metadataBase: new URL("https://portly.xyz"),
  alternates: {
    canonical: "https://portly.xyz"
  },

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portly.xyz",
    siteName: "Portly",
    title: "Portly - Wealth Intelligence Reimagined",
    description: "Stop guessing. Start knowing. Track assets, analyze risk, and optimize your crypto portfolio with institutional-grade AI.",
    images: [
      {
        url: "/og-portly.png",
        width: 1200,
        height: 630,
        alt: "Portly - AI Portfolio Manager",
        type: "image/png"
      }
    ]
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@Portly_Official",
    creator: "@Portly_Official",
    title: "Portly - Master Your Crypto Universe",
    description: "Real-time tracking, predictive analytics, and smart alnpm install @next/third-parties@latest next@latesterts for your DeFi assets. Earn PTLY while you manage wealth.",
    images: ["/og-portly.png"]
  },

  // Icons & Favicons
  icons: {
    icon: [
      { url: "/agent.png", sizes: "32x32", type: "image/png" },
      { url: "/agent.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/agent.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/agent.png"
  },

  // App Manifest
  manifest: "/manifest.json",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },

  // Additional Meta Tags
  other: {
    "theme-color": "#8B5CF6",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "application-name": "Portly",
    "msapplication-TileColor": "#0A0A0B",
    "msapplication-config": "/browserconfig.xml"
  },

  // Category
  category: "finance"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD Schema for Finance App */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Portly",
              "url": "https://portly.xyz",
              "description": "AI-powered crypto portfolio management platform. Track assets, analyze risk, and earn PTLY tokens.",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web, iOS, Android",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Portly",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://portly.xyz/logo.png"
                },
                "sameAs": [
                  "https://x.com/Portly_Official"
                ]
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://portly.xyz/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0A0A0B] text-white selection:bg-[#8B5CF6] selection:text-white`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="" />//ga id is panding
    </html>
  );
}