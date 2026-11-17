import type { Accreditation, Attestation, Level, Organisation } from './types'

// The same rule as public.attestation_level() in the database, for the
// workspace screens. The public record always uses the database's answer.
export function levelOf(
  a: Attestation,
  ownerOrgId: string,
  orgs: Map<string, Organisation>,
  accreditations: Accreditation[],
): Level {
  if (a.issuer_org_id === ownerOrgId) return 'self_declared'
  if (orgs.get(a.issuer_org_id)?.status !== 'verified') return 'unverified'
  const day = a.issued_at.slice(0, 10)
  const accredited = accreditations.some(
    (ac) =>
      ac.org_id === a.issuer_org_id && ac.status === 'active' && ac.covers.includes(a.kind) &&
      (!ac.valid_from || ac.valid_from <= day) && (!ac.valid_until || ac.valid_until >= day),
  )
  return accredited ? 'accredited' : 'independent'
}
