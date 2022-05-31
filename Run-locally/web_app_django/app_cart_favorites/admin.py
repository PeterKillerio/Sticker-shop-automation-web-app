from django.contrib import admin
from .models import Cart, StickerCartItem, CanvasCartItem, Favorites, StickerFavoriteItem 

# Registered models
admin.site.register(Cart)
admin.site.register(StickerCartItem)
admin.site.register(CanvasCartItem)

admin.site.register(Favorites)
admin.site.register(StickerFavoriteItem)