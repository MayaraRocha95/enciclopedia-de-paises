"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X, Filter } from "lucide-react"
import { getAllCountries } from "@/lib/countries"
import type { Country } from "@/types/country"
import { motion } from "framer-motion"

export default function SearchFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [region, setRegion] = useState(searchParams.get("region") || "")
  const [language, setLanguage] = useState(searchParams.get("language") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || "")
  const [languages, setLanguages] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchLanguagesAndRegions = async () => {
      const countries = await getAllCountries()

      // Extract unique languages
      const allLanguages = new Set<string>()
      countries.forEach((country: Country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((lang) => {
            allLanguages.add(lang)
          })
        }
      })

      // Extract unique regions
      const allRegions = new Set<string>()
      countries.forEach((country: Country) => {
        if (country.region) {
          allRegions.add(country.region)
        }
      })

      setLanguages(Array.from(allLanguages).sort())
      setRegions(Array.from(allRegions).sort())
    }

    fetchLanguagesAndRegions()
  }, [])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (region) params.set("region", region)
    if (language) params.set("language", language)
    if (sort) params.set("sort", sort)

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearch("")
    setRegion("")
    setLanguage("")
    setSort("")
    router.push(pathname)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-6 rounded-xl border bg-white shadow-sm relative overflow-hidden"
    >
      {/* Elementos decorativos inspirados em bandeiras */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#002B7F] via-[#FFFFFF] to-[#CE1126]"></div>
      <div className="absolute top-1 left-0 w-full h-1 bg-gradient-to-r from-[#009739] via-[#FCD116] to-[#CE1126] opacity-70"></div>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar país..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-lg border-muted bg-white"
          />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-sm bg-white">
            <Filter className="mr-2 h-4 w-4" />
            {isExpanded ? "Ocultar filtros" : "Mostrar filtros"}
          </Button>

          <div className="flex gap-2">
            {(search || region || language || sort) && (
              <Button variant="outline" size="sm" onClick={resetFilters} className="text-sm bg-white">
                <X className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            )}

            <Button size="sm" onClick={applyFilters} className="text-sm bg-primary hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" />
              Aplicar
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t"
        >
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="rounded-lg bg-white">
              <SelectValue placeholder="Filtrar por região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="rounded-lg bg-white">
              <SelectValue placeholder="Filtrar por idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os idiomas</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="rounded-lg bg-white">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Padrão</SelectItem>
              <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
              <SelectItem value="population-desc">População (Maior-Menor)</SelectItem>
              <SelectItem value="population-asc">População (Menor-Maior)</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      )}
    </motion.div>
  )
}
