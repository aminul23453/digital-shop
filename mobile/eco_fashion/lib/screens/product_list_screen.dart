import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/products_provider.dart';
import '../widgets/product_card.dart';

class ProductListScreen extends StatefulWidget {
  const ProductListScreen({Key? key}) : super(key: key);

  @override
  _ProductListScreenState createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen> {
  String? _categorySlug;
  String? _searchQuery;
  bool _sustainabilityFilter = false;
  String _sortBy = 'newest'; // Options: newest, price_low, price_high

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
    
    if (args != null) {
      _categorySlug = args['categorySlug'];
      _searchQuery = args['searchQuery'];
      _sustainabilityFilter = args['sustainabilityFilter'] ?? false;
      _loadProducts();
    } else {
      _loadProducts();
    }
  }

  void _loadProducts() {
    Provider.of<ProductsProvider>(context, listen: false).loadProducts(
      categorySlug: _categorySlug,
      search: _searchQuery,
    );
  }

  @override
  Widget build(BuildContext context) {
    final productsProvider = Provider.of<ProductsProvider>(context);
    final products = productsProvider.products;
    
    // Apply sustainability filter if needed
    final filteredProducts = _sustainabilityFilter
        ? products.where((p) => p.sustainabilityRating >= 4).toList()
        : products;
    
    // Apply sorting
    switch (_sortBy) {
      case 'price_low':
        filteredProducts.sort((a, b) => a.currentPrice.compareTo(b.currentPrice));
        break;
      case 'price_high':
        filteredProducts.sort((a, b) => b.currentPrice.compareTo(a.currentPrice));
        break;
      case 'newest':
      default:
        // Already sorted by newest in the backend
        break;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(_getCategoryTitle()),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              _showSearchDialog();
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              _showFilterDialog();
            },
          ),
        ],
      ),
      body: productsProvider.isLoading
          ? const Center(child: CircularProgressIndicator())
          : filteredProducts.isEmpty
              ? const Center(child: Text('No products found'))
              : RefreshIndicator(
                  onRefresh: () async {
                    await _loadProducts();
                  },
                  child: GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 2/3,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: filteredProducts.length,
                    itemBuilder: (ctx, i) => ProductCard(
                      product: filteredProducts[i],
                    ),
                  ),
                ),
    );
  }

  String _getCategoryTitle() {
    if (_searchQuery != null && _searchQuery!.isNotEmpty) {
      return 'Search: $_searchQuery';
    }
    
    if (_sustainabilityFilter) {
      return 'Sustainable Products';
    }
    
    if (_categorySlug != null) {
      final category = Provider.of<ProductsProvider>(context, listen: false)
          .getCategoryBySlug(_categorySlug!);
      return category?.name ?? 'Products';
    }
    
    return 'All Products';
  }

  void _showSearchDialog() {
    final searchController = TextEditingController(text: _searchQuery);
    
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Search Products'),
        content: TextField(
          controller: searchController,
          decoration: const InputDecoration(
            hintText: 'Enter product name or keyword',
            prefixIcon: Icon(Icons.search),
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
            },
            child: const Text('CANCEL'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _searchQuery = searchController.text.trim();
                _loadProducts();
              });
              Navigator.of(ctx).pop();
            },
            child: const Text('SEARCH'),
          ),
        ],
      ),
    );
  }

  void _showFilterDialog() {
    String tempSortBy = _sortBy;
    bool tempSustainabilityFilter = _sustainabilityFilter;
    
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Filter & Sort'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Sort By',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              RadioListTile<String>(
                title: const Text('Newest'),
                value: 'newest',
                groupValue: tempSortBy,
                onChanged: (value) {
                  setState(() {
                    tempSortBy = value!;
                  });
                },
              ),
              RadioListTile<String>(
                title: const Text('Price: Low to High'),
                value: 'price_low',
                groupValue: tempSortBy,
                onChanged: (value) {
                  setState(() {
                    tempSortBy = value!;
                  });
                },
              ),
              RadioListTile<String>(
                title: const Text('Price: High to Low'),
                value: 'price_high',
                groupValue: tempSortBy,
                onChanged: (value) {
                  setState(() {
                    tempSortBy = value!;
                  });
                },
              ),
              const Divider(),
              const Text(
                'Filters',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SwitchListTile(
                title: const Text('Sustainable Products Only'),
                value: tempSustainabilityFilter,
                onChanged: (value) {
                  setState(() {
                    tempSustainabilityFilter = value;
                  });
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(ctx).pop();
              },
              child: const Text('CANCEL'),
            ),
            TextButton(
              onPressed: () {
                this.setState(() {
                  _sortBy = tempSortBy;
                  _sustainabilityFilter = tempSustainabilityFilter;
                });
                Navigator.of(ctx).pop();
              },
              child: const Text('APPLY'),
            ),
          ],
        ),
      ),
    );
  }
}