<template>
  <div class="level-container vh-100 d-flex flex-column text-white p-3">
    <!-- نوار بالا -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button class="btn btn-outline-light rounded-circle" @click="router.push('/menu')">
        <i class="bi bi-arrow-left fs-5"></i>
      </button>
      <h4 class="m-0 fw-bold text-warning">انتخاب مرحله</h4>
      <div style="width: 40px"></div>
      <!-- برای تعادل چیدمان -->
    </div>

    <!-- گرید مراحل -->
    <div class="flex-grow-1 overflow-auto p-2">
      <div class="row g-3 justify-content-center">
        <div
          v-for="level in gameStore.totalLevels"
          :key="level"
          class="col-4 col-sm-3 col-md-2 d-flex justify-content-center"
        >
          <button
            class="level-btn btn d-flex flex-column justify-content-center align-items-center rounded-4 shadow"
            :class="isUnlocked(level) ? 'btn-warning active-btn' : 'btn-dark disabled-btn'"
            :disabled="!isUnlocked(level)"
            @click="startLevel(level)"
          >
            <span v-if="isUnlocked(level)" class="fs-4 fw-bold">{{ level }}</span>
            <i v-else class="bi bi-lock-fill fs-4 text-secondary"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const isUnlocked = (lvl) => lvl <= gameStore.unlockedLevel

// ... بقیه اسکریپت
const startLevel = (lvl) => {
  gameStore.playClick() // 💥 صدای کلیک رو اینجا اضافه کردم
  router.push(`/game/${lvl}`)
}
// ... بقیه اسکریپت
</script>

<style scoped>
.level-container {
  background: radial-gradient(circle, #1e293b 0%, #0f172a 100%);
  user-select: none;
}
.level-btn {
  width: 75px;
  height: 75px;
  transition: transform 0.15s ease;
}
.active-btn:active {
  transform: scale(0.92);
}
.disabled-btn {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
