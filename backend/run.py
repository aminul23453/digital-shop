#!/usr/bin/env python3
"""
Run script for the Django backend server
"""

import os
import sys
import subprocess
import time # time module was imported but not used, can be removed if not needed later.

def main():
    project_root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(project_root)
    
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ecommerce.settings")

    print("Running migrations...")
    try:
        subprocess.run([sys.executable, "manage.py", "migrate"], check=True, cwd=project_root)
    except subprocess.CalledProcessError as e:
        print(f"Error running migrations: {e}")
        # sys.exit(1) # Decide if this should be fatal
    except FileNotFoundError:
        print("Error: manage.py not found. Ensure you are in the Django project root.")
        sys.exit(1)

    print("Ensuring admin superuser exists...")
    # Multi-line script for clarity and better syntax handling with shell -c
    createsuperuser_script = """
from django.contrib.auth import get_user_model

User = get_user_model()
username = 'admin'
email = 'admin@example.com'
password = 'admin_password' # CHANGE THIS to a secure password or load from env

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Admin superuser '{username}' created.")
else:
    print(f"Admin superuser '{username}' already exists.")
"""
    try:
        # Pass the script as a whole string. Python's triple quotes handle newlines.
        subprocess.run([sys.executable, "manage.py", "shell", "-c", createsuperuser_script], check=True, cwd=project_root)
    except subprocess.CalledProcessError as e:
        print(f"Error ensuring superuser exists: {e}")
    except FileNotFoundError:
        print("Error: manage.py not found for superuser check.")

    print("Loading sample data from data.json via management command...")
    try:
        subprocess.run([sys.executable, "manage.py", "load_sample_data"], check=True, cwd=project_root)
    except subprocess.CalledProcessError as e:
        print(f"Error loading sample data: {e}")
    except FileNotFoundError:
        print("Error: load_sample_data command assumes manage.py is runnable and the command exists.")

    print("Starting server at http://0.0.0.0:8000")
    try:
        subprocess.run([sys.executable, "manage.py", "runserver", "0.0.0.0:8000"], check=True, cwd=project_root)
    except KeyboardInterrupt:
        print("\nServer stopped")
    except subprocess.CalledProcessError as e:
        print(f"Server exited with error: {e}")
    except FileNotFoundError:
        print("Error: manage.py not found. Could not start server.")

if __name__ == "__main__":
    main()