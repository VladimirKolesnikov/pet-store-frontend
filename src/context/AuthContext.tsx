import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as authService from '../api/auth.service'
import {
  AUTH_CHANGE_EVENT,
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setStoredUser,
  type StoredUser,
} from '../utils/storage'

interface AuthContextValue {
  user: StoredUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<StoredUser | null>(() => getStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const syncFromStorage = () => {
      setUser(getStoredUser())
    }

    window.addEventListener(AUTH_CHANGE_EVENT, syncFromStorage)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, syncFromStorage)
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      if (!getAccessToken()) {
        setIsLoading(false)
        return
      }

      try {
        const currentUser = await authService.me()
        setStoredUser(currentUser)
        setUser(currentUser)
      } catch {
        clearAuthStorage()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void initializeAuth()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && getAccessToken()),
      isLoading,
      login: async (credentials) => {
        await authService.login(credentials)
        const currentUser = await authService.me()
        queryClient.removeQueries({ queryKey: ['cart'] })
        setStoredUser(currentUser)
        setUser(currentUser)
      },
      register: async (credentials) => {
        await authService.register(credentials)
        await authService.login(credentials)
        const currentUser = await authService.me()
        queryClient.removeQueries({ queryKey: ['cart'] })
        setStoredUser(currentUser)
        setUser(currentUser)
      },
      logout: async () => {
        try {
          await authService.logout()
        } finally {
          queryClient.removeQueries({ queryKey: ['cart'] })
          clearAuthStorage()
          setUser(null)
        }
      },
    }),
    [isLoading, queryClient, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
