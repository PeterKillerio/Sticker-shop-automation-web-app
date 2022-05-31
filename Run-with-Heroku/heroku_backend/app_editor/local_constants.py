def GET_CANVAS_DIRECTORY_PATH(user_id, finished_canvas_id):
    """ Helper function that specifies the relative save location 
        for canvas images. Relative to root media-server (dir) folder. """
    return f"Media/Users/{user_id}/Canvas/{finished_canvas_id}/";
