"use client"

import { Suspense } from "react"
import CountryList from "@/components/country-list"
import SearchFilters from "@/components/search-filters"
import PopulationRanking from "@/components/population-ranking"
import RandomCountry from "@/components/random-country"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col items-center text-center mb-12 relative">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-[#002B7F]/5"></div>
          <div className="absolute top-0 left-1/3 w-1/3 h-full bg-[#FFFFFF]/5"></div>
          <div className="absolute top-0 left-2/3 w-1/3 h-full bg-[#CE1126]/5"></div>
        </div>

        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#002B7F] via-[#FFFFFF] to-[#CE1126] flex items-center justify-center mb-4">
            <Globe className="h-10 w-10 text-white drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Enciclopédia de Países</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore informações detalhadas sobre todos os países do mundo, suas bandeiras, populações e muito mais
          </p>
        </div>
      </div>

      <Tabs defaultValue="countries" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-4 w-full max-w-md bg-muted/50 p-1">
            <TabsTrigger value="countries" className="data-[state=active]:bg-white data-[state=active]:text-primary">
              Países
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-white data-[state=active]:text-secondary">
              Ranking
            </TabsTrigger>
            <TabsTrigger value="curiosity" className="data-[state=active]:bg-white data-[state=active]:text-accent">
              Curiosidades
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="data-[state=active]:bg-white data-[state=active]:text-[#CE1126]"
              onClick={() => (window.location.href = "/favorites")}
            >
              Favoritos
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="countries" className="space-y-8">
          <SearchFilters />
          <Suspense fallback={<CountryListSkeleton />}>
            <CountryList />
          </Suspense>
        </TabsContent>

        <TabsContent value="ranking">
          <Suspense
            fallback={
              <div className="h-96 flex items-center justify-center">
                <Skeleton className="h-80 w-full max-w-4xl mx-auto rounded-xl" />
              </div>
            }
          >
            <div className="max-w-4xl mx-auto">
              <PopulationRanking />
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="curiosity">
          <Suspense
            fallback={
              <div className="h-96 flex items-center justify-center">
                <Skeleton className="h-80 w-full max-w-md mx-auto rounded-xl" />
              </div>
            }
          >
            <div className="max-w-md mx-auto">
              <RandomCountry />
            </div>
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CountryListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden border bg-card">
            <Skeleton className="h-48 w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
    </div>
  )
}
