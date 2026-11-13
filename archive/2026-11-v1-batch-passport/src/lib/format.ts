import type { BatchStatus, ItemKind, JourneyStage, ProductType } from './types'

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

// Accepts a date ('2026-07-14') or a timestamp; shows '14 Jul 2026'.
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const d = new Date(value.length === 10 ? `${value}T12:00:00Z` : value)
  return Number.isNaN(d.getTime()) ? value : dateFormat.format(d)
}

export function countryName(code: string | null | undefined): string {
  if (!code) return ''
  try {
    return regionNames.of(code) ?? code
  } catch {
    return code
  }
}

export function formatValue(value: number | null, unit: string | null): string {
  if (value === null) return '—'
  return `${value}${unit === '%' ? ' %' : unit ? ` ${unit}` : ''}`
}

export const PRODUCT_TYPES: Record<ProductType, string> = {
  flower: 'Dried flower',
  extract: 'Extract',
  other: 'Other',
}

export const STATUS_LABELS: Record<BatchStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  recalled: 'Recalled',
}

export const STAGES: Record<JourneyStage, string> = {
  cultivation: 'Cultivation',
  harvest: 'Harvest',
  processing: 'Processing',
  testing: 'Laboratory testing',
  packaging: 'Packaging',
  distribution: 'Distribution',
  dispensing: 'Dispensing',
}

export const ITEM_KINDS: Record<ItemKind, string> = {
  cannabinoid: 'Cannabinoids',
  terpene: 'Terpenes',
  contaminant: 'Contaminant checks',
}

// The link a QR code points at.
export function passportUrl(code: string): string {
  const base = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) || window.location.origin
  return `${base.replace(/\/$/, '')}/p/${code}`
}

// The seed data's published batch (supabase/seed.sql).
export const DEMO_CODE = 'demo-flower-2026-014'
export const DEMO_RECALLED_CODE = 'demo-flower-2026-009'
