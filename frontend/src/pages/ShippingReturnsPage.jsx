// src/pages/ShippingReturnsPage.jsx
import React from 'react';
import { Truck, RefreshCw, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom'; // Add this if not present

function ShippingReturnsPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section (already centered) */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 md:py-16 text-center">
        <div className="container mx-auto px-4">
          <Truck className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">Shipping & Returns</h1>
          <p className="text-lg md:text-xl text-emerald-700 max-w-2xl mx-auto">
            Everything you need to know about how we get our sustainable goodies to you, and what to do if things aren't quite right.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Shipping Information Section - Centered Title */}
          <section>
            <div className="text-center mb-6"> {/* Wrapper for centered icon and title */}
              <PackageCheck className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Shipping Information</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                At EcoThreads, we're committed to getting your sustainable fashion to you as efficiently and eco-consciously as possible.
              </p>
              <h3 className="text-xl font-medium text-foreground">Processing Times</h3>
              <p>
                Orders are typically processed within 1-2 business days. During peak seasons or sales events, processing times may be slightly longer. We appreciate your patience!
              </p>
              <h3 className="text-xl font-medium text-foreground">Shipping Methods & Costs</h3>
              <p>
                We offer the following shipping options:
              </p>
              <ul>
                <li><strong>Standard Shipping (5-7 business days):</strong> Calculated at checkout based on your location and order weight. Often free for orders over a certain amount!</li>
                <li><strong>Expedited Shipping (2-3 business days):</strong> Available for an additional fee, calculated at checkout.</li>
              </ul>
              <p>
                All shipping costs are displayed at checkout before you complete your purchase. We currently ship to [List countries/regions you ship to, e.g., the United States and Canada].
              </p>
              <h3 className="text-xl font-medium text-foreground">Eco-Friendly Packaging</h3>
              <p>
                We are proud to use packaging made from recycled and/or biodegradable materials to minimize our environmental impact. We encourage you to recycle or compost our packaging where facilities exist.
              </p>
            </div>
          </section>

          {/* Returns & Exchanges Section - Centered Title */}
          <section>
            <div className="text-center mb-6"> {/* Wrapper for centered icon and title */}
              <RefreshCw className="h-10 w-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Returns & Exchanges</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                We want you to love your EcoThreads pieces! If something isn't quite right, we're here to help.
              </p>
              <h3 className="text-xl font-medium text-foreground">Our Policy</h3>
              <p>
                We accept returns and exchanges on unworn, unwashed items with all original tags attached within <strong>30 days</strong> of the delivery date.
              </p>
              <p>
                Items marked as "Final Sale" are not eligible for return or exchange. Gift cards are non-refundable.
              </p>
              <h3 className="text-xl font-medium text-foreground">How to Initiate a Return/Exchange</h3>
              <ol className="list-decimal pl-5">
                <li>Visit our <Link to="/contact-us" className="text-primary hover:underline">Contact Us page</Link> or your account's order history to start your return/exchange process.</li> {/* Changed to Link */}
                <li>You will need your order number and the email address used to place the order.</li>
                <li>Follow the instructions to select the items you wish to return/exchange and the reason.</li>
                <li>Once approved, you'll receive a prepaid shipping label (for domestic returns) and instructions on how to send your items back to us.</li>
              </ol>
              <h3 className="text-xl font-medium text-foreground">Refunds</h3>
              <p>
                Once we receive and inspect your returned item(s), we will process your refund to the original payment method within 5-7 business days. You will receive an email notification once your refund has been processed. Original shipping charges are non-refundable.
              </p>
              <h3 className="text-xl font-medium text-foreground">Exchanges</h3>
              <p>
                If you'd like to exchange an item for a different size or color, please indicate this when initiating your return. Exchanges are subject to availability. If the desired item is not available, we will process a refund.
              </p>
              <h3 className="text-xl font-medium text-foreground">Questions?</h3>
              <p>
                If you have any questions about our shipping or returns process, please don't hesitate to <Link to="/contact-us" className="text-primary hover:underline">contact us</Link>. {/* Changed to Link */}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
// Need to import Link if not already

export default ShippingReturnsPage;