from django.db import models
from app_editor import local_constants
from web_app_django.models import User
from io import BytesIO
from PIL import Image
from requests import get
from app_sticker_listing.models import Material, Style, MaterialOption, StyleOption

class UserEditor(models.Model):
    """ Organisational model, unieque for each user. """

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)

    def __str__(self):
        return f"{self.user.username}'s editor"

class CanvasMaterial(Material):
    """ Child model to Material model. """
    pass
class CanvasMaterialOption(MaterialOption):
    """ Material option users can choose in the editor. Child model to MaterialOption """

    material = models.ForeignKey(CanvasMaterial, on_delete=models.CASCADE)

    def __str__(self):
        return f"Material option: {self.material.name}"

class CanvasStyle(Style):
    """ Child model to Style specifically for canvas. """

    canvas_material = models.ForeignKey(CanvasMaterial, on_delete=models.CASCADE, blank=False)

    def __str__(self):
        return f"Material: {self.canvas_material.name}, Style: {self.name}"

class CanvasStyleOption(StyleOption):
    """ Canvas style option users can choose in the editor. """

    style = models.ForeignKey(CanvasStyle, on_delete=models.CASCADE)
    material_option = models.ForeignKey(CanvasMaterialOption, on_delete=models.CASCADE)

    def __str__(self):
        return f"Material option: {self.material_option.material.name}, style option: {self.style.name}"

## Filename
# Argument functions for FileFIled models that return a image save path url.
def img_file_path(self, filename):
    file_directory = local_constants.GET_CANVAS_DIRECTORY_PATH(self.user_editor.user.id, self.id)
    extension = filename.split('.')[-1]
    return(file_directory+'img.'+ extension)
def crop_img_file_path(self, filename):
    file_directory = local_constants.GET_CANVAS_DIRECTORY_PATH(self.user_editor.user.id, self.id)
    extension = filename.split('.')[-1]
    return(file_directory+'crop_img.'+ extension)
def img_combi_file_path(self, filename):
    file_directory = local_constants.GET_CANVAS_DIRECTORY_PATH(self.user_editor.user.id, self.id)
    extension = filename.split('.')[-1]
    return(file_directory+'img_combi.'+ extension)

class FinishedCanvas(models.Model):
    """ Model that contains all the information needed for a finished canvas to be
        used in the next stages of order fulfilment """

    id = models.AutoField(primary_key=True)
    user_editor = models.ForeignKey(UserEditor, on_delete=models.CASCADE)

    canvas_style_option = models.ForeignKey(CanvasStyleOption, on_delete=models.CASCADE)
    
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField()
    background_color = models.CharField(max_length=7, default='123') # HEX color code

    img_file = models.FileField(upload_to=img_file_path, blank=True)
    crop_img_file = models.FileField(upload_to=crop_img_file_path, blank=True)
    img_combi_file = models.FileField(upload_to=img_combi_file_path, blank=True)
    
    width_mm = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    height_mm = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    # Automatically set after save
    auto_img_width = models.IntegerField(blank=False, default=0)
    auto_img_height = models.IntegerField(blank=False, default=0) 
    auto_img_aspect_ratio_w_h = models.DecimalField(blank=False, max_digits=5, decimal_places=3, default=0)

    def __str__(self):
        return f"{self.user_editor.user.username}'s: finished canvas, id:{self.id}, material: {self.canvas_style_option.material_option.material.name}, style: {self.canvas_style_option.style.name}, {self.width_mm}mm x {self.height_mm}mm"

    def save(self, *args, **kwargs):
        """ Set some variables after every save automatically. """
        self.set_image_size()
        super().save(*args, **kwargs)

    def set_image_size(self):
        """ After each save, set image size variable. """
        if(self.img_file):
            image = Image.open(self.img_file)
            self.auto_img_width, self.auto_img_height = image.size
            self.auto_img_aspect_ratio_w_h = self.auto_img_width / self.auto_img_height 
        return

class CanvasCutoutImage(models.Model):
    """ Cutout image options that a user can choose when he is picking sticker
        border styles. """
        
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    active = models.BooleanField()
    img_url = models.URLField(max_length=200)

    # Automatically set after save
    auto_img_width = models.IntegerField(blank=False, default=0)
    auto_img_height = models.IntegerField(blank=False, default=0) 
    auto_img_aspect_ratio_w_h = models.DecimalField(max_digits=5, decimal_places=3, default=0)

    def __str__(self):
        return f"{self.name}, id:{self.id}, {self.auto_img_width} x {self.auto_img_height}"

    def save(self, *args, **kwargs):
        """ Set some variables after save additionally. """
        self.set_image_size()
        super().save(*args, **kwargs)

    def set_image_size(self):
        """ After save, set image size variable. """
        image_raw = get(self.img_url)
        image = Image.open(BytesIO(image_raw.content))
        self.auto_img_width, self.auto_img_height = image.size
        self.auto_img_aspect_ratio_w_h = self.auto_img_width / self.auto_img_height 
        return

