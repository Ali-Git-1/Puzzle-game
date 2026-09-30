<template>
  <div class="game-wrapper vh-100 d-flex flex-column justify-content-between p-3 text-white">
    <!-- هدر: دکمه بازگشت و سکه در چپ، تایمر دقیقاً وسط، شماره مرحله و عکس در راست -->
    <div class="position-relative d-flex justify-content-between align-items-center w-100 mb-2">
      <!-- سمت چپ: دکمه بازگشت + سکه -->
      <div class="d-flex align-items-center gap-2 z-2">
        <button
          class="btn btn-outline-light btn-sm rounded-circle"
          @click="trigger(() => goBack())"
        >
          <i class="bi bi-arrow-left fs-5"></i>
        </button>
        <div class="coin-badge">🪙 {{ gameStore.coins }}</div>
      </div>

      <!-- دقیقاً وسط: تایمر -->
      <div class="position-absolute start-50 translate-middle-x z-1">
        <div class="badge bg-danger fs-6 px-3 py-2">
          <i class="bi bi-stopwatch me-1"></i> {{ formatTime(timeLeft) }}
        </div>
      </div>

      <!-- سمت راست: دکمه پیش‌نمایش عکس + شماره مرحله -->
      <div class="d-flex align-items-center gap-2 z-2">
        <span class="fw-bold text-warning">مرحله {{ levelId }}</span>
        <button
          class="btn-preview-thumb"
          title="مشاهده عکس اصلی"
          @click="
            trigger(() => {
              showPreviewModal = true
            })
          "
        >
          <img :src="currentImage" alt="عکس مرحله" />
          <i class="bi bi-eye-fill preview-badge-icon"></i>
        </button>
      </div>
    </div>

    <!-- زمین پازل -->
    <div class="d-flex justify-content-center align-items-center my-auto">
      <div
        class="puzzle-board"
        :class="{ won: isWon }"
        :style="{
          gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,
        }"
      >
        <div
          v-for="(piece, index) in puzzlePieces"
          :key="piece.id"
          class="puzzle-piece"
          :class="{
            selected: selectedIndex === index,
            won: isWon,
          }"
          :style="getPieceStyle(piece)"
          @click="handleTileClick(index)"
        ></div>
      </div>
    </div>
    <!-- دکمه‌های پاورآپ وسط‌چین شده -->
    <div class="d-flex justify-content-center align-items-center gap-3 my-2">
      <button class="btn-powerup" :disabled="gameStore.coins < 10" @click="buyExtraTime">
        ⏳ +30s <small>(-10)</small>
      </button>

      <button class="btn-powerup" :disabled="gameStore.coins < 25" @click="autoSolveOnePiece">
        🧩 حل یک تکه <small>(-25)</small>
      </button>
    </div>

    <!-- راهنما ساده -->
    <div class="text-center text-white-50 small">روی دو تکه کلیک کنید تا جای آن‌ها عوض شود</div>

    <!-- مودال برنده شدن -->
    <div
      v-if="showWinModal"
      class="modal-backdrop-custom d-flex justify-content-center align-items-center"
    >
      <div
        class="card bg-dark text-white p-4 text-center border-warning border-2 shadow-lg"
        style="width: 300px"
      >
        <i class="bi bi-trophy-fill text-warning display-3 mb-2"></i>
        <h4 class="fw-bold text-warning mb-2">آفرین! برنده شدی</h4>
        <p class="text-white-50 small mb-4">پازل رو با موفقیت کامل کردی</p>
        <div class="d-grid gap-2">
          <button class="btn btn-warning fw-bold w-100 py-2" @click="trigger(() => nextLevel())">
            مرحله بعدی
          </button>
          <button class="btn btn-outline-light w-100 py-2" @click="trigger(() => goBack())">
            انتخاب مرحله
          </button>
        </div>
      </div>
    </div>

    <!-- مودال باخت (پایان زمان) -->
    <Transition name="bounce-modal">
      <div v-if="showLoseModal" class="modal-overlay">
        <div class="modal-card lose-card text-center p-4">
          <div class="icon-box mb-3">
            <i class="bi bi-emoji-frown display-1 text-danger animate-pulse"></i>
          </div>
          <h3 class="fw-bold text-white mb-2">⌛زمان تمام شد</h3>
          <p class="text-white-50 mb-4">متأسفانه نتوانستی پازل را در زمان مشخص حل کنی</p>

          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-warning px-4 py-2 fw-bold" @click="trigger(() => resetGame())">
              <i class="bi bi-arrow-counterclockwise me-1"></i> تلاش مجدد
            </button>
            <button class="btn btn-outline-light px-4 py-2" @click="trigger(() => goBack())">
              انتخاب مرحله
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  <!-- مودال نمایش تصویر کامل مرحله -->
  <Transition name="bounce-modal">
    <div
      v-if="showPreviewModal"
      class="modal-overlay"
      @click.self="
        trigger(() => {
          showPreviewModal = false
        })
      "
    >
      <div class="preview-modal-card text-center p-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold text-warning small">
            <i class="bi bi-image me-1"></i> تصویر کامل مرحله {{ levelId }}
          </span>
          <button
            class="btn-close btn-close-white btn-sm"
            @click="
              trigger(() => {
                showPreviewModal = false
              })
            "
          ></button>
        </div>

        <div class="preview-img-box">
          <img :src="currentImage" class="img-fluid rounded-3" alt="تصویر اصلی" />
        </div>

        <button
          class="btn btn-warning btn-sm fw-bold w-100 mt-3"
          @click="
            trigger(() => {
              showPreviewModal = false
            })
          "
        >
          ادامه بازی
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import confetti from 'canvas-confetti'

