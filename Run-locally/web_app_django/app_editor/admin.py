from django.contrib import admin
from .models import UserEditor,CanvasMaterialOption,CanvasMaterial,CanvasStyle,CanvasStyleOption,FinishedCanvas,CanvasCutoutImage

# Registered models
admin.site.register(UserEditor)

admin.site.register(CanvasMaterial)
admin.site.register(CanvasMaterialOption)

admin.site.register(CanvasStyle)
admin.site.register(CanvasStyleOption)

admin.site.register(FinishedCanvas)
admin.site.register(CanvasCutoutImage)
