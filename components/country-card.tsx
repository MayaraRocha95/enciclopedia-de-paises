"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Heart, Globe, Users } from "lucide-react"
import { formatPopulation } from "@/lib/utils"
import type { Country } from "@/types/country"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CountryModal from "./country-modal"
import { motion } from "framer-motion"

interface CountryCardProps {
  country: Country
}

export default function CountryCard({ country }: CountryCardProps) {
  const [isFavorite, setIsFavorite] = useState(() => {
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]")
      return favorites.includes(country.cca3)
    }
    return false
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const favorites = JSON.parse(localStorage.getItem("favoriteCountries") || "[]")

    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== country.cca3)
      localStorage.setItem("favoriteCountries", JSON.stringify(newFavorites))
    } else {
      favorites.push(country.cca3)
      localStorage.setItem("favoriteCountries", JSON.stringify(favorites))
    }

    setIsFavorite(!isFavorite)

    // Redirecionar para a página de favoritos
    window.location.href = "/favorites"
  }

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  // Determine which flag-inspired border to use based on country code
  const getBorderClass = () => {
    const code = country.cca3.toLowerCase()
    if (["usa", "gbr", "fra", "rus"].includes(code)) {
      return "flag-primary-border"
    } else if (["bra", "mex", "ind", "chn"].includes(code)) {
      return "flag-secondary-border"
    } else {
      return "flag-accent-border"
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        onClick={openModal}
        className={`h-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 ${getBorderClass()} cursor-pointer`}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={country.flags.svg || country.flags.png}
            alt={country.flags.alt || `Bandeira de ${country.name.common}`}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white z-10 rounded-full shadow-sm"
            onClick={toggleFavorite}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
              )}
            />
            <span className="sr-only">Favoritar</span>
          </Button>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{country.name.common}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-3 w-3 text-primary" />
              </div>
              <span className="text-muted-foreground">{country.region}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10">
                <Users className="h-3 w-3 text-secondary" />
              </div>
              <span className="text-muted-foreground">{formatPopulation(country.population)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <CountryModal country={country} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
