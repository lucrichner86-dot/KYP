// Row shapes, written by hand to match supabase/migrations.

export type OrgKind =
  | 'producer' | 'importer' | 'distributor' | 'laboratory' | 'certifier'
  | 'pharmacy' | 'track_and_trace' | 'other'
export type OrgStatus = 'pending' | 'verified' | 'suspended'
export type LotStatus = 'draft' | 'published' | 'recalled'
export type Category = 'cannabis_flower' | 'cannabis_extract' | 'cannabis_other' | 'other'
export type AttestationKind = 'lab_result' | 'gmp_release' | 'origin' | 'other'
export type Level = 'accredited' | 'independent' | 'system_recorded' | 'self_declared' | 'unverified'
export type EventType =
  | 'cultivation' | 'harvest' | 'processing' | 'testing' | 'packaging' | 'release'
  | 'shipping' | 'receiving' | 'dispensing' | 'destruction'
export type ItemKind = 'cannabinoid' | 'terpene' | 'contaminant' | 'other'

export interface Organisation {
  id: string
  name: string
  kind: OrgKind
  country: string
  website: string | null
  status: OrgStatus
  status_changed_at: string | null
  created_at: string
}

export interface Identifier {
  id: string
  org_id: string
  scheme: string
  value: string
  note: string | null
}

export interface Accreditation {
  id: string
  org_id: string
  standard: string
  body: string
  certificate_number: string | null
  scope: string | null
  covers: AttestationKind[]
  valid_from: string | null
  valid_until: string | null
  status: 'active' | 'withdrawn'
}

export interface Review {
  id: string
  org_id: string
  decision: 'verified' | 'suspended'
  note: string
  created_at: string
}

export interface Product {
  id: string
  owner_org_id: string
  name: string
  category: Category
  gtin: string | null
  description: string | null
}

export interface Lot {
  id: string
  owner_org_id: string
  product_id: string
  lot_number: string
  production_date: string | null
  expiry_date: string | null
  origin_country: string | null
  status: LotStatus
  recall_note: string | null
  public_code: string
  created_at: string
  published_at: string | null
  recalled_at: string | null
}

export interface LabItem {
  kind: ItemKind
  name: string
  value?: number
  unit?: string
  passed?: boolean
}

export interface LabClaim {
  test_date: string
  items: LabItem[]
}

export interface Attestation {
  id: string
  lot_id: string
  issuer_org_id: string
  kind: AttestationKind
  summary: string
  claim: Partial<LabClaim> & Record<string, unknown>
  evidence_url: string | null
  evidence_sha256: string | null
  valid_until: string | null
  request_id: string | null
  status: 'active' | 'revoked'
  revoked_reason: string | null
  revoked_at: string | null
  issued_at: string
}

export interface EventRow {
  id: string
  lot_id: string
  event_type: EventType
  occurred_on: string
  place: string
  country: string | null
  source: 'manual' | 'import'
  source_system: string | null
  created_at: string
}

export interface AttestationRequest {
  id: string
  lot_id: string
  requester_org_id: string
  issuer_org_id: string
  kind: AttestationKind
  note: string | null
  status: 'open' | 'fulfilled' | 'declined'
  decline_reason: string | null
  created_at: string
  closed_at: string | null
}

// What get_record(code) returns.
export interface PublicRecord {
  code: string
  status: 'published' | 'recalled'
  recall_note: string | null
  published_at: string
  recalled_at: string | null
  lot_number: string
  production_date: string | null
  expiry_date: string | null
  origin_country: string | null
  product: { name: string; category: Category; gtin: string | null; description: string | null }
  owner: { name: string; kind: OrgKind; country: string; status: OrgStatus }
  attestations: {
    kind: AttestationKind
    summary: string
    claim: Partial<LabClaim>
    evidence_url: string | null
    evidence_sha256: string | null
    valid_until: string | null
    issued_at: string
    status: 'active' | 'revoked'
    revoked_reason: string | null
    revoked_at: string | null
    level: Level
    issuer: {
      name: string
      kind: OrgKind
      country: string
      status: OrgStatus
      accreditations: { standard: string; body: string; certificate_number: string | null; valid_until: string | null }[]
    }
  }[]
  events: {
    event_type: EventType
    occurred_on: string
    place: string
    country: string | null
    level: 'system_recorded' | 'self_declared'
    source_system: string | null
  }[]
}
