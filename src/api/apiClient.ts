import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import {
  clearAuthStorage,
  getAccessToken,
  setAccessToken,
} from '../utils/storage'

interface RefreshResponse {
  access_token: string
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const addAccessTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()

  if (config.headers && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}

const refreshTokensInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as CustomAxiosRequestConfig

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    try {
      const res = await axios.post<RefreshResponse>(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )

      const newAccessToken = res.data.access_token
      setAccessToken(newAccessToken)

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      }

      return apiClient(originalRequest)
    } catch {
      clearAuthStorage()
    }
  }

  return Promise.reject(error)
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(addAccessTokenInterceptor)
apiClient.interceptors.response.use(
  (response) => response,
  refreshTokensInterceptor
)

export default apiClient
