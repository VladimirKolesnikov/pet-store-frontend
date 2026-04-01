import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

interface RefreshResponse {
  accessToken: string;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const addAccessTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');

  if (config.headers && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

const refreshTokensInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as CustomAxiosRequestConfig;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const res = await axios.get<RefreshResponse>(
        "http://localhost:3000/auth/refresh",
        { withCredentials: true }
      );

      const newAccessToken = res.data?.accessToken;
      localStorage.setItem("accessToken", newAccessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event('logout')) // it is better to use a redirect
    }
  }

  return Promise.reject(error);
};

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(addAccessTokenInterceptor);
apiClient.interceptors.response.use(
  (response) => response,
  refreshTokensInterceptor
);

export default apiClient;