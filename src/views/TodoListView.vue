<template>
    <!-- ToDo List -->
    <div id="todoListPage" class="bg-half">
        <nav>
            <h1><a href="#">ONLINE TODO LIST</a></h1>
            <ul>
                <li class="todo_sm"><a href="#/todoList"><span>{{ user.nickname }} 的代辦</span></a></li>
                <li><a href="#" v-on:click="onSignOut">登出</a></li>
            </ul>
        </nav>
        <div class="conatiner todoListPage vhContainer">
            <TodosList :todoDatas="todoDatas" @add-todo="addTodos" @edit-todo="editTodos"
                @switch-todo-status="switchTodoStatus" @delete-todo="deleteTodos" />
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { GET_USER_CHECKOUT, GET_TODOS, POST_SIGN_OUT, POST_TODOS, PUT_TODOS, DELETE_TODOS, PATCH_TODOS, formatAPIUrl } from '@/utils/api';
import TodosList from '@/component/TodosList.vue';


const todoDatas = ref([]); //目前使用者的代辦清單
const loginIn = ref(false); //驗證登入用

const user = inject('getUserData', { nickname: '訪客', uid: '' }); // 第二個參數是沒有帶入參數時的預設值
const loadConfig = inject('LoadingConfig'); //做各項讀取用

const token = ref(''); //暫存使用者Token

//取得資料狀態，因為是初始化內容，做Loading處理
const getTodoDatas = async () => {

    loadConfig.value.message = '代辦事項載入中…';
    loadConfig.value.modelValue = true;

    // console.log(token.value);
    await axios.get(formatAPIUrl(GET_TODOS), {
        headers: {
            Authorization: token.value
        }
    }).then((res) => {
        console.log(res);
        if (loginIn.value == false) {
            loginIn.value = true;
        }
        todoDatas.value = res.data.data;
    }).catch((e) => {
        console.log(e);
    }).finally(() => {
        loadConfig.value.modelValue = false;
    });
}

//登出
const onSignOut = async () => {

    loadConfig.value.message = '正在登出...';
    loadConfig.value.modelValue = true;

    await axios.post(formatAPIUrl(POST_SIGN_OUT), {}, {
        headers: {
            Authorization: token.value
        }
    }).then((res) => {
        console.log(res);
        loginIn.value = false;
        token.value = '';
        alert('已成功登出');
        window.location.href = `#/`;
    }).catch((e) => {
        console.log(e);
    }).finally(() => {
        loadConfig.value.modelValue = false;
    });
}

//新增待辦事項
const addTodos = async (todoData, successCallback) => {
    loadConfig.value.message = '正在新增項目...';
    loadConfig.value.modelValue = true;

    await axios.post(formatAPIUrl(POST_TODOS), todoData, {
        headers: {
            Authorization: token.value
        }
    }).then((res) => {
        if (res.data.status === true) {
            todoDatas.value.push(res.data.newTodo);
        }
        alert('新增待辦事項成功！');
        successCallback(); //做清除欄位
    }).catch((error) => {
        console.log(`POST_TODOS : ${error}`);
    }).finally(() => {
        loadConfig.value.modelValue = false;
    });;

}

//修改編輯事項
const editTodos = async (todoData) => {

    loadConfig.value.message = '正在修改項目...';
    loadConfig.value.modelValue = true;

    const newTodoValue = {
        content: todoData.content
    };

    await axios.put(formatAPIUrl(PUT_TODOS, { id: todoData.id }), newTodoValue, {
        headers: {
            Authorization: token.value
        }
    }).then((res) => {
        alert('修改待辦事項成功！');
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        loadConfig.value.modelValue = false;
    });
}

//修改事項狀態
const switchTodoStatus = async (todoData) => {

    loadConfig.value.message = '正在調整項目...';
    loadConfig.value.modelValue = true;

    await axios.patch(formatAPIUrl(PATCH_TODOS, { id: todoData.id }), null, {
        headers: {
            Authorization: token.value
        }
    }).then((res) => {
        alert('更改待辦事項成功！');
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        loadConfig.value.modelValue = false;
    });
}

//刪除事項
const deleteTodos = async (todoId) => {

    loadConfig.value.message = '正在刪除項目...';
    loadConfig.value.modelValue = true;

    await axios.delete(formatAPIUrl(DELETE_TODOS, { id: todoId }), {
        headers: {
            Authorization: token.value
        }
    }).then((res) => {
        alert('已刪除代辦事項!');
        todoDatas.value = todoDatas.value.filter(item => item.id !== todoId);
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        loadConfig.value.modelValue = false;
    });
}

//驗證登入，並取得使用者資料
const checkToken = async () => {
    token.value = document.cookie.replace(/(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$/i, "$1");
    if (token.value === ``) {
        alert(`登入驗證已過期，請重新登入`);
        window.location.href = `#/`;
        return false;
    }
    else {
        await axios.get(formatAPIUrl(GET_USER_CHECKOUT), {
            headers: {
                Authorization: token.value
            }
        }).then((res) => {
            user.value = res.data;
            console.log(user.value);
        }).catch((e) => {
            alert(`登入驗證已過期，請重新登入`);
            window.location.href = `#/`;
            return false;
        });

        return true;
    }
}

onMounted(async () => {

    if (await checkToken() == false) {//初始驗證登入
        return;
    }
    getTodoDatas(); //如果有過就取資料

    //測試用
    // setTimeout(() => {
    //     loadConfig.value.message = '處理中…';
    //     loadConfig.value.modelValue = true;
    // }, 1000)
})
</script>
