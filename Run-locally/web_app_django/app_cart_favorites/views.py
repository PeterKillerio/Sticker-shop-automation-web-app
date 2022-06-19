from django.http import Http404, HttpResponse
from django.db.models.fields.files import FieldFile
from django.core.files.base import File, ContentFile
from django.core.files.images import ImageFile
from django.db.models.fields import Field
from django.core.files.temp import NamedTemporaryFile

# Rest framework
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from PIL import Image, ImageColor, ImageChops
import PIL.ImageOps
import requests
import base64
import io

# Imported models
from web_app_django.models import User
from app_sticker_listing.models import StickerStyleOption
from app_editor.models import CanvasStyleOption, CanvasCutoutImage 

# Price calulation and other helper function
from app_sticker_listing.helper_functions.sticker_price_calculation import getStickerPrice, getCanvasPrice
from app_sticker_listing.helper_functions.size_calculation import longestSidePick2Dimensions


def parseFavoriteStickerItems(favoriteStickerItems):
    """ Wraps data in a valid format for API response. """
    parsedFavoriteStickerItems = []
    for favoriteItem in favoriteStickerItems:
        parsedFavoriteStickerItems.append({
            "name": favoriteItem.sticker_style_option.material_option.sticker.name,\
            "sticker_id": favoriteItem.sticker_style_option.material_option.sticker.id,\
            "favorite_item_id": favoriteItem.id,\
            "sticker_option_id": favoriteItem.sticker_style_option.id,\
            "img": favoriteItem.sticker_style_option.img_combi_url
        })

    content={   'favorite_items': parsedFavoriteStickerItems  }
    return content

def parseCartItems(cart):
    """ Wraps data in a valid format for API response. """
    cartStickerItems = cart.stickercartitem_set.all()
    cartCanvasItems = cart.canvascartitem_set.all()

    parsedCartStickerItems = []
    for cartStickerItem in cartStickerItems:
        parsedCartStickerItems.append({
            "name": cartStickerItem.sticker_style_option.material_option.sticker.name,\
            "sticker_id": cartStickerItem.sticker_style_option.material_option.sticker.id,\
            "cart_sticker_id": cartStickerItem.id,\
            "price": cartStickerItem.price,\
            "finalPrice": round(cartStickerItem.price*cartStickerItem.quantity, 2),\
            "amount": cartStickerItem.quantity,\
            "width": cartStickerItem.width,\
            "height": cartStickerItem.height,\
            'material': cartStickerItem.sticker_style_option.material_option.material.name, \
            'style': cartStickerItem.sticker_style_option.style.name, \
            "img": cartStickerItem.sticker_style_option.img_combi_url, \
        })
    parsedCartCanvasItems = []
    for cartCanvasItem in cartCanvasItems:
        parsedCartCanvasItems.append({
            "name": f"Canvas #{cartCanvasItem.finished_canvas.id}",\
            "finished_canvas_id": cartCanvasItem.finished_canvas.id,\
            "cart_canvas_id": cartCanvasItem.id,\
            "price": cartCanvasItem.price,\
            "finalPrice": round(cartCanvasItem.price*cartCanvasItem.quantity, 2),\
            "amount": cartCanvasItem.quantity,\
            "width": cartCanvasItem.width,\
            "height": cartCanvasItem.height,\
            'material': cartCanvasItem.finished_canvas.canvas_style_option.material_option.material.name, \
            'style': cartCanvasItem.finished_canvas.canvas_style_option.style.name, \
            "img": cartCanvasItem.finished_canvas.img_combi_file.url, \
        })

    content={   'cart_sticker_items': parsedCartStickerItems, 'cart_canvas_items': parsedCartCanvasItems}
    return content

class FavoritesPage(APIView):
    """ View for requesting favorite stickers page data. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def get(self, request):
        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Get all of his favorites and parse them
        favoriteStickerItems = user.favorites_set.get().stickerfavoriteitem_set.all()
        content= parseFavoriteStickerItems(favoriteStickerItems)

        return Response(content)

class AddFavoriteSticker(APIView):
    """ View for adding favorite stickers to current user. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def post(self, request):

        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Check if the sticker style option exists
        try:
            sticker_style_option = StickerStyleOption.objects.get(id=request.data['sticker_style_option_id'])
        except:
            sticker_style_option = None

        if sticker_style_option != None:
            # Check if the request to add this favorite item is valid (item is active)
            if sticker_style_option.active == True and sticker_style_option.material_option.active == True:
                # Check if the sticker is already a favorite of this user
                if not user.favorites_set.get().stickerfavoriteitem_set.filter(sticker_style_option=sticker_style_option).exists():
                    user.favorites_set.get().stickerfavoriteitem_set.create(sticker_style_option=sticker_style_option)
                else:
                    return HttpResponse('Sticker is already in favorites', status=409) # 409 Conflict
            else:
                return HttpResponse('Sticker is inactive', status=401) # 401 Unauthorized
        else:
            raise Http404 # 404 Not foound
            
        return Response({})

