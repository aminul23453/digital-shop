import '../models/product.dart';
import '../models/category.dart';
import 'local_storage_service.dart';

class ProductService {
  final LocalStorageService _storageService = LocalStorageService();
  
  // Get all products
  Future<List<Product>> getProducts({String? categorySlug, String? search}) async {
    final List<Product> products = await _storageService.getProducts();
    
    if (categorySlug == null && search == null) {
      return products;
    }
    
    // Filter by category if specified
    List<Product> filteredProducts = products;
    if (categorySlug != null) {
      final categories = await _storageService.getCategories();
      final category = categories.firstWhere(
        (c) => c.slug == categorySlug,
        orElse: () => Category(id: -1, name: "", slug: ""),
      );
      
      if (category.id != -1) {
        filteredProducts = filteredProducts.where((p) => p.categoryId == category.id).toList();
      }
    }
    
    // Filter by search query if specified
    if (search != null && search.isNotEmpty) {
      final searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.where((product) => 
        product.title.toLowerCase().contains(searchLower) || 
        product.description.toLowerCase().contains(searchLower) ||
        (product.materials?.toLowerCase().contains(searchLower) ?? false)
      ).toList();
    }
    
    return filteredProducts;
  }
  
  // Get featured products
  Future<List<Product>> getFeaturedProducts() async {
    final List<Product> products = await _storageService.getProducts();
    return products.where((product) => product.isFeatured).toList();
  }
  
  // Get product by slug
  Future<Product?> getProductBySlug(String slug) async {
    final List<Product> products = await _storageService.getProducts();
    try {
      return products.firstWhere((product) => product.slug == slug);
    } catch (e) {
      return null;
    }
  }
  
  // Get all categories
  Future<List<Category>> getCategories() async {
    return await _storageService.getCategories();
  }
  
  // Update product inventory after purchase
  Future<void> updateProductInventory(int productId, int quantityPurchased) async {
    final List<Product> products = await _storageService.getProducts();
    final index = products.indexWhere((p) => p.id == productId);
    
    if (index != -1) {
      final product = products[index];
      final newInventory = product.inventory - quantityPurchased;
      
      if (newInventory >= 0) {
        products[index] = product.copyWithUpdatedInventory(newInventory);
        await _storageService.saveProducts(products);
      }
    }
  }
  
  // Update product variant stock after purchase
  Future<void> updateVariantStock(int productId, int variantId, int quantityPurchased) async {
    final List<Product> products = await _storageService.getProducts();
    final productIndex = products.indexWhere((p) => p.id == productId);
    
    if (productIndex != -1 && products[productIndex].variants != null) {
      final product = products[productIndex];
      final variants = List.of(product.variants!);
      final variantIndex = variants.indexWhere((v) => v.id == variantId);
      
      if (variantIndex != -1) {
        final variant = variants[variantIndex];
        final newStock = variant.stock - quantityPurchased;
        
        if (newStock >= 0) {
          variants[variantIndex] = variant.copyWithUpdatedStock(newStock);
          
          // Create a new product with updated variants
          final updatedProduct = Product(
            id: product.id,
            title: product.title,
            slug: product.slug,
            categoryId: product.categoryId,
            categoryName: product.categoryName,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice,
            inventory: product.inventory,
            imageUrl: product.imageUrl,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            materials: product.materials,
            sustainabilityRating: product.sustainabilityRating,
            variants: variants,
          );
          
          products[productIndex] = updatedProduct;
          await _storageService.saveProducts(products);
        }
      }
    }
  }
}