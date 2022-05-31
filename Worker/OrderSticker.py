class OrderSticker:
    def __init__(self, stickerDictionary): 

        self.name = stickerDictionary['name']

        self.price = stickerDictionary['price']
        self.quantity = stickerDictionary['quantity']

        self.width = stickerDictionary['width']
        self.height = stickerDictionary['height']

        self.material_name = stickerDictionary['material_name']
        self.style_name = stickerDictionary['style_name']

        self.img_url = stickerDictionary['img_url']
        self.crop_img_url = stickerDictionary['crop_img_url']