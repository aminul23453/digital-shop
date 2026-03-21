import '../models/cart_item.dart';
import '../models/product.dart';
import '../models/product_variant.dart';
import 'local_storage_service.dart';
import 'product_service.dart';

class CartService {
  final LocalStorageService _storageService = LocalStorageService();
  final ProductService _productService = ProductService();
  
  // Get cart items
  Future<List<CartItem>> getCartItems() async {
    return await _storageService.getCartItems();
  }
  
  // Add item to cart
  Future<CartItem?> addToCart(int productId, int quantity, {int? variantId}) async {
    // Get product details
    final product = await _productService.getProductBySlug(productId.toString());
    if (product == null) {
      return null;
    }
    
    // Check if product has variants and validate the variant exists
    ProductVariant? variant;
    if (variantId != null && product.variants != null) {
      try {
        variant = product.variants!.firstWhere((v) => v.id == variantId);
      } catch (e) {
        return null; // Variant not found
      }
    }
    
    // Check inventory
    final availableStock = variant != null 
        ? variant.stock 
        : product.inventory;
    
    if (availableStock < quantity) {
      return null; // Not enough stock
    }
    
    // Get existing cart items
    final cartItems = await _storageService.getCartItems();
    
    // Check if item already exists in cart
    final existingItemIndex = cartItems.indexWhere((item) => 
      item.productId == product.id && item.variantId == variantId
    );
    
    if (existingItemIndex != -1) {
      // Update existing item
      final existingItem = cartItems[existingItemIndex];
      final newQuantity = existingItem.quantity + quantity;
      
      // Check if new quantity exceeds available stock
      if (newQuantity > availableStock) {
        return null; // Not enough stock
      }
      
      // Update cart item
      final updatedItem = existingItem.copyWithUpdatedQuantity(newQuantity);
      cartItems[existingItemIndex] = updatedItem;
      await _storageService.saveCartItems(cartItems);
      return updatedItem;
    } else {
      // Add new cart item
      final newItemId = cartItems.isNotEmpty 
          ? cartItems.map((item) => item.id).reduce((a, b) => a > b ? a : b) + 1 
          : 1;
          
      final newItem = CartItem.fromProduct(
        id: newItemId,
        productId: product.id,
        productTitle: product.title,
        productImage: product.imageUrl,
        variantId: variantId,
        size: variant?.size,
        color: variant?.color,
        quantity: quantity,
        price: product.currentPrice,
      );
      
      cartItems.add(newItem);
      await _storageService.saveCartItems(cartItems);
      return newItem;
    }
  }
  
  // Update cart item quantity
  Future<bool> updateCartItemQuantity(int itemId, int quantity) async {
    final cartItems = await _storageService.getCartItems();
    final itemIndex = cartItems.indexWhere((item) => item.id == itemId);
    
    if (itemIndex == -1) {
      return false; // Item not found
    }
    
    final item = cartItems[itemIndex];
    
    // Check available stock
    Product? product = await _productService.getProductBySlug(item.productId.toString());
    if (product == null) {
      return false;
    }
    
    final availableStock = item.variantId != null && product.variants != null
        ? product.variants!.firstWhere((v) => v.id == item.variantId, orElse: () => 
            ProductVariant(
              id: -1, 
              productId: product.id, 
              size: '', 
              color: '', 
              stock: 0
            )
          ).stock
        : product.inventory;
    
    if (quantity > availableStock) {
      return false; // Not enough stock
    }
    
    // Update cart item
    cartItems[itemIndex] = item.copyWithUpdatedQuantity(quantity);
    await _storageService.saveCartItems(cartItems);
    return true;
  }
  
  // Remove item from cart
  Future<bool> removeCartItem(int itemId) async {
    final cartItems = await _storageService.getCartItems();
    final filteredItems = cartItems.where((item) => item.id != itemId).toList();
    
    if (filteredItems.length == cartItems.length) {
      return false; // Item not found
    }
    
    await _storageService.saveCartItems(filteredItems);
    return true;
  }
  
  // Clear cart
  Future<void> clearCart() async {
    await _storageService.saveCartItems([]);
  }
  
  // Calculate subtotal
  Future<double> getSubtotal() async {
    final cartItems = await _storageService.getCartItems();
    return cartItems.fold(0, (sum, item) => sum + item.totalPrice);
  }
  
  // Calculate shipping cost
  Future<double> getShippingCost() async {
    final subtotal = await getSubtotal();
    return subtotal >= 100 ? 0 : 7.99; // Free shipping over $100
  }
  
  // Calculate tax
  Future<double> getTax() async {
    final subtotal = await getSubtotal();
    return subtotal * 0.08; // 8% tax
  }
  
  // Calculate total
  Future<double> getTotal() async {
    final subtotal = await getSubtotal();
    final shipping = await getShippingCost();
    final tax = await getTax();
    return subtotal + shipping + tax;
  }
}