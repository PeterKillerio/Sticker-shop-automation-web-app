"""web_app_django URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import re_path, path

# Import apps views
import app_order.views as app_order_views
import app_cart_favorites.views as app_cart_favorites_views
import app_sticker_listing.views as app_sticker_listing_views
import web_app_django.views as web_app_django_views
import app_editor.views as app_editor_views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Sticker listing
    path('api/tags/', app_sticker_listing_views.GetFilterOptions.as_view(), name='GetFilterOptions'),
    path('api/stickers/', app_sticker_listing_views.StickerList.as_view(), name='StickerList'),
    
    # Product page data request
    path('api/sticker/<int:sticker_id>/', app_sticker_listing_views.StickerPage.as_view(), name='StickerPage'),
    
    # Favorite stickers views
    path('api/favorites/', app_cart_favorites_views.FavoritesPage.as_view(), name='FavoritesPage'),
    path('api/favorites/remove/', app_cart_favorites_views.RemoveFavoriteSticker.as_view(), name='RemoveFavoriteSticker'),
    path('api/favorites/add/', app_cart_favorites_views.AddFavoriteSticker.as_view(), name='AddFavoriteSticker'),
    
    # Cart for stickers views
    path('api/cart/', app_cart_favorites_views.CartPage.as_view(), name='CartPage'),
    path('api/cart/remove/', app_cart_favorites_views.RemoveStickerFromCart.as_view(), name='RemoveStickerFromCart'),
    path('api/cart/canvas/remove/', app_cart_favorites_views.RemoveCanvasFromCart.as_view(), name='RemoveCanvasFromCart'),
    path('api/cart/add/', app_cart_favorites_views.AddStickerToCart.as_view(), name='AddStickerToCart'),
    path('api/cart/add/canvas', app_cart_favorites_views.AddCanvasToCart.as_view(), name='AddCanvasToCart'),

    # Order views
    path('api/order/creation/', app_order_views.OrderCreationPage.as_view(), name='OrderCreationPage'),
    path('api/order/create/', app_order_views.CreateOrder.as_view(), name='CreateOrder'),
    path('api/order/', app_order_views.GetOrders.as_view(), name='GetOrders'),
    # Editor views
    path('api/editor/', app_editor_views.EditorPage.as_view(), name='EditorPage'),
    
    ## JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # Create temporary user and get tokens ~ signing up as a visitor
    path('api/token/temp/', web_app_django_views.GetTemporaryUserTokens.as_view(), name='token_verify'),
    path('api/token/login/', web_app_django_views.LoginView.as_view(), name='auth_login'),
    path('api/token/register/', web_app_django_views.RegisterView.as_view(), name='auth_register'),
    
]

