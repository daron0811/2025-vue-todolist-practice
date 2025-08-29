// src/utils/api.js
const BASE_API_URL = 'https://todolist-api.hexschool.io';

// API 路徑常數
export const POST_SIGN_IN = 'users/sign_in';        //登入
export const POST_SIGN_UP = 'users/sign_up';        //註冊
export const GET_USER_CHECKOUT = 'users/checkout';  //驗證使用者
export const POST_SIGN_OUT = 'users/sign_out';      //登出
export const GET_TODOS = 'todos/';              //取得代辦清單 
export const POST_TODOS = 'todos/';             //新增代辦事項
export const PUT_TODOS = 'todos/{id}';        //更新代辦事項
export const DELETE_TODOS = 'todos/{id}';     //刪除代辦事項
export const PATCH_TODOS = 'todos/{id}/toggle'; //切換代辦事項完成狀態

// 格式化 URL
// 如果要帶參數 formatAPIUrl(PUT_TODOS, { id: 123 }); 
export function formatAPIUrl(path, params = {}) {
    let requestPath = path;

    // 替換路徑參數 {xxx}
    for (const [key, value] of Object.entries(params)) {
        requestPath = requestPath.replace(`{${key}}`, value);
    }

    const requestURL = `${BASE_API_URL}/${path}`;
    console.log('API Request URL:', requestURL);
    return requestURL;
}
