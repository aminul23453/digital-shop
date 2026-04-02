import axios from 'axios'

// Base API URL - dynamically determine if we're on Replit or local
const isReplit =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('replit')

export const API_URL = isReplit
  ? `https://${window.location.hostname.replace('5000', '3000')}/api`
  : 'http://localhost:3000/api'

// Explicitly log the API URL for debugging
console.log('API_URL being used:', API_URL)

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Categories
export const getCategories = () => api.get('/categories')

// Products
export const getProducts = (url) =>
  url && url.startsWith('http')
    ? axios.get(url)
    : api.get(url || '/products')

export const getProductBySlug   = (slug) => api.get(`/products/${slug}`)
export const getFeaturedProducts = () => api.get('/products?featured=true')
export const searchProducts      = (q)    => api.get(`/products?search=${q}`)

// Cart
export const getCartItems    = (sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {}
  return api.get('/cart', { params })
}
export const addToCart       = (item, sessionId) => {
  const data = { ...item, session_id: sessionId }
  return api.post('/cart', data)
}
export const updateCartItem  = (itemId, quantity, sessionId) =>
  api.put(`/cart/${itemId}`, { quantity })
export const removeFromCart  = (itemId, sessionId) =>
  api.delete(`/cart/${itemId}`)
export const clearCart       = (sessionId) =>
  api.delete('/cart', { params: { session_id: sessionId } })

// ← NEW: merge anonymous cart into authenticated user’s cart
export const mergeCart = (sessionId) =>
  api.post('/cart/merge', { session_id: sessionId })

// Orders
export const getOrders    = ()      => api.get('/orders')
export const getOrderById = (id)    => api.get(`/orders/${id}`)
export const createOrder  = (data)  => api.post('/orders', data)

// Auth
export const login        = (creds) => api.post('/auth/login', creds)
export const register     = (u)     => api.post('/auth/register', u)
export const updateProfile = (u)    => api.put('/auth/user', u)

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for API calls
api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    err.message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      'Something went wrong'
    return Promise.reject(err)
  }
)

export default api
