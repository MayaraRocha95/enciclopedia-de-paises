"use client"

import Link from "next/link"
import { Globe } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full backdrop-blur-md supports-[backdrop-filter]:bg-background/80 flag-stripes-header",
        isHome ? "border-transparent" : "border-b",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="bg-gradient-to-br from-[#002B7F] to-[#CE1126] rounded-full p-1.5"
          >
            <Globe className="h-5 w-5 text-white" />
          </motion.div>
          <span className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
            Enciclopédia de Países
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="h-8 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#002B7F]"></span>
            <span className="w-2 h-2 rounded-full bg-[#FFFFFF] border border-gray-200"></span>
            <span className="w-2 h-2 rounded-full bg-[#CE1126]"></span>
          </div>
        </div>
      </div>
    </header>
  )
}
