<!-- src/views/OperationsDashboard.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5 font-weight-bold">운영자 대시보드</v-card-title>
      <v-divider />

      <v-card-text>
        <v-row dense>
          <v-col
            cols="12" sm="6" md="4"
            v-for="link in dashboardLinks"
            :key="link.title"
          >
            <v-card
              class="pa-4 d-flex flex-column align-center justify-center"
              hover
              :to="!link.action && link.route ? link.route : undefined"
              @click="link.action ? link.action() : null"
              style="cursor: pointer;"
            >
              <v-icon :icon="link.icon" size="48" color="primary" class="mb-3" />
              <div class="text-subtitle-1 font-weight-medium">{{ link.title }}</div>
              <div class="text-body-2 text-grey-darken-1">{{ link.description }}</div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>

  <v-fab-transition>
    <v-btn
      v-if="showScrollTop"
      icon
      color="primary"
      class="position-fixed"
      style="bottom: 24px; right: 24px; z-index: 1000;"
      @click="scrollToTop"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const companyId = route.query.companyId
const companyName = route.query.companyName || ''

const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 200
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})

const goToMenuList = () => {
  if (!companyId || !companyName) {
    console.error('Missing companyId or companyName')
    alert('회사 정보를 찾을 수 없습니다.')
    return
  }

  router.push({
    name: 'MenuList',
    params: { companyId },
    query: { companyName }
  })
}

const goToSoldOutManager = () => {
  if (!companyId || !companyName) {
    console.error('Missing companyId or companyName')
    alert('회사 정보를 찾을 수 없습니다.')
    return
  }

  router.push({
    name: 'SoldOutManager',
    query: { companyId, companyName }
  })
}

const goToOrderManager = () => {
  if (!companyId || !companyName) {
    console.error('Missing companyId or companyName')
    alert('회사 정보를 찾을 수 없습니다.')
    return
  }

  router.push({
    name: 'OrderManager',
    query: { companyId, companyName }
  })
}

// ... 기존 코드 위에 추가
const goToSalesAnalysis = () => {
  if (!companyId || !companyName) {
    console.error('Missing companyId or companyName')
    alert('회사 정보를 찾을 수 없습니다.')
    return
  }
  
  router.push({
    name: 'SalesAnalysis',
    query: { companyId, companyName }
  })
}

const goToHourlySalesAnalysis = () => {
  if (!companyId || !companyName) {
    console.error('Missing companyId or companyName')
    alert('회사 정보를 찾을 수 없습니다.')
    return
  }
  
  router.push({
    name: 'HourlySalesAnalysis',
    query: { companyId, companyName }
  })
}

const goToProductSalesReport = () => {
  if (!companyId || !companyName) {
    console.error('Missing companyId or companyName')
    alert('회사 정보를 찾을 수 없습니다.')
    return
  }

  router.push({
    name: 'ProductSalesReport',
    query: { companyId, companyName }
  })
}

const dashboardLinks = ref([
  {
    title: '메뉴 관리',
    description: '메뉴 추가, 수정, 삭제',
    icon: 'mdi-food',
    action: goToMenuList
  },
  {
    title: '메뉴 품절 관리',
    description: '품절 메뉴 설정 및 해제',
    icon: 'mdi-cancel',
    action: goToSoldOutManager
  },
  {
    title: '고객 주문 확인',
    description: '실시간 주문 목록 보기',
    icon: 'mdi-clipboard-list',
    action: goToOrderManager
  },
  {
    title: '주문 완료 및 픽업 알림',
    description: '주문 상태 업데이트 및 알림 전송',
    //route: '/admin/notify',
    icon: 'mdi-bell-ring'
  },
  {
    title: '고객 주문 취소 처리',
    description: '고객 요청 주문 취소 승인',
    //route: '/admin/cancel',
    icon: 'mdi-cancel'
  },
  {
    title: '매출 분석',
    description: '일/주/월/연 매출 요약 및 성장률 확인',
    icon: 'mdi-chart-line',
    action: goToSalesAnalysis
  },
  {
    title: '시간대별 매출 분석',
    description: '시간별 매출 트렌드 및 분석',
    icon: 'mdi-timetable',
    action: goToHourlySalesAnalysis
  },
  {
    title: '상품별 매출 리포트',
    description: '상품 단위의 상세 매출 정보',
    icon: 'mdi-chart-bar',
    action: goToProductSalesReport
  }
  
])
</script>
