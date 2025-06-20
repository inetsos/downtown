<!-- src/views/OrderManager.vue-->
<template>
  <v-container>
    <v-card>
      <div class="text-end mb-4 mr-2">
        <span class="text-primary text-subtitle-2 cursor-pointer" @click="goToDashboard">
          운영 대시보드
        </span>
      </div>

      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h5 font-weight-bold">{{ companyName }} 주문 </span>
        
        <v-btn
          :color="showOnlyPending ? 'primary' : 'default'"
          variant="outlined"
          density="comfortable"
          @click="togglePendingFilter"
        >
          {{ showOnlyPending ? '전체 보기' : '대기 보기' }}
        </v-btn>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-card-text>
        <!-- 날짜 선택 -->
        <v-row class="mb-4" align="center" justify="center" no-gutters>
          <!-- 이전날 버튼 -->
          <v-col
            cols="auto"
            class="d-flex justify-center"
          >
            <v-btn
              variant="text"
              @click="changeDate(-1)"
              class="me-1"
              :aria-label="'이전날'"
              density="compact"
              small
            >
              <v-icon left>mdi-chevron-left</v-icon>
              <span class="d-none d-sm-inline">이전날</span>
            </v-btn>
          </v-col>

          <!-- 날짜 선택 입력 -->
          <v-col cols="auto" class="flex-grow-1" style="min-width: 150px; max-width: 280px;">
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290"
              min-width="auto"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="selectedDateFormatted"
                  label="날짜 선택"
                  readonly
                  v-bind="props"
                  @click="dateMenu = true"
                  density="compact"
                  prepend-icon="mdi-calendar"
                  hide-details
                />
              </template>

              <v-date-picker
                v-model="selectedDate"
                @update:model-value="dateMenu = false"
              />
            </v-menu>
          </v-col>

          <!-- 다음날 버튼 -->
          <v-col
            cols="auto"
            class="d-flex justify-center"
          >
            <v-btn
              variant="text"
              @click="changeDate(1)"
              class="ms-1"
              :aria-label="'다음날'"
              density="compact"
              small
            >
              <span class="d-none d-sm-inline">다음날</span>
              <v-icon right>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- 주문 건수 표시 -->
        <div class="mb-2 text-subtitle-2">
          총 주문 건수: <strong>{{ orders.length }}</strong>건
        </div>

        <v-alert v-if="error" type="error" dense>
          오류: {{ error.message || error }}
        </v-alert>

        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-3" />

        <template v-if="orders.length">
          <div class="order-grid">
            <div v-for="order in filteredOrders" :key="order.id" class="order-card">
              <v-card>
                <v-card-title class="text-h6 font-weight-bold d-flex flex-wrap align-center justify-space-between">
                  <span class="text-body-1 mb-1 mb-sm-0"><strong>주문번호: {{ order.orderNumber }}</strong></span>
                  <v-chip :color="getStatusColor(order.status)" dark class="ml-sm-2 mt-1 mt-sm-0">
                    {{ order.status }}
                  </v-chip>
                </v-card-title>

                <v-card-text>
                  <div class="order-info">
                    <div v-if="order.isGuest">
                      <p><strong style="color: red;">비회원</strong></p>
                      <p><strong>이름:</strong> {{ order.userName }}</p>
                      <p><strong>전화번호:</strong> {{ order.userPhone }}</p>
                    </div>
                    <div v-else>
                      <p><strong>회원:</strong> {{ order.userName }}</p>
                    </div>
                    <p><strong>총 금액:</strong> {{ order.totalAmount.toLocaleString() }}원</p>
                    <p><strong>주문 일시:</strong> {{ formatDate(order.createdAt) }}</p>
                    <p> 주문 ID: {{ order.id }} </p>
                  </div>

                  <v-divider class="my-4" />
                  <strong class="text-h6 font-weight-medium">주문 항목:</strong>

                  <div class="mt-2">
                    <div
                      v-for="(item, index) in order.items"
                      :key="item.menuId + (item.option?.name || '')"
                      class="order-item-row mb-4"
                    >
                      <div class="category">[ {{ item.categoryName }} ]</div>
                      <div class="item-name">
                        {{ item.name }} - {{ item.option.name }} |
                      </div>

                      <div v-if="item.toppings?.length" class="toppings">
                        {{ item.toppings.map(t => t.name).join(', ') }} |
                      </div>

                      <div class="quantity">
                        x {{ item.quantity }}
                      </div>                    
                    </div>
                    
                  </div>

                </v-card-text>

                <v-card-actions class="d-flex justify-between px-4 pb-4">
                  <v-btn
                    color="orange"
                    dark
                    style="width: 48%"
                    @click="markAsPendingHandler(order.id)"
                  >
                    대기
                  </v-btn>

                  <v-btn
                    color="green"
                    dark
                    style="width: 48%"
                    @click="markAsCompletedHandler(order.id)"
                  >
                    완료
                  </v-btn>                
                </v-card-actions>

              </v-card>
            </div>
          </div>
        </template>

        <v-alert v-else type="info">선택한 날짜에 주문이 없습니다.</v-alert>
      </v-card-text>

      <v-fab-transition>
        <v-btn
          v-show="showScrollTop"
          color="primary"
          icon
          class="scroll-top-btn"
          @click="scrollToTop"
        >
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder } from '@/composables/useOrder'

