<template>
  <div
    class="splash-container d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white"
  >
    <div class="logo-box mb-4 animate-bounce">
      <i class="bi bi-controller display-1 text-warning"></i>
    </div>
    <h2 class="fw-bold mb-3">بازی نینجا</h2>
    <div class="spinner-border text-warning" role="status">
      <span class="visually-hidden">در حال بارگذاری...</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push('/menu')
  }, 2500)
})
</script>

<style scoped>
.splash-container {
  user-select: none;
}
.animate-bounce {
  animation: bounce 1.5s infinite ease-in-out;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
</style>
