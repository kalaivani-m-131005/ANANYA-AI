/* ============================================================
   ANANYA-AI — Axios API Client
   Centralised HTTP client for all API communication.
   Backend URL is configured via VITE_API_URL environment variable.
   ============================================================ */

import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

// ── Base Configuration ─────────────────────────────────────────
const BASE_URL = import.meta.env['VITE_API_URL'] as string ?? 'http://localhost:5000/api'

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Support cookie-based sessions when backend enables them
})

// ── Request Interceptor ────────────────────────────────────────
// Attaches the stored JWT access token to every outgoing request.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('ananya_access_token')
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error),
)

// ── Response Interceptor ───────────────────────────────────────
// Handles global error cases: 401 (token expired), 403, 500.
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status

      if (status === 401) {
        // Access token expired — clear local storage and redirect to login.
        // Phase 3 will replace this with a token refresh flow.
        localStorage.removeItem('ananya_access_token')
        window.location.href = '/login'
      }

      if (status === 403) {
        console.warn('[ANANYA-AI] 403 Forbidden — insufficient permissions.')
      }

      if (status && status >= 500) {
        console.error('[ANANYA-AI] Server error:', error.response?.data)
      }
    }

    return Promise.reject(error)
  },
)

export default api
