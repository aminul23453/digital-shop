import 'package:flutter/material.dart';
import '../models/cart_item.dart';
import 'api_service.dart';

class CartProvider with ChangeNotifier {
  final ApiService _apiService;
  List<CartItem> _items = [];
  bool _isLoading = false;
  String? _error;

  CartProvider(this._apiService) {
    loadCart();
  }

  List<CartItem> get items => _items;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);
  
  double get subtotal => _items.fold(0, (sum, item) => sum + item.totalPrice);
  
  double get shippingCost {
    if (subtotal >= 100) return 0;  // Free shipping over $100
    return 7.99;
  }
  
  double get tax => subtotal * 0.08; // 8% tax
  
  double get total => subtotal + shippingCost + tax;

  Future<void> loadCart() async {
    try {
      _isLoading = true;
      notifyListeners();
      
      _items = await _apiService.getCartItems();
      _error = null;
    } catch (e) {
      _error = 'Failed to load cart items';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> addToCart(int productId, int quantity, {int? variantId}) async {
    try {
      _isLoading = true;
      notifyListeners();
      
      await _apiService.addToCart(productId, quantity, variantId: variantId);
      await loadCart();
    } catch (e) {
      _error = 'Failed to add item to cart';
      notifyListeners();
    }
  }

  Future<void> updateQuantity(int itemId, int quantity) async {
    try {
      final originalItems = List<CartItem>.from(_items);
      
      // Optimistic update
      final index = _items.indexWhere((item) => item.id == itemId);
      if (index != -1) {
        // Create a new CartItem with updated quantity
        // This is a simplified approach - in a real app, you'd create a copy with the new quantity
        _items = List.from(_items);
        // Due to immutability, this is just a placeholder for UI update
        // The actual updated item will come from the API
        notifyListeners();
      }

      await _apiService.updateCartItem(itemId, quantity);
      await loadCart();
    } catch (e) {
      _error = 'Failed to update quantity';
      notifyListeners();
    }
  }

  Future<void> removeItem(int itemId) async {
    try {
      final originalItems = List<CartItem>.from(_items);
      
      // Optimistic update
      _items = _items.where((item) => item.id != itemId).toList();
      notifyListeners();

      await _apiService.removeCartItem(itemId);
    } catch (e) {
      // Revert to original items if the API call fails
      _items = originalItems;
      _error = 'Failed to remove item from cart';
      notifyListeners();
    }
  }

  void clearCart() {
    _items = [];
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}