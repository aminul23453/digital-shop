from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Product, ProductVariant, Order, OrderItem, CartItem

# For generating tokens if needed directly in a serializer (though typically done in view)
# from rest_framework_simplejwt.tokens import RefreshToken


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        # 'product' field (FK) might be useful if variants are ever serialized standalone
        # but usually it's clear from context when nested.
        fields = ['id', 'size', 'color', 'stock', 'image_url']


class ProductSerializer(serializers.ModelSerializer): # For product lists
    category_name = serializers.CharField(source='category.name', read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True) # Assuming variants are needed in list view

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 
            'category', # Foreign key ID
            'category_name', 
            'description', 'price', 'discount_price', 'inventory',
            'image_url', 'is_featured', 'is_active', 'created_at',
            'materials', 'sustainability_rating', 
            'variants'
        ]


class ProductDetailSerializer(serializers.ModelSerializer): # For single product detail
    category_name = serializers.CharField(source='category.name', read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 
            'category', # Foreign key ID
            'category_name', 
            'description', 'price', 'discount_price', 'inventory',
            'image_url', 'is_featured', 'is_active', 'created_at',
            'materials', 'sustainability_rating', 
            'variants'
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_image = serializers.CharField(source='product.image_url', read_only=True, allow_null=True)
    
    # If the frontend sends variant ID when adding to cart, ensure 'variant' is a writable PK field.
    # It's currently read-only by default if not specified for write.
    # To make it writable for POST/PUT:
    # variant = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), allow_null=True, required=False)

    size = serializers.CharField(source='variant.size', read_only=True, allow_null=True)
    color = serializers.CharField(source='variant.color', read_only=True, allow_null=True)
    
    unit_price = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id',               
            'product',          # Writable: ID of the product
            'product_title',    # Read-only
            'product_image',    # Read-only
            'variant',          # Writable: ID of the variant (ProductVariant PK)
            'size',             # Read-only
            'color',            # Read-only
            'quantity',         # Writable
            'unit_price',       # Read-only
            'total_price',      # Read-only
            # 'session_id' is typically handled by the view, not sent by client in payload for GET.
            # 'created_at' is auto-set.
        ]
        # For POST/PUT, client mainly sends 'product', 'variant', 'quantity'.
        # 'user' or 'session_id' are set in the view.

    def get_unit_price(self, obj: CartItem) -> float:
        if obj.product:
            price_to_use = obj.product.price
            if obj.product.discount_price is not None:
                price_to_use = obj.product.discount_price
            
            # Future consideration: if variants have their own price adjustments
            # if obj.variant and hasattr(obj.variant, 'additional_price') and obj.variant.additional_price:
            #     price_to_use += obj.variant.additional_price
            return float(price_to_use)
        return 0.0

    def get_total_price(self, obj: CartItem) -> float:
        unit_p = self.get_unit_price(obj)
        return float(unit_p * obj.quantity)


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_image = serializers.CharField(source='product.image_url', read_only=True, allow_null=True)
    size = serializers.CharField(source='variant.size', read_only=True, allow_null=True)
    color = serializers.CharField(source='variant.color', read_only=True, allow_null=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'product_image',
                 'variant', 'size', 'color', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    # To match Node 'id' as primary key for order response if FE expects it
    # id = serializers.IntegerField(source='pk', read_only=True) # If FE expects 'id' not 'order_id'
    
    class Meta:
        model = Order
        fields = [
            'id', # This is Django's auto PK. Node likely used its own sequential or UUID.
                  # Your model has 'order_id' (UUID) which is good.
            'order_id', 
            'user', # Consider serializing user details here or just ID.
            'email', 'shipping_address',
            'total_amount', 'status', 'created_at', 'items'
        ]
        read_only_fields = ['order_id', 'user', 'total_amount', 'status', 'created_at', 'items'] # Default for create


class UserSerializer(serializers.ModelSerializer): # For displaying user info (login, /auth/user)
    firstName = serializers.CharField(source='first_name', allow_blank=True, required=False)
    lastName = serializers.CharField(source='last_name', allow_blank=True, required=False)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        # For GET /api/auth/user, these are read-only.
        # If UserDetailView allows updates, read_only might be different.
        fields = ['id', 'username', 'email', 'firstName', 'lastName', 'isAdmin']
        read_only_fields = ['id', 'username', 'isAdmin'] # email, firstName, lastName could be updatable

    def get_isAdmin(self, obj: User) -> bool:
        return obj.is_superuser or obj.is_staff


class UserCreateSerializer(serializers.ModelSerializer): # For /auth/register POST
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    firstName = serializers.CharField(source='first_name', required=False, allow_blank=True)
    lastName = serializers.CharField(source='last_name', required=False, allow_blank=True)
    # No 'isAdmin' here, new users shouldn't set this.

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'firstName', 'lastName']
        
    def create(self, validated_data):
        # Pop first_name and last_name because create_user doesn't expect them directly.
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), # email might be optional depending on your User model
            password=validated_data['password']
        )
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        return user