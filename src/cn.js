import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes with sensible deduplication. */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
