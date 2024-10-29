import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/storyboard',
    name: 'storyboard',
    component: () => import('../views/storyboard.vue')
  },
  {
    path: '/exportPage',
    name: 'exportPage',
    component: () => import('../views/exportPage.vue')
  },
  {
    path: '/storyVersion',
    name: 'storyVersion',
    component: () => import('../views/storyVersion.vue')
  },
  {
    path: '/shootingPlan',
    name: 'shootingPlan',
    component: () => import('../views/shootingPlan.vue')
  },
  {
    path: '/shootingNotice',
    name: 'shootingNotice',
    component: () => import('../views/shootingNotice.vue')
  },
  {
    path: '/noticeSheet',
    name: 'noticeSheet',
    component: () => import('../views/noticeSheet.vue')
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('../views/contacts.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})




export default router
