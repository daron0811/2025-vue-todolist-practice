<template>

  <!--讀取用-->
  <div v-if="loadConfig.modelValue" class="loading-overlay" :style="{ zIndex: loadConfig.zIndex }" role="status"
    aria-live="polite" aria-busy="true" @click.self="onOverlayClick">
    <div class="loading-card" :class="{ 'no-backdrop': !loadConfig.backdrop }">
      <i class="fa-solid fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
      <p class="loading-text">{{ loadConfig.message }}</p>
    </div>
  </div>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router';
import { ref, provide, onMounted, watch, onUnmounted } from 'vue';

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

const loadConfig = ref({
  modelValue: false,      // 是否顯示覆蓋層
  message: '載入中...',     // 顯示文字
  zIndex: 1100,           // 疊層順序
  backdrop: true,         // 是否顯示半透明背景（這裡只是用來決定卡片樣式）
  lockScroll: true,       // 顯示時是否鎖住 body 捲動
  closable: false,        // 點擊背景是否可關閉
});

provide('LoadingConfig', loadConfig);

// 點擊背景時的關閉行為
function onOverlayClick() {
  if (loadConfig.closable) loadConfig.modelValue = false;
}

// 顯示時鎖住 body 捲動，關閉時恢復
const originalOverflow = typeof window !== 'undefined'
  ? document.body.style.overflow
  : '';


watch(
  loadConfig.value.modelValue,
  (newValue, oldValue) => {
    //TODO : 可以狀態逾時處理
  },
  { immediate: true }
)

onUnmounted(() => {
  if (loadConfig.lockScroll) {
    document.body.style.overflow = originalOverflow || '';
  }
});


</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  pointer-events: auto;
}

.loading-card {
  min-width: 200px;
  max-width: 80vw;
  padding: 20px 24px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .15);
  text-align: center;
}

.loading-card.no-backdrop {
  background: transparent;
  box-shadow: none;
}

.loading-text {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.4;
}
</style>