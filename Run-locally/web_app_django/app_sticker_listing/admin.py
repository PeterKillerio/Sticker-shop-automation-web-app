from django.contrib import admin
from .models import SizeLimit,StickerMaterial,StickerStyle,Gallery,StickerTag,Sticker,StickerMaterialOption,StickerStyleOption

# Registered models
admin.site.register(SizeLimit)
admin.site.register(StickerMaterial)
admin.site.register(StickerStyle)
admin.site.register(Gallery)
admin.site.register(StickerTag)
admin.site.register(Sticker)    
admin.site.register(StickerMaterialOption)
admin.site.register(StickerStyleOption)