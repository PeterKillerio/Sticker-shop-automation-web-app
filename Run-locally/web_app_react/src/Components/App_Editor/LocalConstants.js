export const CANVAS_TOOLS = {
    MOVE_TOOL: 0,
    ERASER_TOOL: 1,
    DEERASER_TOOL: 2,
    PAINT_TOOL: 3,
    DEPAINT_TOOL: 4
};

/*  Each editor tool has its own states f.e. if user preses/hold a left mouse click a different
    state with different functionality is activated (not painting vs painting)  */
export const MOVE_TOOL_STATES = {
    INACTIVE: 0,
    ACTIVE: 1,
} 

export const ERASER_DEERASER_TOOL_STATES = {
    INACTIVE: 0,
    ACTIVE: 1,
}

export const PAINT_DEPAINT_TOOL_STATES = {
    INACTIVE: 0,
    ACTIVE: 1,
}

export const API_CALL_URLS = {
    get_editor_page: 'api/editor/',
    add_cart_canvas: 'api/cart/add/canvas/'   
};