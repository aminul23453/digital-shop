import React, { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if user is already logged in on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse user data', error)
        localStorage.removeItem('user')
      }
    }
    setIsInitialized(true)
  }, [])

  const login = async (credentials) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.login(credentials)
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        'Login failed. Please check your credentials and try again.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.register(userData)
      // Auto login after registration
      await login({
        username: userData.username,
        password: userData.password
      })
      return response.data
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        'Registration failed. Please try again.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = async (userData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.updateProfile(userData)
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      const errorMessage = 
        error.response?.data?.error || 
        'Failed to update profile. Please try again.'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isInitialized,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


// src/context/CartContext.jsx

// import React, { createContext, useContext, useState, useEffect } from 'react'
// import { getSessionId } from '../lib/utils'
// import * as api from '../services/api'
// import { useAuth } from './AuthContext'

// const CartContext = createContext()

// /**
//  * Named export for the hook—Fast Refresh–friendly
//  */
// export function useCart() {
//   return useContext(CartContext)
// }

// /**
//  * Named export for the provider—Fast Refresh–friendly
//  */
// export function CartProvider({ children }) {
//   const [cartItems, setCartItems] = useState([])
//   const [isLoading, setIsLoading] = useState(true)
//   const { isAuthenticated } = useAuth()
//   const sessionId = getSessionId()

//   // Load or reload cart when auth changes
//   useEffect(() => {
//     async function fetchCart() {
//       setIsLoading(true)
//       try {
//         const response = isAuthenticated
//           ? await api.getCartItems()
//           : await api.getCartItems(sessionId)
//         setCartItems(response.data)
//       } catch (err) {
//         console.error('Failed to fetch cart', err)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     fetchCart()
//   }, [isAuthenticated, sessionId])

//   // Merge guest cart on login
//   useEffect(() => {
//     async function merge() {
//       if (isAuthenticated && sessionId) {
//         try {
//           const response = await api.mergeCart(sessionId)
//           setCartItems(response.data)
//         } catch (err) {
//           console.error('Failed to merge cart', err)
//         }
//       }
//     }
//     merge()
//   }, [isAuthenticated, sessionId])

//   async function addToCart(item) {
//     try {
//       const response = isAuthenticated
//         ? await api.addToCart(item)
//         : await api.addToCart(item, sessionId)

//       setCartItems(prev => {
//         const idx = prev.findIndex(i =>
//           i.product === item.product &&
//           (item.variant ? i.variant === item.variant : !i.variant)
//         )
//         if (idx >= 0) {
//           return prev.map((i, j) => (j === idx ? response.data : i))
//         }
//         return [...prev, response.data]
//       })
//     } catch (err) {
//       console.error('Failed to add to cart', err)
//     }
//   }

//   async function updateCartItem(itemId, quantity) {
//     try {
//       const response = isAuthenticated
//         ? await api.updateCartItem(itemId, quantity)
//         : await api.updateCartItem(itemId, quantity, sessionId)
//       setCartItems(prev =>
//         prev.map(item => (item.id === itemId ? response.data : item))
//       )
//     } catch (err) {
//       console.error('Failed to update cart item', err)
//     }
//   }

//   async function removeFromCart(itemId) {
//     try {
//       if (isAuthenticated) {
//         await api.removeFromCart(itemId)
//       } else {
//         await api.removeFromCart(itemId, sessionId)
//       }
//       setCartItems(prev => prev.filter(item => item.id !== itemId))
//     } catch (err) {
//       console.error('Failed to remove from cart', err)
//     }
//   }

//   async function clearCart() {
//     try {
//       if (isAuthenticated) {
//         await api.clearCart()
//       } else {
//         await api.clearCart(sessionId)
//       }
//       setCartItems([])
//     } catch (err) {
//       console.error('Failed to clear cart', err)
//     }
//   }

//   function calculateTotal() {
//     return cartItems.reduce((sum, item) => sum + item.total_price, 0)
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         isLoading,
//         addToCart,
//         updateCartItem,
//         removeFromCart,
//         clearCart,
//         calculateTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export default CartProvider
