"use client"

import { useEffect, useState } from "react"
import { getAllCountries } from "@/lib/countries"
import type { Country } from "@/types/country"
import { formatPopulation } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { motion } from "framer-motion"

export default function PopulationRanking() {
  const [topCountries, setTopCountries] = useState<Country[]>([])

  useEffect(() => {
    const fetchTopCountries = async () => {
      const countries = await getAllCountries()
      const sorted = [...countries].sort((a, b) => b.population - a.population)
      setTopCountries(sorted.slice(0, 10))
    }

    fetchTopCountries()
  }, [])

  const chartData = topCountries.map((country, index) => ({
    name: country.name.common,
    population: country.population,
    flag: country.flags.svg,
    color: [
      "#002B7F", // Azul
      "#CE1126", // Vermelho
      "#009739", // Verde
      "#FCD116", // Amarelo
      "#F77F00", // Laranja
      "#7209B7", // Roxo
      "#4361EE", // Azul claro
      "#D62828", // Vermelho escuro
      "#2A9D8F", // Verde água
      "#E76F51", // Coral
    ][index % 10],
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border rounded-xl shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-[#002B7F]/5 via-[#FFFFFF]/5 to-[#CE1126]/5 border-b relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#002B7F] via-[#FFFFFF] to-[#CE1126]"></div>
          <CardTitle className="text-2xl">Top 10 Países Mais Populosos</CardTitle>
          <CardDescription>Ranking dos países com maior população mundial</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[500px] w-full">
            <ChartContainer
              config={{
                population: {
                  label: "População",
                  color: "hsl(var(--primary))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 120, bottom: 10 }}>
                  <XAxis type="number" tickFormatter={(value) => formatPopulation(value)} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-white p-3 shadow-md">
                            <div className="flex flex-col">
                              <span className="font-bold">{payload[0].payload.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {formatPopulation(payload[0].value as number)}
                              </span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="population"
                    animationDuration={1500}
                    radius={[0, 4, 4, 0]}
                    fill={(entry) => entry.color}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
