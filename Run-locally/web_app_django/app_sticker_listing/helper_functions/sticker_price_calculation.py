def getStickerPrice(stickerStyleOption, longestSidePick):
    """ This function takes in sticker option model instance and sticker longest side pick number to calcualte price from.
        All dimensions are in mm and price in Euro. """
    price = float(longestSidePick)*float(stickerStyleOption.style.price_per_square_mm)
    return round(price, 2)

def getCanvasPrice(canvasStyleOption, longestSidePick):
    """ This function takes in canvas option model instance and canvas longest side pick to calcualte price from.
        All dimensions are in mm and price in Euro. """
    price = float(longestSidePick)*float(canvasStyleOption.style.price_per_square_mm)
    return round(price, 2)