const route = useRoute()
const router = useRouter()

const companyId = route.query.companyId
const companyName = route.query.companyName

const { loading, error, orders, fetchOrdersRealtimeToday, updateOrderStatus } = useOrder()
let unsubscribe = null

const dateMenu = ref(false)
const selectedDate = ref(new Date())

const selectedDateFormatted = computed(() =>
  selectedDate.value
    ? new Intl.DateTimeFormat('ko-KR').format(selectedDate.value)
    : ''
)

function getStartAndEndOfDay(date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)

  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

const showOnlyPending = ref(false)

const togglePendingFilter = () => {
  showOnlyPending.value = !showOnlyPending.value
}

// orders 대신 필터링된 주문 목록 computed 추가
const filteredOrders = computed(() => {
  if (showOnlyPending.value) {
    return orders.value.filter(order => order.status === '대기')
  }
  return orders.value
})

const changeDate = (offset) => {
  const newDate = new Date(selectedDate.value)
  newDate.setDate(newDate.getDate() + offset)
  selectedDate.value = newDate
}

const fetchWithDate = (date) => {
  if (!companyId) return
  const { start, end } = getStartAndEndOfDay(date)

  if (unsubscribe) unsubscribe()
  unsubscribe = fetchOrdersRealtimeToday(companyId, start, end)
}

const showScrollTop = ref(false)

onMounted(() => {
  if (companyId) {
    fetchWithDate(selectedDate.value)
  } else {
    console.warn('companyId가 없습니다.')
  }
  window.addEventListener('scroll', handleScroll)
})

watch(selectedDate, (newDate) => {
  fetchWithDate(newDate)
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId, companyName }
  })
}

function formatDate(timestamp) {
  if (!timestamp) return '-'
  return timestamp.toDate?.()?.toLocaleString() ??
    (timestamp instanceof Date ? timestamp.toLocaleString() : '-')
}

function getStatusColor(status) {
  switch (status) {
    case '완료': return 'green'
    case '대기': return 'orange'
    case '취소': return 'red'
    default: return 'grey'
  }
}

const markAsCompletedHandler = async (orderId) => {
  if (!companyId) return
  try {
    await updateOrderStatus(companyId, orderId, '완료')
  } catch (e) {
    console.error('주문 완료 처리 중 오류:', e)
  }
}

const markAsPendingHandler = async (orderId) => {
  if (!companyId) return
  try {
    await updateOrderStatus(companyId, orderId, '대기')
  } catch (e) {
    console.error('주문 대기 처리 중 오류:', e)
  }
}

</script>

<style scoped>
  .order-info p {
    margin: 6px 0;
  }

  .scroll-top-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999;
  }

  .order-item-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.category,
.item-name,
.toppings,
.quantity {
  font-weight: 500;
  font-size: 14px;
  white-space: nowrap;
}

@media (min-width: 960px) {
  .order-item-row {
    flex-wrap: nowrap;
  }
}
.order-grid {
  display: block;
}

@media (min-width: 960px) {
  .order-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    align-items: stretch; /* 카드 높이 맞춤 */
  }
}

.order-card {
  width: 100%;
  height: 100%;  /* 그리드 셀 높이 100% */
  display: flex;
  flex-direction: column; /* 내부 요소가 세로로 쌓임 */
}

.order-card > .v-card {
  flex: 1 1 auto; /* flex-grow, flex-shrink, flex-basis */
  display: flex;
  flex-direction: column;
}


</style>
