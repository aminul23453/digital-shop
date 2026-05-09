# Eco-Friendly Fashion E-Commerce Platform

A full-stack sustainable fashion e-commerce platform built with Django REST Framework and React. This platform showcases eco-friendly clothing with a focus on sustainability, ethical manufacturing, and transparent materials sourcing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Environment Configuration](#environment-configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core E-Commerce Functionality
- Product catalog with categories and filtering
- Product detail pages with variants (size, color)
- Shopping cart management (session-based and user-based)
- Checkout process with order management
- User authentication and registration
- Order tracking and history

### Sustainability Features
- Sustainability rating system for products
- Materials transparency
- Ethical manufacturing information
- Educational content about sustainable fashion

### User Experience
- Responsive design with TailwindCSS
- Modern UI components using Radix UI
- Product search and filtering
- Featured products showcase
- Blog and educational resources
- FAQ section
- Size guide
- Shipping and returns information

## Tech Stack

### Backend
- **Django 4.x** - Python web framework
- **Django REST Framework** - API development
- **SQLite/PostgreSQL** - Database
- **CORS Headers** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Additional Services
- **Express.js** - Alternative Node.js backend (optional)

## Project Structure

```
E-commerce-Django/
├── backend/                 # Django backend
│   ├── api/                # Main API application
│   │   ├── models.py      # Database models
│   │   ├── serializers.py # DRF serializers
│   │   ├── views.py       # API views
│   │   ├── urls.py        # API routes
│   │   └── management/    # Custom Django commands
│   ├── ecommerce/         # Django project settings
│   └── manage.py          # Django management script
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   ├── services/     # API service layer
│   │   └── App.jsx       # Main application component
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend-js/           # Optional Express.js backend
└── README.md             # This file
```

## Prerequisites

- **Python 3.9+**
- **Node.js 16+** and npm
- **pip** (Python package manager)
- **virtualenv** (recommended)

## Installation

### 1. Clone the Repository

```bash
git clone git@github.com:6ixGod6/thesis.git
cd thesis
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers

# Run migrations
python manage.py migrate

# Load sample data (optional)
python manage.py load_sample_data

# Create superuser for admin access
python manage.py createsuperuser
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

## Running the Application

### Development Mode

#### Terminal 1 - Backend Server
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver 0.0.0.0:8000
```

The backend API will be available at `http://localhost:8000`

#### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Deployment

#### Backend
```bash
cd backend
source venv/bin/activate

# Collect static files
python manage.py collectstatic --noinput

# Run with gunicorn (production server)
gunicorn ecommerce.wsgi:application --bind 0.0.0.0:8000
```

#### Frontend
```bash
cd frontend

# Build for production
npm run build

# Serve the dist folder with your preferred web server (nginx, apache, etc.)
```

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/search/?q=query` - Search products

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{slug}/` - Get category details

### Cart
- `GET /api/cart/` - Get cart items
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/update/{id}/` - Update cart item
- `DELETE /api/cart/remove/{id}/` - Remove item from cart

### Orders
- `GET /api/orders/` - List user orders
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/{order_id}/` - Get order details

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/user/` - Get current user

## Database Models

### Product
- Title, slug, description
- Price and discount price
- Category relationship
- Inventory management
- Sustainability rating (1-5)
- Materials information
- Multiple variants (size, color)

### Category
- Name and slug
- Description
- Product relationships

### Order
- Unique order ID (UUID)
- User relationship
- Email and shipping address
- Order status (pending, processing, shipped, delivered, cancelled)
- Order items with quantities and prices

### Cart
- Session or user-based
- Product and variant relationships
- Quantity management

### User
- Django's built-in User model
- Extended with cart and order relationships

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

## Key Features Implementation

### Sustainability Rating System
Products include a 5-point sustainability rating:
- 1: Low Impact
- 2: Medium Impact
- 3: Eco-Friendly
- 4: Sustainable
- 5: Highly Sustainable

### Product Variants
Products can have multiple variants based on:
- Size (XS, S, M, L, XL, XXL)
- Color
- Individual stock tracking per variant

### Cart Management
The platform supports both:
- **Guest users**: Session-based cart storage
- **Authenticated users**: Database-persisted cart

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin`

Features:
- Product and category management
- Order management and status updates
- User management
- Inventory tracking

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Django and Django REST Framework communities
- React and Vite teams
- TailwindCSS and Radix UI for excellent UI tools
- Sustainable fashion movement for inspiration

## Contact

For questions or support, please open an issue on GitHub.

---

**Note**: This project was developed as part of a thesis on sustainable e-commerce platforms. The focus is on demonstrating modern full-stack development practices while promoting environmental consciousness in fashion retail.
