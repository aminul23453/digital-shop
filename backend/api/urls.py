from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'cart', views.CartItemViewSet, basename='cart')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('user/', views.UserDetailView.as_view(), name='user-detail'),
    path('checkout/', views.create_order, name='checkout'),
    #path('merge-cart/', views.merge_carts, name='merge-cart'),
    path('cart/merge/', views.merge_carts, name='merge-cart'),
    #path('cart/merge/',  views.merge_carts,    name='merge-cart'),
]
