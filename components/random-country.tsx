"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAllCountries } from "@/lib/countries"
import type { Country } from "@/types/country"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPopulation, formatLanguages } from "@/lib/utils"
import { RefreshCw, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function RandomCountry() {
  const [countries, setCountries] = useState<Country[]>([])
  const [randomCountry, setRandomCountry] = useState<Country | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      const data = await getAllCountries()
      setCountries(data)

      // Set initial random country
      const randomIndex = Math.floor(Math.random() * data.length)
      setRandomCountry(data[randomIndex])
    }

    fetchCountries()
  }, [])

  const getRandomCountry = () => {
    setIsLoading(true)
    setIsFlipped(false)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * countries.length)
      setRandomCountry(countries[randomIndex])
      setIsLoading(false)
    }, 300)
  }

  if (!randomCountry) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  const facts = [
    `${randomCountry.name.common} tem uma população de ${formatPopulation(randomCountry.population)} habitantes.`,
    `A capital de ${randomCountry.name.common} é ${randomCountry.capital?.[0] || "não definida"}.`,
    `${randomCountry.name.common} está localizado na região de ${randomCountry.region}${randomCountry.subregion ? `, ${randomCountry.subregion}` : ""}.`,
    randomCountry.languages
      ? `Em ${randomCountry.name.common}, fala-se ${formatLanguages(randomCountry.languages)}.`
      : "",
    randomCountry.borders
      ? `${randomCountry.name.common} faz fronteira com ${randomCountry.borders.length} países.`
      : `${randomCountry.name.common} não faz fronteira com nenhum país.`,
  ].filter(Boolean)

  const randomFact = facts[Math.floor(Math.random() * facts.length)]

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={randomCountry.cca3}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <Card className="overflow-hidden border rounded-xl shadow-sm bg-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#002B7F] via-[#FFFFFF] to-[#CE1126]"></div>
            <div className="absolute top-1 left-0 w-full h-1 bg-gradient-to-r from-[#009739] via-[#FCD116] to-[#CE1126] opacity-70"></div>

            <div className="relative">
              <div className={`transform transition-all duration-500 ${isFlipped ? "rotate-y-180" : ""}`}>
                <div className="backface-hidden">
                  <div className="relative h-60 w-full">
                    <Image
                      src={randomCountry.flags.svg || randomCountry.flags.png}
                      alt={randomCountry.flags.alt || `Bandeira de ${randomCountry.name.common}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <CardHeader className="relative z-10 -mt-16 bg-gradient-to-t from-white to-transparent pt-8">
                    <CardTitle className="text-2xl">{randomCountry.name.common}</CardTitle>
                    <CardDescription>{randomCountry.name.official}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <p className="text-lg">{randomFact}</p>
                  </CardContent>
                </div>
              </div>
            </div>

            <CardFooter className="flex justify-between p-4 border-t bg-muted/10">
              <Button variant="outline" onClick={() => setIsFlipped(!isFlipped)} className="bg-white">
                Ver {isFlipped ? "frente" : "detalhes"}
              </Button>

              <Button
                onClick={getRandomCountry}
                disabled={isLoading}
                className="relative overflow-hidden bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <span className="animate-spin">
                    <RefreshCw className="h-4 w-4" />
                  </span>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Novo país
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8">
        <Link href={`/country/${randomCountry.cca3}`}>
          <Button variant="outline" className="group bg-white">
            Ver página completa
            <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
