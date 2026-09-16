<template>
  <div
    class="menu-container d-flex flex-column justify-content-between align-items-center vh-100 p-4 text-white"
  >
    <!-- هدر: دکمه‌های بالا -->
    <div class="w-100 d-flex justify-content-between align-items-center">
      <button
        class="btn btn-outline-light rounded-circle p-2"
        @click="trigger(() => (showExitModal = true))"
      >
        <i class="bi bi-box-arrow-right fs-4"></i>
      </button>
      <button
        class="btn btn-outline-light rounded-circle p-2"
        @click="trigger(() => (showSettingsModal = true))"
      >
        <i class="bi bi-gear-fill fs-4"></i>
      </button>
    </div>

    <!-- بخش وسط: عنوان و دکمه‌ها -->
    <div class="text-center w-100" style="max-width: 320px">
      <h1 class="display-5 fw-bold mb-5 text-warning">Puzzle</h1>

      <div class="d-grid gap-3">
        <button
          class="btn btn-warning btn-lg fw-bold shadow py-3"
          @click="trigger(() => router.push('/levels'))"
        >
          <i class="bi bi-play-fill me-1"></i> شروع بازی
        </button>
        <button class="btn btn-outline-light btn-lg fw-bold" @click="trigger(() => showAlert())">
          <i class="bi bi-info-circle me-1"></i> درباره ما
        </button>
      </div>
    </div>

    <!-- فوتر ساده -->
    <small class="text-white-50">نسخه 1.0.0</small>

    <!-- مودال تنظیمات -->
    <div
      v-if="showSettingsModal"
      class="modal-backdrop-custom d-flex justify-content-center align-items-center"
    >
      <div
        class="card bg-dark text-white p-4 border-secondary text-center shadow-lg"
        style="width: 280px"
      >
        <h5 class="mb-4">تنظیمات صدا</h5>
        <div class="d-flex justify-content-around mb-4">
          <button
            class="btn"
            :class="gameStore.isMusicMuted ? 'btn-danger' : 'btn-success'"
            @click="trigger(() => gameStore.toggleMusic())"
          >
            <i
              :class="gameStore.isMusicMuted ? 'bi bi-volume-mute-fill' : 'bi bi-music-note-beamed'"
              class="fs-3"
            ></i>
            <div class="small mt-1">موزیک</div>
          </button>
          <button
            class="btn"
            :class="gameStore.isSoundMuted ? 'btn-danger' : 'btn-success'"
            @click="trigger(() => gameStore.toggleSound())"
          >
            <i
              :class="gameStore.isSoundMuted ? 'bi bi-bell-slash-fill' : 'bi bi-bell-fill'"
              class="fs-3"
            ></i>
            <div class="small mt-1">صداها</div>
          </button>
        </div>
        <button class="btn btn-secondary w-100" @click="trigger(() => (showSettingsModal = false))">
          بستن
        </button>
      </div>
    </div>

    <!-- مودال خروج -->
    <div
      v-if="showExitModal"
      class="modal-backdrop-custom d-flex justify-content-center align-items-center"
    >
      <div
        class="card bg-dark text-white p-4 border-secondary text-center shadow-lg"
        style="width: 280px"
      >
        <h5 class="mb-3">خروج از بازی</h5>
        <p class="text-white-50 mb-4">آیا مطمئن هستید؟</p>
        <div class="d-flex gap-2">
          <button class="btn btn-danger flex-grow-1" @click="trigger(() => exitGame())">بله</button>
          <button
            class="btn btn-secondary flex-grow-1"
            @click="trigger(() => (showExitModal = false))"
          >
            خیر
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const showSettingsModal = ref(false)
const showExitModal = ref(false)

onMounted(() => {
  gameStore.playMenuMusic() // ✅ مدیریت صدا فقط از طریق استور سراسری
})

// 🔥 یه تابع جادویی: اول صدا، بعد کار
const trigger = (action) => {
  gameStore.playClick()
  action()
}

const showAlert = () => alert('طراحی و توسعه داده شده توسط علی عربپور')
const exitGame = () => window.close()
</script>

<style scoped>
/* کدهای قبلی .menu-container رو پاک کن و این رو جایگزین کن */
.menu-container {
  background:
    linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)),
    url('/puzzle-bg.jpg') center/cover no-repeat;
  user-select: none;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1050;
}
</style>
