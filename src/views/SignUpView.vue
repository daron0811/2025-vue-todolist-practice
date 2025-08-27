<template>
    <!-- sign up -->
    <div id="signUpPage" class="bg-yellow">
        <div class="conatiner signUpPage vhContainer">
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
                    <h2 class="formControls_txt">註冊帳號</h2>
                    <label class="formControls_label" for="email">Email</label>
                    <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email"
                        required v-model="signUpField.email">

                    <label class="formControls_label" for="name">您的暱稱</label>
                    <input class="formControls_input" type="text" name="name" id="name" placeholder="請輸入您的暱稱"
                        v-model="signUpField.nickname">

                    <label class="formControls_label" for="pwd">密碼</label>
                    <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請輸入密碼" required
                        v-model="signUpField.password">

                    <label class="formControls_label" for="pwd">再次輸入密碼</label>
                    <input class="formControls_input" type="password" name="pwd" id="pwd" placeholder="請再次輸入密碼" required
                        v-model="signUpPWCheck">

                    <span v-if="errMessage" style="align-self: center; padding-top: 3px;">{{ errMessage }}</span>

                    <input class="formControls_btnSubmit" type="button" v-on:click="onSignup" value="註冊帳號">
                    <a class="formControls_btnLink" href="#">登入</a>
                </form>
            </div>
        </div>

    </div>
</template>


<script setup>
import { ref } from 'vue';

//使用者註冊欄位
const signUpField = ref({
    nickname: '',
    email: '',
    password: ''
});

const errMessage = ref('');//錯誤訊息

const signUpPWCheck = ref(''); // 雙重密碼確認

//前端先檢查是否為有效帳號
//可以共用
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

const onSignup = async () => {
    errMessage.value = '';

    if (signUpField.value.password !== signUpPWCheck.value) {
        errMessage.value = '兩次密碼欄位輸入不一致'
        return;
    };

    if (signUpField.value.nickname === '' ||
        signUpField.value.email === '' ||
        signUpField.value.password === ''
    ) {
        errMessage.value = '欄位不可留空';
        return;
    }

    if (!isValidEmail(signUpField.value.email)) {
        errMessage.value = 'Email 帳號格式不正確';
        return;
    }

    //TODO:如果錯誤訊息有先清空
    //TODO:可再復查欄位資料正確性
    // try {
    //     const res = await axios.post(formatAPIUrl(POST_SIGN_UP), signUpField.value);
    //     console.log('signup response:', res);
    //     signupRes.value = res.data.uid;
    //     alert(`${signUpField.value.nickname} 你好，你已註冊成功\n[uid : ' + ${res.data.uid}}]`);

    //     //清空資料
    //     clearSignUpField();
    //     singUpPage.value = false;
    //     //TODO : 跳出註冊成功訊息，註冊成功後回到登入頁面
    // } catch (error) {
    //     console.log("錯誤！")
    //     console.log(error)
    // }
};

</script>