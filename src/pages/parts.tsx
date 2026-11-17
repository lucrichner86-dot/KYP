import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ATTESTATION_KINDS, ITEM_KINDS, LEVELS, countryName, formatValue } from '../lib/format'
import type { AttestationKind, ItemKind, LabItem, Level } from '../lib/types'

// Placeholder for the KYP logo.
export function Wordmark({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="wordmark" aria-label="KYP, Know Your Product">
      KYP
    </Link>
  )
}

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`level level-${level}`} title={LEVELS[level].explain}>
      {LEVELS[level].label}
    </span>
  )
}

const KIND_ORDER: ItemKind[] = ['cannabinoid', 'terpene', 'other', 'contaminant']

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

export const COUNTRY_CODES = ['CH', 'DE', 'AT', 'NL', 'DK', 'PT', 'ES', 'IT', 'CZ', 'GR', 'MK', 'GB', 'FR', 'BE', 'LU', 'MT', 'PL', 'CA', 'AU', 'IL', 'CO', 'UY', 'ZA', 'LS', 'US']
export const COUNTRIES = COUNTRY_CODES.map((code) => ({ code, name: countryName(code) })).sort((a, b) =>
  a.name.localeCompare(b.name),
)

export function CountrySelect({ value, onChange, optional = false }: { value: string; onChange: (v: string) => void; optional?: boolean }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {optional && <option value="">Not stated</option>}
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name}
        </option>
      ))}
    </select>
  )
}

// SHA-256 of a local file, computed in the browser. The file is not uploaded.
async function sha256Hex(file: File): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
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

export interface StatementDraft {
  kind: AttestationKind
  summary: string
  claim: Record<string, unknown>
  evidenceUrl: string
  evidenceSha256: string
  validUntil: string
}

// The form for one statement. `fixedKind` is set when answering a request.
export function StatementForm({
  fixedKind,
  allowedKinds = ['lab_result', 'gmp_release', 'origin', 'other'],
  submitLabel,
  onSubmit,
}: {
  fixedKind?: AttestationKind
  allowedKinds?: AttestationKind[]
  submitLabel: string
  onSubmit: (draft: StatementDraft) => Promise<boolean>
}) {
  const [kind, setKind] = useState<AttestationKind>(fixedKind ?? allowedKinds[0])
  const [summary, setSummary] = useState('')
  const [testDate, setTestDate] = useState('')
  const [rows, setRows] = useState<ItemRow[]>(START_ROWS)
  const [evidenceUrl, setEvidenceUrl] = useState('')
  const [evidenceSha256, setEvidenceSha256] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (index: number, patch: Partial<ItemRow>) =>
    setRows((list) => list.map((row, i) => (i === index ? { ...row, ...patch } : row)))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    let claim: Record<string, unknown> = {}
    if (kind === 'lab_result') {
      const items: LabItem[] = []
      for (const row of rows) {
        const name = row.name.trim()
        if (row.kind === 'contaminant') {
          if (!row.passed) continue
          if (!name) return setError('Name every contaminant check that has a result.')
          items.push({ kind: row.kind, name, passed: row.passed === 'pass' })
        } else {
          if (row.value.trim() === '') continue
          const value = Number(row.value)
          if (!name || !row.unit.trim() || Number.isNaN(value) || value < 0)
            return setError('Each measured value needs a name, a number and a unit.')
          items.push({ kind: row.kind, name, value, unit: row.unit.trim() })
        }
      }
      if (items.length === 0) return setError('Enter at least one measured value or contaminant check.')
      claim = { test_date: testDate, items }
    }
    setBusy(true)
    const ok = await onSubmit({ kind, summary, claim, evidenceUrl, evidenceSha256, validUntil })
    setBusy(false)
    if (ok) {
      setSummary('')
      setTestDate('')
      setRows(START_ROWS)
      setEvidenceUrl('')
      setEvidenceSha256('')
      setValidUntil('')
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      {!fixedKind && (
        <label>
          Kind of statement
          <select value={kind} onChange={(e) => setKind(e.target.value as AttestationKind)}>
            {allowedKinds.map((k) => (
              <option key={k} value={k}>
                {ATTESTATION_KINDS[k]}
              </option>
            ))}
          </select>
        </label>
      )}
      <label>
        Statement
        <textarea
          required
          rows={2}
          maxLength={500}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder={kind === 'lab_result' ? 'e.g. Full release panel, all contaminant checks passed.' : 'What exactly you confirm'}
        />
        <span className="hint">Facts only. No statements about effects, quality rankings or use.</span>
      </label>

      {kind === 'lab_result' && (
        <>
          <label>
            Test date
            <input type="date" required value={testDate} onChange={(e) => setTestDate(e.target.value)} />
          </label>
          <div className="item-rows">
            {rows.map((row, index) => (
              <div className="item-row" key={index}>
                <select aria-label="Kind" value={row.kind}
                  onChange={(e) => update(index, { kind: e.target.value as ItemKind, value: '', passed: '' })}>
                  <option value="cannabinoid">Cannabinoid</option>
                  <option value="terpene">Terpene</option>
                  <option value="other">Other value</option>
                  <option value="contaminant">Contaminant check</option>
                </select>
                <input aria-label="Name" placeholder="Name" value={row.name} onChange={(e) => update(index, { name: e.target.value })} />
                {row.kind === 'contaminant' ? (
                  <select aria-label="Result" className="span-2" value={row.passed}
                    onChange={(e) => update(index, { passed: e.target.value as ItemRow['passed'] })}>
                    <option value="">Not tested</option>
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                ) : (
                  <>
                    <input aria-label="Value" placeholder="Value" inputMode="decimal" value={row.value}
                      onChange={(e) => update(index, { value: e.target.value.replace(',', '.') })} />
                    <select aria-label="Unit" value={row.unit} onChange={(e) => update(index, { unit: e.target.value })}>
                      <option value="%">%</option>
                      <option value="mg/g">mg/g</option>
                      <option value="mg/ml">mg/ml</option>
                      <option value="ppm">ppm</option>
                    </select>
                  </>
                )}
                <button type="button" className="quiet-link danger" aria-label="Remove row"
                  onClick={() => setRows((list) => list.filter((_, i) => i !== index))}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="quiet-link"
            onClick={() => setRows((list) => [...list, { kind: 'terpene', name: '', value: '', unit: '%', passed: '' }])}>
            + Add a row
          </button>
        </>
      )}

      <div className="form-row">
        <label>
          Link to the source document (optional)
          <input type="url" placeholder="https://" pattern="https://.*" title="An address starting with https://"
            value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} />
        </label>
        <label>
          Valid until (optional)
          <input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        </label>
      </div>
      <label>
        Fingerprint of the source document (optional)
        <input type="file" onChange={async (e) => {
          const file = e.target.files?.[0]
          setEvidenceSha256(file ? await sha256Hex(file) : '')
        }} />
        <span className="hint">
          {evidenceSha256
            ? <>SHA-256 <code>{evidenceSha256}</code>. The file stays on your device; only the fingerprint is stored, so anyone can later check a copy is the same document.</>
            : 'Pick the certificate file to store its SHA-256 fingerprint. The file is not uploaded.'}
        </span>
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={busy}>{submitLabel}</button>
    </form>
  )
}
