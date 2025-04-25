"use client"

import { useState, useEffect } from "react"
import { getCountry } from "@/lib/countries"
import type { Country } from "@/types/country"
import CountryCard from "@/components/country-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function FavoritesPage() {
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Recuperar IDs dos favoritos do localStorage
        const favoriteIds = JSON.parse(localStorage.getItem("favoriteCountries") || "[]")

        if (favoriteIds.length === 0) {
          setIsLoading(false)
          return
        }

        // Buscar dados de cada país favorito
        const countriesPromises = favoriteIds.map((id: string) => getCountry(id))
        const countries = await Promise.all(countriesPromises)

        // Filtrar países nulos (caso algum não seja encontrado)
        setFavoriteCountries(countries.filter(Boolean))
      } catch (error) {
        console.error("Erro ao carregar países favoritos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const clearFavorites = () => {
    localStorage.setItem("favoriteCountries", "[]")
    setFavoriteCountries([])
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col items-center text-center mb-12 relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-[#002B7F]/5"></div>
          <div className="absolute top-0 left-1/3 w-1/3 h-full bg-[#FFFFFF]/5"></div>
          <div className="absolute top-0 left-2/3 w-1/3 h-full bg-[#CE1126]/5"></div>
        </div>

        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#CE1126] via-[#FFFFFF] to-[#002B7F] flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Países Favoritos</h1>
          <p className="text-muted-foreground max-w-2xl">Sua coleção pessoal de países favoritos</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <Link href="/">
          <Button variant="outline" className="bg-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para todos os países
          </Button>
        </Link>

        {favoriteCountries.length > 0 && (
          <Button variant="outline" onClick={clearFavorites} className="bg-white text-secondary hover:text-secondary">
            Limpar favoritos
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-muted-foreground">Carregando favoritos...</div>
        </div>
      ) : favoriteCountries.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favoriteCountries.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border shadow-sm">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-2xl font-semibold mb-2">Nenhum país favorito</h2>
          <p className="text-muted-foreground mb-6">Você ainda não adicionou nenhum país aos seus favoritos.</p>
          <Link href="/">
            <Button>Explorar países</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
