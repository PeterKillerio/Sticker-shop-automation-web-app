export const API_CALL_BASE_URL = 'https://sticker-application-backend.herokuapp.com/';

export const STICKER_PAGE_URL = 'sticker/' // + id
export const ORDERS_PAGE_URL = 'orders/'
export const FAVORITE_STICKERS_PAGE_URL = 'favorites/'
export const CART_STICKERS_PAGE_URL = 'cart/'
export const ORDER_CREATION_PAGE_URL = 'cart/continue/'

export const LOCAL_STORAGE = {
    access_token: 'api/tokens/access_token', // <string>
    refresh_token: 'api/tokens/refresh_token', // <string>
    is_temp: 'user/auth/is_temp_user', // <bool>
    username: 'user/auth/username' // <string>
};

export const COLORS = {
    colorA: '#000000',
    colorB: '#FFFFFF',
    colorC: '#FF3333'
}

export const FONT_SIZES = {
    sizeA: '12px',
    sizeB: '10px'
}