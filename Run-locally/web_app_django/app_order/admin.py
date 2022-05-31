from django.contrib import admin
from .models import Order, OrderStickerItem, OrderCanvasItem

# Registered models
admin.site.register(Order)
admin.site.register(OrderStickerItem)
admin.site.register(OrderCanvasItem) 