import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'models/user.dart';
import 'services/local_storage_service.dart';
import 'services/product_service.dart';
import 'services/cart_service.dart';
import 'services/auth_service.dart';
import 'services/order_service.dart';

import 'screens/splash_screen.dart';
import 'screens/home_screen.dart';
import 'screens/product_list_screen.dart';
import 'screens/product_detail_screen.dart';
import 'screens/cart_screen.dart';
import 'screens/checkout_screen.dart';
import 'screens/order_history_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';

import 'providers/products_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/order_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize services
  final localStorageService = LocalStorageService();
  final productService = ProductService();
  final cartService = CartService();
  final authService = AuthService();
  final orderService = OrderService();
  
  // Preload data
  await localStorageService.loadSampleProducts();
  await localStorageService.loadSampleCategories();
  
  runApp(MyApp(
    productService: productService,
    cartService: cartService,
    authService: authService,
    orderService: orderService,
  ));
}

class MyApp extends StatelessWidget {
  final ProductService productService;
  final CartService cartService;
  final AuthService authService;
  final OrderService orderService;
  
  const MyApp({
    Key? key,
    required this.productService,
    required this.cartService,
    required this.authService,
    required this.orderService,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (ctx) => ProductsProvider(productService),
        ),
        ChangeNotifierProvider(
          create: (ctx) => CartProvider(cartService),
        ),
        ChangeNotifierProvider(
          create: (ctx) => AuthProvider(authService),
        ),
        ChangeNotifierProvider(
          create: (ctx) => OrderProvider(orderService),
        ),
      ],
      child: Consumer<AuthProvider>(
        builder: (ctx, auth, _) => MaterialApp(
          title: 'Eco Fashion',
          theme: ThemeData(
            primarySwatch: Colors.green,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF4CAF50),
              background: const Color(0xFFF5F5F5),
              secondary: const Color(0xFF8BC34A),
              tertiary: const Color(0xFFCDDC39),
            ),
            fontFamily: 'Poppins',
            textTheme: const TextTheme(
              displayLarge: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF1B5E20)),
              displayMedium: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1B5E20)),
              displaySmall: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1B5E20)),
              headlineMedium: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: Color(0xFF2E7D32)),
              bodyLarge: TextStyle(fontSize: 16, color: Color(0xFF33691E)),
              bodyMedium: TextStyle(fontSize: 14, color: Color(0xFF33691E)),
            ),
            appBarTheme: const AppBarTheme(
              backgroundColor: Color(0xFF4CAF50),
              foregroundColor: Colors.white,
              elevation: 0,
            ),
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF8BC34A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
            cardTheme: CardTheme(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            inputDecorationTheme: InputDecorationTheme(
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: Color(0xFF8BC34A)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: const BorderSide(color: Color(0xFF4CAF50), width: 2),
              ),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
          home: const SplashScreen(),
          routes: {
            '/home': (ctx) => const HomeScreen(),
            '/products': (ctx) => const ProductListScreen(),
            '/product-detail': (ctx) => const ProductDetailScreen(),
            '/cart': (ctx) => const CartScreen(),
            '/checkout': (ctx) => const CheckoutScreen(),
            '/orders': (ctx) => const OrderHistoryScreen(),
            '/profile': (ctx) => const ProfileScreen(),
            '/login': (ctx) => const LoginScreen(),
            '/register': (ctx) => const RegisterScreen(),
          },
        ),
      ),
    );
  }
}