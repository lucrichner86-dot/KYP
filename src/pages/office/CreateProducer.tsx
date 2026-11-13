import { useState, type FormEvent } from 'react'
import { createProducer } from '../../lib/data'
import { COUNTRIES } from './countries'

export default function CreateProducer({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('')
  const [country, setCountry] = useState('CH')
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await createProducer(name, country, website)
      onCreated()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <form className="card form narrow-card" onSubmit={submit}>
      <h1>Set up your producer</h1>
      <p>This name appears on every passport you publish.</p>
      <label>
        Company name
        <input required minLength={2} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Country
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Website (optional)
        <input
          type="url"
          placeholder="https://"
          pattern="https://.*"
          title="An address starting with https://"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={busy}>
        Create producer
      </button>
    </form>
  )
}
