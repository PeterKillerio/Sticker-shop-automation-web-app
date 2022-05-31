
from django.contrib.auth import get_user_model
from django.http import Http404, HttpResponse

# Rest framework 
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

# Other models
from web_app_django.models import User
from app_order.serializers import CreateOrderSerializer

# Constants
from app_order.local_constants import ORDER_STATUS_OPTIONS_MAP

# Price calulation
from app_sticker_listing.helper_functions.sticker_price_calculation import getStickerPrice


def parseOrderCreationPageData(cartStickerItems, cartCanvasItems):
    """ Complete information returned on an API call for order creation page """

    parsedOrderCreationPageData = []

    final_price = 0 
    for cartStickerItem in cartStickerItems:
        final_price += cartStickerItem.price*cartStickerItem.quantity
    for cartCanvasItem in cartCanvasItems:
        final_price += cartCanvasItem.price*cartCanvasItem.quantity

    content={   "finalPrice": round(final_price, 2),
                "itemCount": len(cartStickerItems)+len(cartCanvasItems)  }

    return content

def parseGetOrdersData(orders):
    """ Parse complete information returned on an API call listing all user's orders """

    parsedGetOrdersData = []

    ordersData = []
    for order in orders:
        
        orderItemsData = []

        for stickerItem in order.orderstickeritem_set.all():
            orderItemsData.append({
                "name": stickerItem.name,
                "price": stickerItem.price,
                "quantity": stickerItem.quantity,
                "width": stickerItem.width,
                "height": stickerItem.height,
                "img": stickerItem.sticker_style_option.img_combi_url
            })
        for canvasItem in order.ordercanvasitem_set.all():
            orderItemsData.append({
                "name": canvasItem.name,
                "price": canvasItem.price,
                "quantity": canvasItem.quantity,
                "width": canvasItem.width,
                "height": canvasItem.height,
                "img": canvasItem.finished_canvas.img_combi_file.url
            })

        ordersData.append({
            "id": order.id,
            "price": order.price,
            "status": ORDER_STATUS_OPTIONS_MAP[order.status],
            "creation_date": str(order.creation_date).split('.')[0], # Remove miliseconds,
            "orderItemsData": orderItemsData
        })

    content={ "orders": ordersData}

    return content

class OrderCreationPage(APIView):
    """ View for requesting order creation page data. """

    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def get(self, request):

        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Get all of his cart stickers and canvases, extract infromation and returnd the data for display
        cartStickerItems = user.cart_set.get().stickercartitem_set.all()
        cartCanvasItems = user.cart_set.get().canvascartitem_set.all()

        if len(cartStickerItems) + len(cartCanvasItems):
            content = parseOrderCreationPageData(cartStickerItems, cartCanvasItems)
        else:
            return HttpResponse("You don't have any stickers in your cart", status=400) # 400 Bad Request

        return Response(content)

class CreateOrder(generics.CreateAPIView):
    """ View for creating order. """

    queryset = get_user_model().objects.all()
    serializer_class = CreateOrderSerializer

class GetOrders(APIView):
    """ View for getting all the user's orders data. """
    permission_classes = [IsAuthenticated] # Anythin before or after will not be run if not authenticated

    def get(self, request):

        # Get authenticated user object
        user = User.objects.get(id=request.user.id)

        # Get all of his cart stickers, extract infromation and returnd the data for display
        orders = user.order_set.all()

        if len(orders):
            content = parseGetOrdersData(orders)
        else:
            return HttpResponse("You don't have any orders", status=404) # 404 No orders

        return Response(content)

    