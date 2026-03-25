import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../models/category.dart';
import '../services/product_service.dart';

class ProductsProvider with ChangeNotifier {
  final ProductService _productService;
  List<Product> _products = [];
  List<Product> _featuredProducts = [];
  List<Category> _categories = [];
  bool _isLoading = false;
  String? _error;

  ProductsProvider(this._productService) {
    // Load initial data
    loadProducts();
    loadFeaturedProducts();
    loadCategories();
  }

  List<Product> get products => [..._products];
  List<Product> get featuredProducts => [..._featuredProducts];
  List<Category> get categories => [..._categories];
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load all products
  Future<void> loadProducts({String? categorySlug, String? search}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _products = await _productService.getProducts(
        categorySlug: categorySlug,
        search: search,
      );
    } catch (error) {
      _error = 'Failed to load products. Please try again.';
      print('Error loading products: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Load featured products
  Future<void> loadFeaturedProducts() async {
    try {
      _featuredProducts = await _productService.getFeaturedProducts();
      notifyListeners();
    } catch (error) {
      print('Error loading featured products: $error');
    }
  }

  // Load categories
  Future<void> loadCategories() async {
    try {
      _categories = await _productService.getCategories();
      notifyListeners();
    } catch (error) {
      print('Error loading categories: $error');
    }
  }

  // Get product by slug
  Future<Product?> getProductBySlug(String slug) async {
    try {
      return await _productService.getProductBySlug(slug);
    } catch (error) {
      print('Error getting product by slug: $error');
      return null;
    }
  }

  // Get category by slug
  Category? getCategoryBySlug(String slug) {
    try {
      return _categories.firstWhere((category) => category.slug == slug);
    } catch (error) {
      return null;
    }
  }
}