const showPreviewModal = ref(false)
const puzzlePieces = ref([])
const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

// وضعیت‌های بازی
const isWon = ref(false)
const isWonAnimation = ref(false)
const isGameOver = ref(false)
const showWinModal = ref(false)
const showLoseModal = ref(false)
const selectedIndex = ref(null)
const timeLeft = ref(0)
let timer = null
const windowWidth = ref(window.innerWidth)

// پاورآپ ۱: اضافه کردن ۳۰ ثانیه زمان
function buyExtraTime() {
  if (gameStore.spendCoins(10)) {
    timeLeft.value += 30
  }
}

// پاورآپ ۲: حل یک تکه از پازل
function autoSolveOnePiece() {
  if (isWon.value || isGameOver.value) return

  // پیدا کردن اولین قطعه‌ای که سر جاش نیست
  const wrongIdx = puzzlePieces.value.findIndex((p, idx) => p.correctIndex !== idx)
  if (wrongIdx === -1) return

  if (gameStore.spendCoins(25)) {
    // پیدا کردن قطعه‌ای که باید سر این جایگاه بیاد
    const targetIdx = puzzlePieces.value.findIndex((p) => p.correctIndex === wrongIdx)

    // جابه‌جایی دو قطعه
    const temp = puzzlePieces.value[wrongIdx]
    puzzlePieces.value[wrongIdx] = puzzlePieces.value[targetIdx]
    puzzlePieces.value[targetIdx] = temp

    // بررسی اتمام پازل
    checkWin()
  }
}

// محاسبه اندازه گرید و برد
const levelId = computed(() => Number(route.params.id) || 1)
const gridSize = computed(() => {
  return Math.floor((levelId.value - 1) / 3) + 2
})

const boardSize = computed(() => Math.min(windowWidth.value * 0.85, 380))
const pieceSize = computed(() => (boardSize.value - (gridSize.value - 1) * 3) / gridSize.value)
const currentImage = computed(() => `/images/${levelId.value}.jpg`)

// تابع کمکی برای تعاملات
const trigger = (action) => {
  gameStore.playClick()
  if (action) action()
}

// تنظیم زمان اولیه هر مرحله
const initialTime = computed(() => {
  return 20 + (levelId.value - 1) * 10
})

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// شروع و ریست بازی
const initBoard = () => {
  clearInterval(timer)
  gameStore.stopGameMusic()

  isWon.value = false
  isWonAnimation.value = false
  isGameOver.value = false
  showWinModal.value = false
  showLoseModal.value = false
  selectedIndex.value = null

  const totalPieces = gridSize.value * gridSize.value
  puzzlePieces.value = Array.from({ length: totalPieces }, (_, index) => ({
    id: index,
    correctIndex: index,
  }))

  puzzlePieces.value = [...puzzlePieces.value].sort(() => Math.random() - 0.5)
  timeLeft.value = initialTime.value
  startTimer()
}

