import { createRouter, createWebHistory } from 'vue-router'
import Orders from '../views/Orders.vue'
import Overview from '../views/Overview.vue'

export function createAppRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', redirect: '/overview' },
      { path: '/overview', name: 'overview', component: Overview },
      { path: '/orders', name: 'orders', component: Orders },
    ],
  })
}
