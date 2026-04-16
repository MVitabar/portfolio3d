import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AuthUser {
  id: string
  email: string
  role?: string
}

export class AuthService {
  // Sign up new user
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    return { data, error }
  }

  // Sign in user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { data, error }
  }

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email!,
      role: user.user_metadata?.role || 'user'
    }
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user?.role === 'admin'
  }

  // Listen to auth changes
  onAuthChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role || 'user'
        })
      } else {
        callback(null)
      }
    })
  }

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  // Update user metadata (e.g., make admin)
  async updateUserRole(userId: string, role: string) {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    })
    return { data, error }
  }
}

export const authService = new AuthService()
