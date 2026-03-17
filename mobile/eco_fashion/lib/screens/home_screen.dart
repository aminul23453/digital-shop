import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../services/product_provider.dart';
import '../services/cart_provider.dart';
import '../widgets/product_card.dart';
import 'product_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Load products when the screen is first displayed
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ProductProvider>(context, listen: false).loadProducts();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar with Search
          SliverAppBar(
            floating: true,
            pinned: true,
            title: const Text('Eco Fashion'),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(60),
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search sustainable products...',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        Provider.of<ProductProvider>(context, listen: false)
                            .setSearchQuery(null);
                      },
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  onSubmitted: (value) {
                    if (value.isNotEmpty) {
                      Provider.of<ProductProvider>(context, listen: false)
                          .setSearchQuery(value);
                    }
                  },
                ),
              ),
            ),
            actions: [
              Stack(
                alignment: Alignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.shopping_cart),
                    onPressed: () {
                      Navigator.pushNamed(context, '/cart');
                    },
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Consumer<CartProvider>(
                      builder: (context, cartProvider, child) {
                        final itemCount = cartProvider.itemCount;
                        if (itemCount == 0) return const SizedBox.shrink();
                        
                        return Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          constraints: const BoxConstraints(
                            minWidth: 16,
                            minHeight: 16,
                          ),
                          child: Text(
                            itemCount.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
          
          // Category Filters
          SliverToBoxAdapter(
            child: Consumer<ProductProvider>(
              builder: (context, productProvider, child) {
                return SizedBox(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    children: [
                      // All Products Filter
                      Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: const Text('All Products'),
                          selected: productProvider.selectedCategorySlug == null,
                          onSelected: (selected) {
                            if (selected) {
                              productProvider.setSelectedCategory(null);
                            }
                          },
                        ),
                      ),
                      
                      // Category Filters
                      ...productProvider.categories.map((category) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: FilterChip(
                            label: Text(category.name),
                            selected: productProvider.selectedCategorySlug == category.slug,
                            onSelected: (selected) {
                              if (selected) {
                                productProvider.setSelectedCategory(category.slug);
                              }
                            },
                          ),
                        );
                      }).toList(),
                    ],
                  ),
                );
              },
            ),
          ),
          
          // Featured Products Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Featured Products',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  TextButton(
                    onPressed: () {
                      Provider.of<ProductProvider>(context, listen: false)
                          .clearFilters();
                    },
                    child: const Text('See All'),
                  ),
                ],
              ),
            ),
          ),
          
          Consumer<ProductProvider>(
            builder: (context, productProvider, child) {
              final featuredProducts = productProvider.featuredProducts;
              
              if (productProvider.isLoading) {
                return const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator()),
                );
              }
              
              if (featuredProducts.isEmpty) {
                return const SliverToBoxAdapter(
                  child: SizedBox.shrink(),
                );
              }
              
              return SliverToBoxAdapter(
                child: SizedBox(
                  height: 300,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: featuredProducts.length,
                    itemBuilder: (context, index) {
                      final product = featuredProducts[index];
                      return SizedBox(
                        width: 200,
                        child: Padding(
                          padding: const EdgeInsets.only(right: 16),
                          child: ProductCard(
                            product: product,
                            onTap: () => _navigateToProductDetail(product),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              );
            },
          ),
          
          // Product Grid
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
              child: Text(
                'All Products',
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ),
          ),
          
          Consumer<ProductProvider>(
            builder: (context, productProvider, child) {
              if (productProvider.isLoading) {
                return const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator()),
                );
              }
              
              if (productProvider.products.isEmpty) {
                return SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.search_off, size: 64, color: Colors.grey),
                        const SizedBox(height: 16),
                        Text(
                          'No products found',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: Colors.grey[600],
                          ),
                        ),
                        if (productProvider.searchQuery != null ||
                            productProvider.selectedCategorySlug != null)
                          TextButton(
                            onPressed: () {
                              productProvider.clearFilters();
                              _searchController.clear();
                            },
                            child: const Text('Clear Filters'),
                          ),
                      ],
                    ),
                  ),
                );
              }
              
              return SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    childAspectRatio: 0.7,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final product = productProvider.products[index];
                      return ProductCard(
                        product: product,
                        onTap: () => _navigateToProductDetail(product),
                      );
                    },
                    childCount: productProvider.products.length,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  void _navigateToProductDetail(Product product) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProductDetailScreen(productSlug: product.slug),
      ),
    );
  }
}