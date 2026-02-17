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
