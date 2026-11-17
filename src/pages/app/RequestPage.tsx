import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useOrg } from './Shell'
import { LabItems, StatementForm } from '../parts'
import { declineRequest, fetchLot, fetchOrganisations, fetchRequest, issueAttestation, revokeAttestation, type LotDetail } from '../../lib/data'
import { ATTESTATION_KINDS, LOT_STATUS, formatDate } from '../../lib/format'
import type { AttestationRequest, Organisation } from '../../lib/types'

export default function RequestPage() {
  const org = useOrg()
  const { id = '' } = useParams()
  const [request, setRequest] = useState<AttestationRequest | null | undefined>(undefined)
  const [lot, setLot] = useState<LotDetail | null>(null)
  const [orgs, setOrgs] = useState<Organisation[]>([])
  const [error, setError] = useState('')

  const load = useCallback(() => {
    fetchRequest(id)
      .then(async (r) => {
        setRequest(r)
        if (r) {
          const [l, o] = await Promise.all([fetchLot(r.lot_id), fetchOrganisations()])
          setLot(l)
          setOrgs(o)
        }
      })
      .catch((e: Error) => setError(e.message))
  }, [id])
  useEffect(load, [load])

  const run = useCallback(async (action: () => Promise<unknown>) => {
    setError('')
    try {
      await action()
      load()
      return true
    } catch (e) {
      setError((e as Error).message)
      return false
    }
  }, [load])

  if (request === undefined) return error ? <p className="error">{error}</p> : <p className="loading">Loading…</p>
  if (request === null || request.issuer_org_id !== org.id || !lot)
    return <div className="card"><h1>Request not found</h1><Link to="/app">Back to the overview</Link></div>

  const requester = orgs.find((o) => o.id === request.requester_org_id)
  const ours = lot.attestations.filter((a) => a.issuer_org_id === org.id)
  const canIssue = request.status === 'open' && lot.status !== 'recalled' && org.status !== 'suspended'

  return (
    <>
      <section className="card">
        <Link to="/app" className="quiet-link back">← Overview</Link>
        <div className="card-head">
          <h1>{ATTESTATION_KINDS[request.kind]} requested</h1>
          <span className={`status ${request.status === 'open' ? 'draft' : request.status === 'fulfilled' ? 'published' : 'recalled'}`}>{request.status}</span>
        </div>
        <dl className="facts">
          <div><dt>From</dt><dd>{requester?.name}</dd></div>
          <div><dt>Product</dt><dd>{lot.product?.name}</dd></div>
          <div><dt>Lot</dt><dd>{lot.lot_number} ({LOT_STATUS[lot.status]})</dd></div>
          <div><dt>Sent</dt><dd>{formatDate(request.created_at)}</dd></div>
        </dl>
        {request.note && <p className="notice">{request.note}</p>}
        {request.status === 'declined' && <p className="hint">You declined{request.decline_reason ? `: ${request.decline_reason}` : '.'}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      {canIssue && (
        <section className="card">
          <h2>Issue the statement</h2>
          <p className="hint">
            The statement is published under {org.name}'s name on the lot's public record. {requester?.name} cannot change
            or remove it. Only you can revoke it later, and the revocation stays visible.
          </p>
          <StatementForm fixedKind={request.kind} submitLabel="Issue statement" onSubmit={(d) => run(() => issueAttestation({
            issuerOrgId: org.id, lotId: lot.id, kind: d.kind, summary: d.summary, claim: d.claim,
            evidenceUrl: d.evidenceUrl, evidenceSha256: d.evidenceSha256, validUntil: d.validUntil, requestId: request.id,
          }))} />
          <DeclineForm onDecline={(reason) => run(() => declineRequest(request.id, reason))} />
        </section>
      )}

      {ours.length > 0 && (
        <section className="card">
          <h2>Statements {org.name} has issued on this lot</h2>
          {ours.map((a) => (
            <article className={`statement ${a.status === 'revoked' ? 'revoked' : ''}`} key={a.id}>
              <div className="statement-head">
                <span className="statement-kind">{ATTESTATION_KINDS[a.kind]}</span>
                <span className="hint">{formatDate(a.issued_at)}</span>
              </div>
              <p className="statement-summary">{a.summary}</p>
              {a.kind === 'lab_result' && a.claim.items && <LabItems items={a.claim.items} />}
              {a.status === 'revoked' ? (
                <p className="recall-box">Revoked {formatDate(a.revoked_at)}: {a.revoked_reason}</p>
              ) : (
                <button className="quiet-link danger" onClick={() => {
                  const reason = window.prompt('Why is this statement revoked? The reason is shown publicly.')
                  if (reason && reason.trim()) run(() => revokeAttestation(a.id, reason))
                }}>Revoke this statement</button>
              )}
            </article>
          ))}
        </section>
      )}
    </>
  )
}

function DeclineForm({ onDecline }: { onDecline: (reason: string) => Promise<boolean> }) {
  const [reason, setReason] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault()
    await onDecline(reason)
  }
  return (
    <details className="sub-form">
      <summary>Decline this request</summary>
      <form className="form" onSubmit={submit}>
        <label>Reason (shown to the requester)<textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} /></label>
        <button className="button secondary">Decline</button>
      </form>
    </details>
  )
}
