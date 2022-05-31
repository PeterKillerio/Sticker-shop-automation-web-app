# This worker, regularly searches the database for paid orders and if such
# order exists (for sticker or canvas), it will start the printing process
import psycopg2
from PIL import Image
import requests
from io import BytesIO

from local_constants import MEDIA_PATH

def returnStringsWithCommas(array_strings):
    ret_string = ""
    for array_string_idx, array_string in enumerate(array_strings):
        if ret_string != "":
            ret_string = ret_string + ', ' + array_string 
        else:
            ret_string = array_string
    return ret_string

def url2image(image_url):
    """ Reads image from the URL and returns PIL image """
    response = requests.get(image_url)
    return Image.open(BytesIO(response.content))

def saveQueryToDictionary(save_dictionary, db_cursor, select_what, save_selected_as, select_from, where_what, equals_this):
    """ Function for making queries and saving them into 'save_dictionary' """
    db_cursor.execute(f"SELECT {returnStringsWithCommas(select_what)} FROM {select_from} WHERE {where_what} = %s;", [equals_this,])
    data = db_cursor.fetchall()
    # Iterate all the data and save accordingly
    for save_as_idx, save_as in enumerate(save_selected_as):
        
        # If its FileField, prepend media path prefix
        if select_what[save_as_idx].endswith('_file'):
            save_dictionary[save_as] = MEDIA_PATH + data[0][save_as_idx]
        else:
            save_dictionary[save_as] = data[0][save_as_idx]
    return

