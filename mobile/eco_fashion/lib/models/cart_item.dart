import 'dart:convert';

class CartItem {
  final int id;
  final int productId;
  final String productTitle;
  final String productImage;
  final int? variantId;
  final String? size;
  final String? color;
  final int quantity;
  final double unitPrice;
  final double totalPrice;

  CartItem({
    required this.id,
    required this.productId,
    required this.productTitle,
    required this.productImage,
    this.variantId,
    this.size,
    this.color,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'],
      productId: json['product'],
      productTitle: json['product_title'],
      productImage: json['product_image'],
      variantId: json['variant'],
      size: json['size'],
      color: json['color'],
      quantity: json['quantity'],
      unitPrice: double.parse(json['unit_price'].toString()),
      totalPrice: double.parse(json['total_price'].toString()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product': productId,
      'product_title': productTitle,
      'product_image': productImage,
      'variant': variantId,
      'size': size,
      'color': color,
      'quantity': quantity,
      'unit_price': unitPrice.toString(),
      'total_price': totalPrice.toString(),
    };
  }

  String toJsonString() {
    return jsonEncode(toJson());
  }

  // Create a copy with updated quantity
  CartItem copyWithUpdatedQuantity(int newQuantity) {
    return CartItem(
      id: id,
      productId: productId,
      productTitle: productTitle,
      productImage: productImage,
      variantId: variantId,
      size: size,
      color: color,
      quantity: newQuantity,
      unitPrice: unitPrice,
      totalPrice: unitPrice * newQuantity,
    );
  }

  // Create a new cart item from a product
  static CartItem fromProduct({
    required int id,
    required int productId,
    required String productTitle,
    required String productImage,
    int? variantId,
    String? size,
    String? color,
    required int quantity,
    required double price,
  }) {
    return CartItem(
      id: id,
      productId: productId,
      productTitle: productTitle,
      productImage: productImage,
      variantId: variantId,
      size: size,
      color: color,
      quantity: quantity,
      unitPrice: price,
      totalPrice: price * quantity,
    );
  }
}