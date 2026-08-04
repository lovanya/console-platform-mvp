import { createRouter, createWebHistory } from 'vue-router'
import Orders from '../views/Orders.vue'
import Overview from '../views/Overview.vue'

export function createAppRouter(basename?: string) {
  const router = createRouter({
    history: createWebHistory(basename),
    routes: [
      { path: '/', redirect: '/overview' },
      { path: '/overview', name: 'overview', component: Overview, meta: { keepAlive: true } },
      { path: '/orders', name: 'orders', component: Orders, meta: { keepAlive: true } },
    ],
  })
  return router
}
