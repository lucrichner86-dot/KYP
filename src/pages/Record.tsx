import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LabItems, LevelBadge, Wordmark } from './parts'
import { fetchRecord } from '../lib/record'
import {
  ATTESTATION_KINDS, CATEGORIES, EVENT_TYPES, LEVELS, LEVEL_ORDER, ORG_KINDS, ORG_STATUS, countryName, formatDate,
} from '../lib/format'
import type { Level, PublicRecord } from '../lib/types'

type State = { phase: 'loading' } | { phase: 'unknown' } | { phase: 'error' } | { phase: 'ready'; record: PublicRecord }

export default function Record() {
  const { code = '' } = useParams()
  const [state, setState] = useState<State>({ phase: 'loading' })

  useEffect(() => {
    let current = true
    setState({ phase: 'loading' })
    fetchRecord(code)
      .then((record) => current && setState(record ? { phase: 'ready', record } : { phase: 'unknown' }))
      .catch(() => current && setState({ phase: 'error' }))
    return () => {
      current = false
    }
  }, [code])

  return (
    <div className="page narrow">
      <header className="topbar">
        <Wordmark />
        <span className="topbar-note">Product record</span>
      </header>
      <main>
        {state.phase === 'loading' && <p className="loading">Looking up this code…</p>}
        {state.phase === 'unknown' && (
          <div className="card">
            <h1>Code not recognised</h1>
            <p>No published lot matches this code. KYP cannot confirm anything about a pack carrying it.</p>
            <p>Scan the code again in case the link was cut short. If it still is not recognised, ask where you bought the product.</p>
            <p className="code-line">Code: <code>{code}</code></p>
          </div>
        )}
        {state.phase === 'error' && (
          <div className="card">
            <h1>The record could not be loaded</h1>
            <p>This is a technical problem, not a statement about the product. Check your connection and try again.</p>
            <button className="button" onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}
        {state.phase === 'ready' && <RecordView r={state.record} />}
      </main>
    </div>
  )
}

function RecordView({ r }: { r: PublicRecord }) {
  const active = r.attestations.filter((a) => a.status === 'active')
  const counts = LEVEL_ORDER.map((level) => ({
    level,
    n: active.filter((a) => a.level === level).length + r.events.filter((e) => e.level === level).length,
  })).filter((c) => c.n > 0)

  return (
    <>
      {r.status === 'recalled' ? (
        <section className="banner recalled" role="alert">
          <h1>This lot has been recalled</h1>
          <p className="banner-note">{r.recall_note}</p>
          <p className="banner-meta">Recalled by {r.owner.name} on {formatDate(r.recalled_at)}.</p>
        </section>
      ) : (
        <section className="banner published">
          <h1>Code recognised · published lot</h1>
          <p className="banner-meta">
            Lot {r.lot_number}, published by {r.owner.name} on {formatDate(r.published_at)}. No recall is recorded.
          </p>
        </section>
      )}

      <section className="card">
        <p className="eyebrow">{CATEGORIES[r.product.category]}</p>
        <h2 className="product-name">{r.product.name}</h2>
        {r.product.description && <p>{r.product.description}</p>}
        <dl className="facts">
          <Fact label="Owner" value={`${r.owner.name}, ${countryName(r.owner.country)}`} />
          <Fact label="Owner status" value={ORG_STATUS[r.owner.status]} />
          <Fact label="Lot number" value={r.lot_number} />
          {r.product.gtin && <Fact label="GTIN" value={r.product.gtin} />}
          {r.production_date && <Fact label="Produced" value={formatDate(r.production_date)} />}
          {r.expiry_date && <Fact label="Use by" value={formatDate(r.expiry_date)} />}
          {r.origin_country && <Fact label="Origin" value={countryName(r.origin_country)} />}
        </dl>
      </section>

      <section className="card">
        <h2>Who stands behind this record</h2>
        <ul className="level-list compact">
          {counts.map((c) => (
            <li key={c.level}>
              <LevelBadge level={c.level} />
              <span>{c.n} {c.n === 1 ? 'fact' : 'facts'}</span>
            </li>
          ))}
        </ul>
        <details>
          <summary>What the levels mean</summary>
          <ul className="level-list">
            {LEVEL_ORDER.map((level) => (
              <li key={level}><LevelBadge level={level} /><span>{LEVELS[level].explain}</span></li>
            ))}
          </ul>
        </details>
      </section>

      <section className="card">
        <h2>Statements</h2>
        {r.attestations.map((a, index) => (
          <article className={`statement ${a.status === 'revoked' ? 'revoked' : ''}`} key={index}>
            <div className="statement-head">
              <span className="statement-kind">{ATTESTATION_KINDS[a.kind]}</span>
              {a.status === 'revoked' ? <span className="level level-revoked">Revoked</span> : <LevelBadge level={a.level as Level} />}
            </div>
            <p className="statement-summary">{a.summary}</p>
            {a.status === 'revoked' && (
              <p className="recall-box">Revoked by the issuer on {formatDate(a.revoked_at)}: {a.revoked_reason}</p>
            )}
            {a.kind === 'lab_result' && a.claim.items && (
              <>
                <p className="lab-meta">Tested on {formatDate(a.claim.test_date)}</p>
                <LabItems items={a.claim.items} />
              </>
            )}
            <p className="issuer">
              Issued by <strong>{a.issuer.name}</strong> ({ORG_KINDS[a.issuer.kind]}, {countryName(a.issuer.country)}) on{' '}
              {formatDate(a.issued_at)}.
              {a.issuer.accreditations.map((ac, i) => (
                <span key={i}> {ac.standard} accredited by {ac.body}{ac.certificate_number ? ` (${ac.certificate_number})` : ''}.</span>
              ))}
              {a.valid_until && <span> Valid until {formatDate(a.valid_until)}.</span>}
            </p>
            {(a.evidence_url || a.evidence_sha256) && (
              <p className="evidence">
                {a.evidence_url && <a href={a.evidence_url} target="_blank" rel="noopener noreferrer">Source document</a>}
                {a.evidence_sha256 && <span className="hint"> SHA-256 <code>{a.evidence_sha256}</code></span>}
              </p>
            )}
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Journey</h2>
        {r.events.length === 0 ? (
          <p className="hint">No events are recorded for this lot.</p>
        ) : (
          <ol className="timeline">
            {r.events.map((e, index) => (
              <li key={index}>
                <span className="timeline-date">{formatDate(e.occurred_on)}</span>
                <span className="timeline-stage">{EVENT_TYPES[e.event_type]}</span>
                <span className="timeline-place">{[e.place, countryName(e.country)].filter(Boolean).join(', ')}</span>
                <span className="timeline-level"><LevelBadge level={e.level} />{e.source_system && <span className="hint"> {e.source_system}</span>}</span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <footer className="footer">
        <p>KYP shows who stated each fact. It does not test products itself and gives no medical advice. For questions about use, ask your doctor or pharmacist.</p>
        <p className="code-line">Record code: <code>{r.code}</code></p>
      </footer>
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