const startTimer = () => {
  clearInterval(timer)
  gameStore.playGameMusic() // موزیک همراه تایمر شروع شود

  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timer)
      gameStore.stopGameMusic()
      gameStore.playLose()
      isGameOver.value = true
      // فقط اگر کاربر در مرحله جدید باخت، ۲ سکه کم کن (نه در مراحل قبلی)
      if (levelId.value >= gameStore.unlockedLevel) {
        gameStore.deductCoins(2)
      }
      setTimeout(() => {
        showLoseModal.value = true
      }, 500)
    }
  }, 1000)
}

const getPieceStyle = (piece) => {
  const originalRow = Math.floor(piece.correctIndex / gridSize.value)
  const originalCol = piece.correctIndex % gridSize.value
  return {
    width: `${pieceSize.value}px`,
    height: `${pieceSize.value}px`,
    backgroundImage: `url(${currentImage.value})`,
    backgroundSize: `${gridSize.value * pieceSize.value}px ${gridSize.value * pieceSize.value}px`,
    backgroundPosition: `${-(originalCol * pieceSize.value)}px ${-(originalRow * pieceSize.value)}px`,
    backgroundRepeat: 'no-repeat',
  }
}

const handleTileClick = (index) => {
  if (isWon.value || isGameOver.value) return

  if (selectedIndex.value === null) {
    selectedIndex.value = index
  } else {
    if (selectedIndex.value !== index) {
      const temp = puzzlePieces.value[selectedIndex.value]
      puzzlePieces.value[selectedIndex.value] = puzzlePieces.value[index]
      puzzlePieces.value[index] = temp
      checkWin()
    }
    selectedIndex.value = null
  }
}

const checkWin = () => {
  const won = puzzlePieces.value.every((piece, idx) => piece.correctIndex === idx)
  if (won) {
    clearInterval(timer)
    gameStore.stopGameMusic()
    triggerWinEffects()
  }
}

const triggerWinEffects = () => {
  isWon.value = true
  isWonAnimation.value = true

  // فعلاً چون فایل مخصوص برد نداری از کلیک استفاده میکنیم
  gameStore.playWin()

  if (levelId.value >= gameStore.unlockedLevel) {
    gameStore.addCoins(10)
  }

  confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })

  if (gameStore.unlockNextLevel) {
    gameStore.unlockNextLevel(levelId.value)
  }

  setTimeout(() => {
    showWinModal.value = true
  }, 4000)
}

const nextLevel = () => {
  trigger(() => {
    showWinModal.value = false
    router.push(`/game/${levelId.value + 1}`)
  })
}

const resetGame = () => {
  trigger(() => {
    initBoard()
  })
}

const goBack = () => {
  trigger(() => {
    clearInterval(timer)
    gameStore.stopGameMusic()
    gameStore.playMenuMusic()
    router.push('/levels')
  })
}

const updateDimensions = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  initBoard()
  window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
  clearInterval(timer)
  gameStore.stopGameMusic()
  window.removeEventListener('resize', updateDimensions)
})

watch(levelId, () => {
  initBoard()
})
</script>

<style scoped>
.coin-badge {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 193, 7, 0.5);
  color: #ffc107;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.95rem;
}

.btn-powerup {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  border: 1px solid rgba(255, 193, 7, 0.5);
  color: #ffc107;
  font-weight: bold;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.95rem;
}