class RemoveFavoriteSticker(APIView):
    """ View for removing favorite stickers of current user. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def post(self, request):
        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Check if the favorite exists
        try:
            print(f"request.data['sticker_style_option_id']: {request.data['sticker_style_option_id']}")
            favorite_sticker_to_remove = user.favorites_set.get().stickerfavoriteitem_set.filter(sticker_style_option__id=request.data['sticker_style_option_id'])
        except:
            favorite_sticker_to_remove = None

        if favorite_sticker_to_remove != None and favorite_sticker_to_remove:
            favorite_sticker_to_remove.delete()
        else:
            raise Http404
            
        return Response({})
        
class CartPage(APIView):
    """ View for requesting cart page data. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def get(self, request):
        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Get all of his cart stickers and parse them
        cart = user.cart_set.get()
        content = parseCartItems(cart)

        return Response(content)

class AddStickerToCart(APIView):
    """ View for adding stickers to user's cart. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def post(self, request):
        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Check if the sticker style option exists
        try:
            sticker_style_option = StickerStyleOption.objects.get(id=request.data['sticker_style_option_id'])

            # Check if the chosen dimensions are valid
            sizeLimitObj = sticker_style_option.style.size_limit

            # Calculate sticker width,heigh
            longestSidePick = float(request.data['longest_side_pick'])

            stickerAspectRatio = float(sticker_style_option.auto_img_aspect_ratio_w_h)

            width, height = longestSidePick2Dimensions( aspectRatio=stickerAspectRatio, 
                                                        longestSidePick=longestSidePick)

            # Check size validity
            if (min(width, height) < sizeLimitObj.minimal_side_length_mm) or (max(width, height) > sizeLimitObj.maximal_side_length_mm):
                return HttpResponse('Invalid sticker size', status=400) # 400 Bad Request
            
            # Check if user chose valid sticker amount
            amount = round(int(request.data['sticker_amount']))
            if amount < 1:
                return HttpResponse('Invalid amount value', status=400) # 400 Bad Request
        except:
            sticker_style_option = None

        if sticker_style_option != None:
            # Check if the request to remove this favorite item is valid (item is active)
            if sticker_style_option.active == True and sticker_style_option.material_option.active == True:
                price = getStickerPrice(stickerStyleOption=sticker_style_option, longestSidePick=longestSidePick)
                user.cart_set.get().stickercartitem_set.create( price=price, quantity=amount, sticker_style_option=sticker_style_option, width=width, height=height)
            else:
                return HttpResponse('Sticker is inactive', status=401) # 401 Unauthorized
        else:
            raise Http404 # 404 Not foound
            
        return Response({})

class AddCanvasToCart(APIView):
    """ View for adding canvas to user's cart. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def post(self, request):
        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        ## Check inputs validity
        try:
            quantity = request.data['canvas_amount']
            background_color_hex = request.data['background_color']
            canvas_style_option_id = request.data['canvas_style_option_id']
            longestSidePick = float(request.data['longest_side_pick'])
            canvas_cutout_option_id = request.data['canvas_cutout_option_id']
            request_image_canvas = request.data['image_canvas']
        except:
            return HttpResponse(""" ERROR: Missing a requiered POST data variable.""", status=400) # 400 - Bad request
        
        # Check if the canvas style option exists and color format
        try:
            canvas_style_option = CanvasStyleOption.objects.get(id=canvas_style_option_id)
        except:
            return HttpResponse(""" ERROR: Invalid canvas style.""", status=400) # 400 - Bad request
        try:
            background_color_rgb = ImageColor.getcolor(background_color_hex, "RGB")
        except:
            return HttpResponse(""" ERROR: Invalid color format.""", status=400) # 400 - Bad request

        ## Check if the chosen dimensions are valid
        sizeLimitObj = canvas_style_option.style.size_limit
        # Calculate canvas width,height
        canvas_cutout_option = CanvasCutoutImage.objects.get(id=canvas_cutout_option_id)
        width, height = longestSidePick2Dimensions( aspectRatio=canvas_cutout_option.auto_img_aspect_ratio_w_h, 
                                                    longestSidePick=longestSidePick)
                                                
        if (min(width, height) < sizeLimitObj.minimal_side_length_mm) or (max(width, height) > sizeLimitObj.maximal_side_length_mm):
            return HttpResponse('ERROR: Invalid sticker size', status=400) # 400 Bad Request
            
        # Calculate price
        price = getCanvasPrice(canvasStyleOption=canvas_style_option, longestSidePick=longestSidePick)

        ## Get, decode and edit images
        # Canvas image
        format, image_canvas_str = request_image_canvas.split(';base64,')
        image_canvas_decoded = base64.b64decode(image_canvas_str.encode('UTF-8'))
        # Cutout image
        crop_image_str = requests.get(canvas_cutout_option.img_url)


        ## Edit to-be-saved images 
        image_canvas = Image.open(io.BytesIO(image_canvas_decoded))
        crop_image = Image.open(io.BytesIO(crop_image_str.content)).convert('RGBA')

        ## Place image on colored background or metalic background
        image_background = Image.new("RGBA", crop_image.size, background_color_rgb) # Create an rgba/metalic background 
        # If there is canvas style background image, apply the image
        if canvas_style_option.style.style_background_image_url:
            background_style_image_req = requests.get(canvas_style_option.style.style_background_image_url)
            background_style_image = Image.open(io.BytesIO(background_style_image_req.content))
            # Resize the background style image
            background_style_image = background_style_image.resize(crop_image.size)
            # Convert to RGBA
            background_style_image = background_style_image.convert("RGBA")
            # Paste the image on the colored background
            image_background.paste(background_style_image, (0, 0), background_style_image)

        # Apply mask on 'image_canvas', and 'image_background' 
        # Crop print image

        image_canvas = ImageChops.multiply(ImageChops.invert(crop_image), image_canvas)
        # Apply image on background and crop it
        image_background.paste(image_canvas, (0, 0), image_canvas)
        image_background = ImageChops.multiply(ImageChops.invert(crop_image).convert('RGBA'), image_background)


        # Finally, convert the crop_image to RGB on white background and invert it so that the design-space will be black
        white_background = Image.new("RGBA", crop_image.size, "#FFFFFF")
        white_background.paste(crop_image.convert('RGBA'), (0, 0), crop_image.convert('RGBA'))
        crop_image = white_background.convert("RGB")  
        crop_image = PIL.ImageOps.invert(crop_image.convert("RGB"))


        ## Create temporary file (neccessary for S3 FileField upload)
        ## and save the canvas to the temporary file 
        # Create temporary file
        img_temp = NamedTemporaryFile(delete=True)
        crop_img_temp = NamedTemporaryFile(delete=True)
        combi_img_temp = NamedTemporaryFile(delete=True)
        # Save 'image_canvas' (and 'crop_image', 'combi_image', ...) bytes data to 'img_byte_arr' (crop_img_byte_arr, combi_img_byte_arr)
        img_byte_arr = io.BytesIO()
        crop_img_byte_arr = io.BytesIO()
        combi_img_byte_arr = io.BytesIO()
        
        image_canvas.save(img_byte_arr, format='PNG')
        crop_image.save(crop_img_byte_arr, format='PNG')
        image_background.save(combi_img_byte_arr, format='PNG')

        ## Write bytes data to temporary file
        # Print image
        img_temp.write(img_byte_arr.getvalue())
        img_temp.flush()   
        # Crop image     
        crop_img_temp.write(crop_img_byte_arr.getvalue())
        crop_img_temp.flush()   
        # Combi image     
        combi_img_temp.write(combi_img_byte_arr.getvalue())
        combi_img_temp.flush()    

        # Create 'finishedcanvas' (without assigned FileFields)
        user_editor = user.usereditor_set
        finished_canvas = user_editor.get().finishedcanvas_set.create(
            canvas_style_option = canvas_style_option,

            price = price,
            quantity = quantity,
            background_color = background_color_hex,

            # img_file = -, # crop_img_file = -, # img_combi_file = -,
            
            width_mm = width,
            height_mm = height
        )

        # Assign filefield to finished canvas
        try:
            finished_canvas.img_file.save('image.png', img_temp)
            finished_canvas.crop_img_file.save('cutoutImage.png', crop_img_temp)
            finished_canvas.img_combi_file.save('imageCombi.png', combi_img_temp)
            user.save()
        except:
            # Error: remove the finished canvas
            finished_canvas.delete()  
            return HttpResponse("""Error while saving canvas media.""", status=500) # 500 - Internal Server Error

        try:
            # Create canvas cart item
            user_cart = user.cart_set.get()
            canvas_cart_item = user_cart.canvascartitem_set.create(
                width = width,
                height = height,
                finished_canvas = finished_canvas,

                price = price,
                quantity = quantity
            )
            canvas_cart_item.save()
        except:
            # Error: remove the finished canvas
            finished_canvas.delete()  
            return HttpResponse("""Error while adding item to the cart.""", status=500) # 500 - Internal Server Error

        # Return success -> user then updates cart
        return Response({})

class RemoveStickerFromCart(APIView):
    """ View for removing sticker from current user's cart. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def post(self, request):
        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Check if the cart item exists
        try:
            sticker_cart_item_to_remove = user.cart_set.get().stickercartitem_set.filter(id=request.data['sticker_cart_item_id'])
        except:
            sticker_cart_item_to_remove = None

        if sticker_cart_item_to_remove != None and sticker_cart_item_to_remove:
            sticker_cart_item_to_remove.delete()
        else:
            raise Http404
            
        return Response({})
        
class RemoveCanvasFromCart(APIView):
    """ View for removing canvas from current user's cart. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated
    
    def post(self, request):
        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Check if the cart canvas item exists
        try:
            canvas_cart_item_to_remove = user.cart_set.get().canvascartitem_set.filter(id=request.data['canvas_cart_item_id'])
        except:
            canvas_cart_item_to_remove = None

        if canvas_cart_item_to_remove != None and canvas_cart_item_to_remove:
            canvas_cart_item_to_remove.delete()
        else:
            print(f"canvas_cart_item_to_remove: {canvas_cart_item_to_remove}, canvas_cart_item_to_remove: {canvas_cart_item_to_remove}")
            raise Http404
            
        return Response({})

        
