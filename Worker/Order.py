# This worker, regularly searches the database for paid orders and if such
# order exists (for sticker or canvas), it will start the printing process
import psycopg2
from PIL import Image
import requests
from io import BytesIO

from local_constants import MEDIA_PATH

from OrderSticker import OrderSticker

class Order:
    def __init__(self, order_id, order_status, orderArray):
        """ Accepts array of dictionaries for the order """

        self.order_status = order_status
        self.order_id = order_id
        self.user_id = orderArray[0]['user_id']
        self.username = orderArray[0]['username']

        # Parse all the stickers separately
        self.orderStickers = []
        for sticker_dictionary in orderArray:
            self.orderStickers.append(OrderSticker(sticker_dictionary))
    
    def printOrderedStickers(self):
        for orderSticker in self.orderStickers:
            print(f"order_id: {self.order_id} ,name: {orderSticker.name} x {orderSticker.quantity}")


