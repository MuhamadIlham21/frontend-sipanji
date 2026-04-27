import apiClient from './axios'

export const authApi = {
  login(credentials) {
    return apiClient.post('/auth/login', credentials) // fix endpoint
  },
  loginUserInstansi(cretentials) {
    return apiClient.post('/auth/login-instansi', cretentials)
  },
}
