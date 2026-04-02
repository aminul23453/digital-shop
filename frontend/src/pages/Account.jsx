import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Skeleton } from '../components/ui/skeleton'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/use-toast'
import * as api from '../services/api'
import { formatPrice } from '../lib/utils'
import { Circle, FileText, LogOut, Package, ShoppingBag, User } from 'lucide-react'

const Account = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, updateProfile, logout } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/account' } } })
    }
  }, [isAuthenticated, navigate])
  
  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return
      
      try {
        setOrdersLoading(true)
        const response = await api.getOrders()
        setOrders(response.data)
      } catch (error) {
        console.error('Failed to fetch orders', error)
        toast({
          title: "Failed to load orders",
          description: "Please try again later",
          variant: "destructive"
        })
      } finally {
        setOrdersLoading(false)
      }
    }
    
    fetchOrders()
  }, [isAuthenticated])
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
  }
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    
    setProfileLoading(true)
    
    try {
      await updateProfile(profileForm)
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive"
      })
    } finally {
      setProfileLoading(false)
    }
  }
  
  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    navigate('/')
  }
  
  if (!isAuthenticated) {
    return null // Redirect handled in useEffect
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="text-lg">
                    {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Circle className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:w-3/4">
          <Tabs defaultValue="orders">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">
                <FileText className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>
            
            {/* Orders tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track your recent orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="border p-4 rounded-lg">
                          <div className="flex justify-between mb-4">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-6 w-24" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border p-4 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                            <div className="mb-2 sm:mb-0">
                              <h3 className="font-medium">Order #{order.order_id}</h3>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge 
                              className={
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                  <span className="font-medium">{item.product_title}</span>
                                  <span className="text-muted-foreground"> × {item.quantity}</span>
                                  {item.size && item.color && (
                                    <span className="text-muted-foreground"> - {item.size} / {item.color}</span>
                                  )}
                                </div>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Total:</span>
                            <span className="font-semibold">{formatPrice(order.total_amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-4">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">
                        When you place orders, they will appear here
                      </p>
                      <Button asChild>
                        <a href="/">Start Shopping</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Profile tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium">
                          Username
                        </label>
                        <Input
                          id="username"
                          value={user?.username || ''}
                          disabled
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">
                          Username cannot be changed
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="first_name" className="text-sm font-medium">
                            First Name
                          </label>
                          <Input
                            id="first_name"
                            name="first_name"
                            value={profileForm.first_name}
                            onChange={handleProfileChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="last_name" className="text-sm font-medium">
                            Last Name
                          </label>
                          <Input
                            id="last_name"
                            name="last_name"
                            value={profileForm.last_name}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button variant="outline" type="button" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                        <Button type="submit" disabled={profileLoading}>
                          {profileLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Account
