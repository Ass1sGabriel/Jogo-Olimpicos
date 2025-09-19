import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Cinzel_Decorative } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
})

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Olímpicos - Jogo de Tabuleiro Digital",
  description: "Um jogo de tabuleiro digital baseado na mitologia grega",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${cinzel.variable} ${cinzelDecorative.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
