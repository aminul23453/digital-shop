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
    # Pagination enabled - uses settings.REST_FRAMEWORK['PAGE_SIZE'] = 12

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
        from rest_framework.exceptions import ValidationError

        # Client sends: product (ID), variant (ID, optional), quantity
        product = serializer.validated_data.get('product')
        variant = serializer.validated_data.get('variant')
        quantity = serializer.validated_data.get('quantity')

        # Validate quantity
        if quantity <= 0:
            raise ValidationError({'quantity': 'Quantity must be greater than 0'})

        if quantity > 100:
            raise ValidationError({'quantity': 'Maximum quantity per item is 100'})

        # Check stock availability
        if variant:
            # Check variant stock
            if variant.stock < quantity:
                raise ValidationError({
                    'error': f'Insufficient stock. Only {variant.stock} items available.'
                })
            available_stock = variant.stock
        else:
            # Check product inventory
            if product.inventory < quantity:
                raise ValidationError({
                    'error': f'Insufficient stock. Only {product.inventory} items available.'
                })
            available_stock = product.inventory

        if self.request.user.is_authenticated:
            cart_item, created = CartItem.objects.get_or_create(
                user=self.request.user,
                product=product,
                variant=variant,
                defaults={'quantity': quantity}
            )
            if not created:
                # Check if total quantity would exceed stock
                new_quantity = cart_item.quantity + quantity
                if new_quantity > available_stock:
                    raise ValidationError({
                        'error': f'Cannot add {quantity} more. You already have {cart_item.quantity} in cart. Stock available: {available_stock}'
                    })
                if new_quantity > 100:
                    raise ValidationError({'error': 'Maximum total quantity per item is 100'})

                cart_item.quantity = F('quantity') + quantity
                cart_item.save()
                cart_item.refresh_from_db() # Get updated quantity
            serializer.instance = cart_item # So serializer can return the final state
        else:
            session_id = self.request.data.get('session_id') # Get session_id from POST body
            if not session_id:
                raise ValidationError({'session_id': 'Session ID is required for guest users.'})

            cart_item, created = CartItem.objects.get_or_create(
                session_id=session_id,
                product=product,
                variant=variant,
                defaults={'quantity': quantity}
            )
            if not created:
                # Check if total quantity would exceed stock
                new_quantity = cart_item.quantity + quantity
                if new_quantity > available_stock:
                    raise ValidationError({
                        'error': f'Cannot add {quantity} more. You already have {cart_item.quantity} in cart. Stock available: {available_stock}'
                    })
                if new_quantity > 100:
                    raise ValidationError({'error': 'Maximum total quantity per item is 100'})

                cart_item.quantity = F('quantity') + quantity
                cart_item.save()
                cart_item.refresh_from_db()
            serializer.instance = cart_item

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
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError as DjangoValidationError
    from django.db import transaction

    user = request.user
    cart_items = CartItem.objects.filter(user=user).select_related('product', 'variant')

    if not cart_items.exists():
        return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    # Extract and validate required fields from request body
    email = request.data.get('email', user.email)
    shipping_address = request.data.get('shipping_address')

    # Validation
    if not shipping_address or not shipping_address.strip():
        return Response({'error': 'Shipping address is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate email format
    try:
        validate_email(email)
    except DjangoValidationError:
        return Response({'error': 'Invalid email format.'}, status=status.HTTP_400_BAD_REQUEST)

    # Use atomic transaction to ensure data consistency
    try:
        with transaction.atomic():
            # Validate stock availability and quantity limits
            for item in cart_items:
                # Check quantity limit
                if item.quantity <= 0:
                    return Response({'error': f'Invalid quantity for {item.product.title}'}, status=status.HTTP_400_BAD_REQUEST)

                if item.quantity > 100:  # Max quantity per item
                    return Response({'error': f'Maximum quantity per item is 100. Please adjust {item.product.title}'}, status=status.HTTP_400_BAD_REQUEST)

                # Check stock availability
                if item.variant:
                    # If there's a variant, check variant stock
                    if item.variant.stock < item.quantity:
                        return Response({
                            'error': f'Insufficient stock for {item.product.title} ({item.variant.size}/{item.variant.color}). Available: {item.variant.stock}'
                        }, status=status.HTTP_400_BAD_REQUEST)
                else:
                    # No variant, check product inventory
                    if item.product.inventory < item.quantity:
                        return Response({
                            'error': f'Insufficient stock for {item.product.title}. Available: {item.product.inventory}'
                        }, status=status.HTTP_400_BAD_REQUEST)

            # Calculate total amount
            total_amount = 0
            for item in cart_items:
                price_to_use = item.product.price
                if item.product.discount_price is not None:
                    price_to_use = item.product.discount_price
                total_amount += price_to_use * item.quantity

            # Create order
            order_data = {
                'user': user,
                'email': email,
                'shipping_address': shipping_address,
                'total_amount': total_amount,
                'status': 'pending'
            }
            order = Order.objects.create(**order_data)

            # Create order items and decrement stock
            order_items_to_create = []
            for cart_item in cart_items:
                price_at_purchase = cart_item.product.price
                if cart_item.product.discount_price is not None:
                    price_at_purchase = cart_item.product.discount_price

                order_items_to_create.append(
                    OrderItem(
                        order=order,
                        product=cart_item.product,
                        variant=cart_item.variant,
                        quantity=cart_item.quantity,
                        price=price_at_purchase
                    )
                )

                # Decrement stock
                if cart_item.variant:
                    cart_item.variant.stock -= cart_item.quantity
                    cart_item.variant.save()
                else:
                    cart_item.product.inventory -= cart_item.quantity
                    cart_item.product.save()

            OrderItem.objects.bulk_create(order_items_to_create)

            # Clear the user's cart
            cart_items.delete()

            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': f'Failed to create order: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def merge_carts(request): # POST /api/cart/merge/
    """
    Merge guest cart items (identified by session_id) into authenticated user's cart.
    This is called after login to combine any items added before authentication.
    """
    session_id = request.data.get('session_id')
    if not session_id:
        return Response({'error': 'Session ID is required in the request body.'}, status=status.HTTP_400_BAD_REQUEST)

    guest_cart_items = CartItem.objects.filter(session_id=session_id)
    if not guest_cart_items.exists():
        # No guest cart to merge, return current user's cart
        user_cart = CartItem.objects.filter(user=request.user).select_related('product', 'variant')
        serializer = CartItemSerializer(user_cart, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Merge guest cart items into user's cart
    for guest_item in guest_cart_items:
        user_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=guest_item.product,
            variant=guest_item.variant,
            defaults={'quantity': guest_item.quantity, 'session_id': None}
        )
        if not created:
            # Item already exists in user's cart, sum quantities
            user_item.quantity += guest_item.quantity
            user_item.save()

    # Delete the guest cart items after merging
    guest_cart_items.delete()

    # Return the merged user cart
    merged_user_cart = CartItem.objects.filter(user=request.user).select_related('product', 'variant')
    serializer = CartItemSerializer(merged_user_cart, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)