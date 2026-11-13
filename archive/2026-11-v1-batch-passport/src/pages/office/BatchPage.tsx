import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import { LabItems } from '../Passport'
import {
  addJourneyStep,
  addLabResult,
  fetchBatch,
  fetchScanCount,
  publishBatch,
  recallBatch,
  removeJourneyStep,
  removeLabResult,
} from '../../lib/data'
import { STAGES, STATUS_LABELS, countryName, formatDate, passportUrl } from '../../lib/format'
import type { BatchDetail, ItemKind, JourneyStage, LabItem } from '../../lib/types'

export default function BatchPage() {
  const { id = '' } = useParams()
  const [batch, setBatch] = useState<BatchDetail | null | undefined>(undefined)
  const [scans, setScans] = useState<number | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    fetchBatch(id)
      .then((b) => {
        setBatch(b)
        if (b && b.status !== 'draft') fetchScanCount(b.id).then(setScans, () => setScans(null))
      })
      .catch((e: Error) => setError(e.message))
  }, [id])
  useEffect(load, [load])

  // Runs a change, shows its error if it fails, and reloads the batch.
  const run = useCallback(
    async (action: () => Promise<void>) => {
      setError('')
      try {
        await action()
        load()
        return true
      } catch (e) {
        setError((e as Error).message)
        return false
      }
    },
    [load],
  )

  if (batch === undefined) return error ? <p className="error">{error}</p> : <p className="loading">Loading…</p>
  if (batch === null)
    return (
      <div className="card">
        <h1>Batch not found</h1>
        <Link to="/office">Back to the overview</Link>
      </div>
    )

  const draft = batch.status === 'draft'
  const origin = [batch.origin_grower, batch.origin_place, countryName(batch.origin_country)].filter(Boolean).join(', ')

  return (
    <>
      <section className="card">
        <Link to="/office" className="quiet-link back">
          ← Overview
        </Link>
        <div className="card-head">
          <h1>Batch {batch.batch_number}</h1>
          <span className={`status ${batch.status}`}>{STATUS_LABELS[batch.status]}</span>
        </div>
        <dl className="facts">
          <div>
            <dt>Product</dt>
            <dd>{batch.product?.name}</dd>
          </div>
          <div>
            <dt>Harvested</dt>
            <dd>{formatDate(batch.harvest_date)}</dd>
          </div>
          <div>
            <dt>Packaged</dt>
            <dd>{formatDate(batch.packaging_date)}</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>{origin || '—'}</dd>
          </div>
        </dl>
        {batch.status === 'recalled' && (
          <p className="recall-box">
            <strong>Recalled on {formatDate(batch.recalled_at)}.</strong> {batch.recall_note}
          </p>
        )}
        {error && <p className="error">{error}</p>}
        {draft && (
          <div className="actions">
            <button
              className="button"
              disabled={batch.lab_results.length === 0}
              onClick={() => {
                if (window.confirm('Publish this batch? Its laboratory results can no longer be changed afterwards.'))
                  run(() => publishBatch(batch.id))
              }}
            >
              Publish
            </button>
            {batch.lab_results.length === 0 && <span className="hint">Add a laboratory result to publish.</span>}
          </div>
        )}
      </section>

      {!draft && <PassportCard batch={batch} scans={scans} />}

      <section className="card">
        <h2>Laboratory results</h2>
        {batch.lab_results.length === 0 && <p className="hint">None yet.</p>}
        {batch.lab_results.map((result) => (
          <div className="lab-result" key={result.id}>
            <p className="lab-meta">
              {result.lab_name}, tested {formatDate(result.test_date)}
              {result.coa_url && (
                <>
                  {' · '}
                  <a href={result.coa_url} target="_blank" rel="noopener noreferrer">
                    Certificate
                  </a>
                </>
              )}
            </p>
            <LabItems items={result.items} />
            {draft && (
              <button className="quiet-link danger" onClick={() => run(() => removeLabResult(result.id))}>
                Remove this result
              </button>
            )}
          </div>
        ))}
        {draft && <LabResultForm batchId={batch.id} run={run} />}
      </section>

      <section className="card">
        <h2>Journey</h2>
        {batch.journey_steps.length === 0 && <p className="hint">No steps yet.</p>}
        <ol className="timeline">
          {batch.journey_steps.map((step) => (
            <li key={step.id}>
              <span className="timeline-date">{formatDate(step.step_date)}</span>
              <span className="timeline-stage">{STAGES[step.stage]}</span>
              <span className="timeline-place">{step.place}</span>
              {draft && (
                <button className="quiet-link danger" onClick={() => run(() => removeJourneyStep(step.id))}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ol>
        {batch.status !== 'recalled' && <JourneyForm batchId={batch.id} run={run} />}
      </section>

      {batch.status === 'published' && <RecallForm batchId={batch.id} run={run} />}
    </>
  )
}

type Run = (action: () => Promise<void>) => Promise<boolean>

function PassportCard({ batch, scans }: { batch: BatchDetail; scans: number | null }) {
  const url = passportUrl(batch.passport_code)
  const [qr, setQr] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(url, { width: 600, margin: 2, errorCorrectionLevel: 'M' }).then(setQr, () => setQr(''))
  }, [url])

  return (
    <section className="card">
      <h2>Passport</h2>
      <div className="qr-block">
        {qr && <img src={qr} alt={`QR code for batch ${batch.batch_number}`} width={180} height={180} />}
        <div>
          <p className="url-line">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </p>
          <div className="actions">
            <button
              className="button secondary"
              onClick={() => navigator.clipboard.writeText(url).then(() => setCopied(true))}
            >
              {copied ? 'Copied' : 'Copy link'}
            </button>
            {qr && (
              <a className="button secondary" href={qr} download={`kyp-${batch.batch_number}.png`}>
                Download QR code
              </a>
            )}
          </div>
          {scans !== null && (
            <p className="hint">
              Passport opened {scans} {scans === 1 ? 'time' : 'times'}. Only the time of each view is stored.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

interface ItemRow {
  kind: ItemKind
  name: string
  value: string
  unit: string
  passed: '' | 'pass' | 'fail'
}

const START_ROWS: ItemRow[] = [
  { kind: 'cannabinoid', name: 'THC', value: '', unit: '%', passed: '' },
  { kind: 'cannabinoid', name: 'CBD', value: '', unit: '%', passed: '' },
  { kind: 'terpene', name: '', value: '', unit: '%', passed: '' },
  { kind: 'contaminant', name: 'Microbial count', value: '', unit: '', passed: '' },
  { kind: 'contaminant', name: 'Heavy metals', value: '', unit: '', passed: '' },
  { kind: 'contaminant', name: 'Pesticides', value: '', unit: '', passed: '' },
  { kind: 'contaminant', name: 'Mycotoxins', value: '', unit: '', passed: '' },
]

function LabResultForm({ batchId, run }: { batchId: string; run: Run }) {
  const [labName, setLabName] = useState('')
  const [testDate, setTestDate] = useState('')
  const [coaUrl, setCoaUrl] = useState('')
  const [rows, setRows] = useState<ItemRow[]>(START_ROWS)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (index: number, patch: Partial<ItemRow>) =>
    setRows((list) => list.map((row, i) => (i === index ? { ...row, ...patch } : row)))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    // Rows left empty are skipped; rows half filled in are an error.
    const items: LabItem[] = []
    for (const row of rows) {
      const name = row.name.trim()
      if (row.kind === 'contaminant') {
        if (!row.passed) continue
        if (!name) return setError('Name every contaminant check that has a result.')
        items.push({ kind: row.kind, name, value: null, unit: null, passed: row.passed === 'pass' })
      } else {
        if (row.value.trim() === '') continue
        const value = Number(row.value)
        if (!name || !row.unit.trim() || Number.isNaN(value) || value < 0)
          return setError('Each measured value needs a name, a number and a unit.')
        items.push({ kind: row.kind, name, value, unit: row.unit.trim(), passed: null })
      }
    }
    if (items.length === 0) return setError('Enter at least one measured value or contaminant check.')
    setBusy(true)
    const ok = await run(() => addLabResult({ batchId, labName, testDate, coaUrl, items }))
    setBusy(false)
    if (ok) {
      setLabName('')
      setTestDate('')
      setCoaUrl('')
      setRows(START_ROWS)
    }
  }

  return (
    <form className="form sub-form" onSubmit={submit}>
      <h3>Add a laboratory result</h3>
      <div className="form-row">
        <label>
          Laboratory
          <input required maxLength={160} value={labName} onChange={(e) => setLabName(e.target.value)} />
        </label>
        <label>
          Test date
          <input type="date" required value={testDate} onChange={(e) => setTestDate(e.target.value)} />
        </label>
      </div>
      <label>
        Link to the certificate of analysis
        <input
          type="url"
          placeholder="https://"
          pattern="https://.*"
          title="An address starting with https://"
          value={coaUrl}
          onChange={(e) => setCoaUrl(e.target.value)}
        />
      </label>

      <div className="item-rows">
        {rows.map((row, index) => (
          <div className="item-row" key={index}>
            <select
              aria-label="Kind"
              value={row.kind}
              onChange={(e) => update(index, { kind: e.target.value as ItemKind, value: '', passed: '' })}
            >
              <option value="cannabinoid">Cannabinoid</option>
              <option value="terpene">Terpene</option>
              <option value="contaminant">Contaminant check</option>
            </select>
            <input
              aria-label="Name"
              placeholder="Name"
              value={row.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            {row.kind === 'contaminant' ? (
              <select
                aria-label="Result"
                className="span-2"
                value={row.passed}
                onChange={(e) => update(index, { passed: e.target.value as ItemRow['passed'] })}
              >
                <option value="">Not tested</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
            ) : (
              <>
                <input
                  aria-label="Value"
                  placeholder="Value"
                  inputMode="decimal"
                  value={row.value}
                  onChange={(e) => update(index, { value: e.target.value.replace(',', '.') })}
                />
                <select aria-label="Unit" value={row.unit} onChange={(e) => update(index, { unit: e.target.value })}>
                  <option value="%">%</option>
                  <option value="mg/g">mg/g</option>
                  <option value="mg/ml">mg/ml</option>
                </select>
              </>
            )}
            <button
              type="button"
              className="quiet-link danger"
              aria-label="Remove row"
              onClick={() => setRows((list) => list.filter((_, i) => i !== index))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="quiet-link"
        onClick={() => setRows((list) => [...list, { kind: 'terpene', name: '', value: '', unit: '%', passed: '' }])}
      >
        + Add a row
      </button>
      <p className="hint">Rows without a value or result are left out. Enter what the certificate states.</p>
      {error && <p className="error">{error}</p>}
      <button className="button secondary" disabled={busy}>
        Save laboratory result
      </button>
    </form>
  )
}

function JourneyForm({ batchId, run }: { batchId: string; run: Run }) {
  const [stage, setStage] = useState<JourneyStage>('cultivation')
  const [place, setPlace] = useState('')
  const [stepDate, setStepDate] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    const ok = await run(() => addJourneyStep(batchId, stage, place, stepDate))
    setBusy(false)
    if (ok) setPlace('')
  }

  return (
    <form className="form sub-form" onSubmit={submit}>
      <h3>Add a journey step</h3>
      <div className="form-row three">
        <label>
          Stage
          <select value={stage} onChange={(e) => setStage(e.target.value as JourneyStage)}>
            {Object.entries(STAGES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Place
          <input required maxLength={160} placeholder="Town, country" value={place} onChange={(e) => setPlace(e.target.value)} />
        </label>
        <label>
          Date
          <input type="date" required value={stepDate} onChange={(e) => setStepDate(e.target.value)} />
        </label>
      </div>
      <button className="button secondary" disabled={busy}>
        Add step
      </button>
    </form>
  )
}

function RecallForm({ batchId, run }: { batchId: string; run: Run }) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!window.confirm('Recall this batch? Every passport for it will show the recall at once. This cannot be undone.'))
      return
    setBusy(true)
    await run(() => recallBatch(batchId, note))
    setBusy(false)
  }

  return (
    <form className="card form danger-zone" onSubmit={submit}>
      <h2>Recall this batch</h2>
      <p>
        The passport will show a recall banner with your note. Say why the batch is recalled and what patients should
        do with their pack. A recall cannot be undone.
      </p>
      <label>
        Note for patients
        <textarea required rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <button className="button danger" disabled={busy}>
        Recall batch
      </button>
    </form>
  )
}
