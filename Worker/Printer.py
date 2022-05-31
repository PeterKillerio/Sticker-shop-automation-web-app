# https://stackoverflow.com/questions/61817956/python-send-pil-image-to-printer-using-printerdialog-from-pyqt5-problem-pyqt5

import sys
from tabnanny import verbose
from PyQt5 import QtCore, QtGui, QtWidgets, QtPrintSupport
from PIL import Image, ImageColor, ImageChops
from PIL.ImageQt import ImageQt
import requests
import base64
import io
import time

PRINT_SPACE_WIDTH_MM = 210
PRINT_SPACE_HEIGHT_MM = 297

class App(QtWidgets.QWidget):
    def __init__(self, page):
        super().__init__()
        self.title = "Sticker web app worker"
        
        #3 Image parameters
        self.default_dpi = 300
        # Create pixel maps and add them to the dictionary
        for print_sticker in page:
            # Prepare image
            print_sticker['image_qt'] = ImageQt(print_sticker['image']).copy()
            print_sticker['image_pixmap'] = QtGui.QPixmap.fromImage(print_sticker['image_qt'])
            
            ## Width scaling
            # print_sticker['image_pixmap'] = print_sticker['image_pixmap'].scaledToWidth(self.width) 
            ## Or use precise scalling
            print_sticker['image_pixmap'] = print_sticker['image_pixmap'].scaled(
                                                self.mmToPaperDim(print_sticker['width']), 
                                                self.mmToPaperDim(print_sticker['height'])) 
        # Save the data
        self.page = page
        
        ## Setup printer and make print order
        printer = QtPrintSupport.QPrinter()
        # AUTOMATIC
        printer.setResolution(self.default_dpi)
        # Save printed image
        printer.setOutputFileName(f"print_jobs_{time.strftime('%Y_%m_%d_%H_%M_%S')}.pdf")
        dialog = QtPrintSupport.QPrintDialog(printer)
        dialog.accept()
        self.handle_paint_request(printer)
        
        # WITH MANUAL DIALOG OPTION
        # Set DPI
        # printer.setResolution(self.default_dpi)
        # dialog = QtPrintSupport.QPrintDialog(printer)
        # if dialog.exec_() == QtWidgets.QDialog.Accepted:
        #     self.handle_paint_request(printer)
        # else:
        #     print("Not accepted")

    def mmToPaperDim(self, dimension):
        """ Return dpi-adjusted dimension to represent real dimensions in mm on paper """

        dim_inches = float(dimension)*0.0393701 # Convert to inches
        return round(self.default_dpi*(dim_inches))

        
    def handle_paint_request(self, printer):
        # Setup print page
        printer.setOrientation(QtPrintSupport.QPrinter.Portrait)
        printer.setPaperSize(QtPrintSupport.QPrinter.A4)
        printer.setPageSize(QtPrintSupport.QPrinter.A4)
        printer.setPageMargins(0, 0, 0, 0, QtPrintSupport.QPrinter.Millimeter)

        # Create painter
        painter = QtGui.QPainter(printer)  
        # Draw images in page
        for print_sticker in self.page:
            painter.drawPixmap(10, self.mmToPaperDim(print_sticker['offset_top']), print_sticker['image_pixmap'])
        painter.end()

def getAndPrepareLocalImage(path_to_image):
    # Make the transparency white instead of black (by efault)
    # Place the image (pobbily transparent) on white background and return the image
    im = Image.open(path_to_image).convert("RGBA")
    image_background = Image.new("RGBA", im.size, '#FFFFFF')
    image = Image.new("RGBA", im.size)
    image.paste(image_background, (0, 0), image_background)
    image.paste(im, (0, 0), im)
    image = image.convert("RGB")
    return image
def getAndPrepareURLImage(image_url):
    # Make the transparency white instead of black (by efault)
    # Place the image (pobbily transparent) on white background and return the image
    image_req = requests.get(image_url)
    im = Image.open(io.BytesIO(image_req.content)).convert("RGBA")
    image_background = Image.new("RGBA", im.size, '#FFFFFF')
    image = Image.new("RGBA", im.size)
    image.paste(image_background, (0, 0), image_background)
    image.paste(im, (0, 0), im)
    image = image.convert("RGB")
    return image

def printStickers(orders):
    """ This application takes in an order/s (see Order in Order.py) as an input and creates print jobs for each and stacks the order stickers
        on top of each other.  """

    # Parse stickers (image + cut) for all orders all at once
    print_stickers = [] #  [{width_mm=xxx, height_mm=xxx, <PIL Image> image }, {...}, ...]

    print("Parsing orders...")
    for order_i, order in enumerate(orders):
        print(f"order: {order_i+1}/{len(orders)}")
        for orderSticker_i, orderSticker in enumerate(order.orderStickers):
            print(f"sticker: {orderSticker_i+1}/{len(order.orderStickers)}")

            # Get image and crop and multiple their occurence by the ordered amount
            image = getAndPrepareURLImage(orderSticker.img_url)
            crop_image = getAndPrepareURLImage(orderSticker.crop_img_url)
            for i in range(orderSticker.quantity):
                print_stickers.append({'image':image, 'width': orderSticker.width, 'height': orderSticker.height})
                print_stickers.append({'image':crop_image, 'width': orderSticker.width, 'height': orderSticker.height})

    

    # Also try to fill the first page -> call print for that page -> then fill second etc...
    print_space_height_left = PRINT_SPACE_HEIGHT_MM
    # Iterate all the print stickers and assign them 
    # to page
    pages = []
    temp_page = []
    for print_sticker in print_stickers:
        # Check if there is enough space on the page
        if print_space_height_left <= print_sticker['height']:
            pages.append(temp_page)
            temp_page = []
            # Reset offset
            print_space_height_left = PRINT_SPACE_HEIGHT_MM
        
        # Valid free space
        print_sticker['offset_top'] = int(PRINT_SPACE_HEIGHT_MM - print_space_height_left)
        temp_page.append(print_sticker)
        print_space_height_left -= print_sticker['height']
    
    if temp_page != []:
        pages.append(temp_page)

    print(f"pages to print: {len(pages)}")

    # Make print jobs for each page separately   
    app = QtWidgets.QApplication(sys.argv)      
    for page in pages:
        # Make print job
        
        App(page)


if __name__ == "__main__":
    printStickers()
    exit()