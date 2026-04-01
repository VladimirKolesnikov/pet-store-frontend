
import apiClient from "./apiClient";

interface RegisterResponse {
  accessToken: string;
}

interface LoginResponse {
  accessToken: string;
}


export const register = async ({ email, password }: any) => {
  const response = await apiClient.post<RegisterResponse>("auth/register", {
    email,
    password,
  });

  localStorage.setItem('accessToken', response.data.accessToken);
}

export const login = async ({ email, password }: any) => {
  console.log('1')
  const response = await apiClient.post<LoginResponse>("auth/login", {
    email,
    password,
  });
  console.log('2')

  localStorage.setItem('accessToken', response.data.accessToken);
  console.log('3')
}

export const logout = async () => {
  await apiClient.get("auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  // How to notify the AuthProvider that the user is logged out?
}

export const me = async () => {
  const response = await apiClient.get("auth/me");
  return response.data;
}
