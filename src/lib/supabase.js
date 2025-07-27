import { createClient } from '@supabase/supabase-js'

// Project ID will be auto-injected during deployment
const SUPABASE_URL = 'https://enjzwbqvfnumnhxhcmfj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanp3YnF2Zm51bW5oeGhjbWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDQ3MTQsImV4cCI6MjA2OTE4MDcxNH0.-tEThVUAgoO4oeNkHcZukBzzFR4109CIvlnPcrvvAYw'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>' ){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})