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
                            <a @click="saveEdit(todo)" v-if="todo.isEditing">
                                <i class="fa-solid fa-floppy-disk" style="color:aliceblue;"></i>
                            </a>
                        </div>
                        <div v-else>

                        </div>


                        <label class="todoList_label" v-if="!todo.isEditing">
                            <input class="todoList_input" type="checkbox" value="true" v-model="todo.status">
                            <span>{{ todo.content }}</span>
                        </label>
                        <a @click="editTodo(todo)" v-if="!todo.isEditing">
                            <i class="fa fa-pencil" style="color:brown"></i>
                        </a>
                        <a @click="deleteTodo(todo.id)" v-if="!todo.isEditing">
                            <i class="fa fa-times" style="color:brown"></i>
                        </a>

                    </li>

                </ul>
                <div class="todoList_statistics">
                    <span v-if="currentTypeDatas.length == 0"> 尚無資料 </span>
                    <!-- <p v-else-if="currentTable === Table_Type.All">{{ todoDatas.length }} 個待完成項目
                    </p> -->
                    <p v-else-if="currentTable === Table_Type.UNFINISH"> {{ todoDatasByStatus(true).length }} 個已完成項目
                    </p>
                    <p>{{ todoDatasByStatus(false).length }} 個未完成項目
                    </p>


                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const prop = defineProps({
    todoDatas: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['add-todo', 'edit-todo', 'delete-todo', 'switch-todo-status']);

const Table_Type = Object.freeze({
    All: "all",
    FINISH: "Finish",
    UNFINISH: "UNFINISH"
});

const currentTable = ref(Table_Type.All);

const newTodoField = ref({
    content: ''
});

const todoDatasByStatus = (status) => {
    if (currentTable.value === Table_Type.All) {
        return prop.todoDatas;
    }
    else {
        return prop.todoDatas.filter(item => item.status === status);
    }
}

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

const toggleTableType = (type) => {
    currentTable.value = type;
}

//新增
const addtodos = () => {
    if (newTodoField.value.content.trim() === '') {
        alert('請輸入代辦事項內容');
        return;
    }
    emit('add-todo', newTodoField.value);
    console.log(`addtodos ${newTodoField.value}`);
}

//編輯
const editTodos = (id, content) => {
    emit('add-todo', newTodoField.value);
    console.log(`addtodos ${newTodoField.value}`);
}

const deleteTodo = (id) => {
    console.log(`deletetodo ${id}`)
}

const switchTodoStatus = (id) => {
    if (newTodoField.value.content.trim() === '') {
        alert('請輸入代辦事項內容');
        return;
    }
    emit('add-todo', newTodoField.value);

    console.log(`addtodos ${newTodoField.value}`);
}

const editTodo = (todoData) => {
    todoData.isEditing = true
}

const saveEdit = async (todoData) => {
    console.log('saveEdit', todoData);
    try {
        todoData.isEditing = false;
    } catch (err) {
        console.error(err)
    }
}

</script>