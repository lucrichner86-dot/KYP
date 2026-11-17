import { createClient } from '@supabase/supabase-js'
import { SUPABASE_KEY, SUPABASE_URL, isConfigured } from './config'

// Used by the back office only. Without .env the client is built with
// placeholders so the app still loads; the back office shows a notice instead.
export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'http://localhost:54321',
  isConfigured ? SUPABASE_KEY : 'not-configured',
)
