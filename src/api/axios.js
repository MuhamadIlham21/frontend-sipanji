import axios from 'axios'

// Validate base URL
const getBaseURL = () => {
  const url = import.meta.env.VITE_API_BASE_URL
  if (!url && import.meta.env.MODE === 'production') {
    console.error('VITE_API_BASE_URL not configured in production!')
  }
  return url || 'https://si-panji.id/api'
}

// Create axios instance
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  // withCredentials: true,
  // xsrfCookieName: 'XSRF-TOKEN',
  // xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Track refresh token promise to prevent concurrent refresh requests
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Check token expiry and refresh preemptively
    const tokenExpiry = localStorage.getItem('token_expiry')
    if (tokenExpiry) {
      const expiryTime = new Date(tokenExpiry).getTime()
      const currentTime = new Date().getTime()
      const timeUntilExpiry = expiryTime - currentTime

      // Warn if token expires in less than 5 minutes
      if (timeUntilExpiry < 300000 && timeUntilExpiry > 0) {
        const minutesRemaining = Math.floor(timeUntilExpiry / 60000)
        console.warn(`[API] Token expiring in ${minutesRemaining} minutes`)
      }
    }

    // Logging in development mode
    if (import.meta.env.MODE === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === 'development') {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data,
      )
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Initialize retry count for network/timeout errors
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0
    }

    const maxRetries = 3
    const isTimeoutError = error.code === 'ECONNABORTED' && error.message.includes('timeout')
    const isNetworkError = !error.response && error.code === 'ERR_NETWORK'

    // Retry logic for timeout and network errors
    if ((isTimeoutError || isNetworkError) && originalRequest._retryCount < maxRetries) {
      originalRequest._retryCount++

      const delay = Math.pow(2, originalRequest._retryCount) * 1000
      console.warn(
        `[API] Retrying request (${originalRequest._retryCount}/${maxRetries}) after ${delay}ms...`,
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
      return apiClient(originalRequest)
    }

    // Handle 401 Unauthorized with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refresh_token')

      if (!refreshToken) {
        handleLogout()
        return Promise.reject(error)
      }

      // Handle concurrent refresh requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      isRefreshing = true

      try {
        const response = await axios.post(`${getBaseURL()}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const responseData = response.data.data || response.data
        const newAccessToken = responseData.access_token
        const expiresIn = responseData.expires_in

        const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

        localStorage.setItem('auth_token', newAccessToken)
        localStorage.setItem('token_expiry', expiresAt)
        localStorage.setItem('expires_in', expiresIn.toString())

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`

        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        handleLogout()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Handle other HTTP errors
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.message

      if (import.meta.env.MODE === 'development') {
        console.error(`[API Error ${status}]`, {
          url: error.config?.url,
          method: error.config?.method,
          message,
          data: error.response.data,
        })
      }

      switch (status) {
        case 403:
          console.error('[API] Forbidden: You do not have permission')
          break
        case 404:
          console.error('[API] Not Found:', error.config?.url)
          break
        case 500:
        case 502:
        case 503:
          console.error('[API] Server Error:', message)
          break
        default:
          break
      }
    }

    return Promise.reject(error)
  },
)

// Helper function to handle logout
const handleLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('token_expiry')
  localStorage.removeItem('expires_in')
  localStorage.removeItem('auth_user')
  localStorage.removeItem('user_role')
  localStorage.removeItem('user_id')

  delete apiClient.defaults.headers.common.Authorization

  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

// Optional: Add method to manually refresh token
apiClient.refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await axios.post(`${getBaseURL()}/auth/refresh`, {
    refresh_token: refreshToken,
  })

  const responseData = response.data.data || response.data
  const newAccessToken = responseData.access_token
  const expiresIn = responseData.expires_in
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

  localStorage.setItem('auth_token', newAccessToken)
  localStorage.setItem('token_expiry', expiresAt)
  localStorage.setItem('expires_in', expiresIn.toString())

  return newAccessToken
}

export default apiClient
