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
}