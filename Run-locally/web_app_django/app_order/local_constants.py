# States an order can be in
ORDER_STATUS_OPTIONS_MAP = {
    'CREATED': 'Created',
    'PAID': 'Paid',
    'PRINTED': 'Printed',
    'PACKAGED': 'Packaged',
    'SHIPPED': 'Shipped',
    'RECEIVED': 'Received',  
}
ORDER_STATUS_OPTIONS = [
    ('CREATED', ORDER_STATUS_OPTIONS_MAP['CREATED']),
    ('PAID', ORDER_STATUS_OPTIONS_MAP['PAID']),
    ('PRINTED', ORDER_STATUS_OPTIONS_MAP['PRINTED']),
    ('PACKAGED', ORDER_STATUS_OPTIONS_MAP['PACKAGED']),
    ('SHIPPED', ORDER_STATUS_OPTIONS_MAP['SHIPPED']),
    ('RECEIVED', ORDER_STATUS_OPTIONS_MAP['RECEIVED']),
]

# Limits for models
FULL_NAME_LENGTH = 64
EMAIL_LENGTH = 255
COUNTRY_LENGTH = 64                                  
STREET_LENGTH = 64
CITY_LENGTH = 64
POSTAL_CODE_LENGTH = 16
TELEPHONE_NUMBER_LENGTH = 32
INFORMATION_FOR_DELIVERY_LENGTH= 256