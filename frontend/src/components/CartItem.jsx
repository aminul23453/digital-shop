import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'
import { Minus, Plus, Trash2 } from 'lucide-react'

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart()

  const handleIncreaseQuantity = () => {
    updateCartItem(item.id, item.quantity + 1)
  }

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateCartItem(item.id, item.quantity - 1)
    } else {
      removeFromCart(item.id)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  return (
    <div className="flex items-start py-4 border-b">
      <div className="w-24 h-24 overflow-hidden rounded-md flex-shrink-0">
        <Link to={`/product/${item.product}`}>
          <img
            src={item.product_image}
            alt={item.product_title}
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
      <div className="ml-4 flex-1">
        <Link to={`/product/${item.product}`}>
          <h3 className="font-medium text-lg">{item.product_title}</h3>
        </Link>
        {(item.size || item.color) && (
          <p className="text-sm text-muted-foreground">
            {item.size && `Size: ${item.size}`}
            {item.size && item.color && ' / '}
            {item.color && `Color: ${item.color}`}
          </p>
        )}
        <div className="flex justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleDecreaseQuantity}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleIncreaseQuantity}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase quantity</span>
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{formatPrice(item.total_price)}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity > 1 ? `${formatPrice(item.unit_price)} each` : ''}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRemove}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
