import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useOrg } from './Shell'
import {
  addIdentifier, addProduct, fetchAccreditations, fetchIdentifiers, fetchIncomingRequests, fetchOwnLots, fetchProducts,
  type LotRow,
} from '../../lib/data'
import {
  ATTESTATION_KINDS, CATEGORIES, IDENTIFIER_SCHEMES, LOT_STATUS, ORG_KINDS, ORG_STATUS, countryName, formatDate,
} from '../../lib/format'
import type { Accreditation, AttestationRequest, Category, Identifier, Product } from '../../lib/types'

export default function Dashboard() {
  const org = useOrg()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [lots, setLots] = useState<LotRow[]>([])
  const [requests, setRequests] = useState<(AttestationRequest & { lot: LotRow | null })[]>([])
  const [identifiers, setIdentifiers] = useState<Identifier[]>([])
  const [accreditations, setAccreditations] = useState<Accreditation[]>([])
  const [error, setError] = useState('')

  const load = useCallback(() => {
    Promise.all([fetchProducts(org.id), fetchOwnLots(org.id), fetchIncomingRequests(org.id), fetchIdentifiers(org.id), fetchAccreditations(org.id)])
      .then(([p, l, r, i, a]) => {
        setProducts(p)
        setLots(l)
        setRequests(r)
        setIdentifiers(i)
        setAccreditations(a)
      })
      .catch((e: Error) => setError(e.message))
  }, [org.id])
  useEffect(load, [load])

  if (error) return <p className="error">{error}</p>
  if (!products) return <p className="loading">Loading…</p>
  const open = requests.filter((r) => r.status === 'open')

  return (
    <>
      <section className="card">
        <div className="card-head">
          <h1>{org.name}</h1>
          <span className={`status org-${org.status}`}>{ORG_STATUS[org.status]}</span>
        </div>
        <p className="hint">{ORG_KINDS[org.kind]} · {countryName(org.country)}</p>
        {org.status === 'pending' && (
          <p className="notice">
            KYP has not verified this organisation yet. You can prepare products and lots, but you cannot publish, and
            nobody can send you requests until you are verified. Add the registry identifiers KYP should check below.
          </p>
        )}
        {org.status === 'suspended' && (
          <p className="error">KYP has suspended this organisation. Your statements show as unverified and you cannot issue new ones.</p>
        )}
        <h3>Identifiers</h3>
        {identifiers.length === 0 ? <p className="hint">None yet.</p> : (
          <ul className="rows plain">
            {identifiers.map((i) => (
              <li key={i.id}><span className="row-main"><strong>{IDENTIFIER_SCHEMES[i.scheme] ?? i.scheme}</strong><span>{i.value}</span></span></li>
            ))}
          </ul>
        )}
        {org.status === 'pending' && <IdentifierForm orgId={org.id} onAdded={load} />}
        {accreditations.length > 0 && (
          <>
            <h3>Accreditations on file</h3>
            <ul className="rows plain">
              {accreditations.map((a) => (
                <li key={a.id}>
                  <span className="row-main">
                    <strong>{a.standard} · {a.body}</strong>
                    <span>Covers {a.covers.map((k) => ATTESTATION_KINDS[k]).join(', ')}{a.valid_until ? ` · until ${formatDate(a.valid_until)}` : ''}</span>
                  </span>
                  <span className={`status ${a.status === 'active' ? 'published' : 'recalled'}`}>{a.status === 'active' ? 'Active' : 'Withdrawn'}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {requests.length > 0 && (
        <section className="card">
          <h2>Requests to {org.name} {open.length > 0 && <span className="status draft">{open.length} open</span>}</h2>
          <ul className="rows">
            {requests.map((r) => (
              <li key={r.id}>
                <Link to={`/app/requests/${r.id}`}>
                  <span className="row-main">
                    <strong>{ATTESTATION_KINDS[r.kind]} · lot {r.lot?.lot_number}</strong>
                    <span>{r.lot?.product?.name}</span>
                  </span>
                  <span className="row-side">
                    <span className={`status ${r.status === 'open' ? 'draft' : r.status === 'fulfilled' ? 'published' : 'recalled'}`}>{r.status}</span>
                    <span className="hint">{formatDate(r.created_at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>Lots</h2>
          {products.length > 0 && <Link to="/app/lots/new" className="button">New lot</Link>}
        </div>
        {lots.length === 0 ? (
          <p className="hint">{products.length === 0 ? 'Add a product first, then enter its first lot.' : 'No lots yet.'}</p>
        ) : (
          <ul className="rows">
            {lots.map((lot) => (
              <li key={lot.id}>
                <Link to={`/app/lots/${lot.id}`}>
                  <span className="row-main"><strong>{lot.lot_number}</strong><span>{lot.product?.name}</span></span>
                  <span className="row-side">
                    <span className={`status ${lot.status}`}>{LOT_STATUS[lot.status]}</span>
                    <span className="hint">{formatDate(lot.recalled_at ?? lot.published_at ?? lot.created_at)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Products</h2>
        {products.length > 0 && (
          <ul className="rows plain">
            {products.map((p) => (
              <li key={p.id}>
                <span className="row-main"><strong>{p.name}</strong><span>{[CATEGORIES[p.category], p.gtin && `GTIN ${p.gtin}`].filter(Boolean).join(' · ')}</span></span>
              </li>
            ))}
          </ul>
        )}
        <ProductForm orgId={org.id} onAdded={load} />
      </section>
    </>
  )
}

function IdentifierForm({ orgId, onAdded }: { orgId: string; onAdded: () => void }) {
  const [scheme, setScheme] = useState('trade_register')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    try {
      await addIdentifier(orgId, scheme, value, '')
      setValue('')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    }
  }
  return (
    <form className="form sub-form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Scheme
          <select value={scheme} onChange={(e) => setScheme(e.target.value)}>
            {Object.entries(IDENTIFIER_SCHEMES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>
          Value
          <input required maxLength={80} value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="button secondary">Add identifier</button>
    </form>
  )
}

function ProductForm({ orgId, onAdded }: { orgId: string; onAdded: () => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>('cannabis_flower')
  const [gtin, setGtin] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await addProduct(orgId, name, category, gtin, description)
      setName('')
      setGtin('')
      setDescription('')
      onAdded()
    } catch (e) {
      setError((e as Error).message)
    }
    setBusy(false)
  }

  return (
    <form className="form sub-form" onSubmit={submit}>
      <h3>Add a product</h3>
      <div className="form-row">
        <label>Name<input required maxLength={160} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {Object.entries(CATEGORIES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>
      <label>
        GTIN (optional)
        <input inputMode="numeric" pattern="[0-9]{14}" title="14 digits; pad shorter codes with leading zeros" value={gtin}
          onChange={(e) => setGtin(e.target.value.replace(/\D/g, ''))} />
      </label>
      <label>
        Description (optional)
        <textarea rows={2} maxLength={600} value={description} onChange={(e) => setDescription(e.target.value)} />
        <span className="hint">Shown publicly. Describe the product only (form, pack size). No statements about effects or use.</span>
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button secondary" disabled={busy}>Add product</button>
    </form>
  )
}
