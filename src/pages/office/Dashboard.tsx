import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useProducer } from './Office'
import { addProduct, fetchBatches, fetchProducts } from '../../lib/data'
import { PRODUCT_TYPES, STATUS_LABELS, formatDate } from '../../lib/format'
import type { BatchListRow, Product, ProductType } from '../../lib/types'

export default function Dashboard() {
  const producer = useProducer()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [batches, setBatches] = useState<BatchListRow[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    Promise.all([fetchProducts(), fetchBatches()])
      .then(([p, b]) => {
        setProducts(p)
        setBatches(b)
      })
      .catch((e: Error) => setError(e.message))
  }, [])
  useEffect(load, [load])

  if (error) return <p className="error">{error}</p>
  if (!products || !batches) return <p className="loading">Loading…</p>

  return (
    <>
      <section className="card">
        <div className="card-head">
          <h1>Batches</h1>
          {products.length > 0 && (
            <Link to="/office/batches/new" className="button">
              New batch
            </Link>
          )}
        </div>
        {batches.length === 0 ? (
          <p className="hint">
            {products.length === 0 ? 'Add a product first, then enter its first batch.' : 'No batches yet.'}
          </p>
        ) : (
          <ul className="rows">
            {batches.map((batch) => (
              <li key={batch.id}>
                <Link to={`/office/batches/${batch.id}`}>
                  <span className="row-main">
                    <strong>{batch.batch_number}</strong>
                    <span>{batch.product?.name}</span>
                  </span>
                  <span className="row-side">
                    <span className={`status ${batch.status}`}>{STATUS_LABELS[batch.status]}</span>
                    <span className="hint">{formatDate(batch.recalled_at ?? batch.published_at ?? batch.created_at)}</span>
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
            {products.map((product) => (
              <li key={product.id}>
                <span className="row-main">
                  <strong>{product.name}</strong>
                  <span>{[PRODUCT_TYPES[product.product_type], product.cultivar].filter(Boolean).join(' · ')}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        <ProductForm producerId={producer.id} onAdded={load} />
      </section>
    </>
  )
}

function ProductForm({ producerId, onAdded }: { producerId: string; onAdded: () => void }) {
  const [name, setName] = useState('')
  const [productType, setProductType] = useState<ProductType>('flower')
  const [cultivar, setCultivar] = useState('')
  const [description, setDescription] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await addProduct({ producerId, name, productType, cultivar, description })
      setName('')
      setCultivar('')
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
        <label>
          Name
          <input required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Type
          <select value={productType} onChange={(e) => setProductType(e.target.value as ProductType)}>
            {Object.entries(PRODUCT_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Cultivar (optional)
        <input value={cultivar} onChange={(e) => setCultivar(e.target.value)} />
      </label>
      <label>
        Description (optional)
        <textarea rows={2} maxLength={600} value={description} onChange={(e) => setDescription(e.target.value)} />
        <span className="hint">
          Shown on the passport. Describe the product only (form, pack size). No statements about effects or use.
        </span>
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button secondary" disabled={busy}>
        Add product
      </button>
    </form>
  )
}
