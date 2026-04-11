import json
import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from api.models import Category, Product, ProductVariant, CartItem, Order

User = get_user_model()

class Command(BaseCommand):
    help = 'Loads sample data from data.json into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--jsonfile',
            type=str,
            help='Path to the data.json file',
            default=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), 'data.json')
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before loading (use with caution!)',
        )

    def handle(self, *args, **options):
        json_file_path = options['jsonfile']
        clear_data = options['clear']

        self.stdout.write(self.style.SUCCESS(f"Attempting to load JSON from: {json_file_path}")) # DEBUG PRINT

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f"JSON file not found at {json_file_path}"))
            return

        if clear_data:
            self.stdout.write(self.style.WARNING("Clearing existing data..."))
            CartItem.objects.all().delete()
            ProductVariant.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            User.objects.filter(is_superuser=False, is_staff=False).delete() # Keep admin/staff users
            self.stdout.write(self.style.SUCCESS("Existing data cleared."))

        try:
            with open(json_file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            self.stdout.write(self.style.ERROR(f"Error decoding JSON from {json_file_path}: {e}"))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred opening or reading {json_file_path}: {e}"))
            return


        self.stdout.write(self.style.SUCCESS(f"Type of loaded data: {type(data)}")) # DEBUG PRINT
        if isinstance(data, list):
            self.stdout.write(self.style.WARNING(f"Data loaded as a LIST. First 3 elements: {data[:3]}"))
            self.stdout.write(self.style.ERROR("Expected data to be a dictionary (JSON object), not a list. Please check data.json format."))
            return # Stop if it's a list, as .get() will fail

        self.stdout.write("Loading data...")

        categories_map = {}
        for cat_data in data.get('categories', []): # This line caused the error if 'data' is a list
            try:
                category, created = Category.objects.update_or_create(
                    id=cat_data.get('id'),
                    defaults={
                        'name': cat_data['name'],
                        'slug': cat_data.get('slug', slugify(cat_data['name'])),
                        'description': cat_data.get('description', '')
                    }
                )
                categories_map[cat_data['id']] = category
                if created:
                    self.stdout.write(f"  Created category: {category.name}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing category {cat_data.get('name', 'N/A')}: {e}"))


        users_map = {}
        for user_data in data.get('users', []):
            try:
                user_defaults = {
                    'email': user_data.get('email', ''),
                    'first_name': user_data.get('firstName', ''),
                    'last_name': user_data.get('lastName', ''),
                    # Map isAdmin carefully. If isAdmin=True, make them staff.
                    # Only make 'admin' superuser, or based on a specific flag if needed.
                    'is_staff': user_data.get('isAdmin', False),
                    'is_superuser': True if user_data.get('username') == 'admin' and user_data.get('isAdmin', False) else False,
                }
                user, created = User.objects.update_or_create(
                    username=user_data['username'],
                    defaults=user_defaults
                )
                if 'id' in user_data and user.id != user_data['id'] and created :
                    # If preserving ID from JSON and it's different from Django's auto ID on creation.
                    # This is complex and usually avoided unless IDs are guaranteed unique and non-conflicting.
                    # For simplicity, usually let Django handle IDs or ensure JSON IDs are used in update_or_create's lookup.
                    # If you used id=user_data.get('id') in update_or_create lookup, this isn't an issue.
                    pass


                if created or 'password' in user_data:
                    user.set_password(user_data.get('password', 'defaultpassword')) # CHANGE defaultpassword
                    user.save() # Save again after setting password
                
                users_map[user_data['id']] = user # Assuming JSON user ID is reliable for mapping
                if created:
                     self.stdout.write(f"  Created user: {user.username}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing user {user_data.get('username')}: {e}"))

        for prod_data in data.get('products', []):
            try:
                category_id = prod_data.get('category')
                category_instance = categories_map.get(category_id)

                if not category_instance:
                    self.stdout.write(self.style.WARNING(f"  Category ID {category_id} not found for product '{prod_data['title']}'. Skipping product."))
                    continue
                
                product_defaults = {
                    'title': prod_data['title'],
                    'slug': prod_data.get('slug', slugify(prod_data['title'])),
                    'category': category_instance,
                    'description': prod_data.get('description', ''),
                    'price': prod_data['price'],
                    'discount_price': prod_data.get('discount_price'),
                    'inventory': prod_data.get('inventory', 0),
                    'image_url': prod_data.get('image_url', ''),
                    'is_featured': prod_data.get('is_featured', False),
                    'is_active': prod_data.get('is_active', True),
                    'materials': prod_data.get('materials', ''),
                    'sustainability_rating': prod_data.get('sustainability_rating', 0)
                }
                product, created = Product.objects.update_or_create(
                    id=prod_data.get('id'),
                    defaults=product_defaults
                )
                if created:
                    self.stdout.write(f"  Created product: {product.title}")

                for var_data in prod_data.get('variants', []):
                    variant_defaults = {
                        'product': product, # This should be part of defaults, not lookup, if ID is the primary lookup
                        'size': var_data['size'],
                        'color': var_data['color'],
                        'stock': var_data.get('stock', 0),
                        'image_url': var_data.get('image_url')
                    }
                    # If variant ID from JSON is primary key:
                    variant, var_created = ProductVariant.objects.update_or_create(
                        id=var_data.get('id'),
                        defaults=variant_defaults
                    )
                    # If composite key (product, size, color) is used for variants:
                    # variant, var_created = ProductVariant.objects.update_or_create(
                    #     product=product,
                    #     size=var_data['size'],
                    #     color=var_data['color'],
                    #     defaults={
                    #         'stock': var_data.get('stock', 0),
                    #         'image_url': var_data.get('image_url')
                    #         # id=var_data.get('id') # if you want to set it but it's not the lookup
                    #     }
                    # )
                    if var_created:
                        self.stdout.write(f"    Created variant for {product.title}: Size {variant.size}, Color {variant.color}")
            except Exception as e:
                 self.stdout.write(self.style.ERROR(f"Error processing product {prod_data.get('title', 'N/A')}: {e}"))


        for item_data in data.get('cartItems', []):
            try:
                product_instance = Product.objects.filter(id=item_data.get('product')).first()
                variant_instance = None
                if item_data.get('variant') is not None:
                    variant_instance = ProductVariant.objects.filter(id=item_data.get('variant')).first()

                if not product_instance:
                    self.stdout.write(self.style.WARNING(f"  Product ID {item_data.get('product')} not found for cart item. Skipping."))
                    continue
                
                # Check if user exists for the cart item if user_id is provided
                user_instance = None
                if 'user_id' in item_data and item_data['user_id'] is not None: # Assuming 'user_id' key if present
                    user_instance = users_map.get(item_data['user_id']) # Use users_map
                    if not user_instance:
                        self.stdout.write(self.style.WARNING(f"  User ID {item_data['user_id']} not found for cart item. Cart item will be guest cart item."))
                        # Fallback to session_id or skip if user_id was mandatory

                cart_item_defaults = {
                    'user': user_instance,
                    'session_id': item_data.get('session_id') if not user_instance else None, # session_id if no user
                    'product': product_instance,
                    'variant': variant_instance,
                    'quantity': item_data.get('quantity', 1),
                }
                cart_item, created = CartItem.objects.update_or_create(
                    id=item_data.get('id'),
                    defaults=cart_item_defaults
                )
                if created:
                    self.stdout.write(f"  Created cart item ID {cart_item.id}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing cart item ID {item_data.get('id', 'N/A')}: {e}"))

        self.stdout.write(self.style.SUCCESS("Data loading process complete."))