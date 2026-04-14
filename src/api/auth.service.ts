import apiClient from './apiClient'
import { clearAuthStorage, setAccessToken, type StoredUser } from '../utils/storage'

interface LoginResponse {
  access_token: string
}

export const register = async ({ email, password }: { email: string; password: string }) => {
  await apiClient.post('auth/register', {
    email,
    password,
  })
}

export const login = async ({ email, password }: { email: string; password: string }) => {
  const response = await apiClient.post<LoginResponse>('auth/login', {
    email,
    password,
  })

  setAccessToken(response.data.access_token)
}

export const logout = async () => {
  await apiClient.post('auth/logout')
  clearAuthStorage()
}

export const me = async () => {
  const response = await apiClient.get<StoredUser>('auth/me')
  return response.data
}
