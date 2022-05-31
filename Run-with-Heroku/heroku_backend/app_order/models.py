from django.db import models

# Other models
from app_editor.models import FinishedCanvas
from web_app_django.models import User
from app_sticker_listing.models import StickerStyleOption 

# Constants
from app_order.local_constants import ( ORDER_STATUS_OPTIONS, 
                                        FULL_NAME_LENGTH, EMAIL_LENGTH, COUNTRY_LENGTH, 
                                        STREET_LENGTH, CITY_LENGTH, POSTAL_CODE_LENGTH, 
                                        TELEPHONE_NUMBER_LENGTH, INFORMATION_FOR_DELIVERY_LENGTH)


class DeliveryData(models.Model):
    """ Main parrent for order representation. One order can compromise of
        multiple stickers and canvases (order items).  """
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=FULL_NAME_LENGTH)
    email = models.CharField(max_length=EMAIL_LENGTH)
    country = models.CharField(max_length=COUNTRY_LENGTH)
    street = models.CharField(max_length=STREET_LENGTH)
    city = models.CharField(max_length=CITY_LENGTH)
    postal_code = models.CharField(max_length=POSTAL_CODE_LENGTH)
    telephone_number = models.CharField(max_length=TELEPHONE_NUMBER_LENGTH)
    information_for_delivery = models.CharField(max_length=INFORMATION_FOR_DELIVERY_LENGTH, blank=True)
class Order(DeliveryData):
    """ Order model that is created after user finishes the ordering process. """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=16, choices=ORDER_STATUS_OPTIONS, default='CREATED')
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}'s order: {self.id} status: {self.status}"


class OrderItem(models.Model):
    """ General parrent model for all order items (stickers, canvases). """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    creation_date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField() 
class OrderStickerItem(OrderItem):
    """ Child model order item for stickers that is created after user orders a sticker. """
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)
    sticker_style_option = models.ForeignKey(StickerStyleOption, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.order.user.username}'s order id: {self.order.id}, Sticker order item id:{self.id}: {self.sticker_style_option.material_option.sticker.name}, {self.sticker_style_option.material_option.material.name}, {self.sticker_style_option.style.name}, {self.quantity}x{self.price} €"
class OrderCanvasItem(OrderItem):
    """ Child model order item for canvases that is created after user orders a canvas. """
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    width = models.DecimalField(max_digits=6, decimal_places=2)
    height = models.DecimalField(max_digits=6, decimal_places=2)
    finished_canvas = models.ForeignKey(FinishedCanvas, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.order.user.username}'s order id: {self.order.id}, Sticker order item id:{self.id}: Canvas #{self.finished_canvas.id}, {self.finished_canvas.canvas_style_option.material_option.material.name}, {self.finished_canvas.canvas_style_option.style.name}, {self.quantity}x{self.price} €"