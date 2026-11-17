import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useWorkspace } from '../app/Shell'
import {
  fetchAccreditations, fetchIdentifiers, fetchOrganisations, fetchReviews, recordAccreditation, reviewOrganisation,
  withdrawAccreditation,
} from '../../lib/data'
import { ATTESTATION_KINDS, IDENTIFIER_SCHEMES, ORG_KINDS, ORG_STATUS, countryName, formatDate } from '../../lib/format'
import type { Accreditation, AttestationKind, Identifier, OrgStatus, Organisation, Review } from '../../lib/types'

const STANDARDS = ['ISO/IEC 17025', 'ISO/IEC 17065', 'ISO/IEC 17020', 'EU-GMP', 'GACP', 'GDP', 'operating licence', 'other']

export default function Admin() {
  const { isAdmin } = useWorkspace()
  const [orgs, setOrgs] = useState<Organisation[] | null>(null)
  const [identifiers, setIdentifiers] = useState<Identifier[]>([])
  const [accreditations, setAccreditations] = useState<Accreditation[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<OrgStatus | 'all'>('pending')
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    Promise.all([fetchOrganisations(), fetchIdentifiers(), fetchAccreditations(), fetchReviews()])
      .then(([o, i, a, r]) => {
        setOrgs(o)
        setIdentifiers(i)
        setAccreditations(a)
        setReviews(r)
      })
      .catch((e: Error) => setError(e.message))
  }, [])
  useEffect(() => {
    if (isAdmin) load()
  }, [isAdmin, load])

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

  const shown = useMemo(() => (orgs ?? []).filter((o) => filter === 'all' || o.status === filter), [orgs, filter])

  if (!isAdmin) return <Navigate to="/app" replace />
  if (!orgs) return error ? <p className="error">{error}</p> : <p className="loading">Loading…</p>
  const org = orgs.find((o) => o.id === selected)

  return (
    <>
      <section className="card">
        <div className="card-head">
          <h1>KYP admin · organisations</h1>
          <select value={filter} onChange={(e) => setFilter(e.target.value as OrgStatus | 'all')} aria-label="Filter">
            <option value="pending">Awaiting verification</option>
            <option value="verified">Verified</option>
            <option value="suspended">Suspended</option>
            <option value="all">All</option>
          </select>
        </div>
        {error && <p className="error">{error}</p>}
        {shown.length === 0 ? <p className="hint">None.</p> : (
          <ul className="rows">
            {shown.map((o) => (
              <li key={o.id}>
                <button className="row-button" onClick={() => setSelected(o.id === selected ? null : o.id)}>
                  <span className="row-main"><strong>{o.name}</strong><span>{ORG_KINDS[o.kind]} · {countryName(o.country)}</span></span>
                  <span className="row-side">
                    <span className={`status org-${o.status}`}>{ORG_STATUS[o.status]}</span>
                    <span className="hint">since {formatDate(o.created_at)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {org && (
        <OrgReview
          key={org.id}
          org={org}
          identifiers={identifiers.filter((i) => i.org_id === org.id)}
          accreditations={accreditations.filter((a) => a.org_id === org.id)}
          reviews={reviews.filter((r) => r.org_id === org.id)}
          run={run}
        />
      )}
    </>
  )
}

function OrgReview({ org, identifiers, accreditations, reviews, run }: {
  org: Organisation
  identifiers: Identifier[]
  accreditations: Accreditation[]
  reviews: Review[]
  run: (action: () => Promise<unknown>) => Promise<boolean>
}) {
  const [note, setNote] = useState('')
  async function decide(decision: 'verified' | 'suspended') {
    if (await run(() => reviewOrganisation(org.id, decision, note))) setNote('')
  }
  return (
    <>
      <section className="card">
        <h2>{org.name}</h2>
        <dl className="facts">
          <div><dt>Role</dt><dd>{ORG_KINDS[org.kind]}</dd></div>
          <div><dt>Country</dt><dd>{countryName(org.country)}</dd></div>
          <div><dt>Status</dt><dd>{ORG_STATUS[org.status]}</dd></div>
          {org.website && <div><dt>Website</dt><dd><a href={org.website} target="_blank" rel="noopener noreferrer">{org.website}</a></dd></div>}
        </dl>
        <h3>Identifiers stated</h3>
        {identifiers.length === 0 ? <p className="hint">None stated.</p> : (
          <ul className="rows plain">
            {identifiers.map((i) => <li key={i.id}><span className="row-main"><strong>{IDENTIFIER_SCHEMES[i.scheme] ?? i.scheme}</strong><span>{i.value}</span></span></li>)}
          </ul>
        )}
        <h3>Review history</h3>
        {reviews.length === 0 ? <p className="hint">Never reviewed.</p> : (
          <ul className="rows plain">
            {reviews.map((r) => <li key={r.id}><span className="row-main"><strong>{r.decision} · {formatDate(r.created_at)}</strong><span>{r.note}</span></span></li>)}
          </ul>
        )}
        <div className="form sub-form">
          <label>
            What you checked
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Trade register entry CHE-… matches name and address; licence checked with the authority on …" />
          </label>
          <div className="actions">
            <button className="button" disabled={!note.trim()} onClick={() => decide('verified')}>Verify</button>
            <button className="button danger" disabled={!note.trim()} onClick={() => decide('suspended')}>Suspend</button>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Accreditations</h2>
        {accreditations.length === 0 && <p className="hint">None on file.</p>}
        <ul className="rows plain">
          {accreditations.map((a) => (
            <li key={a.id}>
              <span className="row-main">
                <strong>{a.standard} · {a.body}{a.certificate_number ? ` · ${a.certificate_number}` : ''}</strong>
                <span>Covers {a.covers.map((k) => ATTESTATION_KINDS[k]).join(', ')} · {formatDate(a.valid_from)} to {formatDate(a.valid_until)}</span>
              </span>
              {a.status === 'active'
                ? <button className="quiet-link danger" onClick={() => window.confirm('Withdraw this accreditation?') && run(() => withdrawAccreditation(a.id))}>Withdraw</button>
                : <span className="status recalled">Withdrawn</span>}
            </li>
          ))}
        </ul>
        <AccreditationForm orgId={org.id} run={run} />
      </section>
    </>
  )
}

function AccreditationForm({ orgId, run }: { orgId: string; run: (action: () => Promise<unknown>) => Promise<boolean> }) {
  const [f, setF] = useState({ standard: 'ISO/IEC 17025', body: '', certificateNumber: '', scope: '', validFrom: '', validUntil: '', evidenceUrl: '' })
  const [covers, setCovers] = useState<AttestationKind[]>(['lab_result'])
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }))
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (await run(() => recordAccreditation({ orgId, covers, ...f })))
      setF({ standard: 'ISO/IEC 17025', body: '', certificateNumber: '', scope: '', validFrom: '', validUntil: '', evidenceUrl: '' })
  }
  return (
    <form className="form sub-form" onSubmit={submit}>
      <h3>Record an accreditation you have checked</h3>
      <div className="form-row">
        <label>Standard<select value={f.standard} onChange={set('standard')}>{STANDARDS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Accreditation body<input required value={f.body} onChange={set('body')} /></label>
      </div>
      <div className="form-row">
        <label>Certificate number<input value={f.certificateNumber} onChange={set('certificateNumber')} /></label>
        <label>Link to the certificate<input type="url" pattern="https://.*" placeholder="https://" value={f.evidenceUrl} onChange={set('evidenceUrl')} /></label>
      </div>
      <div className="form-row">
        <label>Valid from<input type="date" value={f.validFrom} onChange={set('validFrom')} /></label>
        <label>Valid until<input type="date" value={f.validUntil} onChange={set('validUntil')} /></label>
      </div>
      <label>Scope<textarea rows={2} value={f.scope} onChange={set('scope')} /></label>
      <fieldset className="checks">
        <legend>Makes these statements "accredited"</legend>
        {(Object.keys(ATTESTATION_KINDS) as AttestationKind[]).map((k) => (
          <label key={k} className="check">
            <input type="checkbox" checked={covers.includes(k)}
              onChange={(e) => setCovers((c) => e.target.checked ? [...c, k] : c.filter((x) => x !== k))} />
            {ATTESTATION_KINDS[k]}
          </label>
        ))}
      </fieldset>
      <button className="button secondary" disabled={covers.length === 0}>Record accreditation</button>
    </form>
  )
}
