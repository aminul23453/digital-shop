import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService;
  User? _user;
  bool _isLoading = false;
  String? _error;

  AuthProvider(this._apiService) {
    _checkAuth();
  }

  User? get user => _user;
  bool get isAuthenticated => _user != null;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> _checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    if (token != null) {
      try {
        _isLoading = true;
        notifyListeners();
        _user = await _apiService.getUserProfile();
      } catch (e) {
        _error = 'Session expired. Please login again.';
        await logout();
      } finally {
        _isLoading = false;
        notifyListeners();
      }
    }
  }

  Future<bool> login(String username, String password) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final success = await _apiService.login(username, password);
      
      if (success) {
        _user = await _apiService.getUserProfile();
        _error = null;
        notifyListeners();
        return true;
      } else {
        _error = 'Invalid username or password';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Failed to login. Please try again.';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> register(String username, String email, String password) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      final success = await _apiService.register(username, email, password);
      
      if (success) {
        return await login(username, password);
      } else {
        _error = 'Failed to create account. Username or email already exists.';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'Registration failed. Please try again.';
      notifyListeners();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await _apiService.logout();
    _user = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}