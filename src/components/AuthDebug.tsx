'use client'

import { useEffect } from 'react'
import { useAuth } from './AuthProvider'

export default function AuthDebug() {
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    console.log('Auth Debug Info:')
    console.log('User:', user)
    console.log('Is Admin:', isAdmin)
    console.log('User Role:', user?.role)
    console.log('User Metadata:', user)
  }, [user, isAdmin])

  if (!user) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg max-w-sm">
        <p className="font-bold">No user logged in</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-4 rounded-lg max-w-sm border border-purple-400">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <div className="text-sm space-y-1">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || 'undefined'}</p>
        <p><strong>Is Admin:</strong> {isAdmin ? 'YES' : 'NO'}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
      {isAdmin && (
        <p className="text-green-400 mt-2">Admin permissions active!</p>
      )}
    </div>
  )
}
