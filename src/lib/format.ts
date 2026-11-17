import type { AttestationKind, Category, EventType, ItemKind, Level, LotStatus, OrgKind, OrgStatus } from './types'

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

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

export function formatValue(value: number | undefined, unit: string | undefined): string {
  if (value === undefined || value === null) return '—'
  return `${value}${unit ? ` ${unit}` : ''}`
}

// The assurance levels, strongest first. Shown on every public record.
export const LEVELS: Record<Level, { label: string; explain: string }> = {
  accredited: {
    label: 'Accredited third party',
    explain: 'Issued by an organisation KYP has verified, holding a current accreditation that covers this kind of statement.',
  },
  independent: {
    label: 'Independent third party',
    explain: 'Issued by an organisation KYP has verified, other than the owner. No accreditation for this kind of statement is on file.',
  },
  system_recorded: {
    label: 'Track-and-trace record',
    explain: 'Imported from a track-and-trace system, not typed in by hand. Not independently checked by KYP.',
  },
  self_declared: {
    label: 'Declared by the owner',
    explain: 'Stated by the organisation that owns this product. Nobody else has confirmed it.',
  },
  unverified: {
    label: 'Unverified party',
    explain: 'Issued by an organisation that KYP has not verified, or has since suspended.',
  },
}
export const LEVEL_ORDER: Level[] = ['accredited', 'independent', 'system_recorded', 'self_declared', 'unverified']

export const ATTESTATION_KINDS: Record<AttestationKind, string> = {
  lab_result: 'Laboratory result',
  gmp_release: 'GMP release',
  origin: 'Origin',
  other: 'Other statement',
}

export const ORG_KINDS: Record<OrgKind, string> = {
  producer: 'Producer',
  importer: 'Importer',
  distributor: 'Distributor',
  laboratory: 'Laboratory',
  certifier: 'Certifier',
  pharmacy: 'Pharmacy',
  track_and_trace: 'Track-and-trace provider',
  other: 'Other',
}

export const ORG_STATUS: Record<OrgStatus, string> = {
  pending: 'Awaiting verification',
  verified: 'Verified by KYP',
  suspended: 'Suspended',
}

export const LOT_STATUS: Record<LotStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  recalled: 'Recalled',
}

export const CATEGORIES: Record<Category, string> = {
  cannabis_flower: 'Cannabis flower',
  cannabis_extract: 'Cannabis extract',
  cannabis_other: 'Other cannabis product',
  other: 'Other product',
}

export const EVENT_TYPES: Record<EventType, string> = {
  cultivation: 'Cultivation',
  harvest: 'Harvest',
  processing: 'Processing',
  testing: 'Laboratory testing',
  packaging: 'Packaging',
  release: 'Release',
  shipping: 'Shipped',
  receiving: 'Received',
  dispensing: 'Dispensed',
  destruction: 'Destroyed',
}

export const ITEM_KINDS: Record<ItemKind, string> = {
  cannabinoid: 'Cannabinoids',
  terpene: 'Terpenes',
  contaminant: 'Contaminant checks',
  other: 'Other values',
}

export const IDENTIFIER_SCHEMES: Record<string, string> = {
  lei: 'LEI',
  gln: 'GLN',
  vat: 'VAT number',
  trade_register: 'Trade register',
  licence: 'Licence',
  other: 'Other',
}

export function recordUrl(code: string): string {
  const base = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) || window.location.origin
  return `${base.replace(/\/$/, '')}/r/${code}`
}

export const DEMO_CODE = 'demo-kyp-flower-014'
export const DEMO_RECALLED_CODE = 'demo-kyp-flower-009'
