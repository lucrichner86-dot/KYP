import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Wordmark from './Wordmark'
import { fetchPassport } from '../lib/passport'
import { ITEM_KINDS, PRODUCT_TYPES, STAGES, countryName, formatDate, formatValue } from '../lib/format'
import type { ItemKind, LabItem, Passport as PassportData } from '../lib/types'

type State =
  | { phase: 'loading' }
  | { phase: 'unknown' }
  | { phase: 'error' }
  | { phase: 'ready'; passport: PassportData }

export default function Passport() {
  const { code = '' } = useParams()
  const [state, setState] = useState<State>({ phase: 'loading' })

  useEffect(() => {
    let current = true
    setState({ phase: 'loading' })
    fetchPassport(code)
      .then((passport) => current && setState(passport ? { phase: 'ready', passport } : { phase: 'unknown' }))
      .catch(() => current && setState({ phase: 'error' }))
    return () => {
      current = false
    }
  }, [code])

  return (
    <div className="page narrow">
      <header className="topbar">
        <Wordmark />
        <span className="topbar-note">Product passport</span>
      </header>
      <main>
        {state.phase === 'loading' && <p className="loading">Looking up this code…</p>}
        {state.phase === 'unknown' && <Unknown code={code} />}
        {state.phase === 'error' && (
          <div className="card">
            <h1>The passport could not be loaded</h1>
            <p>This is a technical problem, not a statement about the product. Check your connection and try again.</p>
            <button className="button" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        )}
        {state.phase === 'ready' && <PassportView passport={state.passport} />}
      </main>
    </div>
  )
}

function Unknown({ code }: { code: string }) {
  return (
    <div className="card">
      <h1>Code not recognised</h1>
      <p>
        No published batch matches this code. KYP cannot confirm anything about a pack carrying it.
      </p>
      <p>
        Scan the code on the pack again in case the link was cut short. If it still is not recognised, ask the
        pharmacy that dispensed the product.
      </p>
      <p className="code-line">
        Code: <code>{code}</code>
      </p>
    </div>
  )
}

function PassportView({ passport: p }: { passport: PassportData }) {
  const origin = [p.origin_place, countryName(p.origin_country)].filter(Boolean).join(', ')

  return (
    <>
      {p.status === 'recalled' ? (
        <section className="banner recalled" role="alert">
          <h1>This batch has been recalled</h1>
          <p className="banner-note">{p.recall_note}</p>
          <p className="banner-meta">
            Recalled by {p.producer.name} on {formatDate(p.recalled_at)}.
          </p>
        </section>
      ) : (
        <section className="banner published">
          <h1>Code verified · published batch</h1>
          <p className="banner-meta">
            This code belongs to batch {p.batch_number}, published by {p.producer.name} on{' '}
            {formatDate(p.published_at)}. No recall is recorded.
          </p>
        </section>
      )}

      <section className="card">
        <p className="eyebrow">{PRODUCT_TYPES[p.product.product_type]}</p>
        <h2 className="product-name">{p.product.name}</h2>
        {p.product.description && <p>{p.product.description}</p>}
        <dl className="facts">
          <Fact label="Producer" value={`${p.producer.name}, ${countryName(p.producer.country)}`} />
          {p.product.cultivar && <Fact label="Cultivar" value={p.product.cultivar} />}
          <Fact label="Batch number" value={p.batch_number} />
          {p.harvest_date && <Fact label="Harvested" value={formatDate(p.harvest_date)} />}
          {p.packaging_date && <Fact label="Packaged" value={formatDate(p.packaging_date)} />}
        </dl>
      </section>

      <section className="card">
        <h2>Contents and laboratory results</h2>
        {p.lab_results.map((result, index) => (
          <div className="lab-result" key={index}>
            <p className="lab-meta">
              Tested by {result.lab_name} on {formatDate(result.test_date)}
            </p>
            <LabItems items={result.items} />
            {result.coa_url ? (
              <a className="coa-link" href={result.coa_url} target="_blank" rel="noopener noreferrer">
                Certificate of analysis
              </a>
            ) : (
              <p className="hint">No certificate of analysis is linked to this result.</p>
            )}
          </div>
        ))}
      </section>

      <section className="card">
        <h2>Origin and journey</h2>
        <dl className="facts">
          {p.origin_grower && <Fact label="Grown by" value={p.origin_grower} />}
          {origin && <Fact label="Grown in" value={origin} />}
        </dl>
        {p.journey.length > 0 ? (
          <ol className="timeline">
            {p.journey.map((step, index) => (
              <li key={index}>
                <span className="timeline-date">{formatDate(step.step_date)}</span>
                <span className="timeline-stage">{STAGES[step.stage]}</span>
                <span className="timeline-place">{step.place}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="hint">No journey steps are recorded for this batch.</p>
        )}
      </section>

      <footer className="footer">
        <p>
          {p.source === 'cannavigia'
            ? 'The data on this page comes from the Cannavigia track-and-trace record for this batch.'
            : `The data on this page was entered and published by ${p.producer.name}. The certificate of analysis is the laboratory's own document.`}
        </p>
        <p>This page gives no medical advice. For questions about use, ask your doctor or pharmacist.</p>
        <p className="code-line">
          Passport code: <code>{p.code}</code>
        </p>
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

const KIND_ORDER: ItemKind[] = ['cannabinoid', 'terpene', 'contaminant']

// Also used by the back office batch page.
export function LabItems({ items }: { items: LabItem[] }) {
  return (
    <>
      {KIND_ORDER.map((kind) => {
        const rows = items.filter((item) => item.kind === kind)
        if (rows.length === 0) return null
        return (
          <table className="values" key={kind}>
            <caption>{ITEM_KINDS[kind]}</caption>
            <tbody>
              {rows.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{item.name}</th>
                  <td>
                    {kind === 'contaminant' ? (
                      <span className={item.passed ? 'pass' : 'fail'}>{item.passed ? 'Pass' : 'Fail'}</span>
                    ) : (
                      formatValue(item.value, item.unit)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      })}
    </>
  )
}
