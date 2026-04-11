import React, { createContext, useContext, useState, useEffect } from 'react'
import { getSessionId } from '../lib/utils'
import * as api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const sessionId = getSessionId()

  // Load cart items on initial render and when auth state changes
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setIsLoading(true)
        let response
        
        if (isAuthenticated) {
          response = await api.getCartItems()
        } else {
          response = await api.getCartItems(sessionId)
        }
        
        setCartItems(response.data)
      } catch (error) {
        console.error('Failed to fetch cart items', error)
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
    } catch (error) {
      console.error('Failed to add item to cart', error)
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
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
    } catch (error) {
      console.error('Failed to update cart item', error)
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        await api.removeFromCart(itemId)
      } else {
        await api.removeFromCart(itemId, sessionId)
      }
      
      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== itemId)
      )
    } catch (error) {
      console.error('Failed to remove item from cart', error)
    }
  }

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await api.clearCart()
      } else {
        await api.clearCart(sessionId)
      }
      
      setCartItems([])
    } catch (error) {
      console.error('Failed to clear cart', error)
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
