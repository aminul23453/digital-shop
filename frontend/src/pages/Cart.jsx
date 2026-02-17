import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { Skeleton } from '../components/ui/skeleton'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import { formatPrice } from '../lib/utils'
import { AlertCircle, ArrowLeft, ShoppingBag, ShoppingCart } from 'lucide-react'

const Cart = () => {
  const { cartItems, isLoading, calculateTotal } = useCart()
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <div className="border rounded-lg overflow-hidden">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 border-b last:border-b-0">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-24 w-24 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-24 mb-2" />
                      <div className="flex justify-between mt-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="border rounded-lg p-4">
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Separator className="my-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="text-center py-12 border rounded-lg">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some products to your cart and start shopping
          </p>
          <Button asChild>
            <Link to="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = calculateTotal()
  const shipping = subtotal >= 75 ? 0 : 5.99
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart items */}
        <div className="md:w-2/3">
          <div className="border rounded-lg overflow-hidden bg-card">
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="md:w-1/3">
          <div className="border rounded-lg p-6 sticky top-20 bg-card">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
            </div>
            
            {subtotal < 75 && (
              <div className="mt-4 p-3 bg-primary/10 rounded text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p>Add ${formatPrice(75 - subtotal)} more to qualify for free shipping</p>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <Button className="w-full mt-6" asChild>
              <Link to="/checkout">
                Proceed to Checkout
              </Link>
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
