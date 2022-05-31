from statistics import quantiles
from django.db import models
from web_app_django.models import User
from app_sticker_listing.models import StickerStyleOption 
from app_editor.models import FinishedCanvas


## Cart and Favorites database
# Cart database
class Cart(models.Model):
    """ Organisational model, each user has one cart (unique=True).
        It is created on user model creation. """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)
    
    def __str__(self):
        return f"{self.user.username}'s cart: {self.id}"
        
class CartItem(models.Model):
    """ General (parent) model for all the cart items. """
    id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField() 
class StickerCartItem(CartItem):
    """ Child model for CartItem that holds additional information related
        to stickers. """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)
    sticker_style_option = models.ForeignKey(StickerStyleOption, on_delete=models.CASCADE)
class CanvasCartItem(CartItem):
    """ Child model for CartItem that holds additional information related to canvas. """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)
    finished_canvas = models.ForeignKey(FinishedCanvas, on_delete=models.CASCADE)

# Favorites database
class Favorites(models.Model):
    """ Organisational model, each user has one 'Favorites' model. It is created
        automatically on User model creation. """
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)

    def __str__(self):
        return f"{self.user.username}'s favorites: {self.id}"

class FavoriteItem(models.Model):
    """ General (parent) model for all the favorited items. """
    id = models.AutoField(primary_key=True)
    creation_date = models.DateTimeField(auto_now_add=True)
class StickerFavoriteItem(FavoriteItem):
    """ Child model for FavoriteItem that holds additional information about 
        favorited sticker. """
    favorites = models.ForeignKey(Favorites, on_delete=models.CASCADE)
    sticker_style_option = models.ForeignKey(StickerStyleOption, on_delete=models.CASCADE)
    