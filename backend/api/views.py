from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.db.models import Q
from django.http import Http404

from .models import Category, Product, ProductVariant, Order, OrderItem, CartItem
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer,
    OrderSerializer, CartItemSerializer, UserSerializer, UserCreateSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by sustainability rating
        sustainability = self.request.query_params.get('sustainability')
        if sustainability:
            queryset = queryset.filter(sustainability_rating__gte=int(sustainability))
        
        # Search by title or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(description__icontains=search) |
                Q(materials__icontains=search)
            )
        
        # Featured products
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []           
    pagination_class       = None         

    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return CartItem.objects.filter(user=self.request.user)
        
        session_id = self.request.query_params.get('session_id')
        if session_id:
            return CartItem.objects.filter(session_id=session_id)
        
        return CartItem.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            session_id = self.request.query_params.get('session_id')
            if not session_id:
                return Response({'error': 'Session ID is required for non-authenticated users'}, 
                                status=status.HTTP_400_BAD_REQUEST)
            serializer.save(session_id=session_id)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]


class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        serializer = UserSerializer(user)
        return Response(serializer.data)
    if user:
        serializer = UserSerializer(user)
        # mirror your Node API: return user object plus the fake token
        return Response(
            { 'user': serializer.data, 'token': 'fake-jwt-token' },
           status=status.HTTP_200_OK
      )
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_order(request):
    # Get cart items
    cart_items = CartItem.objects.filter(user=request.user)
    
    if not cart_items:
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Calculate total amount
    total_amount = sum(item.product.price * item.quantity for item in cart_items)
    
    # Create order
    order = Order.objects.create(
        user=request.user,
        email=request.data.get('email'),
        shipping_address=request.data.get('shipping_address'),
        total_amount=total_amount
    )
    
    # Create order items
    for cart_item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=cart_item.product,
            variant=cart_item.variant,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
    
    # Clear cart
    cart_items.delete()
    
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def merge_carts(request):
    """Merge anonymous user cart with authenticated user cart"""
    if not request.user.is_authenticated:
        return Response({'error': 'User must be authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
    
    session_id = request.data.get('session_id')
    if not session_id:
        return Response({'error': 'Session ID is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get anonymous cart items
    anon_cart_items = CartItem.objects.filter(session_id=session_id)
    
    for anon_item in anon_cart_items:
        # Check if product is already in user's cart
        try:
            user_item = CartItem.objects.get(
                user=request.user,
                product=anon_item.product,
                variant=anon_item.variant
            )
            # Update quantity if exists
            user_item.quantity += anon_item.quantity
            user_item.save()
            anon_item.delete()
        except CartItem.DoesNotExist:
            # Add to user's cart if not exists
            anon_item.user = request.user
            anon_item.session_id = None
            anon_item.save()
    
    user_cart = CartItem.objects.filter(user=request.user)
    serializer = CartItemSerializer(user_cart, many=True)
    return Response(serializer.data)
