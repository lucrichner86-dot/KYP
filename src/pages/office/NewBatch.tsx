import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducer } from './Office'
import { createBatch, fetchProducts } from '../../lib/data'
import { COUNTRIES } from './countries'
import type { Product } from '../../lib/types'

export default function NewBatch() {
  const producer = useProducer()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [form, setForm] = useState({
    productId: '',
    batchNumber: '',
    harvestDate: '',
    packagingDate: '',
    originGrower: '',
    originPlace: '',
    originCountry: producer.country,
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
      .then((list) => {
        setProducts(list)
        setForm((f) => ({ ...f, productId: f.productId || list[0]?.id || '' }))
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const id = await createBatch(form)
      navigate(`/office/batches/${id}`)
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  if (!products) return error ? <p className="error">{error}</p> : <p className="loading">Loading…</p>
  if (products.length === 0)
    return (
      <div className="card">
        <p>Add a product before entering a batch.</p>
        <Link to="/office">Back to the overview</Link>
      </div>
    )

  return (
    <form className="card form" onSubmit={submit}>
      <Link to="/office" className="quiet-link back">
        ← Overview
      </Link>
      <h1>New batch</h1>
      <p className="hint">
        The batch starts as a draft. You add laboratory results and journey steps next, then publish. The batch
        number, dates and origin cannot be edited after this step.
      </p>
      <div className="form-row">
        <label>
          Product
          <select required value={form.productId} onChange={set('productId')}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Batch number
          <input required maxLength={60} value={form.batchNumber} onChange={set('batchNumber')} />
        </label>
      </div>
      <div className="form-row">
        <label>
          Harvest date
          <input type="date" value={form.harvestDate} onChange={set('harvestDate')} />
        </label>
        <label>
          Packaging date
          <input type="date" min={form.harvestDate || undefined} value={form.packagingDate} onChange={set('packagingDate')} />
        </label>
      </div>
      <label>
        Grower
        <input placeholder="Company or site that grew the plants" value={form.originGrower} onChange={set('originGrower')} />
      </label>
      <div className="form-row">
        <label>
          Place of cultivation
          <input placeholder="Town or region" value={form.originPlace} onChange={set('originPlace')} />
        </label>
        <label>
          Country of cultivation
          <select value={form.originCountry} onChange={set('originCountry')}>
            <option value="">Not stated</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={busy}>
        Create draft
      </button>
    </form>
  )
}
