import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';

class MainDrawer extends StatelessWidget {
  const MainDrawer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final cartProvider = Provider.of<CartProvider>(context);
    
    return Drawer(
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            color: Theme.of(context).colorScheme.primary,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 30),
                const Text(
                  'ECO FASHION',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                if (authProvider.isAuth)
                  Text(
                    'Hello, ${authProvider.user!.firstName ?? authProvider.user!.username}',
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                    ),
                  )
                else
                  const Text(
                    'Welcome, Guest',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () {
              Navigator.of(context).pushReplacementNamed('/home');
            },
          ),
          ListTile(
            leading: const Icon(Icons.category),
            title: const Text('Shop by Category'),
            onTap: () {
              Navigator.of(context).pushNamed('/products');
            },
          ),
          ListTile(
            leading: const Icon(Icons.eco),
            title: const Text('Sustainable Products'),
            onTap: () {
              Navigator.of(context).pushNamed('/products', arguments: {
                'sustainabilityFilter': true,
              });
            },
          ),
          ListTile(
            leading: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.shopping_cart),
                if (cartProvider.itemCount > 0)
                  Positioned(
                    top: -5,
                    right: -5,
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.secondary,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        '${cartProvider.itemCount}',
                        style: const TextStyle(
                          fontSize: 10,
                          color: Colors.white,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
            title: const Text('Cart'),
            onTap: () {
              Navigator.of(context).pushNamed('/cart');
            },
          ),
          const Divider(),
          if (authProvider.isAuth) ...[
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text('Profile'),
              onTap: () {
                Navigator.of(context).pushNamed('/profile');
              },
            ),
            ListTile(
              leading: const Icon(Icons.shopping_bag),
              title: const Text('Order History'),
              onTap: () {
                Navigator.of(context).pushNamed('/orders');
              },
            ),
            ListTile(
              leading: const Icon(Icons.exit_to_app),
              title: const Text('Logout'),
              onTap: () async {
                await authProvider.logout();
                Navigator.of(context).pushReplacementNamed('/home');
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Logged out successfully')),
                );
              },
            ),
          ] else ...[
            ListTile(
              leading: const Icon(Icons.login),
              title: const Text('Login'),
              onTap: () {
                Navigator.of(context).pushNamed('/login');
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_add),
              title: const Text('Register'),
              onTap: () {
                Navigator.of(context).pushNamed('/register');
              },
            ),
          ],
          const Divider(),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('About Us'),
            onTap: () {
              // TODO: Implement about us screen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('About us page not implemented yet')),
              );
              Navigator.of(context).pop();
            },
          ),
          ListTile(
            leading: const Icon(Icons.contact_mail),
            title: const Text('Contact Us'),
            onTap: () {
              // TODO: Implement contact us screen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Contact us page not implemented yet')),
              );
              Navigator.of(context).pop();
            },
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            width: double.infinity,
            child: const Text(
              '© 2025 Eco Fashion',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}