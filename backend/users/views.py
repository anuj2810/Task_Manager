from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer

try:
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
    GOOGLE_AVAILABLE = True
except Exception:
    GOOGLE_AVAILABLE = False


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class GoogleAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if not GOOGLE_AVAILABLE:
            return Response({'detail': 'Google auth is not available on server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        id_token_str = request.data.get('id_token')
        if not id_token_str:
            return Response({'detail': 'id_token is required'}, status=status.HTTP_400_BAD_REQUEST)

        client_id = getattr(settings, 'GOOGLE_CLIENT_ID', '')
        if not client_id:
            return Response({'detail': 'Server missing GOOGLE_CLIENT_ID'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            payload = google_id_token.verify_oauth2_token(id_token_str, google_requests.Request(), audience=client_id)
        except Exception:
            return Response({'detail': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)

        email = payload.get('email')
        email_verified = payload.get('email_verified')
        if not email or not email_verified:
            return Response({'detail': 'Google account email not verified'}, status=status.HTTP_400_BAD_REQUEST)

        username = email
        user, created = User.objects.get_or_create(username=username, defaults={'email': email})
        if created:
            user.set_unusable_password()
            # Populate name fields from Google payload when available
            full_name = payload.get('name')
            given_name = payload.get('given_name')
            family_name = payload.get('family_name')
            if given_name:
                user.first_name = given_name
            elif full_name:
                # If only full name provided, store it in first_name for display
                user.first_name = full_name
            if family_name:
                user.last_name = family_name
            user.save()

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        # Compose display name
        name = (user.get_full_name() or user.first_name or '').strip()
        return Response({
            'access': access,
            'user': {
                'username': user.username,
                'email': user.email,
                'name': name if name else None,
            }
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        name = (user.get_full_name() or user.first_name or '').strip()
        return Response({
            'username': user.username,
            'email': user.email,
            'name': name if name else None,
        }, status=status.HTTP_200_OK)
