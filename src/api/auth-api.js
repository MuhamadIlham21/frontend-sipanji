import apiClient from './axios'

export const authApi = {
  login(cretentials) {
    return apiClient.post('/auth/login-inpassing', cretentials)
  },
  loginUserInstansi(cretentials) {
    return apiClient.post('/auth/login-instansi', cretentials)
  },
}
