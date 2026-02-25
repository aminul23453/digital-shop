import axios from 'axios'

// Base API URL - dynamically determine if we're on Replit or local
const isReplit = typeof window !== 'undefined' && window.location.hostname.includes('replit');
export const API_URL = isReplit 
  ? `https://${window.location.hostname.replace('5000', '8000')}/api`
  : 'http://localhost:8000/api';

console.log('API_URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Categories
export const getCategories = () => {
  return api.get('/categories/')
}

// Products
export const getProducts = (url) => {
  // If full URL is provided, use that instead of appending to base URL
  if (url && url.startsWith('http')) {
    return axios.get(url)
  }
  return api.get(url || '/products/')
}

export const getProductBySlug = (slug) => {
  return api.get(`/products/${slug}/`)
}

export const getFeaturedProducts = () => {
  return api.get('/products/?featured=true')
}

export const searchProducts = (query) => {
  return api.get(`/products/?search=${query}`)
}

// Cart
export const getCartItems = (sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {}
  return api.get('/cart/', { params })
}

export const addToCart = (item, sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {}
  return api.post('/cart/', item, { params })
}

export const updateCartItem = (itemId, quantity, sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {}
  return api.patch(`/cart/${itemId}/`, { quantity }, { params })
}

export const removeFromCart = (itemId, sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {}
  return api.delete(`/cart/${itemId}/`, { params })
}

export const clearCart = (sessionId) => {
  // Clear cart by removing each item
  return getCartItems(sessionId)
    .then((response) => {
      const items = response.data
      const deletePromises = items.map(item => removeFromCart(item.id, sessionId))
      return Promise.all(deletePromises)
    })
}

export const mergeCart = (sessionId) => {
  return api.post('/merge-cart/', { session_id: sessionId })
}

// Orders
export const getOrders = () => {
  return api.get('/orders/')
}

export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}/`)
}

export const createOrder = (orderData) => {
  return api.post('/checkout/', orderData)
}

// Authentication
export const login = (credentials) => {
  return api.post('/login/', credentials)
}

export const register = (userData) => {
  return api.post('/register/', userData)
}

export const updateProfile = (userData) => {
  return api.patch('/user/', userData)
}

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user')
    if (user) {
      // We're not using JWT tokens in this app, but if we were:
      // config.headers.Authorization = `Bearer ${JSON.parse(user).token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Something went wrong'
    
    error.message = message
    return Promise.reject(error)
  }
)

export default api
