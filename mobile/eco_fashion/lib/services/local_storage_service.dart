import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/category.dart';
import '../models/product.dart';
import '../models/product_variant.dart';
import '../models/cart_item.dart';
import '../models/user.dart';

class LocalStorageService {
  static const String _productsKey = 'products';
  static const String _categoriesKey = 'categories';
  static const String _cartItemsKey = 'cart_items';
  static const String _userKey = 'user';
  static const String _orderHistoryKey = 'order_history';

  // Load sample products data
  Future<List<Product>> loadSampleProducts() async {
    // This would typically come from an API, but we're loading from a local JSON
    final productsData = sampleProductsData;
    final List<Product> products = [];
    
    for (var productJson in productsData) {
      try {
        products.add(Product.fromJson(productJson));
      } catch (e) {
        print('Error parsing product: $e');
      }
    }
    
    // Save to local storage
    await saveProducts(products);
    
    return products;
  }

  // Load sample categories data
  Future<List<Category>> loadSampleCategories() async {
    // This would typically come from an API, but we're loading from a local JSON
    final categoriesData = sampleCategoriesData;
    final List<Category> categories = [];
    
    for (var categoryJson in categoriesData) {
      try {
        categories.add(Category.fromJson(categoryJson));
      } catch (e) {
        print('Error parsing category: $e');
      }
    }
    
    // Save to local storage
    await saveCategories(categories);
    
    return categories;
  }

  // Save products to local storage
  Future<void> saveProducts(List<Product> products) async {
    final prefs = await SharedPreferences.getInstance();
    final productsJson = products.map((product) => jsonEncode(product)).toList();
    await prefs.setStringList(_productsKey, productsJson);
  }

  // Get products from local storage
  Future<List<Product>> getProducts() async {
    final prefs = await SharedPreferences.getInstance();
    final productsJson = prefs.getStringList(_productsKey);
    
    if (productsJson == null || productsJson.isEmpty) {
      return await loadSampleProducts();
    }
    
    final List<Product> products = [];
    for (var productJson in productsJson) {
      try {
        products.add(Product.fromJson(jsonDecode(productJson)));
      } catch (e) {
        print('Error loading product: $e');
      }
    }
    
    return products;
  }

  // Save categories to local storage
  Future<void> saveCategories(List<Category> categories) async {
    final prefs = await SharedPreferences.getInstance();
    final categoriesJson = categories.map((category) => jsonEncode(category)).toList();
    await prefs.setStringList(_categoriesKey, categoriesJson);
  }

  // Get categories from local storage
  Future<List<Category>> getCategories() async {
    final prefs = await SharedPreferences.getInstance();
    final categoriesJson = prefs.getStringList(_categoriesKey);
    
    if (categoriesJson == null || categoriesJson.isEmpty) {
      return await loadSampleCategories();
    }
    
    final List<Category> categories = [];
    for (var categoryJson in categoriesJson) {
      try {
        categories.add(Category.fromJson(jsonDecode(categoryJson)));
      } catch (e) {
        print('Error loading category: $e');
      }
    }
    
    return categories;
  }

  // Save cart items to local storage
  Future<void> saveCartItems(List<CartItem> cartItems) async {
    final prefs = await SharedPreferences.getInstance();
    final cartItemsJson = cartItems.map((item) => jsonEncode(item)).toList();
    await prefs.setStringList(_cartItemsKey, cartItemsJson);
  }

  // Get cart items from local storage
  Future<List<CartItem>> getCartItems() async {
    final prefs = await SharedPreferences.getInstance();
    final cartItemsJson = prefs.getStringList(_cartItemsKey);
    
    if (cartItemsJson == null) {
      return [];
    }
    
    final List<CartItem> cartItems = [];
    for (var itemJson in cartItemsJson) {
      try {
        cartItems.add(CartItem.fromJson(jsonDecode(itemJson)));
      } catch (e) {
        print('Error loading cart item: $e');
      }
    }
    
    return cartItems;
  }

