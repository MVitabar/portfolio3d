import { createClient } from '@supabase/supabase-js'

// Debug connection to verify credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const debugSupabase = createClient(supabaseUrl, supabaseAnonKey)

export async function debugConnection() {
  console.log('Debugging Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key exists:', !!supabaseAnonKey)
  
  try {
    // Test basic connection
    const { data, error } = await debugSupabase.from('categories').select('count')
    if (error) {
      console.error('Database connection error:', error)
      return false
    }
    console.log('Database connection OK')
    
    // Test storage connection
    const { data: buckets, error: bucketError } = await debugSupabase.storage.listBuckets()
    if (bucketError) {
      console.error('Storage connection error:', bucketError)
      return false
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name))
    return true
  } catch (error) {
    console.error('Connection error:', error)
    return false
  }
}
