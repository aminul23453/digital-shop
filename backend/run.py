#!/usr/bin/env python3
"""
Run script for the Django backend server
"""

import os
import sys
import subprocess
import time

def main():
    # Change to the backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Set Django settings module
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ecommerce.settings")
    
    # Run migrations
    print("Running migrations...")
    subprocess.run(["python", "manage.py", "migrate"], check=True)
    
    # Create a superuser if it doesn't exist
    print("Creating admin superuser if doesn't exist...")
    subprocess.run([
        "python", "manage.py", "shell", "-c",
        "from django.contrib.auth.models import User; "
        "User.objects.filter(username='admin').exists() or "
        "User.objects.create_superuser('admin', 'admin@example.com', 'admin')"
    ])
    
    # Create sample data (optional)
    print("Creating sample data if database is empty...")
    create_sample_data_script = """
from api.models import Category, Product, ProductVariant
if Category.objects.count() == 0:
    print("Creating sample categories and products...")
    
    # Create categories
    eco_category = Category.objects.create(
        name="Eco-Friendly Clothing", 
        description="Sustainable, eco-friendly clothing made from organic materials"
    )
    
    recycled_category = Category.objects.create(
        name="Recycled Fashion", 
        description="Fashion items made from recycled materials"
    )
    
    organic_category = Category.objects.create(
        name="Organic Basics", 
        description="Essential clothing items made from organic materials"
    )
    
    # Create some sample products
    # Eco-Friendly Category Products
    bamboo_tee = Product.objects.create(
        title="Bamboo Fiber T-Shirt",
        category=eco_category,
        description="Ultra-soft t-shirt made from 100% sustainable bamboo fiber. Breathable, hypoallergenic, and eco-friendly.",
        price=29.99,
        inventory=50,
        image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        is_featured=True,
        is_active=True,
        materials="100% Bamboo Fiber",
        sustainability_rating=5
    )
    
    hemp_jacket = Product.objects.create(
        title="Hemp Canvas Jacket",
        category=eco_category,
        description="Durable canvas jacket made from organic hemp. Weather-resistant and naturally antimicrobial.",
        price=89.99,
        inventory=25,
        image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        is_featured=True,
        is_active=True,
        materials="100% Organic Hemp",
        sustainability_rating=4
    )
    
    # Recycled Fashion Products
    recycled_denim = Product.objects.create(
        title="Recycled Denim Jeans",
        category=recycled_category,
        description="Classic jeans made from recycled denim and organic cotton. Each pair saves approximately 2,000 gallons of water.",
        price=69.99,
        inventory=30,
        image_url="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        is_featured=True,
        is_active=True,
        materials="80% Recycled Denim, 20% Organic Cotton",
        sustainability_rating=4
    )
    
    plastic_sweater = Product.objects.create(
        title="Ocean Plastic Knit Sweater",
        category=recycled_category,
        description="Cozy sweater made from yarn derived from recycled ocean plastic. Each sweater reclaims about 12 plastic bottles.",
        price=59.99,
        inventory=20,
        image_url="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        is_featured=False,
        is_active=True,
        materials="70% Recycled Polyester, 30% Organic Cotton",
        sustainability_rating=5
    )
    
    # Organic Basics Products
    cotton_underwear = Product.objects.create(
        title="Organic Cotton Underwear Set",
        category=organic_category,
        description="Comfortable, breathable underwear made from GOTS-certified organic cotton. Free from harmful chemicals and pesticides.",
        price=34.99,
        discount_price=29.99,
        inventory=100,
        image_url="https://images.unsplash.com/photo-1566207474742-9e7ddcb231a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        is_featured=True,
        is_active=True,
        materials="100% GOTS-certified Organic Cotton",
        sustainability_rating=4
    )
    
    linen_shirt = Product.objects.create(
        title="Organic Linen Button-Up Shirt",
        category=organic_category,
        description="Lightweight, breathable button-up shirt made from organic linen. Perfect for warm weather and naturally antimicrobial.",
        price=49.99,
        inventory=40,
        image_url="https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        is_featured=False,
        is_active=True,
        materials="100% Organic Linen",
        sustainability_rating=3
    )
    
    # Add product variants
    # Bamboo T-shirt variants
    ProductVariant.objects.create(product=bamboo_tee, size='S', color='Natural White', stock=15)
    ProductVariant.objects.create(product=bamboo_tee, size='M', color='Natural White', stock=15)
    ProductVariant.objects.create(product=bamboo_tee, size='L', color='Natural White', stock=10)
    ProductVariant.objects.create(product=bamboo_tee, size='S', color='Earth Green', stock=5)
    ProductVariant.objects.create(product=bamboo_tee, size='M', color='Earth Green', stock=5)
    
    # Hemp Jacket variants
    ProductVariant.objects.create(product=hemp_jacket, size='S', color='Beige', stock=5)
    ProductVariant.objects.create(product=hemp_jacket, size='M', color='Beige', stock=10)
    ProductVariant.objects.create(product=hemp_jacket, size='L', color='Beige', stock=5)
    ProductVariant.objects.create(product=hemp_jacket, size='M', color='Olive', stock=5)
    
    # Recycled Denim variants
    ProductVariant.objects.create(product=recycled_denim, size='28', color='Light Blue', stock=10)
    ProductVariant.objects.create(product=recycled_denim, size='30', color='Light Blue', stock=10)
    ProductVariant.objects.create(product=recycled_denim, size='32', color='Light Blue', stock=5)
    ProductVariant.objects.create(product=recycled_denim, size='30', color='Dark Blue', stock=5)
    
    # Plastic Sweater variants
    ProductVariant.objects.create(product=plastic_sweater, size='S', color='Ocean Blue', stock=5)
    ProductVariant.objects.create(product=plastic_sweater, size='M', color='Ocean Blue', stock=5)
    ProductVariant.objects.create(product=plastic_sweater, size='L', color='Ocean Blue', stock=5)
    ProductVariant.objects.create(product=plastic_sweater, size='M', color='Coral Red', stock=5)
    
    # Cotton Underwear variants
    ProductVariant.objects.create(product=cotton_underwear, size='S', color='White', stock=20)
    ProductVariant.objects.create(product=cotton_underwear, size='M', color='White', stock=30)
    ProductVariant.objects.create(product=cotton_underwear, size='L', color='White', stock=20)
    ProductVariant.objects.create(product=cotton_underwear, size='S', color='Black', stock=10)
    ProductVariant.objects.create(product=cotton_underwear, size='M', color='Black', stock=10)
    ProductVariant.objects.create(product=cotton_underwear, size='L', color='Black', stock=10)
    
    # Linen Shirt variants
    ProductVariant.objects.create(product=linen_shirt, size='S', color='Sand', stock=10)
    ProductVariant.objects.create(product=linen_shirt, size='M', color='Sand', stock=10)
    ProductVariant.objects.create(product=linen_shirt, size='L', color='Sand', stock=10)
    ProductVariant.objects.create(product=linen_shirt, size='XL', color='Sand', stock=10)
    
    print("Sample categories and products created successfully!")
"""
    # Create sample data using the Django shell
    try:
        subprocess.run(["python", "manage.py", "shell", "-c", create_sample_data_script])
    except Exception as e:
        print(f"Error creating sample data: {e}")
    
    # Start the server
    print("Starting server at http://0.0.0.0:8000")
    
    # Use subprocess to start the server
    try:
        subprocess.run(["python", "manage.py", "runserver", "0.0.0.0:8000"], check=True)
    except KeyboardInterrupt:
        print("\nServer stopped")
    
if __name__ == "__main__":
    main()
