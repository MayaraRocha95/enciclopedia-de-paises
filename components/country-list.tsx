"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import CountryCard from "./country-card"
import { getAllCountries } from "@/lib/countries"
import type { Country } from "@/types/country"

export default function CountryList() {
  const [countries, setCountries] = useState<Country[]>([])
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const searchParams = useSearchParams()

  // Extract specific search params to avoid dependency on the entire searchParams object
  const searchTerm = searchParams.get("search") || ""
  const regionFilter = searchParams.get("region") || ""
  const languageFilter = searchParams.get("language") || ""
  const sortOrder = searchParams.get("sort") || ""

  // Fetch countries only once when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getAllCountries()
      setCountries(data)
      setFilteredCountries(data)
    }

    fetchCountries()
  }, [])

  // Apply filters when search params or countries change
  useEffect(() => {
    // Skip if countries aren't loaded yet
    if (countries.length === 0) return

    let filtered = [...countries]

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (country) =>
          country.name.common.toLowerCase().includes(searchLower) ||
          country.name.official.toLowerCase().includes(searchLower),
      )
    }

    // Filter by region
    if (regionFilter && regionFilter !== "all") {
      filtered = filtered.filter((country) => country.region === regionFilter)
    }

    // Filter by language
    if (languageFilter && languageFilter !== "all") {
      const langLower = languageFilter.toLowerCase()
      filtered = filtered.filter(
        (country) =>
          country.languages && Object.values(country.languages).some((lang) => lang.toLowerCase().includes(langLower)),
      )
    }

    // Sort by population or name
    if (sortOrder === "population-asc") {
      filtered.sort((a, b) => a.population - b.population)
    } else if (sortOrder === "population-desc") {
      filtered.sort((a, b) => b.population - a.population)
    } else if (sortOrder === "name-asc") {
      filtered.sort((a, b) => a.name.common.localeCompare(b.name.common))
    } else if (sortOrder === "name-desc") {
      filtered.sort((a, b) => b.name.common.localeCompare(a.name.common))
    }

    setFilteredCountries(filtered)
  }, [countries, searchTerm, regionFilter, languageFilter, sortOrder])

  if (filteredCountries.length === 0 && countries.length > 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Nenhum país encontrado</h3>
        <p className="text-muted-foreground">Tente ajustar seus filtros de busca</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCountries.map((country) => (
        <CountryCard key={country.cca3} country={country} />
      ))}
    </div>
  )
}
