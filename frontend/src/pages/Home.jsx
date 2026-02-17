import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as api from '../services/api'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { ArrowLeft, ArrowRight, Leaf } from 'lucide-react'

const Home = () => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [nextPage, setNextPage] = useState(null)
  const [prevPage, setPrevPage] = useState(null)
  
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchParams])

  const fetchProducts = async (url) => {
    setLoading(true)
    try {
      // Build URL with query params if not paginating
      const endpoint = url || `${api.API_URL}/products/?${searchParams.toString()}`
      const response = await api.getProducts(endpoint)
      
      setProducts(response.data.results)
      setNextPage(response.data.next)
      setPrevPage(response.data.previous)
    } catch (error) {
      console.error('Failed to fetch products', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories()
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories', error)
    }
  }

  const handlePageChange = (url) => {
    if (url) {
      fetchProducts(url)
      window.scrollTo(0, 0)
    }
  }

  const handleFilterChange = () => {
    fetchProducts()
  }

  const featuredParam = searchParams.get('featured')
  const categoryParam = searchParams.get('category')
  const searchQuery = searchParams.get('search')
  
  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results: "${searchQuery}"`
    } else if (featuredParam === 'true') {
      return 'Featured Collection'
    } else if (categoryParam) {
      const category = categories.find(c => c.slug === categoryParam)
      return category ? category.name : 'Products'
    } else {
      return 'All Products'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      {/* Hero section for homepage */}
      {!searchQuery && !featuredParam && !categoryParam && (
        <div className="mb-10 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-900">
                Sustainable Fashion for a Better World
              </h1>
              <p className="text-emerald-700 mb-6">
                Discover our collection of eco-friendly clothing that doesn't compromise on style or quality.
                Every piece is ethically made with sustainable materials to reduce environmental impact.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Shop Collection
                </Button>
                <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-700">
                  Our Materials
                </Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-100 flex items-center justify-center">
                <Leaf className="h-12 w-12 md:h-16 md:w-16 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="md:w-1/4">
          <FilterSidebar 
            categories={categories} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        {/* Main content */}
        <div className="md:w-3/4">
          <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-1/3 mb-3" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {(nextPage || prevPage) && (
                <div className="flex justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(prevPage)}
                    disabled={!prevPage}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(nextPage)}
                    disabled={!nextPage}
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                onClick={() => {
                  // Reset search params and fetch all products
                  window.location.href = '/'
                }}
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
