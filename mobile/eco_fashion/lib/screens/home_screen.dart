import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/products_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/category_chip.dart';
import '../widgets/main_drawer.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Eco Fashion'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // TODO: Navigate to search screen
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Search not implemented yet')),
              );
            },
          ),
          Stack(
            alignment: Alignment.center,
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart),
                onPressed: () {
                  Navigator.of(context).pushNamed('/cart');
                },
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Consumer<CartProvider>(
                  builder: (ctx, cart, _) => cart.itemCount > 0
                      ? Container(
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
                            '${cart.itemCount}',
                            style: const TextStyle(
                              fontSize: 10,
                              color: Colors.white,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        )
                      : const SizedBox(),
                ),
              ),
            ],
          ),
        ],
      ),
      drawer: const MainDrawer(),
      body: RefreshIndicator(
        onRefresh: () async {
          await Provider.of<ProductsProvider>(context, listen: false).loadFeaturedProducts();
          await Provider.of<ProductsProvider>(context, listen: false).loadCategories();
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Hero banner
              Container(
                width: double.infinity,
                height: 200,
                margin: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF4CAF50), Color(0xFF8BC34A)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Sustainable Style',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Fashion that respects our planet',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          Navigator.of(context).pushNamed('/products');
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF4CAF50),
                        ),
                        child: const Text('Shop Now'),
                      ),
                    ],
                  ),
                ),
              ),

              // Categories
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Text(
                  'Categories',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ),
              SizedBox(
                height: 60,
                child: Consumer<ProductsProvider>(
                  builder: (ctx, productData, _) {
                    if (productData.isLoading) {
                      return const Center(child: CircularProgressIndicator());
                    }
                    
                    if (productData.categories.isEmpty) {
                      return const Center(child: Text('No categories found'));
                    }
                    
                    return ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: productData.categories.length,
                      itemBuilder: (ctx, i) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: CategoryChip(
                          category: productData.categories[i],
                          onTap: () {
                            Navigator.of(context).pushNamed(
                              '/products',
                              arguments: {
                                'categorySlug': productData.categories[i].slug,
                              },
                            );
                          },
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Featured Products
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Featured Products',
                      style: Theme.of(context).textTheme.headlineMedium,
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pushNamed('/products');
                      },
                      child: const Text('See All'),
                    ),
                  ],
                ),
              ),
              Consumer<ProductsProvider>(
                builder: (ctx, productData, _) {
                  if (productData.isLoading) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  
                  if (productData.featuredProducts.isEmpty) {
                    return const Center(child: Text('No featured products found'));
                  }
                  
                  return GridView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 2/3,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: productData.featuredProducts.length,
                    itemBuilder: (ctx, i) => ProductCard(
                      product: productData.featuredProducts[i],
                    ),
                  );
                },
              ),
              
              const SizedBox(height: 24),
              
              // Sustainability Message
              Container(
                width: double.infinity,
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F5E9),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Our Commitment to Sustainability',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF2E7D32),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'We source eco-friendly materials and partner with ethical manufacturers to reduce our environmental impact.',
                      style: TextStyle(
                        fontSize: 14,
                        color: Color(0xFF33691E),
                      ),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        // TODO: Navigate to about sustainability screen
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Sustainability page not implemented yet')),
                        );
                      },
                      child: const Text('Learn More'),
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}