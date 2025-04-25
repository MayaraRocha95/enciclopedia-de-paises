import type { Country } from "@/types/country"

const API_URL = "https://restcountries.com/v3.1"

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${API_URL}/all`)

    if (!response.ok) {
      throw new Error("Failed to fetch countries")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching countries:", error)
    return []
  }
}

export async function getCountry(id: string): Promise<Country | null> {
  try {
    const response = await fetch(`${API_URL}/alpha/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch country with ID: ${id}`)
    }

    const data = await response.json()
    return data[0] || null
  } catch (error) {
    console.error(`Error fetching country with ID ${id}:`, error)
    return null
  }
}

export async function getCountriesByRegion(region: string): Promise<Country[]> {
  try {
    const response = await fetch(`${API_URL}/region/${region}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch countries in region: ${region}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching countries in region ${region}:`, error)
    return []
  }
}
