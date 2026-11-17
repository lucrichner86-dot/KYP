import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useOrg } from './Shell'
import { CountrySelect } from '../parts'
import { createLot, fetchProducts } from '../../lib/data'
import type { Product } from '../../lib/types'

export default function NewLot() {
  const org = useOrg()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [form, setForm] = useState({ productId: '', lotNumber: '', productionDate: '', expiryDate: '', originCountry: org.country })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts(org.id)
      .then((list) => {
        setProducts(list)
        setForm((f) => ({ ...f, productId: f.productId || list[0]?.id || '' }))
      })
      .catch((e: Error) => setError(e.message))
  }, [org.id])

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      navigate(`/app/lots/${await createLot(form)}`)
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  if (!products) return error ? <p className="error">{error}</p> : <p className="loading">Loading…</p>
  if (products.length === 0)
    return <div className="card"><p>Add a product before entering a lot.</p><Link to="/app">Back to the overview</Link></div>

  return (
    <form className="card form" onSubmit={submit}>
      <Link to="/app" className="quiet-link back">← Overview</Link>
      <h1>New lot</h1>
      <p className="hint">The lot starts as a draft. Next you add events, ask other organisations for statements, and publish.</p>
      <div className="form-row">
        <label>
          Product
          <select required value={form.productId} onChange={(e) => set('productId')(e.target.value)}>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>Lot number<input required maxLength={60} value={form.lotNumber} onChange={(e) => set('lotNumber')(e.target.value)} /></label>
      </div>
      <div className="form-row">
        <label>Production date<input type="date" value={form.productionDate} onChange={(e) => set('productionDate')(e.target.value)} /></label>
        <label>Use-by date<input type="date" min={form.productionDate || undefined} value={form.expiryDate} onChange={(e) => set('expiryDate')(e.target.value)} /></label>
      </div>
      <label>Country of origin<CountrySelect optional value={form.originCountry} onChange={set('originCountry')} /></label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={busy}>Create draft</button>
    </form>
  )
}
