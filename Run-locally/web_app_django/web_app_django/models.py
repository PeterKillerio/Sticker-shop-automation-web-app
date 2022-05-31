from django.contrib.auth.models import AbstractUser
from django.db import models
from django.apps import apps

class User(AbstractUser):  
    """ Main customized User model used for authentication and user-related data
        relation creation. """ 
    is_temp_user = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)

        ## Post save functions
        # Check if user has Favorites model created 
        if (self.favorites_set.all().first() == None):
            favoritesInstance = apps.get_model('app_cart_favorites.Favorites')(user=self)
            favoritesInstance.save()
            self.favorites = favoritesInstance

        # Check if user has Cart model created 
        if (self.cart_set.all().first() == None):
            cartInstance = apps.get_model('app_cart_favorites.Cart')(user=self)
            cartInstance.save()
            self.cart = cartInstance

        # Check if user has UserEditor model created 
        if (self.usereditor_set.all().first() == None):
            userEditorInstance = apps.get_model('app_editor.UserEditor')(user=self)
            userEditorInstance.save()
            self.user_editor = userEditorInstance

            
            

        
