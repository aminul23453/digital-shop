import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../services/cart_service.dart';

class CartProvider with ChangeNotifier {
  final CartService _cartService;
  List<CartItem> _cartItems = [];
  bool _isLoading = false;
  String? _error;
  
  // Cart summary variables
  double _subtotal = 0;
  double _shipping = 0;
  double _tax = 0;
  double _total = 0;

  CartProvider(this._cartService) {
    loadCartItems();
  }

  List<CartItem> get cartItems => [..._cartItems];
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get itemCount => _cartItems.length;
  int get totalQuantity => _cartItems.fold(0, (sum, item) => sum + item.quantity);
  double get subtotal => _subtotal;
  double get shipping => _shipping;
  double get tax => _tax;
  double get total => _total;

  // Load cart items
  Future<void> loadCartItems() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _cartItems = await _cartService.getCartItems();
      await _updateCartSummary();
    } catch (error) {
      _error = 'Failed to load cart items.';
      print('Error loading cart items: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Add item to cart
  Future<bool> addToCart(int productId, int quantity, {int? variantId}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final newItem = await _cartService.addToCart(productId, quantity, variantId: variantId);
      
      if (newItem == null) {
        _error = 'Failed to add item to cart. Item may be out of stock.';
        return false;
      }
      
      await loadCartItems(); // Reload all cart items to get the updated list
      return true;
    } catch (error) {
      _error = 'Failed to add item to cart.';
      print('Error adding item to cart: $error');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Update cart item quantity
  Future<bool> updateCartItemQuantity(int itemId, int quantity) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _cartService.updateCartItemQuantity(itemId, quantity);
      
      if (!success) {
        _error = 'Failed to update item quantity. Item may be out of stock.';
        return false;
      }
      
      await loadCartItems(); // Reload all cart items to get the updated list
      return true;
    } catch (error) {
      _error = 'Failed to update item quantity.';
      print('Error updating item quantity: $error');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Remove item from cart
  Future<bool> removeFromCart(int itemId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _cartService.removeCartItem(itemId);
      
      if (!success) {
        _error = 'Failed to remove item from cart.';
        return false;
      }
      
      await loadCartItems(); // Reload all cart items to get the updated list
      return true;
    } catch (error) {
      _error = 'Failed to remove item from cart.';
      print('Error removing item from cart: $error');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Clear cart
  Future<bool> clearCart() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _cartService.clearCart();
      await loadCartItems(); // Reload all cart items to get the updated list
      return true;
    } catch (error) {
      _error = 'Failed to clear cart.';
      print('Error clearing cart: $error');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Update cart summary
  Future<void> _updateCartSummary() async {
    try {
      _subtotal = await _cartService.getSubtotal();
      _shipping = await _cartService.getShippingCost();
      _tax = await _cartService.getTax();
      _total = await _cartService.getTotal();
    } catch (error) {
      print('Error updating cart summary: $error');
    }
  }
}