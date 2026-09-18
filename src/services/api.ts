// Service-layer API abstraction.
// Today these resolve against bundled DEMO DATA behind a simulated network
// delay so the UI exercises real loading/error states. Swap the bodies for
// fetch() calls when a backend exists — the signatures stay the same.

export const DEMO_MODE = true

export function delay<T>(value: T, ms = 420): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export function fail(message: string, ms = 420): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
}

export interface Paged<T> {
  items: T[]
  total: number
}
