<template>
    <teleport to="body">
        <transition name="fade">
            <!-- <div class="loading-overlay" :style="{ zIndex: zIndex }" role="status" aria-live="polite" aria-busy="true"
                @click.self="onOverlayClick"> -->
            <div v-if="modelValue" class="loading-overlay" :style="{ zIndex: zIndex }" role="status" aria-live="polite"
                aria-busy="true" @click.self="onOverlayClick">
                <div class="loading-card" :class="{ 'no-backdrop': !backdrop }">
                    <i class="fa-solid fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
                    <p class="loading-text">{{ message }}</p>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';

const props = defineProps({
    modelValue: { type: Boolean, default: false }, // v-model 控制顯示
    message: { type: String, default: '' },         // 文字訊息
    zIndex: { type: Number, default: 1100 },       // 高於 Bootstrap modal(1055)
    backdrop: { type: Boolean, default: true },     // 是否顯示半透明背景
    lockScroll: { type: Boolean, default: true },   // 顯示時鎖住 body 滾動
    closable: { type: Boolean, default: false },    // 點擊背景可關閉（預設關閉）
});

const emit = defineEmits(['update:modelValue']);

function onOverlayClick() {
    if (props.closable) emit('update:modelValue', false);
}

// 顯示時鎖住 body 滾動（可關）
const originalOverflow = typeof window !== 'undefined'
    ? document.body.style.overflow
    : '';

watch(
    () => props.modelValue,
    (show) => {
        if (!props.lockScroll) return;
        if (show) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = originalOverflow || '';
    },
    { immediate: true }
);

onUnmounted(() => {
    if (props.lockScroll) {
        document.body.style.overflow = originalOverflow || '';
    }
});
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    inset: 0;
    /* top/right/bottom/left = 0 */
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.45);
    /* 石板藍半透明 */
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

/* 簡單淡入淡出 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity .18s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
