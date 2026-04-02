import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/?search=${searchQuery}`)
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center">
        <div className="mr-4 flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4">
                <Link to="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link to="/?category=t-shirts" className="text-lg font-medium">
                  T-Shirts
                </Link>
                <Link to="/?category=outerwear" className="text-lg font-medium">
                  Outerwear
                </Link>
                <Link to="/?category=bottoms" className="text-lg font-medium">
                  Bottoms
                </Link>
                <Link to="/?category=accessories" className="text-lg font-medium">
                  Accessories
                </Link>
                <Link to="/?featured=true" className="text-lg font-medium">
                  Featured
                </Link>
                <div className="h-px w-full bg-border my-2" />
                {user ? (
                  <>
                    <Link to="/account" className="text-lg font-medium">
                      My Account
                    </Link>
                    <button 
                      onClick={logout} 
                      className="text-lg font-medium text-left text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-lg font-medium">
                      Login
                    </Link>
                    <Link to="/register" className="text-lg font-medium">
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight">EcoThreads</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1">
          <NavigationMenu className="ml-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/?category=t-shirts">T-Shirts</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/?category=outerwear">Outerwear</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/?category=bottoms">Bottoms</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/?category=accessories">Accessories</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/?featured=true">Featured</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex w-full max-w-sm items-center"
          >
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center space-x-1">
            {user ? (
              <Link to="/account">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