.btn-powerup {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-powerup:hover:not(:disabled) {
  background: rgba(255, 193, 7, 0.2);
  border-color: #ffc107;
  color: #ffc107;
  transform: translateY(-2px);
}

.btn-powerup:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-powerup small {
  color: #ffc107;
  font-size: 0.75rem;
}

.game-wrapper {
  background: radial-gradient(circle, #1a252f 0%, #0d1117 100%);
  user-select: none;
}
.puzzle-board {
  position: relative;
  display: grid;
  gap: 3px;
  background-color: #0f172a;
  padding: 8px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  overflow: hidden; /* برای عبور موج نور پیروزی */
  transition: all 0.4s ease;
}

.puzzle-piece {
  cursor: pointer;
  border-radius: 6px;
  user-select: none;
  position: relative;
  transition:
    transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s ease,
    filter 0.2s ease;
}
.puzzle-piece:hover {
  filter: brightness(1.08);
}

.puzzle-piece.selected {
  z-index: 10;
  transform: scale(0.92);
  filter: brightness(1.2);
  box-shadow:
    0 0 0 3px #fbbf24,
    0 0 20px rgba(251, 191, 36, 0.85);
  animation: pulseSelection 1.2s infinite alternate ease-in-out;
}
@keyframes pulseSelection {
  from {
    box-shadow:
      0 0 0 3px #fbbf24,
      0 0 15px rgba(251, 191, 36, 0.7);
  }
  to {
    box-shadow:
      0 0 0 4px #f59e0b,
      0 0 28px rgba(245, 158, 11, 1);
  }
}
/* 🏆 ۲. افکت پیروزی روی بورد (Victory Glow & Shimmer) */
.puzzle-board.won {
  gap: 0px; /* به هم چسبیدن تکه‌ها مثل عکس اصلی */
  animation: victoryGlow 1.4s ease-in-out infinite alternate;
}

.puzzle-board.won .puzzle-piece {
  border-radius: 0;
  cursor: default;
}

/* موج درخشان و نورانی متحرک روی کل پازل */
.puzzle-board.won::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 80%;
  height: 100%;
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(255, 255, 255, 0.75) 50%,
    rgba(255, 255, 255, 0.1) 70%,
    transparent 100%
  );
  transform: skewX(-25deg);
  animation: shineSweep 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  pointer-events: none;
  z-index: 20;
}

/* انیمیشن چرخش نور */
@keyframes shineSweep {
  0% {
    left: -150%;
  }
  100% {
    left: 200%;
  }
}

/* انیمیشن پالس نورانی طلایی/سبز هنگام برد */
@keyframes victoryGlow {
  0% {
    box-shadow:
      0 0 25px rgba(34, 197, 94, 0.5),
      0 0 10px rgba(251, 191, 36, 0.4);
  }
  100% {
    box-shadow:
      0 0 45px rgba(34, 197, 94, 0.9),
      0 0 30px rgba(251, 191, 36, 0.8);
  }
}
.puzzle-tile {
  cursor: pointer;
  border-radius: 4px;
  transition:
    transform 0.1s ease,
    outline 0.1s ease;
}
.puzzle-tile.selected {
  outline: 3px solid #ffc107;
  transform: scale(0.95);
}
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1050;
}
/* افکت پیروزی پازل */
.board-won {
  animation: winPulse 1s ease-in-out infinite alternate;
  box-shadow: 0 0 30px #ffc107 !important;
  border: 3px solid #ffc107;
  gap: 0 !important; /* چسبیدن تکه‌ها به هم مثل عکس کامل */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
}

.shake {
  animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-2px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(4px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-8px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(8px, 0, 0);
  }
}

@keyframes winPulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.06);
  }
}

/* کارت مودال */
.modal-card {
  background: #2a2d3e;
  border: 2px solid #ff4757;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 71, 87, 0.3);
  max-width: 400px;
  width: 90%;
}

/* انیمیشن ورود و خروج مودال با تم شوک/افکت نرم */
.bounce-modal-enter-active {
  animation: bounce-in 0.5s ease-out;
}
.bounce-modal-leave-active {
  animation: bounce-in 0.3s reverse ease-in;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

/* انیمیشن تپش آیکون */
.animate-pulse {
  display: inline-block;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}
/* دکمه کوچک پیش‌نمایش در هدر */
.btn-preview-thumb {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid rgba(255, 193, 7, 0.7);
  background: #000;
  padding: 0;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.btn-preview-thumb:active {
  transform: scale(0.9);
}

.btn-preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-badge-icon {
  position: absolute;
  bottom: 1px;
  right: 1px;
  font-size: 9px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 1px 3px;
  border-radius: 4px;
}

/* کارت مودال پیش‌نمایش */
.preview-modal-card {
  background: #1e293b;
  border: 2px solid #ffc107;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
  max-width: 340px;
  width: 90%;
}

.preview-img-box {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
}

.preview-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
