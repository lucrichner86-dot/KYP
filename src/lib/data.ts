import { supabase } from './supabase'
import type {
  Accreditation, Attestation, AttestationKind, AttestationRequest, Category, EventRow, EventType,
  Identifier, Lot, Organisation, Product, Review,
} from './types'

// Reads go to the tables (row level security limits them). Every change is a
// database function.

function check<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message)
  return result.data
}

async function rpc<T = void>(name: string, args: Record<string, unknown>): Promise<T> {
  return check(await supabase.rpc(name, args)) as T
}

// ------------------------------------------------------------------ reads

export async function fetchMyOrganisation(): Promise<Organisation | null> {
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) return null
  const membership = check(
    await supabase.from('organisation_members').select('org_id').eq('user_id', auth.user.id).limit(1).maybeSingle(),
  ) as { org_id: string } | null
  if (!membership) return null
  return check(await supabase.from('organisations').select('*').eq('id', membership.org_id).single()) as Organisation
}

export async function fetchIsAdmin(): Promise<boolean> {
  return rpc<boolean>('is_kyp_admin', {})
}

export async function fetchOrganisations(): Promise<Organisation[]> {
  return (check(await supabase.from('organisations').select('*').order('name')) as Organisation[]) ?? []
}

export async function fetchIdentifiers(orgId?: string): Promise<Identifier[]> {
  let q = supabase.from('organisation_identifiers').select('*').order('created_at')
  if (orgId) q = q.eq('org_id', orgId)
  return (check(await q) as Identifier[]) ?? []
}

export async function fetchAccreditations(orgId?: string): Promise<Accreditation[]> {
  let q = supabase.from('accreditations').select('*').order('created_at')
  if (orgId) q = q.eq('org_id', orgId)
  return (check(await q) as Accreditation[]) ?? []
}

export async function fetchReviews(): Promise<Review[]> {
  return (check(await supabase.from('organisation_reviews').select('*').order('created_at', { ascending: false })) as Review[]) ?? []
}

export async function fetchProducts(orgId: string): Promise<Product[]> {
  return (check(await supabase.from('products').select('*').eq('owner_org_id', orgId).order('created_at')) as Product[]) ?? []
}

export interface LotRow extends Lot {
  product: { name: string } | null
}

export async function fetchOwnLots(orgId: string): Promise<LotRow[]> {
  return (
    (check(
      await supabase.from('lots').select('*, product:products(name)').eq('owner_org_id', orgId)
        .order('created_at', { ascending: false }),
    ) as LotRow[]) ?? []
  )
}

export interface LotDetail extends Lot {
  product: Product | null
  attestations: Attestation[]
  events: EventRow[]
  attestation_requests: AttestationRequest[]
}

export async function fetchLot(id: string): Promise<LotDetail | null> {
  const lot = check(
    await supabase
      .from('lots')
      .select('*, product:products(*), attestations(*), events(*), attestation_requests(*)')
      .eq('id', id)
      .maybeSingle(),
  ) as LotDetail | null
  if (!lot) return null
  lot.attestations.sort((a, b) => a.issued_at.localeCompare(b.issued_at))
  lot.events.sort((a, b) => a.occurred_on.localeCompare(b.occurred_on) || a.created_at.localeCompare(b.created_at))
  lot.attestation_requests.sort((a, b) => b.created_at.localeCompare(a.created_at))
  return lot
}

export async function fetchIncomingRequests(orgId: string): Promise<(AttestationRequest & { lot: LotRow | null })[]> {
  return (
    (check(
      await supabase
        .from('attestation_requests')
        .select('*, lot:lots(*, product:products(name))')
        .eq('issuer_org_id', orgId)
        .order('created_at', { ascending: false }),
    ) as (AttestationRequest & { lot: LotRow | null })[]) ?? []
  )
}

export async function fetchRequest(id: string): Promise<AttestationRequest | null> {
  return check(await supabase.from('attestation_requests').select('*').eq('id', id).maybeSingle()) as AttestationRequest | null
}