  // Save user to local storage
  Future<void> saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(user));
  }

  // Get user from local storage
  Future<User?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(_userKey);
    
    if (userJson == null) {
      return null;
    }
    
    try {
      return User.fromJson(jsonDecode(userJson));
    } catch (e) {
      print('Error loading user: $e');
      return null;
    }
  }

  // Remove user from local storage (logout)
  Future<void> removeUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_userKey);
  }

  // Save orders to local storage
  Future<void> saveOrders(List<Map<String, dynamic>> orders) async {
    final prefs = await SharedPreferences.getInstance();
    final ordersJson = orders.map((order) => jsonEncode(order)).toList();
    await prefs.setStringList(_orderHistoryKey, ordersJson);
  }

  // Get orders from local storage
  Future<List<Map<String, dynamic>>> getOrders() async {
    final prefs = await SharedPreferences.getInstance();
    final ordersJson = prefs.getStringList(_orderHistoryKey);
    
    if (ordersJson == null) {
      return [];
    }
    
    final List<Map<String, dynamic>> orders = [];
    for (var orderJson in ordersJson) {
      try {
        orders.add(jsonDecode(orderJson));
      } catch (e) {
        print('Error loading order: $e');
      }
    }
    
    return orders;
  }

  // Add new order to local storage
  Future<void> addOrder(Map<String, dynamic> order) async {
    final orders = await getOrders();
    orders.add(order);
    await saveOrders(orders);
  }

  // Sample data
  static final List<Map<String, dynamic>> sampleCategoriesData = [
    {
      "id": 1,
      "name": "Tops",
      "slug": "tops",
      "description": "Eco-friendly tops made from sustainable materials",
    },
    {
      "id": 2,
      "name": "Bottoms",
      "slug": "bottoms",
      "description": "Sustainable pants, shorts, and skirts",
    },
    {
      "id": 3,
      "name": "Dresses",
      "slug": "dresses",
      "description": "Elegant dresses made from organic materials",
    },
    {
      "id": 4,
      "name": "Outerwear",
      "slug": "outerwear",
      "description": "Sustainable jackets and coats for all seasons",
    },
    {
      "id": 5,
      "name": "Accessories",
      "slug": "accessories",
      "description": "Eco-friendly bags, scarves, and more",
    }
  ];

  static final List<Map<String, dynamic>> sampleProductsData = [
    {
      "id": 1,
      "title": "Organic Cotton T-Shirt",
      "slug": "organic-cotton-t-shirt",
      "category": 1,
      "category_name": "Tops",
      "description": "This classic t-shirt is made from 100% GOTS-certified organic cotton, grown without harmful pesticides or synthetic fertilizers. The production process uses 70% less water than conventional cotton, and natural dyes make this a truly eco-friendly essential.",
      "price": "29.99",
      "discount_price": null,
      "inventory": 100,
      "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": true,
      "is_active": true,
      "materials": "100% Organic Cotton",
      "sustainability_rating": 5,
      "variants": [
        {
          "id": 1,
          "product": 1,
          "size": "S",
          "color": "Natural White",
          "stock": 25,
          "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 2,
          "product": 1,
          "size": "M",
          "color": "Natural White",
          "stock": 30,
          "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 3,
          "product": 1,
          "size": "L",
          "color": "Natural White",
          "stock": 25,
          "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 4,
          "product": 1,
          "size": "XL",
          "color": "Natural White",
          "stock": 20,
          "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 5,
          "product": 1,
          "size": "S",
          "color": "Sage Green",
          "stock": 25,
          "image_url": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 6,
          "product": 1,
          "size": "M",
          "color": "Sage Green",
          "stock": 30,
          "image_url": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 7,
          "product": 1,
          "size": "L",
          "color": "Sage Green",
          "stock": 25,
          "image_url": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 8,
          "product": 1,
          "size": "XL",
          "color": "Sage Green",
          "stock": 20,
          "image_url": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    {
      "id": 2,
      "title": "Hemp Blend Joggers",
      "slug": "hemp-blend-joggers",
      "category": 2,
      "category_name": "Bottoms",
      "description": "These comfortable joggers are crafted from a sustainable hemp and organic cotton blend. Hemp requires minimal water and no pesticides to grow, making it one of the most environmentally friendly natural fibers available. The relaxed fit and natural elasticity provide all-day comfort.",
      "price": "59.99",
      "discount_price": "49.99",
      "inventory": 75,
      "image_url": "https://images.unsplash.com/photo-1514311548104-ae305aac4688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": true,
      "is_active": true,
      "materials": "55% Hemp, 45% Organic Cotton",
      "sustainability_rating": 5,
      "variants": [
        {
          "id": 9,
          "product": 2,
          "size": "S",
          "color": "Earth Brown",
          "stock": 15,
          "image_url": "https://images.unsplash.com/photo-1514311548104-ae305aac4688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 10,
          "product": 2,
          "size": "M",
          "color": "Earth Brown",
          "stock": 20,
          "image_url": "https://images.unsplash.com/photo-1514311548104-ae305aac4688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 11,
          "product": 2,
          "size": "L",
          "color": "Earth Brown",
          "stock": 25,
          "image_url": "https://images.unsplash.com/photo-1514311548104-ae305aac4688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        },
        {
          "id": 12,
          "product": 2,
          "size": "XL",
          "color": "Earth Brown",
          "stock": 15,
          "image_url": "https://images.unsplash.com/photo-1514311548104-ae305aac4688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    {
      "id": 3,
      "title": "Tencel Maxi Dress",
      "slug": "tencel-maxi-dress",
      "category": 3,
      "category_name": "Dresses",
      "description": "This flowing maxi dress is made from Tencel lyocell, a sustainable fiber produced from wood pulp in a closed-loop process that reuses water and solvents. The fabric is biodegradable, incredibly soft, and drapes beautifully for an elegant silhouette.",
      "price": "89.99",
      "discount_price": null,
      "inventory": 50,
      "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": true,
      "is_active": true,
      "materials": "100% Tencel Lyocell",
      "sustainability_rating": 4,
      "variants": [
        {
          "id": 13,
          "product": 3,
          "size": "S",
          "color": "Navy Blue",
          "stock": 15,
          "image_url": null
        },
        {
          "id": 14,
          "product": 3,
          "size": "M",
          "color": "Navy Blue",
          "stock": 20,
          "image_url": null
        },
        {
          "id": 15,
          "product": 3,
          "size": "L",
          "color": "Navy Blue",
          "stock": 15,
          "image_url": null
        }
      ]
    },
    {
      "id": 4,
      "title": "Recycled Polyester Puffer Jacket",
      "slug": "recycled-polyester-puffer-jacket",
      "category": 4,
      "category_name": "Outerwear",
      "description": "Stay warm while reducing plastic waste with this puffer jacket made from 100% recycled polyester. Each jacket contains approximately 20 recycled plastic bottles that would otherwise end up in landfills or oceans. The insulation provides excellent warmth without using any animal products.",
      "price": "129.99",
      "discount_price": null,
      "inventory": 40,
      "image_url": "https://images.unsplash.com/photo-1548126032-079a0fb0099d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": true,
      "is_active": true,
      "materials": "100% Recycled Polyester",
      "sustainability_rating": 4,
      "variants": []
    },
    {
      "id": 5,
      "title": "Cork and Jute Tote Bag",
      "slug": "cork-jute-tote-bag",
      "category": 5,
      "category_name": "Accessories",
      "description": "This durable tote combines two highly sustainable materials: cork and jute. Cork is harvested without harming trees, while jute is a fast-growing plant requiring minimal water and no pesticides. The spacious interior makes it perfect for shopping, beach trips, or daily use.",
      "price": "39.99",
      "discount_price": null,
      "inventory": 60,
      "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": false,
      "is_active": true,
      "materials": "Natural Cork, Jute",
      "sustainability_rating": 5,
      "variants": []
    },
    {
      "id": 6,
      "title": "Bamboo Long Sleeve Shirt",
      "slug": "bamboo-long-sleeve-shirt",
      "category": 1,
      "category_name": "Tops",
      "description": "This versatile button-down shirt is crafted from bamboo viscose, one of the fastest growing plants on Earth. Bamboo requires no pesticides, minimal water, and absorbs more CO2 than cotton. The fabric has natural temperature-regulating properties, keeping you cool in summer and warm in winter.",
      "price": "69.99",
      "discount_price": null,
      "inventory": 80,
      "image_url": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": false,
      "is_active": true,
      "materials": "70% Bamboo Viscose, 30% Organic Cotton",
      "sustainability_rating": 4,
      "variants": []
    },
    {
      "id": 7,
      "title": "Linen Palazzo Pants",
      "slug": "linen-palazzo-pants",
      "category": 2,
      "category_name": "Bottoms",
      "description": "These breezy palazzo pants are made from 100% European flax linen, a highly sustainable fiber that requires minimal water and pesticides. Linen is biodegradable, durable, and becomes softer with each wash. The wide-leg design offers comfort and timeless style.",
      "price": "79.99",
      "discount_price": null,
      "inventory": 45,
      "image_url": "https://images.unsplash.com/photo-1592301933927-35b597393c0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": false,
      "is_active": true,
      "materials": "100% Linen",
      "sustainability_rating": 5,
      "variants": []
    },
    {
      "id": 8,
      "title": "Organic Cotton Wrap Dress",
      "slug": "organic-cotton-wrap-dress",
      "category": 3,
      "category_name": "Dresses",
      "description": "This flattering wrap dress is made from 100% GOTS-certified organic cotton. The versatile design can be dressed up or down, making it a sustainable staple for any wardrobe. The fabric is breathable, soft, and free from harmful chemicals.",
      "price": "84.99",
      "discount_price": "69.99",
      "inventory": 35,
      "image_url": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": false,
      "is_active": true,
      "materials": "100% Organic Cotton",
      "sustainability_rating": 5,
      "variants": []
    },
    {
      "id": 9,
      "title": "Wool & Organic Cotton Cardigan",
      "slug": "wool-organic-cotton-cardigan",
      "category": 4,
      "category_name": "Outerwear",
      "description": "This cozy cardigan blends ZQ-certified merino wool (from sheep raised with high animal welfare standards) with organic cotton. The classic design features sustainable coconut shell buttons and a relaxed fit that pairs well with any outfit.",
      "price": "99.99",
      "discount_price": null,
      "inventory": 30,
      "image_url": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": false,
      "is_active": true,
      "materials": "60% ZQ-Certified Merino Wool, 40% Organic Cotton",
      "sustainability_rating": 4,
      "variants": []
    },
    {
      "id": 10,
      "title": "Recycled Silver Earrings",
      "slug": "recycled-silver-earrings",
      "category": 5,
      "category_name": "Accessories",
      "description": "These elegant earrings are handcrafted from 100% recycled sterling silver. By using reclaimed metal, we reduce the environmental impact of mining while creating beautiful, timeless jewelry. Each pair is unique with subtle variations that celebrate artisanal craftsmanship.",
      "price": "49.99",
      "discount_price": null,
      "inventory": 25,
      "image_url": "https://images.unsplash.com/photo-1633810541231-6e8d87410d7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      "is_featured": false,
      "is_active": true,
      "materials": "100% Recycled Sterling Silver",
      "sustainability_rating": 4,
      "variants": []
    }
  ];
}