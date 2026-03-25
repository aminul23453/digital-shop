import 'package:flutter/foundation.dart';
import '../services/order_service.dart';

class OrderProvider with ChangeNotifier {
  final OrderService _orderService;
  List<Map<String, dynamic>> _orders = [];
  bool _isLoading = false;
  String? _error;

  OrderProvider(this._orderService) {
    loadOrders();
  }

  List<Map<String, dynamic>> get orders => [..._orders];
  bool get isLoading => _isLoading;
  String? get error => _error;

  // Load order history
  Future<void> loadOrders() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _orders = await _orderService.getOrderHistory();
    } catch (error) {
      _error = 'Failed to load orders.';
      print('Error loading orders: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Place a new order
  Future<Map<String, dynamic>?> placeOrder({
    required String email,
    required String shippingAddress,
    required String paymentMethod,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final order = await _orderService.placeOrder(
        email: email,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      );

      if (order == null) {
        _error = 'Failed to place order.';
        return null;
      }

      await loadOrders(); // Reload orders to get the updated list
      return order;
    } catch (error) {
      _error = 'Failed to place order.';
      print('Error placing order: $error');
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Get order details
  Future<Map<String, dynamic>?> getOrderDetails(String orderId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final order = await _orderService.getOrderDetails(orderId);

      if (order == null) {
        _error = 'Order not found.';
      }

      return order;
    } catch (error) {
      _error = 'Failed to load order details.';
      print('Error loading order details: $error');
      return null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}