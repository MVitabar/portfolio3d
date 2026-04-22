import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          featured: boolean
          created_at: string
          updated_at: string
          thumbnail_url: string
          model_url?: string
          images: string[]
          videos: string[]
          tags: string[]
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          featured?: boolean
          created_at?: string
          updated_at?: string
          thumbnail_url: string
          model_url?: string
          images?: string[]
          videos?: string[]
          tags?: string[]
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          featured?: boolean
          created_at?: string
          updated_at?: string
          thumbnail_url?: string
          model_url?: string
          images?: string[]
          videos?: string[]
          tags?: string[]
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          created_at?: string
        }
      }
    }
  }
}

// Export Project type for convenience
export type Project = Database['public']['Tables']['projects']['Row']
