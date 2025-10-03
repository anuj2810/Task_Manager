from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, GoogleAuthView, MeView


urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/google/', GoogleAuthView.as_view(), name='google_auth'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
