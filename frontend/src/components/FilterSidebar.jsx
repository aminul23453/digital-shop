import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger, 
} from './ui/accordion'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select'
import { Badge } from './ui/badge'
import { Slider } from './ui/slider'
import { CheckCircle2, CircleX, Filter, FilterX, SlidersHorizontal } from 'lucide-react'

// Importing Accordion component
const AccordionUI = ({ title, children, defaultValue = "item-1" }) => (
  <Accordion type="single" collapsible defaultValue={defaultValue}>
    <AccordionItem value="item-1">
      <AccordionTrigger className="text-base font-medium">{title}</AccordionTrigger>
      <AccordionContent>{children}</AccordionContent>
    </AccordionItem>
  </Accordion>
)

const FilterSidebar = ({ categories, onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedSustainability, setSelectedSustainability] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('min_price') || 0
    const maxPrice = searchParams.get('max_price') || 200
    const sustainability = searchParams.get('sustainability') || ''
    
    setSelectedCategory(category)
    setPriceRange([parseInt(minPrice), parseInt(maxPrice)])
    setSelectedSustainability(sustainability)
  }, [searchParams])
  
  const handlePriceChange = (value) => {
    setPriceRange(value)
  }
  
  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
    
    if (value) {
      searchParams.set('category', value)
    } else {
      searchParams.delete('category')
    }
    
    setSearchParams(searchParams)
    onFilterChange()
  }
  
  const handleSustainabilityChange = (value) => {
    setSelectedSustainability(value)
    
    if (value) {
      searchParams.set('sustainability', value)
    } else {
      searchParams.delete('sustainability')
    }
    
    setSearchParams(searchParams)
    onFilterChange()
  }
  
  const applyPriceFilter = () => {
    searchParams.set('min_price', priceRange[0])
    searchParams.set('max_price', priceRange[1])
    setSearchParams(searchParams)
    onFilterChange()
  }
  
  const clearAllFilters = () => {
    setSelectedCategory('')
    setPriceRange([0, 200])
    setSelectedSustainability('')
    setSearchParams({})
    onFilterChange()
  }
  
  const hasActiveFilters = 
    selectedCategory || 
    selectedSustainability || 
    priceRange[0] > 0 || 
    priceRange[1] < 200
  
  // Mobile filter drawer content
  const filterContent = (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => clearAllFilters()}
          disabled={!hasActiveFilters}
        >
          <FilterX className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="space-y-6 flex-1 overflow-auto">
        <AccordionUI title="Categories" defaultValue="item-1">
          <div className="space-y-2">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => handleCategoryChange('')}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </AccordionUI>
        
        <AccordionUI title="Price Range" defaultValue="item-1">
          <div className="space-y-4">
            <div className="pt-4">
              <Slider
                defaultValue={[0, 200]}
                value={priceRange}
                min={0}
                max={200}
                step={10}
                onValueChange={handlePriceChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="border rounded-md px-3 py-1">
                ${priceRange[0]}
              </div>
              <div className="border rounded-md px-3 py-1">
                ${priceRange[1]}
              </div>
            </div>
            <Button 
              size="sm" 
              className="w-full"
              onClick={applyPriceFilter}
            >
              Apply Price Filter
            </Button>
          </div>
        </AccordionUI>
        
        <AccordionUI title="Sustainability" defaultValue="item-1">
          <div className="space-y-2">
            <Select 
              value={selectedSustainability} 
              onValueChange={handleSustainabilityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Rating</SelectItem>
                <SelectItem value="1">Low Impact & Above</SelectItem>
                <SelectItem value="2">Medium Impact & Above</SelectItem>
                <SelectItem value="3">Eco-Friendly & Above</SelectItem>
                <SelectItem value="4">Sustainable & Above</SelectItem>
                <SelectItem value="5">Highly Sustainable Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionUI>
      </div>
      
      {/* Apply button for mobile */}
      <div className="mt-auto pt-4 border-t md:hidden">
        <Button 
          className="w-full" 
          onClick={() => setShowMobileFilters(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
  
  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowMobileFilters(true)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filter Products
          {hasActiveFilters && (
            <Badge className="ml-2 bg-primary text-primary-foreground" variant="secondary">
              Active
            </Badge>
          )}
        </Button>
        
        {/* Mobile filter overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-background z-50">
            <div className="container mx-auto px-4 py-4 h-full flex flex-col">
              {filterContent}
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden md:block sticky top-20 w-full">
        {filterContent}
      </div>
    </>
  )
}

export default FilterSidebar
