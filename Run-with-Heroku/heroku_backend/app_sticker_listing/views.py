
from django.http import Http404

# Other models
from app_sticker_listing.models import Sticker, StickerTag
from django.db.models import Count

# Django rest framework library
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

# Import constants
from .local_constants import FILTER_OPTIONS_RETURN_COUNT, ON_INPUT_FETCH_FILTER_OPTIONS_CHARACTER_LIMIT


def parseStickerObjects(max_side_length, stickers):
    """ This function parses filtered/fetched sticker objects to suitable
        output for the front-end. """
    content = []
    
    for sticker_i, sticker in enumerate(stickers):
        # Loop through all styles of a sticker
        for style_option in sticker.get_active_style_options():
            content.append({    'id': sticker.id, \
                                'stickerStyleOptionId': style_option.id, \
                                'name': sticker.name, \
                                'currentAreaToSquareAreaRatio': style_option.auto_current_area_to_square_area_ratio, \
                                'priceParameter': style_option.style.price_per_square_mm, \
                                'material': style_option.material_option.material.name, \
                                'style': style_option.style.name, \
                                'imgDesign': style_option.img_combi_url, \
                                'longest_pick_limit_min': style_option.auto_longest_pick_limit_min, \
                                'longest_pick_limit_max': style_option.auto_longest_pick_limit_max})
    
    return content

def parseFilterOptions(filterTags, filterNames, text=""):
    """ This function parses filter tags and names to suitable
        output for the front-end. """
    content = []

    # Add one additional option: "contains a name"
    if text != "":
        content.append({    'name': text, \
                            'type': 'name', \
                            'count': len(filterNames)})

    for filterTag_i, filterTag in enumerate(filterTags):
        content.append({    'name': filterTag.name, \
                            'type': 'tag', \
                            'count': filterTag.sticker_set.count()})

    for filterName_i, filterName in enumerate(filterNames):
        content.append({    'name': filterName.name, \
                            'type': 'name', \
                            'count': 1})
    return content

def parseStickerData(sticker):
    """ This function parses all necessary sticker data for front-end sticker (product) page. """

    content = []

    # Iterate every material and style
    materialoptions = sticker.stickermaterialoption_set.all().filter(active=True)
    
    contentMaterialOptions = []
    for stickerMaterialOption_i, stickerMaterialOption in enumerate(materialoptions):
        styleOptions = stickerMaterialOption.stickerstyleoption_set.all().filter(active=True)
        contentStyleOptions = []

        for stickerStyleOption_i, stickerStyleOption in enumerate(styleOptions):
            contentStyleOptions.append({    'style_option_name': stickerStyleOption.style.name, \
                                            'style_option_id': stickerStyleOption.id, \
                                            'img_combi_url': stickerStyleOption.img_combi_url, \
                                            'minimal_side_length_mm': stickerStyleOption.style.size_limit.minimal_side_length_mm, \
                                            'maximal_side_length_mm': stickerStyleOption.style.size_limit.maximal_side_length_mm, \
                                            'price_parameter': stickerStyleOption.style.price_per_square_mm, \
                                            'aspect_ratio': stickerStyleOption.auto_img_aspect_ratio_w_h
                                        })

        contentMaterialOptions.append({    'material_name': stickerMaterialOption.material.name, \
                            'material_option_id': stickerMaterialOption.id, \
                            'style_options': contentStyleOptions})
    
    content={   'name': sticker.name, \
                'id': sticker.id, \
                'description': sticker.description, \
                'material_options': contentMaterialOptions}


    return content

def parseQuery(request):
    """ Parse query from request and return 2 arrays, 1st for tags, 2nd for names
        plus longest side picked by the user. """
    tags, names, longest_side_length_mm = ([],[], 30)

    if 'tags' in request.query_params:
        tags = request.query_params['tags'].split()
    if 'names' in request.query_params:
        names = request.query_params['names'].split()
    if 'longestside' in request.query_params:
        longest_side_length_mm = request.query_params['longestside']

    return (tags, names, longest_side_length_mm)
        
        
def filterStickersByTags(tags,objects=None):
    """ Takes list of strings 'tags' as an argument and returns active
        stickers which contains all of the tags.
        Optionally, user can specify already available objects to filter 
        through with 'objects' argument - None by default.
        Returns filtered sticker objects. """
    if (objects == None):
        stickers = Sticker.objects.all().filter(active=True) # Get all active stickers
    else:
        stickers = objects

    # Iterate through tags and filter
    for tag_name in tags:
        stickers = stickers.filter(tags__name=tag_name)

    return stickers

def filterStickersByNames(names,objects=None):
    """ Tages list of strings 'names' as an argument and returns active
        stickers which contains all of the words in the names list.
        Optionally, user can specify already available objects to filter 
        through with 'objects' argument.
        Returns filtered sticker objects. """
    if (objects == None):
        stickers = Sticker.objects.all().filter(active=True) # Get all active stickers
    else: 
        stickers = objects

    # Iterate through names and build filter
    for name in names:
        stickers = stickers.filter(name__icontains=name)

    return stickers

class StickerList(APIView):
    """ Api view for returning all the stickers left after filtering them by user-specified tags
        and names. """
    permission_classes = [AllowAny] # Anythin before or after will not be run if not authenticated

    def get(self, request):
        # Get tags and names from query
        tags, names, longest_side_length_mm = parseQuery(request)

        # Filter by tags and then by names
        filtered_stickers = filterStickersByTags(tags)
       
        filtered_stickers = filterStickersByNames(names, objects=filtered_stickers)
        
        # Filter by longest picked side
        # longest_side_length_mm = 20 # [mm]
        
        # Prepare output
        content = parseStickerObjects(int(longest_side_length_mm), filtered_stickers)
        
        return Response(content)

class GetFilterOptions(APIView):
    """ Api view called by the filter user's options picker. Returns available tags and names
        to filter by. """
    permission_classes = [AllowAny] # Anythin before or after will not be run if not authenticated

    def get(self, request):
        text = "";
        if 'text' in request.query_params:
            text = request.query_params['text'].strip()

        # If the length of the searched filter options is longer than a limit, use that text for filtering them
        if len(text) >= ON_INPUT_FETCH_FILTER_OPTIONS_CHARACTER_LIMIT:
            filterTags = StickerTag.objects.filter(name__icontains=text).annotate(sticker_count=Count('sticker')).order_by('-sticker_count')[0:FILTER_OPTIONS_RETURN_COUNT]
            # Also add names of stickers that match this text
            filterNames =  Sticker.objects.filter(name__icontains=text)[0:FILTER_OPTIONS_RETURN_COUNT]
        else:
            # Take first most popular X tags and return them
            filterTags = StickerTag.objects.annotate(sticker_count=Count('sticker')).order_by('-sticker_count')[0:FILTER_OPTIONS_RETURN_COUNT]
            filterNames = []

        # Prepare output
        content = parseFilterOptions(filterTags, filterNames, text=text)
        
        return Response(content)


class StickerPage(APIView):
    """ View for requesting sticker (product) page data. """
    permission_classes = [AllowAny] # Anythin before or after will not be run if not authenticated

    def get(self, request, sticker_id):
        # Check if the sticker exists and is active
        try:
            sticker = Sticker.objects.get(id=sticker_id, active=True)
        except Sticker.DoesNotExist:
            sticker = None

        # If sticker doesn't exist or is inactive raise 404
        if sticker == None:
            raise Http404

        # Parse sticker data
        content = parseStickerData(sticker)

        return Response(content)

        