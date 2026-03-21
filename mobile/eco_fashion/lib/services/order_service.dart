import 'dart:math';
import 'package:intl/intl.dart';
import '../models/cart_item.dart';
import 'local_storage_service.dart';
import 'cart_service.dart';
import 'product_service.dart';

class OrderService {
  final LocalStorageService _storageService = LocalStorageService();
  final CartService _cartService = CartService();
  final ProductService _productService = ProductService();
  
  // Place an order
  Future<Map<String, dynamic>?> placeOrder({
    required String email,
    required String shippingAddress,
    required String paymentMethod,
  }) async {
    try {
      // Get cart items
      final cartItems = await _storageService.getCartItems();
      if (cartItems.isEmpty) {
        return null;
      }
      
      // Calculate totals
      final subtotal = await _cartService.getSubtotal();
      final shipping = await _cartService.getShippingCost();
      final tax = await _cartService.getTax();
      final total = subtotal + shipping + tax;
      
      // Generate order ID (would be done by server in real app)
      final random = Random();
      final orderId = 'ORD-${DateTime.now().millisecondsSinceEpoch}-${random.nextInt(1000)}';
      
      // Create order object
      final order = {
        'order_id': orderId,
        'email': email,
        'shipping_address': shippingAddress,
        'payment_method': paymentMethod,
        'subtotal': subtotal.toStringAsFixed(2),
        'shipping': shipping.toStringAsFixed(2),
        'tax': tax.toStringAsFixed(2),
        'total': total.toStringAsFixed(2),
        'status': 'processing',
        'created_at': DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now()),
        'items': cartItems.map((item) => {
          'product_id': item.productId,
          'product_title': item.productTitle,
          'product_image': item.productImage,
          'variant_id': item.variantId,
          'size': item.size,
          'color': item.color,
          'quantity': item.quantity,
          'price': item.unitPrice.toStringAsFixed(2),
          'total_price': item.totalPrice.toStringAsFixed(2),
        }).toList(),
      };
      
      // Save order
      await _storageService.addOrder(order);
      
      // Update inventory
      for (var item in cartItems) {
        await _productService.updateProductInventory(item.productId, item.quantity);
        
        if (item.variantId != null) {
          await _productService.updateVariantStock(
            item.productId, 
            item.variantId!,
            item.quantity
          );
        }
      }
      
      // Clear cart
      await _cartService.clearCart();
      
      return order;
    } catch (e) {
      print('Error placing order: $e');
      return null;
    }
  }
  
  // Get order history
  Future<List<Map<String, dynamic>>> getOrderHistory() async {
    return await _storageService.getOrders();
  }
  
  // Get order details
  Future<Map<String, dynamic>?> getOrderDetails(String orderId) async {
    final orders = await _storageService.getOrders();
    try {
      return orders.firstWhere((order) => order['order_id'] == orderId);
    } catch (e) {
      return null;
    }
  }
}