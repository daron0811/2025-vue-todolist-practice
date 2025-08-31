<template>
  <RouterView />
   <FullscreenLoading />
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { ref, provide, onMounted } from 'vue';
import axios from 'axios';
import { GET_USER_CHECKOUT, formatAPIUrl } from '@/utils/api';
import FullscreenLoading from './component/FullscreenLoading.vue';


const userData = ref({
  nickname: '',
  uid: ''
})

//以provide作封裝存取
provide('getUserData', userData);
provide('setUserData', (data) => {
  if (data === null) {
    return;
  }
  userData.value = data;
})

const clearUserData = () => {
  userData.value = {
    nickname: '',
    uid: ''
  };
}

const router = useRouter();
const getTodoDataPage = () => {
  router.push('/todoList');
}

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
      userData.value = res.data;
      console.log(userData.value);
    });
  }
  catch (error) {
    console.log(`${error} 驗證資料已過期 `);
  }
}

onMounted(async () => {
  onCheckout(); //初始驗證登入
})

</script>