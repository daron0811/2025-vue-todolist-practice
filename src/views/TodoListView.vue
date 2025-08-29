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
            <TodosList :todoDatas="todoDatas" @add-todo="addTodos" />
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { GET_TODOS, POST_SIGN_OUT, POST_TODOS, formatAPIUrl } from '@/utils/api';
import TodosList from '@/component/TodosList.vue';


const todoDatas = ref([]); //目前使用者的代辦清單
const loginIn = ref(false);

const user = inject('getUserData', { nickname: '訪客', uid: '' }); // 第二個參數是沒有帶入參數時的預設值

const getTodoDatas = async () => {
    const token = document.cookie.replace(/(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$/i, "$1");
    try {
        const res = await axios.get(formatAPIUrl(GET_TODOS), {
            headers: {
                Authorization: token
            }
        });
        console.log(res);
        if (loginIn.value == false) {
            loginIn.value = true;
        }
        todoDatas.value = res.data.data;
    }
    catch (e) {
        //TODO:失敗處理，返回首頁
        console.log(e);
    }
}

const onSignOut = async () => {
    const token = document.cookie.replace(/(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$/i, "$1");
    console.log('logout');
    try {
        const res = await axios.post(formatAPIUrl(POST_SIGN_OUT), {}, {
            headers: {
                Authorization: token
            }
        });
        console.log(res);
        loginIn.value = false;
        alert('已成功登出');
    }
    catch (error) {
        console.log(error);
    }
}

const addTodos = async (todoData) => {
    const token = document.cookie.replace(/(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$/i, "$1");
    try {
        const res = await axios.post(formatAPIUrl(POST_TODOS), todoData, {
            headers: {
                Authorization: token
            }
        });

        if (res.data.status === true) {
            todoDatas.value.push(res.data.newTodo);
        }
        //TODO : 可以做callback
        console.log(todoDatas.value);
        alert('新增待辦事項成功！');
    }
    catch (error) {
        console.log(error);
    }
}


onMounted(async () => {
    getTodoDatas(); //初始驗證登入
})
</script>
