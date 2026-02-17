import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice, getSustainabilityLabel, getSustainabilityColor } from '../lib/utils'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart({
      product: product.id,
      quantity: 1
    })
  }

  return (
    <Link to={`/product/${product.slug}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="aspect-square overflow-hidden relative">
          <img 
            src={product.image_url} 
            alt={product.title} 
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          {product.is_featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          {product.sustainability_rating > 0 && (
            <Badge className={`absolute top-2 right-2 ${getSustainabilityColor(product.sustainability_rating)}`}>
              {getSustainabilityLabel(product.sustainability_rating)}
            </Badge>
          )}
          {product.discount_price && (
            <Badge className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground">
              Sale
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg line-clamp-1">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{product.category_name}</p>
          <div className="flex mt-2 items-center">
            {product.discount_price ? (
              <>
                <span className="font-bold">{formatPrice(product.discount_price)}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleAddToCart} 
            className="w-full"
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ProductCard
