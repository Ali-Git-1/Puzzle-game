import { defineStore } from 'pinia'

// تعریف شیء‌های صوتی
const menuAudio = new Audio('/sounds/menu.mp3')
menuAudio.loop = true

// اصلاح مسیر فایل به حروف کوچک مطابق عکس شما
const gameAudio = new Audio('/sounds/gameplay.mp3')
gameAudio.loop = true

const clickAudio = new Audio('/sounds/click.wav')
const loseAudio = new Audio('/sounds/lose.wav')
const winAudio = new Audio('/sounds/win.mp3')

export const useGameStore = defineStore('game', {
  state: () => ({
    unlockedLevel: Number(localStorage.getItem('unlockedLevel')) || 1,
    isMusicMuted: localStorage.getItem('musicMuted') === 'true',
    isSoundMuted: localStorage.getItem('soundMuted') === 'true',
    totalLevels: 25,
    coins: parseInt(localStorage.getItem('puzzle_coins') || 100),
  }),
  actions: {
    unlockNextLevel(currentLevel) {
      if (currentLevel >= this.unlockedLevel && this.unlockedLevel < this.totalLevels) {
        this.unlockedLevel = currentLevel + 1
        localStorage.setItem('unlockedLevel', this.unlockedLevel)
      }
    },

    toggleMusic() {
      this.isMusicMuted = !this.isMusicMuted
      localStorage.setItem('musicMuted', this.isMusicMuted)
      if (this.isMusicMuted) {
        menuAudio.pause()
        gameAudio.pause()
      } else {
        // برای جلوگیری از تداخل، فقط منو رو پخش کن (چون در صفحه بازی، خودِ کامپوننت موزیک رو مدیریت می‌کنه)
        this.playMenuMusic()
      }
    },

    toggleSound() {
      this.isSoundMuted = !this.isSoundMuted
      localStorage.setItem('soundMuted', this.isSoundMuted)
    },

    playMenuMusic() {
      gameAudio.pause()
      gameAudio.currentTime = 0
      if (!this.isMusicMuted) {
        menuAudio.play().catch((e) => console.log('موزیک منو آماده پخش است...'))
      }
    },

    playGameMusic() {
      menuAudio.pause()
      menuAudio.currentTime = 0
      if (!this.isMusicMuted) {
        gameAudio.currentTime = 0 // شروع از اول
        gameAudio.play().catch((e) => console.log('موزیک بازی آماده پخش است...'))
      }
    },

    stopGameMusic() {
      gameAudio.pause()
      gameAudio.currentTime = 0
    },

    stopAllMusic() {
      menuAudio.pause()
      gameAudio.pause()
      menuAudio.currentTime = 0
      gameAudio.currentTime = 0
    },

    playClick() {
      if (!this.isSoundMuted) {
        clickAudio.currentTime = 0
        clickAudio.play().catch(() => {})
      }
    },

    playLose() {
      if (!this.isSoundMuted) {
        loseAudio.currentTime = 0
        loseAudio.play().catch(() => {})
      }
    },
    playWin() {
      if (!this.isSoundMuted) {
        winAudio.currentTime = 0
        winAudio.play().catch(() => {})
      }
    },
    addCoins(amount) {
      this.coins += amount
      localStorage.setItem('puzzle_coins', this.coins.toString())
    },

    spendCoins(amount) {
      if (this.coins >= amount) {
        this.coins -= amount
        localStorage.setItem('puzzle_coins', this.coins)
        return true
      }
      return false
    },
    // بخشی از actions در gameStore.js
    addCoins(amount = 10) {
      this.coins += amount
      localStorage.setItem('puzzle_coins', this.coins.toString())
    },

    deductCoins(amount = 2) {
      // جلوگیری از منفی شدن سکه‌ها
      this.coins = Math.max(0, this.coins - amount)
      localStorage.setItem('puzzle_coins', this.coins.toString())
    },
  },
})
