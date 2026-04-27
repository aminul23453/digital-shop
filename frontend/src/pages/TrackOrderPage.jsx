// src/pages/TrackOrderPage.jsx
import React, { useState } from 'react';
import { PackageSearch, Search } from 'lucide-react';
import { Input } from '@/components/ui/input'; // Assuming you have Shadcn Input
import { Button } from '@/components/ui/button'; // Assuming you have Shadcn Button
import { Link } from 'react-router-dom';

function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTrackingInfo(null);

    // Placeholder: In a real app, you'd make an API call here
    // e.g., api.trackOrder(orderId, email)
    console.log('Tracking order:', orderId, 'Email:', email);

    setTimeout(() => {
      if (orderId === '12345XYZ' && email.includes('@')) {
        setTrackingInfo({
          status: 'Shipped',
          carrier: 'EcoCarrier Express',
          trackingNumber: 'EC987654321US',
          estimatedDelivery: 'May 15, 2025',
          updates: [
            { date: 'May 12, 2025', status: 'Package picked up by carrier.' },
            { date: 'May 11, 2025', status: 'Order processed and ready for shipment.' },
          ],
        });
      } else {
        setError('Order not found or invalid details. Please check your order ID and email.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <PackageSearch className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Track Your Order</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Enter your order details below to see its current status.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-lg mx-auto bg-card p-6 md:p-8 rounded-lg shadow-xl">
          <form onSubmit={handleTrackOrder} className="space-y-6 mb-8">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-muted-foreground mb-1">Order ID</label>
              <Input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., 12345XYZ"
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"></span>
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Track Order
            </Button>
          </form>

          {error && <p className="text-center text-destructive mb-4">{error}</p>}

          {trackingInfo && (
            <div className="border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Order Status: <span className="text-primary">{trackingInfo.status}</span></h3>
              <p className="text-sm text-muted-foreground"><strong>Carrier:</strong> {trackingInfo.carrier}</p>
              <p className="text-sm text-muted-foreground"><strong>Tracking Number:</strong> {trackingInfo.trackingNumber}</p>
              <p className="text-sm text-muted-foreground"><strong>Estimated Delivery:</strong> {trackingInfo.estimatedDelivery}</p>
              <div className="mt-4">
                <h4 className="text-md font-medium text-foreground mb-2">Recent Updates:</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {trackingInfo.updates.map((update, index) => (
                    <li key={index} className="border-l-2 border-primary pl-3 py-1">
                      <strong>{update.date}:</strong> {update.status}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

         <p className="text-xs text-muted-foreground mt-8 text-center">
             If you have an account, you can also <Link to="/login" className="text-primary hover:underline">log in</Link> to view your order history and tracking information.
             For any issues, please <Link to="/contact-us" className="text-primary hover:underline">contact support</Link>.
         </p>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderPage;