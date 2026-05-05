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
        const userData = JSON.parse(storedUser)
        setUser(userData)
        // Ensure token is in localStorage for API interceptor
        if (userData.token && !localStorage.getItem('token')) {
          localStorage.setItem('token', userData.token)
        }
      } catch (error) {
        console.error('Failed to parse user data', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
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
      // Store token separately for API interceptor
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
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
      // Registration returns user + token, so set them directly
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
      // Store token separately for API interceptor
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
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
    localStorage.removeItem('token')
  }

  const updateProfile = async (userData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.updateProfile(userData)
      // Merge updated data with existing user (preserve token)
      const updatedUser = { ...user, ...response.data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
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