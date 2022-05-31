from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import update_last_login
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken 

# Import constants
from ..global_constants import USERNAME_LENGTH, EMAIL_LENGTH

class LoginSerializer(serializers.ModelSerializer):
    """ Serializer for a user login. Contains validation and authentication
        functionality and returns information to UI if such validation isn't 
        successful. """
    User = get_user_model()
    
    email = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    username = serializers.SerializerMethodField(read_only=True)
    access = serializers.SerializerMethodField(read_only=True)
    refresh = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = get_user_model()
        fields = ('email', 'password', 'username', 'access', 'refresh')

    def validate(self, data):
        email = data.get("email", None)
        password = data.get("password", None)
        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError(
                'User with this email and password does not exist'
            )
        try:
            update_last_login(None, user)
            
        except User.DoesNotExist:
            raise serializers.ValidationError(
                'User with this email and password does not exist'
            )
        
        return data
    
    def create(self, validated_data):
        email = validated_data.get("email", None)
        password = validated_data.get("password", None)
        user = authenticate(username=email, password=password)

        return {
            'email': user.email,
        }

    def get_username(self, data):
        email = data.get('email')
        user = get_user_model().objects.get(email=email)
        return user.username

    def get_access(self, data):
        email = data.get('email')
        user = get_user_model().objects.get(email=email)
        return str(AccessToken.for_user(user))
    
    def get_refresh(self, data):
        email = data.get('email')
        user = get_user_model().objects.get(email=email)
        return str(RefreshToken.for_user(user))


class RegisterSerializer(serializers.ModelSerializer):
    """ Serializer for user registration. Contains validation
        functionality, user creation and returns information to UI if such validation isn't 
        successful (username/email exists ...). """
    User = get_user_model()

    username = serializers.CharField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all(), message="This username is already taken")]
            )
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all(), message="This email is already taken")]
            )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password')

    def validate_username(self, data):
        if len(data) > USERNAME_LENGTH:
            raise serializers.ValidationError(
                f'Username is too long. Make sure it\'s no longer than {USERNAME_LENGTH} characters')
        return data
    
    def validate_email(self, data):
        if len(data) > EMAIL_LENGTH:
            raise serializers.ValidationError(
                f'Email is too long. Make sure it\'s no longer than {EMAIL_LENGTH} characters')
        return data

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        user = get_user_model().objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user