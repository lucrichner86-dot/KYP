import { SUPABASE_KEY, SUPABASE_URL, isConfigured } from './config'
import type { PublicRecord } from './types'

// The public read: a plain fetch so the record page does not load the
// Supabase client. Returns null for an unknown code or an unpublished lot.
export async function fetchRecord(code: string): Promise<PublicRecord | null> {
  if (!isConfigured) throw new Error('not configured')
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_record`, {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_code: code }),
  })
  if (!response.ok) throw new Error(`record request failed (${response.status})`)
  return (await response.json()) as PublicRecord | null
}
