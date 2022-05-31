from django.contrib.auth import get_user_model
from django.http import Http404, HttpResponse

# Django rest library
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

# Models
from web_app_django.models import User
from app_editor.models import CanvasMaterialOption, CanvasStyleOption, CanvasCutoutImage

# Constants
from app_order.local_constants import ORDER_STATUS_OPTIONS_MAP

# Helper function
from app_sticker_listing.helper_functions.sticker_price_calculation import getStickerPrice


def parseEditorPageData():
    """ Returns complete data to be sent in an API response. """
    content = []

    # Iterate every canvas material and style options
    materialoptions = CanvasMaterialOption.objects.all().filter(active=True)
    
    contentMaterialOptions = []
    for canvasMaterialOption_i, canvasMaterialOption in enumerate(materialoptions):
        styleOptions = canvasMaterialOption.canvasstyleoption_set.all().filter(active=True)
        contentStyleOptions = []

        for stickerStyleOption_i, stickerStyleOption in enumerate(styleOptions):
            
            contentStyleOptionDict = {    'name': stickerStyleOption.style.name, \
                                            'option_id': stickerStyleOption.id, \
                                            'icon_url': stickerStyleOption.style.style_icon_url, \
                                            'minimal_side_length_mm': stickerStyleOption.style.size_limit.minimal_side_length_mm, \
                                            'maximal_side_length_mm': stickerStyleOption.style.size_limit.maximal_side_length_mm, \
                                            'price_parameter': stickerStyleOption.style.price_per_square_mm
                                        }
            if stickerStyleOption.style.style_background_image_url:
                contentStyleOptionDict['style_background_image_url'] = stickerStyleOption.style.style_background_image_url
            
            contentStyleOptions.append(contentStyleOptionDict)

        contentMaterialOptions.append({    'name': canvasMaterialOption.material.name, \
                            'option_id': canvasMaterialOption.id, \
                            'style_options': contentStyleOptions})
    
    # Iterate every available cutout option
    cutoutoptions = CanvasCutoutImage.objects.all().filter(active=True)
    
    contentCutoutOptions = []

    for canvasCutoutOption_i, canvasCutoutOption in enumerate(cutoutoptions):
        contentCutoutOptions.append({   'name': canvasCutoutOption.name, \
                                        'option_id': canvasCutoutOption.id, \
                                        'img_url': canvasCutoutOption.img_url, \
                                        'img_width': canvasCutoutOption.auto_img_width, \
                                        'img_height': canvasCutoutOption.auto_img_height, \
                                        'img_aspect_ratio': canvasCutoutOption.auto_img_aspect_ratio_w_h})

    content={   'material_options': contentMaterialOptions,
                'cutout_options': contentCutoutOptions}

    return content

class EditorPage(APIView):
    """ View for requesting editor page data."""
    permission_classes = [AllowAny] # Anythin before or after will not be run if not authenticated

    def get(self, request):
        
        try:
            content = parseEditorPageData()
        except:
            return HttpResponse("Internal error, contact the maintainer", status=500) # 400 Bad Request

        return Response(content)