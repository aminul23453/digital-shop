import 'product_variant.dart';

class Product {
  final int id;
  final String title;
  final String slug;
  final int categoryId;
  final String categoryName;
  final String description;
  final double price;
  final double? discountPrice;
  final int inventory;
  final String imageUrl;
  final bool isFeatured;
  final bool isActive;
  final String? materials;
  final int sustainabilityRating;
  final List<ProductVariant>? variants;

  Product({
    required this.id,
    required this.title,
    required this.slug,
    required this.categoryId,
    required this.categoryName,
    required this.description,
    required this.price,
    this.discountPrice,
    required this.inventory,
    required this.imageUrl,
    required this.isFeatured,
    required this.isActive,
    this.materials,
    required this.sustainabilityRating,
    this.variants,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    List<ProductVariant>? variants;
    if (json.containsKey('variants') && json['variants'] != null) {
      variants = (json['variants'] as List)
          .map((variantJson) => ProductVariant.fromJson(variantJson))
          .toList();
    }

    return Product(
      id: json['id'],
      title: json['title'],
      slug: json['slug'],
      categoryId: json['category'],
      categoryName: json['category_name'],
      description: json['description'],
      price: double.parse(json['price'].toString()),
      discountPrice: json['discount_price'] != null
          ? double.parse(json['discount_price'].toString())
          : null,
      inventory: json['inventory'],
      imageUrl: json['image_url'],
      isFeatured: json['is_featured'],
      isActive: json['is_active'],
      materials: json['materials'],
      sustainabilityRating: json['sustainability_rating'],
      variants: variants,
    );
  }

  double get currentPrice {
    return discountPrice ?? price;
  }

  double get discountPercentage {
    if (discountPrice == null) return 0;
    return ((price - discountPrice!) / price) * 100;
  }

  bool get isOnSale {
    return discountPrice != null;
  }
}