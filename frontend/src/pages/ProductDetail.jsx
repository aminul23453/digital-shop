import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as api from '../services/api'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Badge } from '../components/ui/badge'
import { 
  BarChart, 
  ChevronLeft, 
  Leaf, 
  Recycle, 
  ShoppingBag, 
  Truck, 
  WaterDrop 
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice, getSustainabilityLabel, getSustainabilityColor } from '../lib/utils'

const ProductDetail = () => {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const response = await api.getProductBySlug(slug)
        setProduct(response.data)
        
        // Set default variant if available
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0])
          setSelectedSize(response.data.variants[0].size)
          setSelectedColor(response.data.variants[0].color)
        }
      } catch (error) {
        console.error('Failed to fetch product', error)
        setError('Failed to load product. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  // Get unique sizes and colors from variants
  const getUniqueSizes = () => {
    if (!product || !product.variants || product.variants.length === 0) return []
    return [...new Set(product.variants.map(v => v.size))]
  }

  const getUniqueColors = () => {
    if (!product || !product.variants || product.variants.length === 0) return []
    
    // If size is selected, filter colors by the selected size
    if (selectedSize) {
      const variantsWithSelectedSize = product.variants.filter(v => v.size === selectedSize)
      return [...new Set(variantsWithSelectedSize.map(v => v.color))]
    }
    
    return [...new Set(product.variants.map(v => v.color))]
  }

  // Update selected variant when size or color changes
  useEffect(() => {
    if (product && product.variants && selectedSize && selectedColor) {
      const variant = product.variants.find(
        v => v.size === selectedSize && v.color === selectedColor
      )
      setSelectedVariant(variant || null)
    }
  }, [selectedSize, selectedColor, product])

  const handleSizeChange = (size) => {
    setSelectedSize(size)
    
    // Reset color if the new size doesn't have the currently selected color
    const variantsWithSelectedSize = product.variants.filter(v => v.size === size)
    const colorsForSize = [...new Set(variantsWithSelectedSize.map(v => v.color))]
    
    if (!colorsForSize.includes(selectedColor)) {
      setSelectedColor(colorsForSize[0] || '')
    }
  }

  const handleAddToCart = () => {
    addToCart({
      product: product.id,
      variant: selectedVariant?.id || null,
      quantity
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-8 w-1/3 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="p-8 rounded-lg border border-destructive/20 bg-destructive/5">
          <h2 className="text-2xl font-semibold mb-4">Error Loading Product</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild variant="outline">
            <Link to="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="rounded-lg overflow-hidden border bg-white aspect-square">
            <img 
              src={selectedVariant?.image_url || product.image_url} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <Link to={`/?category=${product.category}`} className="text-sm text-muted-foreground hover:underline">
              {product.category_name}
            </Link>
            
            {product.sustainability_rating > 0 && (
              <Badge className={getSustainabilityColor(product.sustainability_rating)}>
                {getSustainabilityLabel(product.sustainability_rating)}
              </Badge>
            )}
            
            {product.is_featured && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Featured
              </Badge>
            )}
          </div>
          
          <div className="text-xl font-bold mb-6">
            {product.discount_price ? (
              <div className="flex items-center">
                <span className="text-destructive">{formatPrice(product.discount_price)}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>
          
          <div className="prose prose-sm mb-6 text-muted-foreground">
            <p>{product.description}</p>
          </div>
          
          {product.materials && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Materials:</h3>
              <p className="text-sm text-muted-foreground">{product.materials}</p>
            </div>
          )}
          
          {/* Sustainability features */}
          {product.sustainability_rating > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="flex items-center bg-green-50 p-2 rounded-md">
                <Leaf className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-xs">Eco-friendly</span>
              </div>
              <div className="flex items-center bg-blue-50 p-2 rounded-md">
                <WaterDrop className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-xs">Water-saving</span>
              </div>
              <div className="flex items-center bg-amber-50 p-2 rounded-md">
                <Recycle className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-xs">Recyclable</span>
              </div>
              <div className="flex items-center bg-purple-50 p-2 rounded-md">
                <BarChart className="h-4 w-4 text-purple-600 mr-2" />
                <span className="text-xs">Low carbon footprint</span>
              </div>
            </div>
          )}
          
          {/* Variants selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 mb-6">
              {/* Size selector */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Size:
                </label>
                <Select value={selectedSize} onValueChange={handleSizeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {getUniqueSizes().map(size => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Color selector */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Color:
                </label>
                <Select 
                  value={selectedColor} 
                  onValueChange={setSelectedColor}
                  disabled={!selectedSize}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {getUniqueColors().map(color => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Quantity selector */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quantity:
                </label>
                <Select 
                  value={quantity.toString()} 
                  onValueChange={(value) => setQuantity(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(10)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Stock status */}
              {selectedVariant && (
                <div className="text-sm">
                  {selectedVariant.stock > 0 ? (
                    <span className="text-green-600">
                      In stock: {selectedVariant.stock} available
                    </span>
                  ) : (
                    <span className="text-destructive">Out of stock</span>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Add to cart button */}
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleAddToCart}
            disabled={
              (product.variants && product.variants.length > 0 && 
               (!selectedVariant || selectedVariant.stock <= 0)) || 
              product.inventory <= 0
            }
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          
          {/* Shipping info */}
          <div className="mt-6 p-4 rounded-lg border bg-background/50">
            <div className="flex items-center text-sm mb-2">
              <Truck className="h-4 w-4 mr-2" />
              <span>Free shipping on orders over $75</span>
            </div>
            <div className="text-xs text-muted-foreground">
              This product usually ships within 1-2 business days
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
