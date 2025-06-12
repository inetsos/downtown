// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/login', component: Login },
  {
    path: '/register-company',
    name: 'RegisterCompany',
    component: () => import('@/views/RegisterCompany.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-companies',
    name: 'MyCompanies',
    component: () => import('@/views/MyCompanies.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-company/:id',
    name: 'EditCompany',
    component: () => import('@/views/EditCompany.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/company/:id',
    component: () => import('@/views/CompanyDetail.vue')
  },
  {
    path: '/reservation',
    name: 'Reservation',
    component: () => import('@/views/Reservation.vue')
  }, 
  {
    path: '/order',
    name: 'OrderPage',
    component: () => import('@/views/OrderPage.vue')
  }, 
  {
    path: '/cart',
    name: 'CartPage',
    component: () => import('@/views/CartPage.vue')
  }, 
  {
    path: '/my-reservations',
    name: 'MyReservations',
    component: () => import('@/views/MyReservations.vue'),
    meta: { requiresAuth: true } // 로그인 필요하면
  }, 
  {
    path: '/company-reservations/:companyId',
    name: 'CompanyReservations',
    component: () => import('@/views/CompanyReservations.vue')
  }, 
  {
    path: '/map',
    name: 'MapView',
    component: () => import('@/views/MapView.vue'),
  },
  {
    path: '/companies/:companyId/services',
    name: 'ServiceList',
    component: () => import('@/views/ServiceList.vue'),
    props: route => ({ companyName: route.query.companyName })
  },
  {
    path: '/companies/:companyId/services/:serviceId?',
    name: 'ServiceManagement',
    component: () => import('@/views/ServiceManagement.vue'),
    props: route => ({ companyName: route.query.companyName })
  },
  {
    path: '/companies/:companyId/menus',
    name: 'MenuList',
    component: () => import('@/views/MenuList.vue'),
    props: route => ({
      companyId: route.params.companyId,
      companyName: route.query.companyName || '',
    }),
  },
  {
    path: '/companies/:companyId/menus',
    name: 'MenuManagement',
    component: () => import('@/views/MenuManagement.vue'),
    props: route => ({
      companyId: route.params.companyId,
      companyName: route.query.companyName || '',
    })
  },
  {
    path: '/companies/:companyId/toppings/:toppingId?',
    name: 'ToppingManagement',
    component: () => import('@/views/ToppingManagement.vue'),
    props: route => ({ companyName: route.query.companyName })
  },
  {
    path: '/company/:companyId/category',
    name: 'CategoryManagement',
    component: () => import('@/views/CategoryManagement.vue'),
    props: route => ({
      companyId: route.params.companyId,
      companyName: route.query.companyName || '',
    }),
  },
  {
    path: '/company/:companyId/icehot',
    name: 'IceHotManagement',
    component: () => import('@/views/IceHotManagement.vue'),
    props: route => ({
      companyId: route.params.companyId,
      companyName: route.query.companyName || '',
    }),
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
