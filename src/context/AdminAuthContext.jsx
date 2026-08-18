/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { clearAdminSession, readAdminSession, saveAdminSession } from '../lib/cookies'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => readAdminSession()?.user || null)

  const signIn = ({ token, user }) => {
    saveAdminSession({ token, user })
    setAdmin(user)
  }

  const signOut = () => {
    clearAdminSession()
    setAdmin(null)
  }

  return <AdminAuthContext.Provider value={{ admin, signIn, signOut }}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => useContext(AdminAuthContext)
