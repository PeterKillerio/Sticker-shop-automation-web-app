from django.db import models

from requests import get
from io import BytesIO
from PIL import Image
import math

## General database
class SizeLimit(models.Model):
    """ Model for specifying dimension limits which a widht or a height of a sticker
        cannot cross. """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=254)
    minimal_side_length_mm = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    maximal_side_length_mm = models.DecimalField(max_digits=6, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.name}: {self.minimal_side_length_mm}mm x {self.maximal_side_length_mm}mm"

class Material(models.Model):
    """ Parrent model class for all of the canvas and sticker materials. """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=254)

    def __str__(self):
        return f"{self.name}"
class StickerMaterial(Material):
    """ Child model class specifically for a sticker. """
    pass

class Style(models.Model):
    """ Parrent model class for all of the canvas and sticker styles. """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=254)
    price_per_square_mm = models.DecimalField(max_digits=6, decimal_places=4)
    size_limit = models.ForeignKey(SizeLimit, on_delete=models.SET_NULL, null=True, blank=False, unique=False)
    style_icon_url = models.URLField(max_length=200, null=True, blank=False)
    style_background_image_url = models.URLField(max_length=200, null=True, blank=True)

    def __str__(self):
        return f"{self.name}"

class StickerStyle(Style):
    """ Child model class specifically for a sticker. """

    sticker_material = models.ForeignKey(StickerMaterial, on_delete=models.CASCADE, blank=False)

    def __str__(self):
        return f"Material: {self.sticker_material.name}, Style: {self.name}"

### Stickers gallery database
class Tag(models.Model):
    """ Represents terms/tags for an item which are associated with it. """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)

    def __str__(self):
        return f"{self.name}"
class StickerTag(Tag):
    """ Represents specifically sticker tags. """
    pass

class Gallery(models.Model):
    """ Organisational model which represents the gallery. Added stickers
        are assigned to a certain gallery. """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)

    def __str__(self):
        return f"{self.name}"

class GalleryItem(models.Model):
    """ A general item that is assigned to a gallery. """
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40)
    description = models.CharField(max_length=508)
    active = models.BooleanField()
    
    def __str__(self):
        return f"{self.name}"
class Sticker(GalleryItem):
    """ Gallery item model for stickers """
    tags = models.ManyToManyField(StickerTag, blank=True)
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE)

    def active_style_option_count(self):
        """ Return total number of active style options that are defined by images. """
        count = 0
        
        for material_option in self.stickermaterialoption_set.all().filter(active=True):
            for style_option in material_option.stickerstyleoption_set.all().filter(active=True):
                count += 1
        return count
        
    def get_active_style_options(self):
        """ Return all active style options of a sticker. """
        style_options = [None]*self.active_style_option_count()
        idx = 0
        for material_option in self.stickermaterialoption_set.all().filter(active=True):
            for style_option in material_option.stickerstyleoption_set.all().filter(active=True):
                style_options[idx] = style_option
                idx += 1
        
        return style_options

class MaterialOption(models.Model):
    """ Each item has material options to choose from """
    id = models.AutoField(primary_key=True)
    active = models.BooleanField()
class StickerMaterialOption(MaterialOption):
    """ Sticker material options to choose from (vinyl, metalic). """
    sticker = models.ForeignKey(Sticker, on_delete=models.CASCADE)
    material = models.ForeignKey(StickerMaterial, on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return f"{self.sticker.name}, {self.material.name}"

class StyleOption(models.Model):
    """ Acting as a sub-item for material option, after selecting from a range of materials
        user can choose different style options """
    id = models.AutoField(primary_key=True)
    active = models.BooleanField()
class StickerStyleOption(StyleOption):
    """ Sticker style options such as gold, silver for metalic material or glossy, matte for vinyl.
        StickerStyleOption also contains design and cutting files. """
    material_option = models.ForeignKey(StickerMaterialOption, on_delete=models.CASCADE)
    style = models.ForeignKey(StickerStyle, on_delete=models.SET_NULL, null=True)
    img_url = models.URLField(max_length=200)
    img_combi_url = models.URLField(max_length=200)
    crop_img_url = models.URLField(max_length=200)

    # Automatically set after save
    auto_img_width = models.IntegerField(blank=False, default=0)
    auto_img_height = models.IntegerField(blank=False, default=0) 
    auto_img_aspect_ratio_w_h = models.DecimalField(max_digits=5, decimal_places=3, default=0)
    auto_current_area_to_square_area_ratio = models.DecimalField(max_digits=5, decimal_places=3, default=0)
    auto_longest_pick_limit_min = models.DecimalField(max_digits=6, decimal_places=3, default=0)
    auto_longest_pick_limit_max = models.DecimalField(max_digits=6, decimal_places=3, default=0)

    def __str__(self):
        return f"id:{self.id}, {self.material_option.sticker.name}, {self.material_option.material.name}, {self.style.name}"

    def save(self, *args, **kwargs):
        """ Set some variables after save additionally. """
        self.set_image_size()
        self.set_current_area_to_square_area_ratio()
        self.set_longest_pick_limits()
        super().save(*args, **kwargs)

    def get_image_size(self):
        """ Return width a heigh of image """
        return (self.auto_img_width, self.auto_img_height)
    def get_current_area_to_square_area_ratio(self):
        return self.auto_current_area_to_square_area_ratio

    def set_image_size(self):
        """ After save, set image size variable. """
        image_raw = get(self.crop_img_url)
        image = Image.open(BytesIO(image_raw.content))
        self.auto_img_width, self.auto_img_height = image.size
        self.auto_img_aspect_ratio_w_h = self.auto_img_width / self.auto_img_height 
        return

    def set_current_area_to_square_area_ratio(self):
        """ After save, set image ratio variable. """
        self.set_image_size()
        self.auto_current_area_to_square_area_ratio =  min(self.auto_img_width, self.auto_img_height)/max(self.auto_img_width, self.auto_img_height)
        return
    
    def set_longest_pick_limits(self):
        """ After save, save limitations for user size-picking. """
        self.auto_longest_pick_limit_max = round(self.style.size_limit.maximal_side_length_mm);
        self.auto_longest_pick_limit_min = math.ceil(max(self.auto_img_aspect_ratio_w_h, 1/self.auto_img_aspect_ratio_w_h)*float(self.style.size_limit.minimal_side_length_mm));
        return


