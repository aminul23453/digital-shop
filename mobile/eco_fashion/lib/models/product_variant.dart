class ProductVariant {
  final int id;
  final int productId;
  final String size;
  final String color;
  final int stock;
  final String? imageUrl;

  ProductVariant({
    required this.id,
    required this.productId,
    required this.size,
    required this.color,
    required this.stock,
    this.imageUrl,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) {
    return ProductVariant(
      id: json['id'],
      productId: json['product'],
      size: json['size'],
      color: json['color'],
      stock: json['stock'],
      imageUrl: json['image_url'],
    );
  }
}