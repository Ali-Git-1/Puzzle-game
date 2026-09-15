import { createRouter, createWebHistory } from 'vue-router'
import SplashView from '../views/SplashView.vue'
import MainMenuView from '../views/MainMenuView.vue'
import LevelSelectView from '../views/LevelSelectView.vue'
import GameplayView from '../views/GameplayView.vue'

const routes = [
  { path: '/', name: 'splash', component: SplashView },
  { path: '/menu', name: 'menu', component: MainMenuView },
  { path: '/levels', name: 'levels', component: LevelSelectView },
  { path: '/game/:id', name: 'gameplay', component: GameplayView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
