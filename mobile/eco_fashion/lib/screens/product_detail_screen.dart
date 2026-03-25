import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../models/product_variant.dart';
import '../providers/products_provider.dart';
import '../providers/cart_provider.dart';

class ProductDetailScreen extends StatefulWidget {
  const ProductDetailScreen({Key? key}) : super(key: key);

  @override
  _ProductDetailScreenState createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  bool _isLoading = true;
  Product? _product;
  String? _selectedSize;
  String? _selectedColor;
  int _quantity = 1;
  ProductVariant? _selectedVariant;
  bool _addingToCart = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    
    if (args != null && args.containsKey('slug')) {
      final slug = args['slug'];
      _loadProduct(slug);
    } else {
      // Navigate back if no slug provided
      Navigator.of(context).pop();
    }
  }

  Future<void> _loadProduct(String slug) async {
    setState(() {
      _isLoading = true;
    });

    try {
      final product = await Provider.of<ProductsProvider>(context, listen: false)
          .getProductBySlug(slug);
      
      setState(() {
        _product = product;
        _isLoading = false;
      });
    } catch (error) {
      setState(() {
        _isLoading = false;
      });
      
      // Show error snackbar
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to load product details')),
      );
    }
  }

  // Get available sizes for the selected color
  List<String> get _availableSizes {
    if (_product == null || _product!.variants == null) {
      return [];
    }
    
    if (_selectedColor == null) {
      return _product!.variants!
          .map((v) => v.size)
          .toSet()
          .toList();
    }
    
    return _product!.variants!
        .where((v) => v.color == _selectedColor)
        .map((v) => v.size)
        .toSet()
        .toList();
  }

  // Get available colors for the selected size
  List<String> get _availableColors {
    if (_product == null || _product!.variants == null) {
      return [];
    }
    
    if (_selectedSize == null) {
      return _product!.variants!
          .map((v) => v.color)
          .toSet()
          .toList();
    }
    
    return _product!.variants!
        .where((v) => v.size == _selectedSize)
        .map((v) => v.color)
        .toSet()
        .toList();
  }

  // Get selected variant
  void _updateSelectedVariant() {
    if (_product == null || _product!.variants == null) {
      _selectedVariant = null;
      return;
    }
    
    if (_selectedSize != null && _selectedColor != null) {
      try {
        _selectedVariant = _product!.variants!.firstWhere(
          (v) => v.size == _selectedSize && v.color == _selectedColor
        );
      } catch (e) {
        _selectedVariant = null;
      }
    } else {
      _selectedVariant = null;
    }
  }

  // Add to cart
  Future<void> _addToCart() async {
    if (_product == null) {
      return;
    }
    
    if (_product!.variants != null && _product!.variants!.isNotEmpty && _selectedVariant == null) {
      // Show error if variant is required but not selected
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select size and color')),
      );
      return;
    }
    
    setState(() {
      _addingToCart = true;
    });
    
    try {
      final success = await Provider.of<CartProvider>(context, listen: false)
          .addToCart(_product!.id, _quantity, variantId: _selectedVariant?.id);
      
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${_product!.title} added to cart'),
            action: SnackBarAction(
              label: 'VIEW CART',
              onPressed: () {
                Navigator.of(context).pushNamed('/cart');
              },
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to add to cart. Item may be out of stock.')),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('An error occurred. Please try again.')),
      );
    } finally {
      setState(() {
        _addingToCart = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_product?.title ?? 'Product Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              Navigator.of(context).pushNamed('/cart');
            },
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _product == null
              ? const Center(child: Text('Product not found'))
              : SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product image
                      AspectRatio(
                        aspectRatio: 1,
                        child: Image.network(
                          _selectedVariant?.imageUrl ?? _product!.imageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: Colors.grey[300],
                            child: const Center(
                              child: Icon(Icons.image_not_supported, color: Colors.grey, size: 50),
                            ),
                          ),
                        ),
                      ),
                      
                      // Product info
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  _product!.categoryName,
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.grey[700],
                                  ),
                                ),
                                const Spacer(),
                                if (_product!.sustainabilityRating >= 4)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF4CAF50),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(
                                          Icons.eco,
                                          color: Colors.white,
                                          size: 16,
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Eco-Friendly',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                            
                            const SizedBox(height: 8),
                            
                            Text(
                              _product!.title,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            
                            const SizedBox(height: 12),
                            
                            Row(
                              children: [
                                if (_product!.isOnSale) ...[
                                  Text(
                                    '\$${_product!.discountPrice!.toStringAsFixed(2)}',
                                    style: TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                      color: Theme.of(context).colorScheme.primary,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    '\$${_product!.price.toStringAsFixed(2)}',
                                    style: const TextStyle(
                                      fontSize: 16,
                                      decoration: TextDecoration.lineThrough,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).colorScheme.secondary,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      '${_product!.discountPercentage.toStringAsFixed(0)}% OFF',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ] else
                                  Text(
                                    '\$${_product!.price.toStringAsFixed(2)}',
                                    style: TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                      color: Theme.of(context).colorScheme.primary,
                                    ),
                                  ),
                              ],
                            ),
                            
                            if (_product!.variants != null && _product!.variants!.isNotEmpty) ...[
                              const SizedBox(height: 20),
                              
                              // Size selection
                              Text(
                                'Size',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                children: _availableSizes.map((size) {
                                  final isSelected = size == _selectedSize;
                                  return InkWell(
                                    onTap: () {
                                      setState(() {
                                        _selectedSize = size;
                                        // If the selected color is not available for this size, reset it
                                        if (_selectedColor != null &&
                                            !_product!.variants!
                                                .any((v) => v.size == size && v.color == _selectedColor)) {
                                          _selectedColor = null;
                                        }
                                        _updateSelectedVariant();
                                      });
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                          color: isSelected
                                              ? Theme.of(context).colorScheme.primary
                                              : Colors.grey,
                                          width: isSelected ? 2 : 1,
                                        ),
                                        borderRadius: BorderRadius.circular(4),
                                        color: isSelected
                                            ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                                            : Colors.transparent,
                                      ),
                                      child: Text(
                                        size,
                                        style: TextStyle(
                                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                          color: isSelected
                                              ? Theme.of(context).colorScheme.primary
                                              : Colors.black,
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                              
                              const SizedBox(height: 16),
                              
                              // Color selection
                              Text(
                                'Color',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                children: _availableColors.map((color) {
                                  final isSelected = color == _selectedColor;
                                  return InkWell(
                                    onTap: () {
                                      setState(() {
                                        _selectedColor = color;
                                        // If the selected size is not available for this color, reset it
                                        if (_selectedSize != null &&
                                            !_product!.variants!
                                                .any((v) => v.color == color && v.size == _selectedSize)) {
                                          _selectedSize = null;
                                        }
                                        _updateSelectedVariant();
                                      });
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                          color: isSelected
                                              ? Theme.of(context).colorScheme.primary
                                              : Colors.grey,
                                          width: isSelected ? 2 : 1,
                                        ),
                                        borderRadius: BorderRadius.circular(4),
                                        color: isSelected
                                            ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
                                            : Colors.transparent,
                                      ),
                                      child: Text(
                                        color,
                                        style: TextStyle(
                                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                          color: isSelected
                                              ? Theme.of(context).colorScheme.primary
                                              : Colors.black,
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ],
                            
                            const SizedBox(height: 20),
                            
                            // Quantity selector
                            Row(
                              children: [
                                Text(
                                  'Quantity',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const Spacer(),
                                IconButton(
                                  icon: const Icon(Icons.remove),
                                  onPressed: _quantity > 1
                                      ? () {
                                          setState(() {
                                            _quantity--;
                                          });
                                        }
                                      : null,
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                  decoration: BoxDecoration(
                                    border: Border.all(color: Colors.grey),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    _quantity.toString(),
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                ),
                                IconButton(
                                  icon: const Icon(Icons.add),
                                  onPressed: _quantity < (_selectedVariant?.stock ?? _product!.inventory)
                                      ? () {
                                          setState(() {
                                            _quantity++;
                                          });
                                        }
                                      : null,
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 20),
                            
                            // Stock status
                            Row(
                              children: [
                                const Icon(Icons.inventory, size: 16, color: Colors.grey),
                                const SizedBox(width: 4),
                                if (_selectedVariant != null)
                                  Text(
                                    _selectedVariant!.stock > 0
                                        ? 'In Stock (${_selectedVariant!.stock} available)'
                                        : 'Out of Stock',
                                    style: TextStyle(
                                      color: _selectedVariant!.stock > 0 ? Colors.green : Colors.red,
                                    ),
                                  )
                                else
                                  Text(
                                    _product!.inventory > 0
                                        ? 'In Stock (${_product!.inventory} available)'
                                        : 'Out of Stock',
                                    style: TextStyle(
                                      color: _product!.inventory > 0 ? Colors.green : Colors.red,
                                    ),
                                  ),
                              ],
                            ),
                            
                            const SizedBox(height: 24),
                            
                            // Description
                            const Text(
                              'Description',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              _product!.description,
                              style: const TextStyle(fontSize: 14, height: 1.5),
                            ),
                            
                            const SizedBox(height: 16),
                            
                            // Materials and sustainability
                            if (_product!.materials != null) ...[
                              const Text(
                                'Materials',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                _product!.materials!,
                                style: const TextStyle(fontSize: 14),
                              ),
                              const SizedBox(height: 16),
                            ],
                            
                            Row(
                              children: [
                                const Text(
                                  'Sustainability Rating',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const Spacer(),
                                Row(
                                  children: List.generate(5, (index) {
                                    return Icon(
                                      Icons.eco,
                                      color: index < _product!.sustainabilityRating
                                          ? const Color(0xFF4CAF50)
                                          : Colors.grey[300],
                                      size: 20,
                                    );
                                  }),
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 8),
                            Text(
                              _getSustainabilityLabel(_product!.sustainabilityRating),
                              style: TextStyle(
                                color: _getSustainabilityColor(_product!.sustainabilityRating),
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
      bottomNavigationBar: _isLoading || _product == null
          ? null
          : SafeArea(
              child: Container(
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
                child: ElevatedButton(
                  onPressed: (_selectedVariant?.stock ?? _product!.inventory) > 0 && !_addingToCart
                      ? _addToCart
                      : null,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: _addingToCart
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Text(
                          'ADD TO CART',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
            ),
    );
  }

  String _getSustainabilityLabel(int rating) {
    switch (rating) {
      case 1:
        return 'Low Impact';
      case 2:
        return 'Medium Impact';
      case 3:
        return 'Eco-Friendly';
      case 4:
        return 'Sustainable';
      case 5:
        return 'Highly Sustainable';
      default:
        return 'Not Rated';
    }
  }

  Color _getSustainabilityColor(int rating) {
    switch (rating) {
      case 1:
        return Colors.red;
      case 2:
        return Colors.orange;
      case 3:
        return Colors.blue;
      case 4:
        return Colors.green[700]!;
      case 5:
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}