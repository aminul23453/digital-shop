import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../models/product.dart';
import '../models/product_variant.dart';
import '../services/product_provider.dart';
import '../services/cart_provider.dart';
import '../utils/format_utils.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productSlug;

  const ProductDetailScreen({
    Key? key,
    required this.productSlug,
  }) : super(key: key);

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  int _quantity = 1;
  ProductVariant? _selectedVariant;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    // Load product details when the screen is first displayed
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ProductProvider>(context, listen: false)
          .loadProductDetails(widget.productSlug);
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<ProductProvider>(
        builder: (context, productProvider, child) {
          if (productProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final product = productProvider.selectedProduct;
          if (product == null) {
            return const Center(child: Text('Product not found'));
          }

          // If no variant is selected and product has variants, select the first one
          if (_selectedVariant == null && product.variants != null && product.variants!.isNotEmpty) {
            _selectedVariant = product.variants![0];
          }

          return CustomScrollView(
            controller: _scrollController,
            slivers: [
              // App Bar with Product Image
              SliverAppBar(
                expandedHeight: 300,
                pinned: true,
                flexibleSpace: FlexibleSpaceBar(
                  background: Stack(
                    children: [
                      // Product image
                      Hero(
                        tag: 'product_${product.id}',
                        child: CachedNetworkImage(
                          imageUrl: _selectedVariant?.imageUrl ?? product.imageUrl,
                          fit: BoxFit.cover,
                          width: double.infinity,
                          placeholder: (context, url) => const Center(
                            child: CircularProgressIndicator(),
                          ),
                          errorWidget: (context, url, error) => const Center(
                            child: Icon(Icons.error),
                          ),
                        ),
                      ),

                      // Overlays
                      if (product.isOnSale)
                        Positioned(
                          top: 16,
                          left: 16,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.red,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              '${product.discountPercentage.toInt()}% OFF',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                          ),
                        ),
                      Positioned(
                        top: 16,
                        right: 16,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.green[700],
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            FormatUtils.getProductStatusText(product.sustainabilityRating),
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Product Details
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title and Price
                      Text(
                        product.title,
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 8),

                      // Category
                      Text(
                        product.categoryName,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Price
                      Row(
                        children: [
                          if (product.isOnSale) ...[
                            Text(
                              FormatUtils.formatCurrency(product.currentPrice),
                              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              FormatUtils.formatCurrency(product.price),
                              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                decoration: TextDecoration.lineThrough,
                                color: Colors.grey,
                              ),
                            ),
                          ] else
                            Text(
                              FormatUtils.formatCurrency(product.price),
                              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Sustainability Rating
                      Row(
                        children: [
                          const Text(
                            'Sustainability: ',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          RatingBar.builder(
                            initialRating: product.sustainabilityRating.toDouble(),
                            minRating: 0,
                            direction: Axis.horizontal,
                            allowHalfRating: false,
                            itemCount: 5,
                            itemSize: 20,
                            ignoreGestures: true,
                            itemBuilder: (context, _) => Icon(
                              Icons.eco,
                              color: Colors.green[700],
                            ),
                            onRatingUpdate: (_) {},
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Materials
                      if (product.materials != null) ...[
                        const Text(
                          'Materials:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(product.materials!),
                        const SizedBox(height: 16),
                      ],

                      // Variants Section
                      if (product.variants != null && product.variants!.isNotEmpty) ...[
                        const Text(
                          'Available Options:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),

                        // Size Selection
                        Wrap(
                          spacing: 8,
                          children: _getUniqueSizes(product.variants!).map((size) {
                            return ChoiceChip(
                              label: Text(size),
                              selected: _selectedVariant?.size == size,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    // Find a variant with this size and current color or first available
                                    final variantWithSizeAndColor = product.variants!.firstWhere(
                                      (v) => v.size == size && (_selectedVariant == null || v.color == _selectedVariant!.color),
                                      orElse: () => product.variants!.firstWhere((v) => v.size == size),
                                    );
                                    _selectedVariant = variantWithSizeAndColor;
                                  });
                                }
                              },
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 8),

                        // Color Selection
                        Wrap(
                          spacing: 8,
                          children: _getUniqueColors(product.variants!).map((color) {
                            // Only show colors available for the selected size
                            final availableInSelectedSize = product.variants!.any(
                              (v) => v.color == color && (_selectedVariant == null || v.size == _selectedVariant!.size),
                            );
                            
                            if (!availableInSelectedSize) return const SizedBox.shrink();
                            
                            return ChoiceChip(
                              label: Text(color),
                              selected: _selectedVariant?.color == color,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    // Find a variant with this color and current size
                                    _selectedVariant = product.variants!.firstWhere(
                                      (v) => v.color == color && v.size == _selectedVariant!.size,
                                    );
                                  });
                                }
                              },
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Quantity Selection
                      Row(
                        children: [
                          const Text(
                            'Quantity:',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 16),
                          _buildQuantityControls(),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Add to Cart Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () => _addToCart(context, product),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: const Text(
                            'Add to Cart',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Description
                      const Text(
                        'Description',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(product.description),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildQuantityControls() {
    return Row(
      children: [
        IconButton(
          icon: const Icon(Icons.remove),
          onPressed: _quantity > 1
              ? () => setState(() {
                    _quantity--;
                  })
              : null,
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            border: Border.all(color: Colors.grey[300]!),
            borderRadius: BorderRadius.circular(4),
          ),
          child: Text(
            '$_quantity',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.add),
          onPressed: () => setState(() {
            _quantity++;
          }),
        ),
      ],
    );
  }

  void _addToCart(BuildContext context, Product product) {
    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    
    cartProvider.addToCart(
      product.id,
      _quantity,
      variantId: _selectedVariant?.id,
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product.title} added to cart'),
        action: SnackBarAction(
          label: 'View Cart',
          onPressed: () {
            Navigator.pushNamed(context, '/cart');
          },
        ),
      ),
    );
  }

  List<String> _getUniqueSizes(List<ProductVariant> variants) {
    final sizes = variants.map((v) => v.size).toSet().toList();
    sizes.sort(); // Sort sizes in ascending order
    return sizes;
  }

  List<String> _getUniqueColors(List<ProductVariant> variants) {
    return variants.map((v) => v.color).toSet().toList();
  }
}