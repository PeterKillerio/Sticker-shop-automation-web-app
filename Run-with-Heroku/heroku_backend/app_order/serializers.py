
from django.contrib.auth import get_user_model

# Rest framework serializer core parent class 
from rest_framework import serializers

# Models
from web_app_django.models import User 

# Constants
from web_app_django.global_constants import USERNAME_LENGTH, EMAIL_LENGTH
from app_order.local_constants import ( ORDER_STATUS_OPTIONS, 
                                        FULL_NAME_LENGTH, EMAIL_LENGTH, COUNTRY_LENGTH, 
                                        STREET_LENGTH, CITY_LENGTH, POSTAL_CODE_LENGTH, 
                                        TELEPHONE_NUMBER_LENGTH, INFORMATION_FOR_DELIVERY_LENGTH)

# Helper functions
from app_sticker_listing.helper_functions.sticker_price_calculation import getStickerPrice, getCanvasPrice



class CreateOrderSerializer(serializers.ModelSerializer):
    """ Serializer that is being used for creating an order. Takes
        care of validation of all the inputs and returning appropriate
        validation information to the user's interface. """
    User = get_user_model()

    full_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    country = serializers.CharField(required=True)
    street = serializers.CharField(required=True)
    city = serializers.CharField(required=True)
    postal_code = serializers.CharField(required=True)
    telephone_number = serializers.CharField(required=True)
    information_for_delivery = serializers.CharField(required=False)

    class Meta:
        model = get_user_model()
        fields = ('full_name', 'email', 'country', 'street', 'city', 'postal_code', 'telephone_number', 'information_for_delivery')

    # Validate each field (additional validation can be easily implemented for each field)
    def validate_full_name(self, data):
        if False:
            raise serializers.ValidationError(
                f'Validation error')
        return data
    
    def validate_email(self, data):
        if len(data) > EMAIL_LENGTH:
            raise serializers.ValidationError(
                f'Email is too long. Make sure it\'s no longer than {EMAIL_LENGTH} characters')
        return data

    def validate_country(self, data):
        if len(data) > COUNTRY_LENGTH:
            raise serializers.ValidationError(
                f'Country name is too long. Make sure it\'s no longer than {COUNTRY_LENGTH} characters')
        return data

    def validate_street(self, data):
        if len(data) > STREET_LENGTH:
            raise serializers.ValidationError(
                f'Street name is too long. Make sure it\'s no longer than {STREET_LENGTH} characters')
        return data

    def validate_city(self, data):
        if len(data) > CITY_LENGTH:
            raise serializers.ValidationError(
                f'City name is too long. Make sure it\'s no longer than {CITY_LENGTH} characters')
        return data

    def validate_postal_code(self, data):
        if len(data) > POSTAL_CODE_LENGTH:
            raise serializers.ValidationError(
                f'Postal code is too long. Make sure it\'s no longer than {POSTAL_CODE_LENGTH} characters')
        return data

    def validate_telephone_number(self, data):
        if len(data) > TELEPHONE_NUMBER_LENGTH:
            raise serializers.ValidationError(
                f'Telephone number is too long. Make sure it\'s no longer than {TELEPHONE_NUMBER_LENGTH} characters')
        return data

    def validate_information_for_delivery(self, data):
        if len(data) > INFORMATION_FOR_DELIVERY_LENGTH:
            raise serializers.ValidationError(
                f'Text is too long. Make sure it\'s no longer than {INFORMATION_FOR_DELIVERY_LENGTH} characters')
        return data

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        """ Create an order on valid user's order sumbission. """

        # Get user
        user = User.objects.get(id=self.context['request'].user.id)
        
        # Iterate all objects (stickers and canvases) in user's cart-save them, calculate order price
        order_price = 0
        stickerCartItems = user.cart_set.get().stickercartitem_set.all()
        canvasCartItems = user.cart_set.get().canvascartitem_set.all()
        if (len(stickerCartItems) + len(canvasCartItems)) < 1:
            raise serializers.ValidationError({"detail": "You don't have any stickers or canvases in your cart"})
        for stickerCartItem in stickerCartItems:
            order_price += stickerCartItem.quantity*stickerCartItem.price
        for canvasCartItem in canvasCartItems:
            canvas = canvasCartItem.finished_canvas
            order_price += canvas.quantity*canvasCartItem.price

        # Create new order for this user
        try:
            order = user.order_set.create(
                full_name = validated_data["full_name"],
                email = validated_data["email"],
                country = validated_data["country"],
                street = validated_data["street"],
                city = validated_data["city"],
                postal_code = validated_data["postal_code"],
                telephone_number = validated_data["telephone_number"],
                information_for_delivery = validated_data["information_for_delivery"],
                status = ORDER_STATUS_OPTIONS[1][0],
                price = round(order_price,2)
            )
        except:
            raise serializers.ValidationError({"detail": "Failed to create order, please try making your order again. Contact us after being repeatedly unable to create your order."})

        # Append the sticker and canvas items to that order
        try:
            for stickerCartItem in stickerCartItems:
                order.orderstickeritem_set.create(
                    name = stickerCartItem.sticker_style_option.material_option.sticker.name,
                    width = stickerCartItem.width,
                    height = stickerCartItem.height,
                    sticker_style_option = stickerCartItem.sticker_style_option,
                    price = stickerCartItem.price,
                    quantity = stickerCartItem.quantity
                )
            for canvasCartItem in canvasCartItems:
                order.ordercanvasitem_set.create(
                    name = f"Canvas #{canvasCartItem.finished_canvas.id}",
                    finished_canvas = canvasCartItem.finished_canvas,
                    width = canvasCartItem.width,
                    height = canvasCartItem.height,
                    price = canvasCartItem.price,
                    quantity = canvasCartItem.quantity
                )
        except:
            order.remove()
            raise serializers.ValidationError({"detail": "Failed to create order, please try making your order again. Contact us after being repeatedly unable to create your order."})

        # Successfully created order, remove items from the cart and return
        user.cart_set.get().stickercartitem_set.all().delete()
        user.cart_set.get().canvascartitem_set.all().delete()

        return validated_data