# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet,   basename='category')
router.register(r'products',   views.ProductViewSet,    basename='product')
router.register(r'cart',       views.CartItemViewSet,   basename='cart')
router.register(r'orders',     views.OrderViewSet,      basename='order')

urlpatterns = [
    # Core resource routes (GET /api/categories/, /api/products/, /api/cart/, /api/orders/, etc.)
    path('', include(router.urls)),

    # Auth endpoints (match your Node routes exactly)
    path('auth/login/',    views.login_view,                    name='login'),
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/user/',     views.UserDetailView.as_view(),       name='user-detail'),

    # Cart merge (front end calls POST /api/cart/merge/)
    path('cart/merge/',    views.merge_carts,                   name='merge-cart'),
    # Legacy alias (if anything still hits /api/merge-cart/)
    path('merge-cart/',    views.merge_carts,                   name='merge-cart-legacy'),

    # Checkout (optional: your front end’s createOrder → POST /api/orders/)
    path('checkout/',      views.create_order,                 name='checkout'),
]
