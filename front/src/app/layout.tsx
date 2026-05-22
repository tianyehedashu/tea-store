import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { Inter, Playfair_Display } from "next/font/google"

const brandDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-display",
  display: "swap",
})

const brandSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Zentee - Single-Origin Teas",
    template: "%s | Zentee",
  },
  description:
    "Single-origin loose-leaf teas with origin stories, precise brewing guidance, and a calmer way to shop for a better daily cup.",
  keywords: [
    "zen tea",
    "mindful tea",
    "organic tea",
    "meditation tea",
    "wellness tea",
    "calming tea",
    "tea ceremony",
    "mindfulness",
  ],
  authors: [{ name: "Zentee" }],
  creator: "Zentee",
  publisher: "Zentee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5BA05B",
      },
    ],
  },
  manifest: "/manifest.json",
  applicationName: "Zentee",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zentee",
  },
  openGraph: {
    type: "website",
      siteName: "Zentee",
    title: "Zentee - Single-Origin Teas",
    description:
      "Single-origin loose-leaf teas with origin stories and precise brewing guidance.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556760146-a3e5e6e2abd9?w=1200&h=630&fit=crop&crop=center",
        width: 1200,
        height: 630,
        alt: "Zentee - Sip the Calm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zentee - Single-Origin Teas",
    description:
      "Single-origin loose-leaf teas with origin stories and precise brewing guidance.",
    images: [
      "https://images.unsplash.com/photo-1556760146-a3e5e6e2abd9?w=1200&h=675&fit=crop&crop=center",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "add-your-google-verification-code-here",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${brandDisplay.variable} ${brandSans.variable}`}
    >
      <head>
        <meta name="theme-color" content="#5BA05B" />
        <meta name="msapplication-TileColor" content="#5BA05B" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="bg-[#fffaf2] text-sage-900 antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
