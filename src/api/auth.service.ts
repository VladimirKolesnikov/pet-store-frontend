import apiClient from './apiClient'
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from '../utils/storage'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

export const login = async (credentials: any): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
  const { accessToken, refreshToken } = response.data
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
  return response.data
}

export const register = async (userData: any): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    '/auth/signup',
    userData
  )
  const { accessToken, refreshToken } = response.data
  setAccessToken(accessToken)
  setRefreshToken(refreshToken)
  return response.data
}

export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    clearTokens()
    window.location.href = '/login'
  }
}
