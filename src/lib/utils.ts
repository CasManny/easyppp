import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const compactNumberFormatter = new Intl.NumberFormat(undefined, { notation: "compact"})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCompactNumber = (number: number) => {
  return compactNumberFormatter.format(number)
}

export const removeTrailingSlash = (path: string) => {
  return path.replace(/\/$/, "")
} 
