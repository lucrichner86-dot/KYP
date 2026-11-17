import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { useOrg } from './Shell'
import { CountrySelect, LabItems, LevelBadge, StatementForm } from '../parts'
import {
  fetchAccreditations, fetchLot, fetchOrganisations, fetchScanCount, issueAttestation, publishLot, recallLot,
  recordEvent, removeEvent, requestAttestation, revokeAttestation, type LotDetail,
} from '../../lib/data'
import { levelOf } from '../../lib/levels'
import { ATTESTATION_KINDS, EVENT_TYPES, LOT_STATUS, ORG_KINDS, countryName, formatDate, recordUrl } from '../../lib/format'
import type { Accreditation, AttestationKind, EventType, Organisation } from '../../lib/types'

type Run = (action: () => Promise<unknown>) => Promise<boolean>

export default function LotPage() {
  const org = useOrg()
  const { id = '' } = useParams()
  const [lot, setLot] = useState<LotDetail | null | undefined>(undefined)
  const [orgs, setOrgs] = useState<Organisation[]>([])
  const [accreditations, setAccreditations] = useState<Accreditation[]>([])
  const [scans, setScans] = useState<number | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    Promise.all([fetchLot(id), fetchOrganisations(), fetchAccreditations()])
      .then(([l, o, a]) => {
        setLot(l)
        setOrgs(o)
        setAccreditations(a)
        if (l && l.status !== 'draft') fetchScanCount(l.id).then(setScans, () => setScans(null))
      })
      .catch((e: Error) => setError(e.message))
  }, [id])
  useEffect(load, [load])

  const run: Run = useCallback(async (action) => {
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

  const orgById = useMemo(() => new Map(orgs.map((o) => [o.id, o])), [orgs])

  if (lot === undefined) return error ? <p className="error">{error}</p> : <p className="loading">Loading…</p>
  if (lot === null || lot.owner_org_id !== org.id)
    return <div className="card"><h1>Lot not found</h1><Link to="/app">Back to the overview</Link></div>

  const draft = lot.status === 'draft'
  const recalled = lot.status === 'recalled'
  const activeStatements = lot.attestations.filter((a) => a.status === 'active').length
  const canPublish = draft && org.status === 'verified' && activeStatements > 0

  return (
    <>
      <section className="card">
        <Link to="/app" className="quiet-link back">← Overview</Link>
        <div className="card-head">
          <h1>Lot {lot.lot_number}</h1>
          <span className={`status ${lot.status}`}>{LOT_STATUS[lot.status]}</span>
        </div>
        <dl className="facts">
          <div><dt>Product</dt><dd>{lot.product?.name}</dd></div>
          <div><dt>Produced</dt><dd>{formatDate(lot.production_date)}</dd></div>
          <div><dt>Use by</dt><dd>{formatDate(lot.expiry_date)}</dd></div>
          <div><dt>Origin</dt><dd>{countryName(lot.origin_country) || '—'}</dd></div>
        </dl>
        {recalled && <p className="recall-box"><strong>Recalled on {formatDate(lot.recalled_at)}.</strong> {lot.recall_note}</p>}
        {error && <p className="error">{error}</p>}
        {draft && (
          <div className="actions">
            <button className="button" disabled={!canPublish} onClick={() => {
              if (window.confirm('Publish this lot? Its record becomes public to anyone with the code.')) run(() => publishLot(lot.id))
            }}>Publish</button>
            {org.status !== 'verified' && <span className="hint">KYP must verify your organisation before you can publish.</span>}
            {org.status === 'verified' && activeStatements === 0 && <span className="hint">Add at least one statement to publish.</span>}
          </div>
        )}
      </section>

      {!draft && <RecordCard code={lot.public_code} lotNumber={lot.lot_number} scans={scans} />}

      <section className="card">
        <h2>Statements</h2>
        {lot.attestations.length === 0 && <p className="hint">None yet.</p>}
        {lot.attestations.map((a) => {
          const issuer = orgById.get(a.issuer_org_id)
          const mine = a.issuer_org_id === org.id
          return (
            <article className={`statement ${a.status === 'revoked' ? 'revoked' : ''}`} key={a.id}>
              <div className="statement-head">
                <span className="statement-kind">{ATTESTATION_KINDS[a.kind]}</span>
                {a.status === 'revoked' ? <span className="level level-revoked">Revoked</span>
                  : <LevelBadge level={levelOf(a, lot.owner_org_id, orgById, accreditations)} />}
              </div>
              <p className="statement-summary">{a.summary}</p>
              {a.status === 'revoked' && <p className="recall-box">Revoked {formatDate(a.revoked_at)}: {a.revoked_reason}</p>}
              {a.kind === 'lab_result' && a.claim.items && (
                <><p className="lab-meta">Tested on {formatDate(a.claim.test_date)}</p><LabItems items={a.claim.items} /></>
              )}
              <p className="issuer">Issued by <strong>{issuer?.name ?? 'Unknown'}</strong> on {formatDate(a.issued_at)}.
                {a.evidence_url && <> <a href={a.evidence_url} target="_blank" rel="noopener noreferrer">Source document</a>.</>}
              </p>
              {mine && a.status === 'active' && (
                <RevokeButton onRevoke={(reason) => run(() => revokeAttestation(a.id, reason))} />
              )}
            </article>
          )
        })}
        {!recalled && (
          <details className="sub-form">
            <summary>Add a statement of your own (declared by the owner)</summary>
            <StatementForm submitLabel="Add statement" onSubmit={(d) => run(() => issueAttestation({
              issuerOrgId: org.id, lotId: lot.id, kind: d.kind, summary: d.summary, claim: d.claim,
              evidenceUrl: d.evidenceUrl, evidenceSha256: d.evidenceSha256, validUntil: d.validUntil, requestId: null,
            }))} />
          </details>
        )}
      </section>

      <section className="card">
        <h2>Requests to other organisations</h2>
        <p className="hint">Ask a lab, importer or certifier to issue a statement about this lot. Their statement is theirs: you cannot edit or remove it.</p>
        {lot.attestation_requests.length > 0 && (
          <ul className="rows plain">
            {lot.attestation_requests.map((r) => (
              <li key={r.id}>
                <span className="row-main">
                  <strong>{ATTESTATION_KINDS[r.kind]} from {orgById.get(r.issuer_org_id)?.name ?? 'Unknown'}</strong>
                  <span>{r.status === 'declined' ? `Declined${r.decline_reason ? `: ${r.decline_reason}` : ''}` : `Sent ${formatDate(r.created_at)}`}</span>
                </span>
                <span className={`status ${r.status === 'open' ? 'draft' : r.status === 'fulfilled' ? 'published' : 'recalled'}`}>{r.status}</span>
              </li>
            ))}
          </ul>
        )}
        {!recalled && <RequestForm orgs={orgs.filter((o) => o.status === 'verified' && o.id !== org.id)}
          onSubmit={(issuer, kind, note) => run(() => requestAttestation(lot.id, issuer, kind, note))} />}
      </section>

      <section className="card">
        <h2>Journey</h2>
        {lot.events.length === 0 && <p className="hint">No events yet.</p>}
        <ol className="timeline">
          {lot.events.map((e) => (
            <li key={e.id}>
              <span className="timeline-date">{formatDate(e.occurred_on)}</span>
              <span className="timeline-stage">{EVENT_TYPES[e.event_type]}</span>
              <span className="timeline-place">{[e.place, countryName(e.country)].filter(Boolean).join(', ')}</span>
              <span className="timeline-level"><LevelBadge level={e.source === 'import' ? 'system_recorded' : 'self_declared'} /></span>
              {draft && e.source === 'manual' && (
                <button className="quiet-link danger" onClick={() => run(() => removeEvent(e.id))}>Remove</button>
              )}
            </li>
          ))}
        </ol>
        {!recalled && <EventForm defaultCountry={lot.origin_country ?? ''}
          onSubmit={(t, on, place, country) => run(() => recordEvent(lot.id, t, on, place, country))} />}
      </section>

      {lot.status === 'published' && <RecallForm onRecall={(note) => run(() => recallLot(lot.id, note))} />}
    </>
  )
}

function RecordCard({ code, lotNumber, scans }: { code: string; lotNumber: string; scans: number | null }) {
  const url = recordUrl(code)
  const [qr, setQr] = useState('')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    QRCode.toDataURL(url, { width: 600, margin: 2, errorCorrectionLevel: 'M' }).then(setQr, () => setQr(''))
  }, [url])
  return (
    <section className="card">
      <h2>Public record</h2>
      <div className="qr-block">
        {qr && <img src={qr} alt={`QR code for lot ${lotNumber}`} width={180} height={180} />}
        <div>
          <p className="url-line"><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
          <div className="actions">
            <button className="button secondary" onClick={() => navigator.clipboard.writeText(url).then(() => setCopied(true))}>
              {copied ? 'Copied' : 'Copy link'}
            </button>
            {qr && <a className="button secondary" href={qr} download={`kyp-${lotNumber}.png`}>Download QR code</a>}
          </div>
          {scans !== null && <p className="hint">Opened {scans} {scans === 1 ? 'time' : 'times'}. Only the time of each view is stored.</p>}
        </div>
      </div>
    </section>
  )
}

