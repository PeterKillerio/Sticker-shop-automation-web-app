def longestSidePick2Dimensions(aspectRatio, longestSidePick):
    """ This function takes in aspect ratio w/h and longest pick to calculate
        widht and height """
    longestSidePick = float(longestSidePick)
    aspectRatio = float(aspectRatio)
    if aspectRatio >= 1:
        width, height = (longestSidePick,longestSidePick/aspectRatio)
    else:
        width, height = (longestSidePick*aspectRatio, longestSidePick)
    return (width, height)