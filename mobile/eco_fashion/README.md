# Eco Fashion Mobile App

A Flutter mobile application for sustainable fashion e-commerce that connects to our Django backend API.

## Features

- Browse sustainable fashion products
- View detailed product information and sustainability ratings
- Filter products by category
- Search for specific products
- View product variants (sizes, colors)
- Add items to cart
- Manage cart (update quantities, remove items)
- User authentication (login/register)
- Checkout process
- Order tracking
- User profile management

## Setup Instructions

### Prerequisites

- Flutter SDK (2.5.0 or higher)
- Dart SDK (2.14.0 or higher)
- Android Studio / Xcode for emulators
- Backend API server running

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory:
   ```bash
   cd mobile/eco_fashion
   ```

3. Install dependencies:
   ```bash
   flutter pub get
   ```

4. Update the API URL in `lib/main.dart` to point to your backend server:
   ```dart
   final apiService = ApiService(
     baseUrl: 'http://YOUR_API_SERVER_URL/api',
   );
   ```

5. Run the app:
   ```bash
   flutter run
   ```

## Project Structure

- `/lib/models` - Data models that match our backend entities
- `/lib/screens` - UI screens for the application
- `/lib/services` - API service and state management providers
- `/lib/utils` - Utility functions and theme definition
- `/lib/widgets` - Reusable UI components

## API Integration

The app connects to the same Django backend API that powers the web application. The `ApiService` class in `lib/services/api_service.dart` handles all API requests, including:

- Loading products and categories
- User authentication
- Cart management
- Checkout process

## State Management

The app uses the Provider pattern for state management with the following providers:

- `AuthProvider` - Handles user authentication and profile data
- `ProductProvider` - Manages product listings and filtering
- `CartProvider` - Tracks cart items and checkout

## Design

The app follows material design principles with a custom theme focused on sustainability. The color scheme uses various shades of green to emphasize the eco-friendly nature of the products.

## Running with the Backend

Make sure the Django backend server is running and accessible. If you're testing locally:

1. Start the Django server (default port 8000)
2. If running the app on an emulator, use `10.0.2.2:8000` instead of `localhost:8000` in the API URL

## Required API Endpoints

The mobile app expects the following API endpoints to be available:

- `/api/categories/` - List of product categories
- `/api/products/` - List of products with optional filtering
- `/api/products/<slug>/` - Product details by slug
- `/api/cart/` - Cart operations (GET, POST, DELETE)
- `/api/orders/` - Order creation and history
- `/api/users/register/` - User registration
- `/api/auth/login/` - User authentication
- `/api/users/me/` - Current user profile