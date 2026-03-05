#!/usr/bin/env python
"""
Load sample data into the database.
Run this script after setting up your local environment to populate your database with sample products.
"""

import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce.settings')
django.setup()

from django.core.management import call_command
from api.models import Category, Product, ProductVariant
from django.contrib.auth.models import User

def main():
    """Load sample data from fixture."""
    print("Checking if database is empty...")
    
    # Check if we already have data
    if Category.objects.count() > 0 or Product.objects.count() > 0:
        print("Data already exists in the database. Skipping sample data creation.")
        return
    
    print("Loading sample data from fixture...")
    
    # Load data from fixture
    call_command('loaddata', 'sample_data.json', verbosity=1)
    
    # Create a superuser if doesn't exist
    if not User.objects.filter(username='admin').exists():
        print("Creating admin superuser...")
        User.objects.create_superuser('admin', 'admin@example.com', 'admin')
        print("Superuser created.")
    
    print("Sample data loaded successfully!")
    print(f"Categories: {Category.objects.count()}")
    print(f"Products: {Product.objects.count()}")
    print(f"Product Variants: {ProductVariant.objects.count()}")

if __name__ == "__main__":
    main()