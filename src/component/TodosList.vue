<template>
    <div class="todoList_Content">
        <div class="inputBox">
            <input type="text" placeholder="請輸入待辦事項" v-model="newTodoField.content">
            <a v-on:click="addtodos">
                <i class="fa fa-plus"></i>
            </a>
        </div>
        <div class="todoList_list">
            <ul class="todoList_tab">
                <li><a :class="{ active: currentTable === Table_Type.All }"
                        v-on:click="toggleTableType(Table_Type.All)">全部</a></li>
                <li><a :class="{ active: currentTable === Table_Type.UNFINISH }"
                        v-on:click="toggleTableType(Table_Type.UNFINISH)">待完成</a></li>
                <li><a :class="{ active: currentTable === Table_Type.FINISH }"
                        v-on:click="toggleTableType(Table_Type.FINISH)">已完成</a></li>
            </ul>
            <div class="todoList_items">
                <ul class="todoList_item">

                    <li v-for="(todo, index) in currentTypeDatas()" :key="index">
                        <div class="inputBox" v-if="todo.isEditing">
                            <input type="text" v-model="todo.content" />
                            <a @click="saveCurrentEdit(todo)" v-if="todo.isEditing">
                                <i class="fa-solid fa-floppy-disk" style="color:aliceblue;"></i>
                            </a>
                        </div>
                        <div v-else>

                        </div>


                        <label class="todoList_label" v-if="!todo.isEditing">
                            <input class="todoList_input" type="checkbox" value="true" v-model="todo.status"
                                @click="switchTodoStatus(todo)">
                            <span>{{ todo.content }}</span>
                        </label>
                        <a @click="editCurrentTodo(todo)" v-if="!todo.isEditing"><!--編輯按鈕-->
                            <i class="fa fa-pencil" style="color:brown"></i>
                        </a>
                        <a @click="deleteTodo(todo.id)" v-if="!todo.isEditing"><!--刪除按鈕-->
                            <i class="fa fa-times" style="color:brown"></i>
                        </a>

                    </li>

                </ul>
                <div class="todoList_statistics">
                    <span v-if="todoDatas.length == 0"> 目前尚無待辦事項 </span>
                    <span
                        v-if="(todoDatas.length != 0) && (currentTable === Table_Type.UNFINISH || currentTable === Table_Type.All)">
                        {{
                            todoDatasByStatus(false).length }} 個未完成項目
                    </span>
                    <span v-else-if="(todoDatas.length != 0) && (currentTable === Table_Type.FINISH)">{{
                        todoDatasByStatus(true).length }} 個已完成項目
                    </span>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

//定義要傳入的子層 prop 
const prop = defineProps({
    todoDatas: {
        type: Array,
        required: true
    }
});

//設定emit給予父層處理對應函式
const emit = defineEmits(['add-todo', 'edit-todo', 'delete-todo', 'switch-todo-status']);

//代辦事項狀態列舉
const Table_Type = Object.freeze({
    All: "all",
    FINISH: "Finish",
    UNFINISH: "UNFINISH"
});

//目前所選中的狀態
const currentTable = ref(Table_Type.All);

//新增欄位用
const newTodoField = ref({
    content: ''
});

//依照狀態篩選代辦事項
const todoDatasByStatus = (status) => {
    return prop.todoDatas.filter(item => item.status === status);
}

//依照狀態篩選代辦事項
const currentTypeDatas = () => {
    if (currentTable.value === Table_Type.All) {
        return prop.todoDatas;
    }
    else if (currentTable.value === Table_Type.FINISH) {
        return prop.todoDatas.filter(item => item.status === true);
    }
    else {
        return prop.todoDatas.filter(item => item.status === false);
    }
}

//切換代辦狀態用
const toggleTableType = (type) => {
    currentTable.value = type;
}

//新增代辦
const addtodos = () => {
    if (newTodoField.value.content.trim() === '') {
        alert('請輸入代辦事項內容');
        return;
    }
    emit('add-todo', newTodoField.value, () => { newTodoField.value = '' });
}

//刪除代辦
const deleteTodo = (todoId) => {
    emit('delete-todo', todoId);
}

//切換代辦事項狀態
const switchTodoStatus = (todoData) => {
    todoData.status = !todoData.status;
    emit('switch-todo-status', todoData);
}

//選擇目前編輯事項
const editCurrentTodo = (todoData) => {
    todoData.isEditing = true
}

//編輯儲存
const saveCurrentEdit = async (todoData) => {
    try {
        todoData.isEditing = false;
        emit('edit-todo', todoData);
    } catch (err) {
        console.error(err)
    }
}

</script>