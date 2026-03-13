import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/category.dart';
import '../models/product.dart';
import '../models/cart_item.dart';
import '../models/user.dart';

class ApiService {
  final String baseUrl;
  String? _token;

  ApiService({required this.baseUrl});

  Future<void> loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
  }

  Map<String, String> get headers {
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
    };

    if (_token != null) {
      headers['Authorization'] = 'Token $_token';
    }

    return headers;
  }

  // Auth methods
  Future<bool> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      _token = data['token'];
      
      // Save token
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', _token!);
      
      return true;
    }
    return false;
  }

  Future<bool> register(String username, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users/register/'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
      }),
    );

    return response.statusCode == 201;
  }

  Future<void> logout() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  // Category methods
  Future<List<Category>> getCategories() async {
    final response = await http.get(
      Uri.parse('$baseUrl/categories/'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Category.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load categories');
    }
  }

  // Product methods
  Future<List<Product>> getProducts({String? categorySlug, String? search}) async {
    String url = '$baseUrl/products/';
    
    if (categorySlug != null) {
      url += '?category=$categorySlug';
    }
    
    if (search != null) {
      url += categorySlug != null ? '&search=$search' : '?search=$search';
    }

    final response = await http.get(
      Uri.parse(url),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Product.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load products');
    }
  }

  Future<Product> getProductDetail(String slug) async {
    final response = await http.get(
      Uri.parse('$baseUrl/products/$slug/'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return Product.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load product detail');
    }
  }

  // Cart methods
  Future<List<CartItem>> getCartItems() async {
    await loadToken();
    final response = await http.get(
      Uri.parse('$baseUrl/cart/'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => CartItem.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load cart items');
    }
  }

  Future<CartItem> addToCart(int productId, int quantity, {int? variantId}) async {
    await loadToken();
    final Map<String, dynamic> body = {
      'product': productId,
      'quantity': quantity,
    };

    if (variantId != null) {
      body['variant'] = variantId;
    }

    final response = await http.post(
      Uri.parse('$baseUrl/cart/'),
      headers: headers,
      body: jsonEncode(body),
    );

    if (response.statusCode == 201) {
      return CartItem.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to add item to cart');
    }
  }

  Future<void> updateCartItem(int itemId, int quantity) async {
    await loadToken();
    final response = await http.patch(
      Uri.parse('$baseUrl/cart/$itemId/'),
      headers: headers,
      body: jsonEncode({'quantity': quantity}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update cart item');
    }
  }

  Future<void> removeCartItem(int itemId) async {
    await loadToken();
    final response = await http.delete(
      Uri.parse('$baseUrl/cart/$itemId/'),
      headers: headers,
    );

    if (response.statusCode != 204) {
      throw Exception('Failed to remove cart item');
    }
  }

  // User methods
  Future<User> getUserProfile() async {
    await loadToken();
    final response = await http.get(
      Uri.parse('$baseUrl/users/me/'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load user profile');
    }
  }

  // Order methods
  Future<Map<String, dynamic>> createOrder(String email, String shippingAddress) async {
    await loadToken();
    final response = await http.post(
      Uri.parse('$baseUrl/orders/'),
      headers: headers,
      body: jsonEncode({
        'email': email,
        'shipping_address': shippingAddress,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to create order');
    }
  }
}