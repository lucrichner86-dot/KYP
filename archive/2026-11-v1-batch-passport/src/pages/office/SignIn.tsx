import { useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'

export default function SignIn() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    if (mode === 'in') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/office` },
      })
      if (error) setError(error.message)
      else if (!data.session) setNotice('Check your inbox and confirm your email address, then sign in.')
    }
    setBusy(false)
  }

  return (
    <form className="card form narrow-card" onSubmit={submit}>
      <h1>{mode === 'in' ? 'Producer sign-in' : 'Create a producer account'}</h1>
      <label>
        Email
        <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="error">{error}</p>}
      {notice && <p className="notice">{notice}</p>}
      <button className="button" disabled={busy}>
        {mode === 'in' ? 'Sign in' : 'Create account'}
      </button>
      <button
        type="button"
        className="quiet-link"
        onClick={() => {
          setMode(mode === 'in' ? 'up' : 'in')
          setError('')
          setNotice('')
        }}
      >
        {mode === 'in' ? 'No account yet? Create one' : 'Already have an account? Sign in'}
      </button>
    </form>
  )
}
