// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import Login from '../views/Login.vue'
import { useAuthStore } from '@/stores/authStore'
import { logEvent } from '@/utils/logger'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/register', name: 'register', component: Register },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/login', name: 'login', component: Login },
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
    path: '/companies/:companyId/menu-manager',
    name: 'MenuManager',
    component: () => import('@/views/MenuManager.vue'),
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
  },
  {
    path: '/admin/dashboard',
    name: 'OperationsDashboard',
    component: () => import('@/views/OperationsDashboard.vue'),
    // props: route => ({
    //   companyId: route.query.companyId,
    //   companyName: route.query.companyName || ''
    // })  
  },
  {
    path: '/admin/solsout',
    name: 'SoldOutManager',
    component: () => import('@/views/SoldOutManager.vue'),
    props: route => ({
      companyId: route.query.companyId,
      companyName: route.query.companyName || ''
    })
  },
  {
    path: '/admin/order-manager',
    name: 'OrderManager',
    component: () => import('@/views/OrderManager.vue') 
  },
  {
      path: '/admin/qr-generator',
      name: 'QrGenerator',
      component: () => import('@/views/QrGenerator.vue')
    },
  {
    path: '/my-orders',
    name: 'MyOrderPage',
    component: () => import('@/views/MyOrderPage.vue')
  },
  {
    path: '/my-page',
    name: 'MyPage',
    component: () => import('@/views/MyPage.vue')
  },
  {
    path: '/my-coupons',
    name: 'MyCoupons',
    component: () => import('@/views/MyCoupons.vue'),
    meta: { requiresAuth: true }, // 로그인 필요 시
  },
  {
    path: '/guest-order',
    name: 'GuestOrder',
    component: () => import('@/views/GuestOrder.vue')
  },
  {
    path: '/sales',
    name: 'SalesAnalysis',
    component: () => import('@/views/SalesAnalysis.vue')
  },
  {
    path: '/hourly-sales',
    name: 'HourlySalesAnalysis',
    component: () => import('@/views/HourlySalesAnalysis.vue')
  },
  {
    path: '/produce-sales',
    name: 'ProductSalesReport',
    component: () => import('@/views/ProductSalesReport.vue')
  },
  {
    path: '/kakao-callback',
    name: 'KakaoCallback',
    component: () => import('@/views/KakaoCallback.vue'),
  },
  {
    path: '/naver-callback',
    name: 'NaverCallback',
    component: () => import('@/views/NaverCallback.vue'),
  },
  {
    path: '/map-pick-location',
    name: 'MapPickLocation',
    component: () => import('@/views/MapPickLocation.vue'),
  },
  {
    path: '/nearby-companies',
    name: 'NearbyCompanies',
    component: () => import('@/views/NearbyCompanies.vue'),
  },
  {
    path: '/qr-scanner',
    name: 'QrScanner',
    component: () => import('@/views/QrScanner.vue'),
  },
  {
    path: '/admin/logs',
    name: 'AdminLogs',
    component: () => import('@/views/AdminLogs.vue'),
    meta: {
      requiresAuth: true, // 필요 시 인증 요구
      role: 'admin'       // 필요 시 관리자만 접근 허용
    }
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 항상 최상단으로 스크롤
    return { top: 0 }
  }
})

// 실제 요구가 있을 떄 검토한다.
// router.afterEach((to, from) => {
//   const authStore = useAuthStore()

//   logEvent('info', '페이지 진입', {
//     path: decodeURIComponent(to.fullPath),
//     from: decodeURIComponent(from.fullPath),
//     userId: authStore.user?.uid || 'guest',
//     timestamp: new Date().toISOString(),
//   })
// })

export default router
