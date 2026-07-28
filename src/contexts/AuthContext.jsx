import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  clearAuthStorage,
  setUnauthorizedHandler,
} from '../services/apiClient.js'
import { login as loginRequest } from '../services/authApi.js'
import { getUser } from '../services/userApi.js'
import { createContext } from 'react'

export const AuthContext = createContext(null)

function saveUser(user) {
  localStorage.setItem('userId', String(user.id))
  localStorage.setItem('nickname', user.nickname)

  if (user.profile_image) {
    localStorage.setItem('profileImage', user.profile_image)
  } else {
    localStorage.removeItem('profileImage')
  }
}

export function AuthProvider({ children }) {
  const [authStatus, setAuthStatus] = useState('checking')
  const [user, setUser] = useState(null)

  const clearSession = useCallback(() => {
    clearAuthStorage()
    setUser(null)
    setAuthStatus('guest')
  }, [])

  const signIn = useCallback(async (credentials) => {
    const response = await loginRequest(credentials)
    const loginData = response.data

    localStorage.setItem('accessToken', loginData.access_token)
    saveUser(loginData)
    setUser(loginData)
    setAuthStatus('authenticated')

    return response
  }, [])

  const refreshUser = useCallback(async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      clearSession()
      return null
    }

    const response = await getUser(userId)
    const restoredUser = response.data

    saveUser(restoredUser)
    setUser(restoredUser)
    setAuthStatus('authenticated')

    return restoredUser
  }, [clearSession])

  const updateCurrentUser = useCallback((updatedUser) => {
    if (updatedUser.nickname !== undefined) {
      localStorage.setItem('nickname', updatedUser.nickname)
    }

    if (updatedUser.profile_image) {
      localStorage.setItem('profileImage', updatedUser.profile_image)
    } else if (updatedUser.profile_image === null) {
      localStorage.removeItem('profileImage')
    }

    setUser((currentUser) => ({
      ...currentUser,
      ...updatedUser,
    }))
  }, [])

  useEffect(() => {
    let isActive = true

    const handleUnauthorized = () => {
      if (!isActive) return

      setUser(null)
      setAuthStatus('guest')
    }

    setUnauthorizedHandler(handleUnauthorized)

    const restoreSession = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const userId = localStorage.getItem('userId')

      if (!accessToken || !userId) {
        clearAuthStorage()

        if (isActive) {
          setUser(null)
          setAuthStatus('guest')
        }
        return
      }

      try {
        const response = await getUser(userId)

        if (!isActive) return

        saveUser(response.data)
        setUser(response.data)
        setAuthStatus('authenticated')
      } catch {
        clearAuthStorage()

        if (isActive) {
          setUser(null)
          setAuthStatus('guest')
        }
      }
    }

    restoreSession()

    return () => {
      isActive = false
      setUnauthorizedHandler(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      authStatus,
      isAuthenticated: authStatus === 'authenticated',
      signIn,
      logout: clearSession,
      refreshUser,
      updateCurrentUser,
    }),
    [
      authStatus,
      clearSession,
      refreshUser,
      signIn,
      updateCurrentUser,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