class Worker:
    def __init__(self, database, user, password, host, port):
        # Connect to database
        # Local
        # self.db_connection = psycopg2.connect(database="web_app_db", user="kio", password="kio", host="127.0.0.1", port="5433")
        # Production
        self.db_connection = psycopg2.connect(database=database, user=user, password=password, host=host, port=port)

        self.db_cursor = self.db_connection.cursor()
        
        self.order_ids = []
        self.sticker_data = {}
        self.canvas_data = {}

        # Standardization variables
        self.variables_to_save = ["user_id", "username", "name", "price", "quantity", "width", "height", "material_name", "style_name", "img_url", "crop_img_url"]
        self.orders_and_items = {}

    def find_and_parse(self, order_status="PAID"):
        # Reset variables
        self.reset_order_variables()

        # Get the sticker and canvas data
        self.fetch_orders(order_status=order_status)
        self.fetch_sticker_data_from_orders()
        self.fetch_canvas_data_from_orders()

        # Generate  

        # Printing canvas
        # https://stackoverflow.com/questions/61817956/python-send-pil-image-to-printer-using-printerdialog-from-pyqt5-problem-pyqt5
        # https://doc.qt.io/qtforpython-5/PySide2/QtPrintSupport/QPrinter.html

        # Iterate every order item and append it to the 

    def reset_order_variables(self):
        self.orders_and_items = {}
        self.sticker_data = {}
        self.canvas_data = {}

    def fetch_orders(self, order_status='PAID'):
        self.db_cursor.execute("SELECT deliverydata_ptr_id FROM app_order_order WHERE app_order_order.status = %s;", [order_status,])
        self.order_ids = self.db_cursor.fetchall()

    def fetch_sticker_data_from_orders(self):
        for order_id in self.order_ids:
            # Get all sticker ids in this order
            self.db_cursor.execute("SELECT orderitem_ptr_id FROM app_order_orderstickeritem WHERE app_order_orderstickeritem.order_id = %s;", [order_id[0],])
            order_sticker_item_ids = self.db_cursor.fetchall()
            
            # Iterate every sticker and save its data into 'order_items'
            for order_sticker_item_id in order_sticker_item_ids:
                self.sticker_data = {}

                # Format for filling the 'self.sticker_data' using sql queries
                # [[select what], [save selected as], 'select from', 'where what', 'equals this']
                # Get [user_id] from Model Order
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["user_id"],  ["user_id"], 'app_order_order', 'app_order_order.deliverydata_ptr_id', order_id[0])
                # Get [username] from Model User
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["username"],  ["username"], 'web_app_django_user', 'web_app_django_user.id', self.sticker_data['user_id'])
                # Get [name, price, quantity] from Model OrderItem
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["name", "price", "quantity"],  ["name", "price", "quantity"], 'app_order_orderitem', 'app_order_orderitem.id', order_sticker_item_id[0])
                # Get [width <[mm]>, height <[mm]>, sticker_style_option_id] from Model OrderStickerItem 
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["width", "height", "sticker_style_option_id"],  ["width", "height", "sticker_style_option_id"], 'app_order_orderstickeritem', 'app_order_orderstickeritem.orderitem_ptr_id', order_sticker_item_id[0])
                # Get [img_url, crop_img_url, material_option_id, style_id] from Model StickerStyleOption
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["img_url", "crop_img_url", "material_option_id", "style_id"],  ["img_url", "crop_img_url", "material_option_id", "style_id"], 'app_sticker_listing_stickerstyleoption', 'app_sticker_listing_stickerstyleoption.styleoption_ptr_id', self.sticker_data['sticker_style_option_id'])
                # Get [material_id <sticker_material_id>] from Model StickerMaterialOption
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["material_id"],  ["material_id"], 'app_sticker_listing_stickermaterialoption', 'app_sticker_listing_stickermaterialoption.materialoption_ptr_id', self.sticker_data['material_option_id'])
                # Get [name] from Model Material
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["name"],  ["material_name"], 'app_sticker_listing_material', 'app_sticker_listing_material.id', self.sticker_data['material_id'])
                # Get [name] from Model Style
                saveQueryToDictionary(self.sticker_data, self.db_cursor, ["name"],  ["style_name"], 'app_sticker_listing_style', 'app_sticker_listing_style.id', self.sticker_data['style_id'])

                # Standardize
                temp_dict = {}
                for variable_name in self.variables_to_save:
                    temp_dict[variable_name] = self.sticker_data[variable_name]
                if order_id[0] in self.orders_and_items:
                    self.orders_and_items[order_id[0]].append(temp_dict)
                else:
                    self.orders_and_items[order_id[0]] = [temp_dict]

    def fetch_canvas_data_from_orders(self):
        for order_id in self.order_ids:
            # Get all canvas ids in this order
            self.db_cursor.execute("SELECT orderitem_ptr_id FROM app_order_ordercanvasitem WHERE app_order_ordercanvasitem.order_id = %s;", [order_id[0],])
            order_canvas_item_ids = self.db_cursor.fetchall()

            # Iterate every canvas and save its data into 'order_items'
            for order_canvas_item_id in order_canvas_item_ids:
                self.canvas_data = {}
                
                # Get [user_id] from Model Order
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["user_id"],  ["user_id"], 'app_order_order', 'app_order_order.deliverydata_ptr_id', order_id[0])
                # Get [username] from Model User
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["username"],  ["username"], 'web_app_django_user', 'web_app_django_user.id', self.canvas_data['user_id'])
                # Get [name, price, quantity] from Model OrderItem
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["name", "price", "quantity"],  ["name", "price", "quantity"], 'app_order_orderitem', 'app_order_orderitem.id', order_canvas_item_id[0])
                # Get [width <[mm]>, height <[mm]>, finished_canvas_id] from Model OrderCanvasItem 
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["width", "height", "finished_canvas_id"],  ["width", "height", "finished_canvas_id"], 'app_order_ordercanvasitem', 'app_order_ordercanvasitem.orderitem_ptr_id', order_canvas_item_id[0])
                # Get [img_url, crop_img_url, material_option_id, style_id] from Model FinishedCanvas
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["img_file", "crop_img_file", "canvas_style_option_id"],  ["img_url", "crop_img_url", "canvas_style_option_id"], 'app_editor_finishedcanvas', 'app_editor_finishedcanvas.id', self.canvas_data['finished_canvas_id'])
                # Get [style_id] from Model CanvasStyleOption
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["style_id"],  ["style_id"], 'app_editor_canvasstyleoption', 'app_editor_canvasstyleoption.styleoption_ptr_id', self.canvas_data['canvas_style_option_id'])
                # Get [material_option_id] from Model CanvasStyleOption
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["material_option_id"],  ["material_option_id"], 'app_editor_canvasstyleoption', 'app_editor_canvasstyleoption.styleoption_ptr_id', self.canvas_data['canvas_style_option_id'])
                # Get [material_id] from Model MaterialOption
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["material_id"],  ["material_id"], 'app_editor_canvasmaterialoption', 'app_editor_canvasmaterialoption.materialoption_ptr_id', self.canvas_data['material_option_id'])
                # Get [name] from Model Material
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["name"],  ["material_name"], 'app_sticker_listing_material', 'app_sticker_listing_material.id', self.canvas_data['material_id'])
                # Get [name] from Model Style
                saveQueryToDictionary(self.canvas_data, self.db_cursor, ["name"],  ["style_name"], 'app_sticker_listing_style', 'app_sticker_listing_style.id', self.canvas_data['style_id'])

                # Standardize
                temp_dict = {}
                for variable_name in self.variables_to_save:
                    temp_dict[variable_name] = self.canvas_data[variable_name]
                if order_id[0] in self.orders_and_items:
                    self.orders_and_items[order_id[0]].append(temp_dict)
                else:
                    self.orders_and_items[order_id[0]] = [temp_dict]
        

    def setOrderStatus(self, order_id, status):
        """ Updates order with id 'order_id' to status 'status', in currenlty connected database """
        self.db_cursor.execute("UPDATE app_order_order SET status = %s WHERE deliverydata_ptr_id = %s;", ("PRINTED",order_id))  
        self.db_connection.commit()