from django.contrib import admin
from .models import Category, Product, ProductVariant, Order, OrderItem, CartItem

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'variant', 'quantity', 'price']
    can_delete = False

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'price', 'inventory', 'is_active', 'is_featured']
    list_filter = ['category', 'is_active', 'is_featured', 'sustainability_rating']
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ['title', 'description']
    inlines = [ProductVariantInline]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_id', 'user', 'email', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_id', 'email', 'user__username']
    readonly_fields = ['order_id', 'total_amount', 'created_at']
    inlines = [OrderItemInline]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'session_id', 'product', 'variant', 'quantity']
    list_filter = ['created_at']
