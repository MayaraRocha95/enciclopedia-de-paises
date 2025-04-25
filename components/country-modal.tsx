"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Globe,
  Languages,
  Landmark,
  Users,
  Coins,
  MapPin,
  Flag,
  ArrowRight,
  Calendar,
  Mountain,
  Compass,
  Hash,
  Phone,
  LinkIcon,
  Clock,
  Car,
  Building,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPopulation, formatLanguages, formatCurrencies } from "@/lib/utils"
import type { Country } from "@/types/country"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CountryModalProps {
  country: Country
  isOpen: boolean
  onClose: () => void
}

export default function CountryModal({ country, isOpen, onClose }: CountryModalProps) {
  const [activeTab, setActiveTab] = useState("general")

  // Close modal on escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Determine flag colors for styling elements
  const getFlagColors = () => {
    // Predefined colors for common countries
    const countryColors: Record<string, string[]> = {
      USA: ["#002868", "#BF0A30", "#FFFFFF"],
      GBR: ["#00247D", "#CF142B", "#FFFFFF"],
      FRA: ["#002395", "#ED2939", "#FFFFFF"],
      DEU: ["#000000", "#DD0000", "#FFCE00"],
      ITA: ["#009246", "#FFFFFF", "#CE2B37"],
      ESP: ["#AA151B", "#F1BF00", "#000000"],
      BRA: ["#009739", "#FFDF00", "#002776"],
      JPN: ["#FFFFFF", "#BC002D", "#000000"],
      CAN: ["#FF0000", "#FFFFFF", "#FF0000"],
      AUS: ["#00008B", "#FF0000", "#FFFFFF"],
    }

    // Default colors if country not in list
    const defaultColors = ["#002B7F", "#CE1126", "#FFFFFF"]

    return countryColors[country.cca3] || defaultColors
  }

  const flagColors = getFlagColors()
  const primaryColor = flagColors[0]
  const secondaryColor = flagColors[1]

  // Format area with commas
  const formatArea = (area: number): string => {
    return area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Format car signs
  const formatCarSigns = (signs?: string[]): string => {
    if (!signs || signs.length === 0) return "N/A"
    return signs.join(", ")
  }

  // Format timezones
  const formatTimezones = (timezones: string[]): string => {
    if (!timezones || timezones.length === 0) return "N/A"
    return timezones.join(", ")
  }

  // Format TLDs
  const formatTlds = (tlds?: string[]): string => {
    if (!tlds || tlds.length === 0) return "N/A"
    return tlds.join(", ")
  }

  // Format phone code
  const formatPhoneCode = (idd: { root?: string; suffixes?: string[] }): string => {
    if (!idd.root) return "N/A"
    if (!idd.suffixes || idd.suffixes.length === 0) return idd.root
    return `${idd.root}${idd.suffixes[0]}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-background/60"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl bg-white shadow-lg border"
          >
            {/* Elementos decorativos inspirados em bandeiras */}
            <div
              className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r"
              style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            ></div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white/100 shadow-sm"
              onClick={onClose}
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Cabeçalho com bandeira e nome */}
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="h-full w-full relative"
                >
                  <Image
                    src={country.flags.svg || country.flags.png}
                    alt={country.flags.alt || `Bandeira de ${country.name.common}`}
                    fill
                    className="object-cover md:rounded-tl-2xl"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />

                  {/* Overlay com efeito de ondulação */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />

                  {/* Badge com o código do país */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
                    <Flag className="h-4 w-4" style={{ color: primaryColor }} />
                    <span className="font-medium text-sm">{country.cca3}</span>
                  </div>
                </motion.div>
              </div>

              <div className="p-6 md:p-8 w-full md:w-2/3">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h2 className="mb-1 text-3xl font-bold tracking-tight">{country.name.common}</h2>
                  <p className="mb-2 text-sm text-muted-foreground">{country.name.official}</p>

                  {/* Faixa com cores da bandeira */}
                  <div className="h-1.5 w-24 mb-4 rounded-full overflow-hidden">
                    <div
                      className="h-full w-full bg-gradient-to-r"
                      style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                    ></div>
                  </div>

                  {/* Informações básicas */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <Landmark className="h-4 w-4" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Capital</p>
                        <p className="font-medium text-sm">{country.capital?.[0] || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${secondaryColor}20` }}
                      >
                        <Globe className="h-4 w-4" style={{ color: secondaryColor }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Região</p>
                        <p className="font-medium text-sm">{country.region}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <Users className="h-4 w-4" style={{ color: primaryColor }} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">População</p>
                        <p className="font-medium text-sm">{formatPopulation(country.population)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Abas com informações detalhadas */}
            <div className="px-6 pb-6">
              <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="general" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Info className="h-4 w-4 mr-2" />
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="geography" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Mountain className="h-4 w-4 mr-2" />
                    Geografia
                  </TabsTrigger>
                  <TabsTrigger value="economy" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Coins className="h-4 w-4 mr-2" />
                    Economia
                  </TabsTrigger>
                  <TabsTrigger value="misc" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Globe className="h-4 w-4 mr-2" />
                    Outros
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Idiomas */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Languages className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Idiomas</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{formatLanguages(country.languages)}</p>
                      </div>
                    </div>

                    {/* Moedas */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Moedas</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{formatCurrencies(country.currencies)}</p>
                      </div>
                    </div>

                    {/* Nomes alternativos */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Nomes alternativos</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{country.altSpellings?.join(", ") || "N/A"}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Status</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="font-medium">{country.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Independente:</span>
                            <span className="font-medium">{country.independent ? "Sim" : "Não"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Membro da ONU:</span>
                            <span className="font-medium">{country.unMember ? "Sim" : "Não"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Brasão de armas (se disponível) */}
                    {country.coatOfArms && (country.coatOfArms.svg || country.coatOfArms.png) && (
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-5 w-5" style={{ color: primaryColor }} />
                          <h3 className="font-semibold">Brasão de Armas</h3>
                        </div>
                        <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                          <div className="relative h-40 w-40">
                            <Image
                              src={country.coatOfArms.svg || country.coatOfArms.png || ""}
                              alt={`Brasão de armas de ${country.name.common}`}
                              fill
                              className="object-contain"
                              sizes="160px"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="geography" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Região */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Região</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span>Região:</span>
                            <span className="font-medium">{country.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sub-região:</span>
                            <span className="font-medium">{country.subregion || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Continentes:</span>
                            <span className="font-medium">{country.continents?.join(", ") || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Área */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mountain className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Área</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span>Área total:</span>
                            <span className="font-medium">{formatArea(country.area)} km²</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sem litoral:</span>
                            <span className="font-medium">{country.landlocked ? "Sim" : "Não"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coordenadas */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Coordenadas</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span>Latitude:</span>
                            <span className="font-medium">{country.latlng?.[0] || "N/A"}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Longitude:</span>
                            <span className="font-medium">{country.latlng?.[1] || "N/A"}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ver no mapa:</span>
                            <a
                              href={country.maps.googleMaps}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:underline"
                              style={{ color: primaryColor }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Google Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Países fronteiriços */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Compass className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Países Fronteiriços</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {country.borders && country.borders.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {country.borders.map((border) => (
                              <span
                                key={border}
                                className="rounded-full px-3 py-1 text-xs text-white"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {border}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p>Nenhum país fronteiriço</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="economy" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Moedas */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Moedas</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{formatCurrencies(country.currencies)}</p>
                      </div>
                    </div>

                    {/* Índice Gini (se disponível) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Hash className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Índice Gini</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {country.gini ? (
                          <div className="space-y-2">
                            {Object.entries(country.gini).map(([year, value]) => (
                              <div key={year} className="flex justify-between">
                                <span>Ano {year}:</span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>Dados não disponíveis</p>
                        )}
                      </div>
                    </div>

                    {/* FIFA (se disponível) */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Código FIFA</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{country.fifa || "N/A"}</p>
                      </div>
                    </div>

                    {/* Início da semana */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Início da Semana</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="capitalize">{country.startOfWeek}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="misc" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Código de telefone */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Código Telefônico</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{formatPhoneCode(country.idd)}</p>
                      </div>
                    </div>

                    {/* TLDs */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Domínios de Internet</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{formatTlds(country.tld)}</p>
                      </div>
                    </div>

                    {/* Fusos horários */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" style={{ color: primaryColor }} />
                        <h3 className="font-semibold">Fusos Horários</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p>{formatTimezones(country.timezones)}</p>
                      </div>
                    </div>

                    {/* Informações de carro */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5" style={{ color: secondaryColor }} />
                        <h3 className="font-semibold">Informações de Trânsito</h3>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between">
                            <span>Lado da direção:</span>
                            <span className="font-medium capitalize">{country.car.side}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sinais de carro:</span>
                            <span className="font-medium">{formatCarSigns(country.car.signs)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Código postal (se disponível) */}
                    {country.postalCode && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-5 w-5" style={{ color: primaryColor }} />
                          <h3 className="font-semibold">Código Postal</h3>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                              <span>Formato:</span>
                              <span className="font-medium">{country.postalCode.format}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Botão para ver página completa */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-8 flex justify-center"
              >
                <Link href={`/country/${country.cca3}`}>
                  <Button
                    className="group flex items-center gap-2 text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Ver página completa
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
