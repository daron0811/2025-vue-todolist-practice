<template>
    <!-- login_page -->
    <div id="loginPage" class="bg-yellow">
        <div class="conatiner loginPage vhContainer ">
            <div class="side">
                <a href="#"><img class="logoImg"
                        src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
                        alt=""></a>
                <img class="d-m-n"
                    src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
                    alt="workImg">
            </div>

            <div>
                <form class="formControls" action="index.html">
                    <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
                    <label class="formControls_label" for="email">Email</label>
                    <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"
                        required v-model="signInField.email" @blur="emailTouched = true" @focus="emailTouched = false">

                    <span v-if="emailTouched && signInField.email === ''">此欄位不可留空</span>
                    <span v-else-if="emailTouched && !isValidEmail(signInField.email)">Email 格式不正確</span>

                    <label class="formControls_label" for="pwd">密碼</label>
                    <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required
                        v-model="signInField.password" @blur="passwordTouched = true" @focus="passwordTouched = false">
                    <span v-if="passwordTouched && signInField.password === ''">此欄位不可留空</span>
                    <span v-if="errMessage" style="align-self: center; padding-top: 3px;">{{ errMessage }}</span>
                    <input class="formControls_btnSubmit" type="button" v-on:click="onSignIn" value="登入">
                    <a class="formControls_btnLink" href="#signup">註冊帳號</a>
                </form>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { POST_SIGN_IN, GET_USER_CHECKOUT, formatAPIUrl } from '@/utils/api';
import { useRouter } from 'vue-router';

//使用者登入欄位
const signInField = ref({
    email: '',
    password: ''
});

//UI狀態
const emailTouched = ref(false); //email的點擊狀態
const passwordTouched = ref(false);

const errMessage = ref('');

const user = ref({
    nickname: '',
    uid: ''
})


const signinRes = ref('');
//按下登入時
const onSignIn = async () => {
    console.log(signInField.value);
    errMessage.value = '';
    emailTouched.value = false;

    //TODO : 還可以先做欄位檢查

    await axios.post(formatAPIUrl(POST_SIGN_IN), signInField.value)
        .then((res) => {
            console.log('signup response:', res);
            signinRes.value = res.data.uid;
            document.cookie = `customTodoToken=${res.data.token};path=/`;
            alert(`你好 ${res.data.nickname}，已成功登入 \n`);
            user.nickname = res.data.nickname;
            onCheckout();//驗證並登入
        }).catch((error) => {
            console.log('signup error:', error);
            errMessage.value = '請確認是否輸入正確 : ' + error.response.data.message;
        }).finally(() => {
            
        });
   
}

//前端先檢查是否為有效帳號,正規表示法驗證email是否正確
//TODO:註冊頁也有用到，可考慮共用
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

const router = useRouter();
const getTodoDataPage = () => {
    router.push('/todoList');
}

//如果有使用者Token，做登入
const onCheckout = async () => {
    try {// 驗證登入
        const token = document.cookie.replace(/(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$/i, "$1");
        const res = await axios.get(formatAPIUrl(GET_USER_CHECKOUT), {
            headers: {
                Authorization: token
            }
        }).then((res) => {
            if (res.data.status === true) {
                getTodoDataPage();
            }
            user.value = res.data;
        });
    }
    catch (error) {
    }
}

onMounted(async () => {
    const token = document.cookie.replace(/(?:^|.*;\s*)customTodoToken\s*=\s*([^;]*).*$/i, "$1");
    if (token.trim() !== '') {
        onCheckout(); //初始驗證登入
    }
})


</script>
