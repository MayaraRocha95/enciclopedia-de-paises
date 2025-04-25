import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPopulation(population: number): string {
  if (population >= 1000000000) {
    return `${(population / 1000000000).toFixed(1)} bilhões`
  } else if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)} milhões`
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(1)} mil`
  } else {
    return population.toString()
  }
}

export function formatLanguages(languages: Record<string, string> | undefined): string {
  if (!languages) return "N/A"

  const languageList = Object.values(languages)

  if (languageList.length === 0) return "N/A"
  if (languageList.length === 1) return languageList[0]

  const lastLanguage = languageList.pop()
  return `${languageList.join(", ")} e ${lastLanguage}`
}

export function formatCurrencies(currencies: Record<string, { name: string; symbol: string }> | undefined): string {
  if (!currencies) return "N/A"

  const currencyList = Object.values(currencies).map((currency) => `${currency.name} (${currency.symbol || ""})`)

  if (currencyList.length === 0) return "N/A"
  if (currencyList.length === 1) return currencyList[0]

  const lastCurrency = currencyList.pop()
  return `${currencyList.join(", ")} e ${lastCurrency}`
}
