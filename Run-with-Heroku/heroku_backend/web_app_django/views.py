from os import access
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken 
from django.contrib.auth import get_user_model
# Import helper functions
from django.utils.crypto import get_random_string # random alphanumeric
# Import constants
from .global_constants import TEMPORARY_USER_USERNAME_LENGTH, TEMPORARY_USERNAME_PASSWORD_LENGTH
# Import serializer
from web_app_django.authentication.serializers import LoginSerializer, RegisterSerializer

class GetTemporaryUserTokens(APIView):
    """ This API call returns access and refresh tokens to a newly created user which suffices as
        a key to user-session information in a way that will not disrupt the application
        architecture i.e. everyone is registered but not everyone is verified. """
    permission_classes = [AllowAny] # Anythin before or after will not be run if not authenticated

    def get(self, request):
        # Get user model
        User = get_user_model() #username=username, password=password)

        # Create user with unique random username and password
        username = get_random_string(length=TEMPORARY_USER_USERNAME_LENGTH)
        password = get_random_string(length=TEMPORARY_USERNAME_PASSWORD_LENGTH)
        while User.objects.filter(username=username).exists():
            username = get_random_string(length=TEMPORARY_USER_USERNAME_LENGTH)
        new_user = User.objects.create_user(username=username, password=password, is_temp_user=True)
        new_user.save()

        # Get JWT token pair 
        # https://django-rest-framework-simplejwt.readthedocs.io/en/latest/creating_tokens_manually.html
        refresh = RefreshToken.for_user(new_user)
        access = AccessToken.for_user(new_user)

        # Send the tokens to the user
        content = [{'access': str(access), 'refresh': str(refresh)},]
        return Response(content)

class LoginView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = get_user_model().objects.all()
    serializer_class = LoginSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializer