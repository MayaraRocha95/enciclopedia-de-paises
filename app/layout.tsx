import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata = {
  title: "Enciclopédia de Países",
  description: "Explore informações sobre todos os países do mundo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative min-h-screen bg-background">
          <Header />
          <main className="pb-16">{children}</main>
          <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#002B7F] via-[#FCD116] to-[#CE1126] z-10"></div>
        </div>
      </body>
    </html>
  )
}