function RevokeButton({ onRevoke }: { onRevoke: (reason: string) => Promise<boolean> }) {
  return (
    <button className="quiet-link danger" onClick={() => {
      const reason = window.prompt('Why is this statement revoked? The reason is shown publicly.')
      if (reason && reason.trim()) onRevoke(reason)
    }}>Revoke this statement</button>
  )
}

function RequestForm({ orgs, onSubmit }: { orgs: Organisation[]; onSubmit: (issuer: string, kind: AttestationKind, note: string) => Promise<boolean> }) {
  const [issuer, setIssuer] = useState('')
  const [kind, setKind] = useState<AttestationKind>('lab_result')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  if (orgs.length === 0) return <p className="hint">No other verified organisations are registered yet.</p>
  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    if (await onSubmit(issuer, kind, note)) setNote('')
    setBusy(false)
  }
  return (
    <form className="form sub-form" onSubmit={submit}>
      <h3>Send a request</h3>
      <div className="form-row">
        <label>
          Organisation
          <select required value={issuer} onChange={(e) => setIssuer(e.target.value)}>
            <option value="">Choose…</option>
            {orgs.map((o) => <option key={o.id} value={o.id}>{o.name} ({ORG_KINDS[o.kind]}, {o.country})</option>)}
          </select>
        </label>
        <label>
          Statement asked for
          <select value={kind} onChange={(e) => setKind(e.target.value as AttestationKind)}>
            {Object.entries(ATTESTATION_KINDS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>
      <label>Note (optional)<textarea rows={2} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <button className="button secondary" disabled={busy}>Send request</button>
    </form>
  )
}

function EventForm({ defaultCountry, onSubmit }: {
  defaultCountry: string
  onSubmit: (t: EventType, on: string, place: string, country: string) => Promise<boolean>
}) {
  const [type, setType] = useState<EventType>('cultivation')
  const [on, setOn] = useState('')
  const [place, setPlace] = useState('')
  const [country, setCountry] = useState(defaultCountry)
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    if (await onSubmit(type, on, place, country)) setPlace('')
    setBusy(false)
  }
  return (
    <form className="form sub-form" onSubmit={submit}>
      <h3>Add an event</h3>
      <p className="hint">Events you type in show as declared by the owner. Events imported from a track-and-trace system show as track-and-trace records.</p>
      <div className="form-row">
        <label>
          What happened
          <select value={type} onChange={(e) => setType(e.target.value as EventType)}>
            {Object.entries(EVENT_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>Date<input type="date" required value={on} onChange={(e) => setOn(e.target.value)} /></label>
      </div>
      <div className="form-row">
        <label>Place<input required maxLength={160} placeholder="Town or site" value={place} onChange={(e) => setPlace(e.target.value)} /></label>
        <label>Country<CountrySelect optional value={country} onChange={setCountry} /></label>
      </div>
      <button className="button secondary" disabled={busy}>Add event</button>
    </form>
  )
}

function RecallForm({ onRecall }: { onRecall: (note: string) => Promise<boolean> }) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!window.confirm('Recall this lot? The public record shows the recall at once. This cannot be undone.')) return
    setBusy(true)
    await onRecall(note)
    setBusy(false)
  }
  return (
    <form className="card form danger-zone" onSubmit={submit}>
      <h2>Recall this lot</h2>
      <p>The public record will show a recall banner with your note. Say why, and what people holding a pack should do. A recall cannot be undone.</p>
      <label>Note for the public<textarea required rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} /></label>
      <button className="button danger" disabled={busy}>Recall lot</button>
    </form>
  )
}
