import axios from 'axios'

// Base API URL - dynamically determine if we're on Replit or local
const isReplit =
  typeof window !== 'undefined' &&
  window.location.hostname.includes('replit')

export const API_URL = isReplit
  ? `https://${window.location.hostname.replace('5000', '8000')}/api` // Assuming replit proxy maps 8000 to your service
  : 'http://localhost:8000/api' // Django runs on 8000

// Explicitly log the API URL for debugging
console.log('API_URL being used:', API_URL)

// Create axios instance
const api = axios.create({
  baseURL: API_URL, // API_URL already ends with /api, so paths below should be relative to that
  headers: { 'Content-Type': 'application/json' },
})

// Categories
export const getCategories = () => api.get('/categories/') // Added slash

// Products
export const getProducts = (url) =>
  url && url.startsWith('http') // For fetching next/prev paginated URLs directly
    ? axios.get(url)
    : api.get(url || '/products/') // Added slash for default /products

export const getProductBySlug   = (slug) => api.get(`/products/${slug}/`) // Added slash
export const getFeaturedProducts = () => api.get('/products/?featured=true') // Slash before query
export const searchProducts      = (q)    => api.get(`/products/?search=${q}`) // Slash before query

// Cart
export const getCartItems    = (sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {}
  return api.get('/cart/', { params }) // Added slash
}
export const addToCart       = (item, sessionId) => {
  const data = { ...item, session_id: sessionId }
  return api.post('/cart/', data) // Added slash
}
export const updateCartItem  = (itemId, quantity, sessionId) => // sessionId not used here by backend
  api.put(`/cart/${itemId}/`, { quantity }) // Added slash
export const removeFromCart  = (itemId, sessionId) => // sessionId not used here by backend
  api.delete(`/cart/${itemId}/`) // Added slash

// For CartItemViewSet's @action clear_cart, URL is typically /api/cart/clear/
export const clearCart       = (sessionId) =>
  api.delete('/cart/clear/', { params: { session_id: sessionId } }) // MODIFIED PATH and added slash

export const mergeCart = (sessionId) =>
  api.post('/cart/merge/', { session_id: sessionId }) // Added slash

// Orders
export const getOrders    = ()      => api.get('/orders/') // Added slash
export const getOrderById = (id)    => api.get(`/orders/${id}/`) // Added slash

// CHOOSE ONE FOR createOrder:
// Option A: Point to Django's /checkout/ endpoint
export const createOrder  = (data)  => api.post('/checkout/', data) // Pointing to Django's custom order view
// Option B: (If you modify Django's OrderViewSet to handle creation at /orders/)
// export const createOrder  = (data)  => api.post('/orders/', data) // Added slash

// Auth
export const login        = (creds) => api.post('/auth/login/', creds)    // Added slash
export const register     = (u)     => api.post('/auth/register/', u)   // Added slash
export const updateProfile = (u)    => api.put('/auth/user/', u)      // Added slash

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}` // This is correct for SimpleJWT
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
      err.response?.data?.detail || // DRF often uses 'detail' for errors
      'Something went wrong'
    return Promise.reject(err)
  }
)

export default api
