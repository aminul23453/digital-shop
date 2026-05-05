import React, { createContext, useContext, useState, useEffect } from 'react'
import { getSessionId } from '../lib/utils'
import * as api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, isAuthenticated } = useAuth()
  const sessionId = getSessionId()

  // Load cart items on initial render and when auth state changes
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true)
        setError(null)
        let response

        if (isAuthenticated) {
          response = await api.getCartItems()
        } else {
          response = await api.getCartItems(sessionId)
        }

        setCartItems(response.data)
      } catch (error) {
        console.error('Failed to fetch cart items', error)
        setError(error.response?.data?.error || 'Failed to load cart')
        setCartItems([]) // Reset to empty on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItems()
  }, [isAuthenticated, user])

  // Merge anonymous cart with user cart on login
  useEffect(() => {
    const mergeCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.mergeCart(sessionId)
          setCartItems(response.data)
        } catch (error) {
          console.error('Failed to merge cart', error)
        }
      }
    }
    
    if (isAuthenticated && sessionId) {
      mergeCart()
    }
  }, [isAuthenticated])

  const addToCart = async (item) => {
    try {
      setError(null)
      let response

      if (isAuthenticated) {
        response = await api.addToCart(item)
      } else {
        response = await api.addToCart(item, sessionId)
      }

      setCartItems(prevItems => {
        // Check if item already exists
        const existingItemIndex = prevItems.findIndex(i =>
          i.product === item.product &&
          (item.variant ? i.variant === item.variant : !i.variant)
        )

        if (existingItemIndex >= 0) {
          // Update existing item
          return prevItems.map((i, index) =>
            index === existingItemIndex
              ? response.data
              : i
          )
        } else {
          // Add new item
          return [...prevItems, response.data]
        }
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to add item to cart', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to add item to cart'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      setError(null)
      let response

      if (isAuthenticated) {
        response = await api.updateCartItem(itemId, quantity)
      } else {
        response = await api.updateCartItem(itemId, quantity, sessionId)
      }

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? response.data : item
        )
      )

      return { success: true }
    } catch (error) {
      console.error('Failed to update cart item', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to update item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      setError(null)

      if (isAuthenticated) {
        await api.removeFromCart(itemId)
      } else {
        await api.removeFromCart(itemId, sessionId)
      }

      setCartItems(prevItems =>
        prevItems.filter(item => item.id !== itemId)
      )

      return { success: true }
    } catch (error) {
      console.error('Failed to remove item from cart', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to remove item'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const clearCart = async () => {
    try {
      setError(null)

      if (isAuthenticated) {
        await api.clearCart()
      } else {
        await api.clearCart(sessionId)
      }

      setCartItems([])

      return { success: true }
    } catch (error) {
      console.error('Failed to clear cart', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'Failed to clear cart'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.total_price, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}