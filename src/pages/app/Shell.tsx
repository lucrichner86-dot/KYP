import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, Outlet, useLocation, useOutletContext } from 'react-router-dom'
import { CountrySelect, Wordmark } from '../parts'
import SignIn from './SignIn'
import { SessionProvider, useSession } from '../../lib/session'
import { supabase } from '../../lib/supabase'
import { isConfigured } from '../../lib/config'
import { createOrganisation, fetchIsAdmin, fetchMyOrganisation } from '../../lib/data'
import { ORG_KINDS } from '../../lib/format'
import type { OrgKind, Organisation } from '../../lib/types'

export interface Workspace {
  org: Organisation | null
  isAdmin: boolean
  reload: () => void
}

export function useWorkspace(): Workspace {
  return useOutletContext<Workspace>()
}

// The organisation is required everywhere except the admin screen.
export function useOrg(): Organisation {
  const { org } = useWorkspace()
  if (!org) throw new Error('No organisation')
  return org
}

export default function Shell() {
  return (
    <SessionProvider>
      <Gate />
    </SessionProvider>
  )
}

function Gate() {
  const { session, loading } = useSession()
  const location = useLocation()
  const userId = session?.user.id
  const [org, setOrg] = useState<Organisation | null | undefined>(undefined)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setError('')
    Promise.all([fetchMyOrganisation(), fetchIsAdmin()])
      .then(([o, a]) => {
        setOrg(o)
        setIsAdmin(a)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    setOrg(undefined)
    if (userId) load()
  }, [userId, load])

  const onAdminPage = location.pathname.startsWith('/app/admin')
  let body
  if (!isConfigured) {
    body = (
      <div className="card">
        <h1>Not connected</h1>
        <p>The Supabase address and key are missing. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> and rebuild.</p>
      </div>
    )
  } else if (loading) {
    body = <p className="loading">Loading…</p>
  } else if (!session) {
    body = <SignIn />
  } else if (error) {
    body = (
      <div className="card">
        <h1>Could not load your organisation</h1>
        <p className="error">{error}</p>
        <button className="button" onClick={load}>Try again</button>
      </div>
    )
  } else if (org === undefined) {
    body = <p className="loading">Loading…</p>
  } else if (org === null && !(isAdmin && onAdminPage)) {
    body = <CreateOrganisation onCreated={load} isAdmin={isAdmin} />
  } else {
    body = <Outlet context={{ org, isAdmin, reload: load } satisfies Workspace} />
  }

  return (
    <div className="page">
      <header className="topbar">
        <Wordmark to="/app" />
        <span className="topbar-note">{org ? org.name : 'Workspace'}</span>
        {isAdmin && <Link to="/app/admin" className="quiet-link">KYP admin</Link>}
        {session && <button className="quiet-link" onClick={() => supabase.auth.signOut()}>Sign out</button>}
      </header>
      <main>{body}</main>
    </div>
  )
}

function CreateOrganisation({ onCreated, isAdmin }: { onCreated: () => void; isAdmin: boolean }) {
  const [name, setName] = useState('')
  const [kind, setKind] = useState<OrgKind>('producer')
  const [country, setCountry] = useState('CH')
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await createOrganisation(name, kind, country, website)
      onCreated()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <form className="card form narrow-card" onSubmit={submit}>
      <h1>Register your organisation</h1>
      <p>KYP checks every organisation before it can publish records or issue statements that count as third party. Registering starts that check.</p>
      <label>
        Legal name
        <input required minLength={2} maxLength={160} value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <div className="form-row">
        <label>
          Role
          <select value={kind} onChange={(e) => setKind(e.target.value as OrgKind)}>
            {Object.entries(ORG_KINDS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label>
          Country
          <CountrySelect value={country} onChange={setCountry} />
        </label>
      </div>
      <label>
        Website (optional)
        <input type="url" placeholder="https://" pattern="https://.*" title="An address starting with https://"
          value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={busy}>Register</button>
      {isAdmin && <Link to="/app/admin" className="quiet-link">Go to KYP admin instead</Link>}
    </form>
  )
}
