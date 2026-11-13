import { useCallback, useEffect, useState } from 'react'
import { Outlet, useOutletContext } from 'react-router-dom'
import Wordmark from '../Wordmark'
import SignIn from './SignIn'
import CreateProducer from './CreateProducer'
import { SessionProvider, useSession } from '../../lib/session'
import { supabase } from '../../lib/supabase'
import { isConfigured } from '../../lib/config'
import { fetchMyProducer } from '../../lib/data'
import type { Producer } from '../../lib/types'

// Layout and gate for everything under /office: sign in, then make sure the
// account has a producer, then show the requested screen.
export default function Office() {
  return (
    <SessionProvider>
      <Gate />
    </SessionProvider>
  )
}

export function useProducer(): Producer {
  return useOutletContext<Producer>()
}

function Gate() {
  const { session, loading } = useSession()
  const userId = session?.user.id
  const [producer, setProducer] = useState<Producer | null | undefined>(undefined)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setError('')
    fetchMyProducer()
      .then(setProducer)
      .catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    setProducer(undefined)
    if (userId) load()
  }, [userId, load])

  let body
  if (!isConfigured) {
    body = (
      <div className="card">
        <h1>Not connected</h1>
        <p>
          The Supabase address and key are missing. Copy <code>.env.example</code> to <code>.env</code>, fill it in
          and restart.
        </p>
      </div>
    )
  } else if (loading) {
    body = <p className="loading">Loading…</p>
  } else if (!session) {
    body = <SignIn />
  } else if (error) {
    body = (
      <div className="card">
        <h1>Could not load your producer</h1>
        <p className="error">{error}</p>
        <button className="button" onClick={load}>
          Try again
        </button>
      </div>
    )
  } else if (producer === undefined) {
    body = <p className="loading">Loading…</p>
  } else if (producer === null) {
    body = <CreateProducer onCreated={load} />
  } else {
    body = <Outlet context={producer} />
  }

  return (
    <div className="page">
      <header className="topbar">
        <Wordmark to="/office" />
        <span className="topbar-note">{producer ? producer.name : 'Producer back office'}</span>
        {session && (
          <button className="quiet-link" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        )}
      </header>
      <main>{body}</main>
    </div>
  )
}