export async function fetchScanCount(lotId: string): Promise<number> {
  const { count, error } = await supabase.from('scan_log').select('id', { count: 'exact', head: true }).eq('lot_id', lotId)
  if (error) throw new Error(error.message)
  return count ?? 0
}

// ---------------------------------------------------------------- changes

export const createOrganisation = (name: string, kind: string, country: string, website: string) =>
  rpc<string>('create_organisation', { p_name: name, p_kind: kind, p_country: country, p_website: website })

export const addIdentifier = (orgId: string, scheme: string, value: string, note: string) =>
  rpc<string>('add_organisation_identifier', { p_org_id: orgId, p_scheme: scheme, p_value: value, p_note: note })

export const reviewOrganisation = (orgId: string, decision: 'verified' | 'suspended', note: string) =>
  rpc('review_organisation', { p_org_id: orgId, p_decision: decision, p_note: note })

export const recordAccreditation = (a: {
  orgId: string; standard: string; body: string; covers: AttestationKind[]; certificateNumber: string
  scope: string; validFrom: string; validUntil: string; evidenceUrl: string
}) =>
  rpc<string>('record_accreditation', {
    p_org_id: a.orgId, p_standard: a.standard, p_body: a.body, p_covers: a.covers,
    p_certificate_number: a.certificateNumber, p_scope: a.scope, p_valid_from: a.validFrom || null,
    p_valid_until: a.validUntil || null, p_evidence_url: a.evidenceUrl,
  })

export const withdrawAccreditation = (id: string) => rpc('withdraw_accreditation', { p_accreditation_id: id })

export const addProduct = (orgId: string, name: string, category: Category, gtin: string, description: string) =>
  rpc<string>('add_product', { p_org_id: orgId, p_name: name, p_category: category, p_gtin: gtin, p_description: description })

export const createLot = (l: { productId: string; lotNumber: string; productionDate: string; expiryDate: string; originCountry: string }) =>
  rpc<string>('create_lot', {
    p_product_id: l.productId, p_lot_number: l.lotNumber, p_production_date: l.productionDate || null,
    p_expiry_date: l.expiryDate || null, p_origin_country: l.originCountry,
  })

export const recordEvent = (lotId: string, type: EventType, on: string, place: string, country: string) =>
  rpc<string>('record_event', { p_lot_id: lotId, p_event_type: type, p_occurred_on: on, p_place: place, p_country: country })

export const removeEvent = (id: string) => rpc('remove_event', { p_event_id: id })

export const requestAttestation = (lotId: string, issuerOrgId: string, kind: AttestationKind, note: string) =>
  rpc<string>('request_attestation', { p_lot_id: lotId, p_issuer_org_id: issuerOrgId, p_kind: kind, p_note: note })

export const declineRequest = (id: string, reason: string) =>
  rpc('decline_attestation_request', { p_request_id: id, p_reason: reason })

export interface StatementInput {
  issuerOrgId: string
  lotId: string
  kind: AttestationKind
  summary: string
  claim: Record<string, unknown>
  evidenceUrl: string
  evidenceSha256: string
  validUntil: string
  requestId: string | null
}

export const issueAttestation = (s: StatementInput) =>
  rpc<string>('issue_attestation', {
    p_issuer_org_id: s.issuerOrgId, p_lot_id: s.lotId, p_kind: s.kind, p_summary: s.summary,
    p_claim: s.claim, p_evidence_url: s.evidenceUrl, p_evidence_sha256: s.evidenceSha256,
    p_valid_until: s.validUntil || null, p_request_id: s.requestId,
  })

export const revokeAttestation = (id: string, reason: string) =>
  rpc('revoke_attestation', { p_attestation_id: id, p_reason: reason })

export const publishLot = (id: string) => rpc('publish_lot', { p_lot_id: id })
export const recallLot = (id: string, note: string) => rpc('recall_lot', { p_lot_id: id, p_note: note })
