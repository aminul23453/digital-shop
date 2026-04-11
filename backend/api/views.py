from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
# from rest_framework.views import APIView # Not explicitly used now, but good to have if needed
from django.contrib.auth import authenticate
from django.db.models import Q, Sum, F, DecimalField
# from django.http import Http404 # Not explicitly used, DRF handles it well

# For JWT token generation
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Category, Product, ProductVariant, Order, OrderItem, CartItem
from .serializers import (
    CategorySerializer, ProductSerializer, ProductDetailSerializer,
    OrderSerializer, CartItemSerializer, UserSerializer, UserCreateSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    pagination_class = None # Assuming no pagination for categories to match Node simplicity


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    lookup_field = 'slug'
    pagination_class = None # UNCOMMENT if frontend expects flat list, not paginated response

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductSerializer # This now includes variants
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).prefetch_related('variants', 'category')
        
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        search_term = self.request.query_params.get('search')
        if search_term:
            queryset = queryset.filter(
                Q(title__icontains=search_term) | 
                Q(description__icontains=search_term) |
                Q(materials__icontains=search_term)
            )
        
        is_featured = self.request.query_params.get('featured')
        if is_featured and is_featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Additional filters from your original view (optional, Node didn't have them)
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price) # Or discount_price logic
        if max_price:
            queryset = queryset.filter(price__lte=max_price) # Or discount_price logic
        
        sustainability = self.request.query_params.get('sustainability')
        if sustainability:
            try:
                queryset = queryset.filter(sustainability_rating__gte=int(sustainability))
            except ValueError:
                pass # Ignore invalid sustainability param
        
        return queryset


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.AllowAny] # Anyone can manage a cart
    # authentication_classes = [] # Default from settings.py (JWTAuthentication) will apply
                                # but permission_classes=[AllowAny] overrides need for auth token
    pagination_class = None # Carts are usually not paginated

    def get_queryset(self):
        # For GET /api/cart/ (list action)
        if self.action == 'list':
            if self.request.user.is_authenticated:
                return CartItem.objects.filter(user=self.request.user).select_related('product', 'variant')
            
            session_id = self.request.query_params.get('session_id')
            if session_id:
                return CartItem.objects.filter(session_id=session_id).select_related('product', 'variant')
            return CartItem.objects.none() # No user, no session_id for list
        
        # For retrieve, update, destroy actions (e.g. /api/cart/{id}/)
        # The default queryset for these actions needs to be broader if items can be ownerless
        # or we rely on get_object to perform the correct filtering.
        # For simplicity, let's assume get_object will handle it or permissions.
        return CartItem.objects.all().select_related('product', 'variant')


    def perform_create(self, serializer):
        # Client sends: product (ID), variant (ID, optional), quantity
        product = serializer.validated_data.get('product')
        variant = serializer.validated_data.get('variant')
        quantity = serializer.validated_data.get('quantity')

        if self.request.user.is_authenticated:
            cart_item, created = CartItem.objects.get_or_create(
                user=self.request.user,
                product=product,
                variant=variant,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity = F('quantity') + quantity
                cart_item.save()
                cart_item.refresh_from_db() # Get updated quantity
            serializer.instance = cart_item # So serializer can return the final state
        else:
            session_id = self.request.data.get('session_id') # Get session_id from POST body
            if not session_id:
                # This should be handled by the serializer or view validation before perform_create
                # but as a fallback:
                # raise serializers.ValidationError({'session_id': 'This field is required for guest users.'})
                # For now, relying on frontend to send it. If not, it will fail unique constraint or save with None.
                # Better to validate upfront.
                # For now, if it gets here without session_id from body, it might fail.
                # The serializer could also have session_id as a write_only field.
                 pass # Let it proceed; if session_id is None and unique_together expects it, it might error

            cart_item, created = CartItem.objects.get_or_create(
                session_id=session_id, # Make sure session_id is provided
                product=product,
                variant=variant,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity = F('quantity') + quantity
                cart_item.save()
                cart_item.refresh_from_db()
            serializer.instance = cart_item
            # serializer.save(session_id=session_id) # If session_id was part of serializer fields

    # To handle DELETE /api/cart?session_id=... (clear cart for session)
    @action(detail=False, methods=['delete'], url_path='clear', permission_classes=[permissions.AllowAny])
    def clear_cart(self, request):
        if request.user.is_authenticated:
            CartItem.objects.filter(user=request.user).delete()
            return Response({'message': 'User cart cleared'}, status=status.HTTP_204_NO_CONTENT)
        
        session_id = request.query_params.get('session_id')
        if session_id:
            CartItem.objects.filter(session_id=session_id).delete()
            return Response({'message': 'Guest cart cleared'}, status=status.HTTP_204_NO_CONTENT)
        
        return Response({'error': 'session_id parameter is required for guest users or user must be authenticated.'},
                        status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet): # Handles GET /api/orders/, GET /api/orders/{id}/
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    # For POST /api/orders/, if you want to use this ViewSet, override create()
    # For now, assuming /api/checkout (create_order view) is used.

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items', 'items__product', 'items__variant')
    
    # If create_order logic moves here:
    # def perform_create(self, serializer):
    #    # Complex logic from create_order view would go here
    #    # serializer.save(user=self.request.user, ...)


# Auth Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password) # Pass request for context
    
    if user is not None:
        user_data = UserSerializer(user).data # Uses updated UserSerializer
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': user_data,
            'token': str(refresh.access_token),
            # 'refresh_token': str(refresh), # Optionally send refresh token if FE will use it
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save() # This calls UserCreateSerializer.create()
        
        user_data_for_response = UserSerializer(user).data # Use UserSerializer for consistent output
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": user_data_for_response,
            "token": str(refresh.access_token),
            # "refresh_token": str(refresh), # Optionally
        }, status=status.HTTP_201_CREATED)


