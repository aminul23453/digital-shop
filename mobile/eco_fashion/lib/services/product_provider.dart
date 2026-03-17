import 'package:flutter/material.dart';
import '../models/category.dart';
import '../models/product.dart';
import 'api_service.dart';

class ProductProvider with ChangeNotifier {
  final ApiService _apiService;
  List<Category> _categories = [];
  List<Product> _products = [];
  Product? _selectedProduct;
  String? _selectedCategorySlug;
  String? _searchQuery;
  bool _isLoading = false;
  String? _error;

  ProductProvider(this._apiService) {
    loadCategories();
    loadProducts();
  }

  List<Category> get categories => _categories;
  List<Product> get products => _products;
  Product? get selectedProduct => _selectedProduct;
  String? get selectedCategorySlug => _selectedCategorySlug;
  String? get searchQuery => _searchQuery;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  List<Product> get featuredProducts => 
      _products.where((product) => product.isFeatured).toList();

  Future<void> loadCategories() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      _categories = await _apiService.getCategories();
    } catch (e) {
      _error = 'Failed to load categories';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadProducts() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      _products = await _apiService.getProducts(
        categorySlug: _selectedCategorySlug,
        search: _searchQuery,
      );
    } catch (e) {
      _error = 'Failed to load products';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadProductDetails(String slug) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      _selectedProduct = await _apiService.getProductDetail(slug);
    } catch (e) {
      _error = 'Failed to load product details';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void setSelectedCategory(String? categorySlug) {
    _selectedCategorySlug = categorySlug;
    loadProducts();
  }

  void setSearchQuery(String? query) {
    _searchQuery = query;
    loadProducts();
  }

  void clearSelectedProduct() {
    _selectedProduct = null;
    notifyListeners();
  }

  void clearFilters() {
    _selectedCategorySlug = null;
    _searchQuery = null;
    loadProducts();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}