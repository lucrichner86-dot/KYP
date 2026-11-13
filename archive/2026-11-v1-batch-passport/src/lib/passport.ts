import { SUPABASE_KEY, SUPABASE_URL, isConfigured } from './config'
import type { Passport } from './types'

// The public passport read. A plain fetch, so the page a patient lands on
// does not have to download the Supabase client.
// Returns null when the code is unknown (or belongs to an unpublished batch).
export async function fetchPassport(code: string): Promise<Passport | null> {
  if (!isConfigured) throw new Error('not configured')
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_passport`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_code: code }),
  })
  if (!response.ok) throw new Error(`passport request failed (${response.status})`)
  return (await response.json()) as Passport | null
}
