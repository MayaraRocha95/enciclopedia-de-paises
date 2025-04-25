import { notFound } from "next/navigation"
import Image from "next/image"
import { getCountry, getAllCountries } from "@/lib/countries"
import { formatPopulation, formatLanguages, formatCurrencies } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Globe, Languages, Landmark, Users, Coins, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"

export async function generateStaticParams() {
  const countries = await getAllCountries()
  return countries.map((country) => ({
    id: country.cca3,
  }))
}

export default async function CountryPage({ params }: { params: { id: string } }) {
  const country = await getCountry(params.id)

  if (!country) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-lg group">
          <Image
            src={country.flags.svg || "/placeholder.svg"}
            alt={country.flags.alt || `Bandeira de ${country.name.common}`}
            width={800}
            height={500}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold">{country.name.common}</h1>
            <p className="text-xl text-muted-foreground">{country.name.official}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Capital</p>
                <p className="font-medium">{country.capital?.[0] || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Região</p>
                <p className="font-medium">
                  {country.region} {country.subregion ? `(${country.subregion})` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">População</p>
                <p className="font-medium">{formatPopulation(country.population)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Idiomas</p>
                <p className="font-medium">{formatLanguages(country.languages)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Moedas</p>
                <p className="font-medium">{formatCurrencies(country.currencies)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ver no mapa</p>
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>

          {country.borders && country.borders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Países Fronteiriços</h2>
              <div className="flex flex-wrap gap-2">
                {country.borders.map((border) => (
                  <Link
                    key={border}
                    href={`/country/${border}`}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm hover:bg-secondary/80 transition-colors"
                  >
                    {border}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
