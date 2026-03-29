import axios from 'axios'

// Base API URL - dynamically determine if we're on Replit or local
const isReplit = typeof window !== 'undefined' && window.location.hostname.includes('replit');
export const API_URL = isReplit 
  ? `https://${window.location.hostname.replace('5000', '3000')}/api`
  : 'http://localhost:3000/api';

// Explicitly log the API URL for debugging
console.log('API_URL being used:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Categories
export const getCategories = () => {
  return api.get('/categories')
}

// Products
export const getProducts = (url) => {
  // If full URL is provided, use that instead of appending to base URL
  if (url && url.startsWith('http')) {
    return axios.get(url)
  }
  return api.get(url || '/products')
}

export const getProductBySlug = (slug) => {
  return api.get(`/products/${slug}`)
}

export const getFeaturedProducts = () => {
  return api.get('/products?featured=true')
}

export const searchProducts = (query) => {
  return api.get(`/products?search=${query}`)
}

// Cart
export const getCartItems = (sessionId) => {
  const params = sessionId ? { session_id: sessionId } : {}
  return api.get('/cart', { params })
}

export const addToCart = (item, sessionId) => {
  const data = { ...item, session_id: sessionId }
  return api.post('/cart', data)
}

export const updateCartItem = (itemId, quantity, sessionId) => {
  return api.put(`/cart/${itemId}`, { quantity })
}

export const removeFromCart = (itemId, sessionId) => {
  return api.delete(`/cart/${itemId}`)
}

export const clearCart = (sessionId) => {
  return api.delete('/cart', { params: { session_id: sessionId } })
}

// Orders
export const getOrders = () => {
  return api.get('/orders')
}

export const getOrderById = (orderId) => {
  return api.get(`/orders/${orderId}`)
}

export const createOrder = (orderData) => {
  return api.post('/orders', orderData)
}

// Authentication
export const login = (credentials) => {
  return api.post('/auth/login', credentials)
}

export const register = (userData) => {
  return api.post('/auth/register', userData)
}

export const updateProfile = (userData) => {
  return api.put('/auth/user', userData)
}

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
