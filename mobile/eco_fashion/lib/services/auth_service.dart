import '../models/user.dart';
import 'local_storage_service.dart';

class AuthService {
  final LocalStorageService _storageService = LocalStorageService();
  
  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final user = await _storageService.getUser();
    return user != null;
  }
  
  // Get current user
  Future<User?> getCurrentUser() async {
    return await _storageService.getUser();
  }
  
  // Login - In a real app this would validate credentials with a server
  Future<bool> login(String username, String password) async {
    // Simulate successful login with demo account
    if (username == 'demo' && password == 'password') {
      final user = User.demoUser();
      await _storageService.saveUser(user);
      return true;
    }
    
    // For demo purposes, allow any login with minimum validation
    if (username.isNotEmpty && password.length >= 6) {
      final user = User(
        id: 1,
        username: username,
        email: '$username@example.com',
        firstName: username,
        lastName: 'User',
      );
      await _storageService.saveUser(user);
      return true;
    }
    
    return false;
  }
  
  // Register - In a real app this would create an account on a server
  Future<bool> register(String username, String email, String password) async {
    if (username.isEmpty || email.isEmpty || password.length < 6) {
      return false;
    }
    
    // For demo purposes, simulate registration
    final user = User(
      id: 1,
      username: username,
      email: email,
      firstName: null,
      lastName: null,
    );
    
    await _storageService.saveUser(user);
    return true;
  }
  
  // Logout
  Future<void> logout() async {
    await _storageService.removeUser();
  }
  
  // Update profile - In a real app this would update account on a server
  Future<bool> updateProfile(String firstName, String lastName) async {
    final user = await _storageService.getUser();
    if (user == null) {
      return false;
    }
    
    final updatedUser = User(
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: firstName,
      lastName: lastName,
    );
    
    await _storageService.saveUser(updatedUser);
    return true;
  }
}