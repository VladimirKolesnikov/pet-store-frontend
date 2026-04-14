const ACCESS_TOKEN_KEY = 'accessToken'
const USER_KEY = 'user'

export const AUTH_CHANGE_EVENT = 'auth-change'

export interface StoredUser {
  id: number
  email: string
  role: string
}

const dispatchAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  dispatchAuthChange()
}

export const getStoredUser = (): StoredUser | null => {
  const rawUser = localStorage.getItem(USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as StoredUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export const setStoredUser = (user: StoredUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  dispatchAuthChange()
}

export const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  dispatchAuthChange()
}
