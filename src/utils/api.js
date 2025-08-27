// src/utils/api.js
const BASE_API_URL = 'https://todolist-api.hexschool.io';

// API 路徑常數
export const POST_SIGN_IN = 'users/sign_in';
export const POST_SIGN_UP = 'users/sign_up';
export const GET_USER_CHECKOUT = 'users/checkout';
export const POST_SIGN_OUT = 'users/sign_out';
export const GET_TODOS = 'todos/';
export const POST_TODOS = 'todos/';

// 格式化 URL
export function formatAPIUrl(path) {
    const requestURL = `${BASE_API_URL}/${path}`;
    console.log('API Request URL:', requestURL);
    return requestURL;
}
