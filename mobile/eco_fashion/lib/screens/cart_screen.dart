import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/auth_provider.dart';
import '../widgets/cart_item_card.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Shopping Cart'),
        actions: [
          TextButton.icon(
            onPressed: () {
              _showClearCartDialog(context);
            },
            icon: const Icon(Icons.delete_outline, color: Colors.white),
            label: const Text(
              'Clear',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
      body: Consumer<CartProvider>(
        builder: (ctx, cartProvider, _) {
          if (cartProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (cartProvider.cartItems.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.shopping_cart_outlined,
                    size: 80,
                    color: Colors.grey[400],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Your cart is empty',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[700],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Add items to get started',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pushReplacementNamed('/products');
                    },
                    child: const Text('BROWSE PRODUCTS'),
                  ),
                ],
              ),
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: cartProvider.cartItems.length,
                  itemBuilder: (ctx, i) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: CartItemCard(
                      cartItem: cartProvider.cartItems[i],
                    ),
                  ),
                ),
              ),
              // Order summary
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      offset: const Offset(0, -3),
                      blurRadius: 6,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Order Summary',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Subtotal'),
                        Text('\$${cartProvider.subtotal.toStringAsFixed(2)}'),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Shipping'),
                        Text(
                          cartProvider.shipping > 0
                              ? '\$${cartProvider.shipping.toStringAsFixed(2)}'
                              : 'FREE',
                          style: TextStyle(
                            color: cartProvider.shipping > 0
                                ? null
                                : Theme.of(context).colorScheme.primary,
                            fontWeight: cartProvider.shipping > 0
                                ? null
                                : FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Estimated Tax'),
                        Text('\$${cartProvider.tax.toStringAsFixed(2)}'),
                      ],
                    ),
                    const Divider(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Total',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        Text(
                          '\$${cartProvider.total.toStringAsFixed(2)}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ],
                    ),
                    if (cartProvider.shipping > 0 && cartProvider.subtotal < 100)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          'Add \$${(100 - cartProvider.subtotal).toStringAsFixed(2)} more for free shipping',
                          style: TextStyle(
                            fontSize: 12,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          // Check if user is logged in
                          final authProvider = Provider.of<AuthProvider>(context, listen: false);
                          if (authProvider.isAuth) {
                            Navigator.of(context).pushNamed('/checkout');
                          } else {
                            _showLoginDialog(context);
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Text(
                          'PROCEED TO CHECKOUT',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  void _showClearCartDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Clear Cart'),
        content: const Text('Are you sure you want to remove all items from your cart?'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: const Text('CANCEL'),
          ),
          TextButton(
            onPressed: () {
              Provider.of<CartProvider>(context, listen: false).clearCart();
              Navigator.of(ctx).pop();
            },
            child: const Text('CLEAR'),
          ),
        ],
      ),
    );
  }

  void _showLoginDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Login Required'),
        content: const Text('You need to be logged in to checkout.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: const Text('CANCEL'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              Navigator.of(context).pushNamed('/login', arguments: {
                'redirectToCheckout': true,
              });
            },
            child: const Text('LOGIN'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              Navigator.of(context).pushNamed('/register', arguments: {
                'redirectToCheckout': true,
              });
            },
            child: const Text('REGISTER'),
          ),
        ],
      ),
    );
  }
}