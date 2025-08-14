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
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${brandDisplay.variable} ${brandSans.variable}`}>
      <body className="bg-brand-50 text-grey-90">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
