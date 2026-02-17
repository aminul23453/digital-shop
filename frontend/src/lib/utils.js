import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class name strings with Tailwind CSS merging
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format price to currency string
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

/**
 * Generate a unique session ID for anonymous users
 */
export function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15)
}

/**
 * Get session ID from localStorage or create a new one
 */
export function getSessionId() {
  let sessionId = localStorage.getItem('sessionId')
  
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('sessionId', sessionId)
  }
  
  return sessionId
}

/**
 * Calculate sustainability label from rating
 */
export function getSustainabilityLabel(rating) {
  const labels = {
    0: 'Not Rated',
    1: 'Low Impact',
    2: 'Medium Impact',
    3: 'Eco-Friendly',
    4: 'Sustainable',
    5: 'Highly Sustainable',
  }
  
  return labels[rating] || 'Not Rated'
}

/**
 * Get color for sustainability badge
 */
export function getSustainabilityColor(rating) {
  const colors = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-indigo-100 text-indigo-800',
    3: 'bg-emerald-100 text-emerald-800',
    4: 'bg-green-100 text-green-800',
    5: 'bg-green-100 text-green-800 border-2 border-green-500',
  }
  
  return colors[rating] || 'bg-gray-100 text-gray-800'
}
