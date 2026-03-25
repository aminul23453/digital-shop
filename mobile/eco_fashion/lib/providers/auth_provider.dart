import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService;
  User? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider(this._authService) {
    _checkAuth();
  }

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuth => _user != null;

  // Check if user is already authenticated
  Future<void> _checkAuth() async {
    _isLoading = true;
    notifyListeners();

    try {
      final isLoggedIn = await _authService.isLoggedIn();
      
      if (isLoggedIn) {
        _user = await _authService.getCurrentUser();
      }
    } catch (error) {
      print('Error checking auth status: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Login
  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _authService.login(username, password);
      
      if (!success) {
        _error = 'Invalid username or password.';
        return false;
      }
      
      _user = await _authService.getCurrentUser();
      return true;
    } catch (error) {
      _error = 'Login failed. Please try again.';
      print('Error during login: $error');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Register
  Future<bool> register(String username, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _authService.register(username, email, password);
      
      if (!success) {
        _error = 'Registration failed. Please try again.';
        return false;
      }
      
      _user = await _authService.getCurrentUser();
      return true;
    } catch (error) {
      _error = 'Registration failed. Please try again.';
      print('Error during registration: $error');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Logout
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _authService.logout();
      _user = null;
    } catch (error) {
      print('Error during logout: $error');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Update profile
  Future<bool> updateProfile(String firstName, String lastName) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final success = await _authService.updateProfile(firstName, lastName);
      
      if (!success) {
        _error = 'Failed to update profile.';
        return false;
      }
      
      _user = await _authService.getCurrentUser();
      return true;
    } catch (error) {
      _error = 'Failed to update profile.';
      print('Error updating profile: $error');
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}