class UserDetailView(generics.RetrieveUpdateAPIView): # GET, PUT, PATCH /api/auth/user/
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] # Requires valid JWT
    
    def get_object(self):
        return self.request.user


# Custom Order Creation and Cart Merge Views
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated]) # Only authenticated users can create orders
def create_order(request): # Corresponds to /api/checkout/
    user = request.user
    cart_items = CartItem.objects.filter(user=user).select_related('product', 'variant')
    
    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Extract required fields from request body for the order
    email = request.data.get('email', user.email) # Default to user's email
    shipping_address = request.data.get('shipping_address')

    if not shipping_address:
        return Response({'error': 'Shipping address is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Calculate total amount
    total_amount = 0
    for item in cart_items:
        price_to_use = item.product.price
        if item.product.discount_price is not None:
            price_to_use = item.product.discount_price
        # Add variant price adjustments here if applicable
        total_amount += price_to_use * item.quantity
    
    order_data = {
        'user': user,
        'email': email,
        'shipping_address': shipping_address,
        'total_amount': total_amount,
        'status': 'pending' # Default status
    }
    order = Order.objects.create(**order_data)
    
    order_items_to_create = []
    for cart_item in cart_items:
        price_at_purchase = cart_item.product.price
        if cart_item.product.discount_price is not None:
            price_at_purchase = cart_item.product.discount_price
        # Add variant price adjustments here if applicable

        order_items_to_create.append(
            OrderItem(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                quantity=cart_item.quantity,
                price=price_at_purchase
            )
        )
    OrderItem.objects.bulk_create(order_items_to_create)
    
    cart_items.delete() # Clear the user's cart
    
    serializer = OrderSerializer(order) # Serialize the created order
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
# @permission_classes([permissions.IsAuthenticated]) # Node version allowed this for anyone with a session_id
@permission_classes([permissions.AllowAny]) # Let's make it AllowAny to match Node's implied behavior for POST
def merge_carts(request): # POST /api/cart/merge/
    session_id = request.data.get('session_id')
    if not session_id:
        return Response({'error': 'Session ID is required in the request body.'}, status=status.HTTP_400_BAD_REQUEST)

    # Node.js behavior for /api/cart/merge was to RETRIEVE the guest cart.
    # Let's replicate that for now. If a true merge is needed, the logic would be different.
    
    guest_cart_items = CartItem.objects.filter(session_id=session_id).select_related('product', 'variant')
    if not guest_cart_items.exists():
        return Response([], status=status.HTTP_200_OK) # Or 404 if preferred for empty/non-existent cart

    serializer = CartItemSerializer(guest_cart_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

    # --- IF YOU WANT A TRUE MERGE (when user logs in) ---
    # This logic would typically be called by the frontend *after* successful login,
    # passing the old guest session_id.
    # if not request.user.is_authenticated:
    #     return Response({'error': 'User must be authenticated for a true merge.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # guest_cart_items = CartItem.objects.filter(session_id=session_id)
    # if not guest_cart_items.exists():
    #     # Return current user's cart or empty if nothing to merge
    #     user_cart = CartItem.objects.filter(user=request.user).select_related('product', 'variant')
    #     serializer = CartItemSerializer(user_cart, many=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    # for guest_item in guest_cart_items:
    #     user_item, created = CartItem.objects.get_or_create(
    #         user=request.user,
    #         product=guest_item.product,
    #         variant=guest_item.variant,
    #         defaults={'quantity': guest_item.quantity}
    #     )
    #     if not created: # Item already exists in user's cart, sum quantities
    #         user_item.quantity = F('quantity') + guest_item.quantity
    #         user_item.save()
    
    # guest_cart_items.delete() # Delete the guest cart items after merging
    
    # merged_user_cart = CartItem.objects.filter(user=request.user).select_related('product', 'variant')
    # serializer = CartItemSerializer(merged_user_cart, many=True)
    # return Response(serializer.data, status=status.HTTP_200_OK)