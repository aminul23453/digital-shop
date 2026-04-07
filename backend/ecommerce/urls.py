"""
URL configuration for ecommerce project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# Root URL handler to respond with API status
def api_status(request):
    return JsonResponse({
        'status': 'online',
        'api_version': '1.0.0',
        'endpoints': {
            'api': '/api/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_status, name='api-status'),  # Root URL now returns API status
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/token/',   TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
