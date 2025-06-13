<!-- src/views/OrderManager.vue-->
<template>
  <v-container>
    <v-card>
      <!-- 운영 대시보드로 돌아가기 버튼 -->
      <div class="text-end mb-4 mr-2">
        <span
          class="text-primary text-subtitle-2 cursor-pointer"
          @click="goToDashboard"
        >
          운영 대시보드
        </span>
      </div>

      <v-card-title class="text-h5 font-weight-bold">{{companyName}} 주문 관리</v-card-title>
      <v-divider class="mb-4" />

      <v-card-text>
        <v-alert v-if="error" type="error" dense>
          오류: {{ error.message || error }}
        </v-alert>

        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-3" />

        <template v-if="orders.length">
          <div v-for="order in orders" :key="order.id" class="mb-6">
            <v-card>
              <v-card-title class="text-h6 font-weight-bold">
                주문번호: {{ order.orderNumber }} / 주문 ID: {{ order.id }}
                <v-spacer />
                <v-chip :color="getStatusColor(order.status)" dark>{{ order.status }}</v-chip>
              </v-card-title>

              <v-card-text>
                <p><strong>회원:</strong> {{ order.userName }}</p>
                <p><strong>총 금액:</strong> {{ order.totalAmount.toLocaleString() }}원</p>
                <p><strong>주문 일시:</strong> {{ formatDate(order.createdAt) }}</p>

                <v-divider class="my-4" />

                <strong class="text-h6 font-weight-medium">
                  주문 항목:
                </strong>


                <div class="mt-2">
                  <div
                    v-for="(item, index) in order.items"
                    :key="item.menuId + (item.option?.name || '')"
                    class="mb-4"
                  >
                    <div class="text-body-1 font-weight-medium">
                      {{ item.name }} - {{ item.option.name }}
                    </div>

                    <div v-if="item.toppings?.length" class="ml-2 mt-1 text-body-1 font-weight-medium">
                      <span v-if="item.toppings?.length" style="color: #0066cc;">
                        토핑: {{ item.toppings.map(t => t.name).join(', ') }}
                      </span>
                    </div>

                    <div class="ml-2 mt-1 text-body-1 font-weight-medium">
                      <span style="color: #CC5500;">
                        수량: {{ item.quantity }}
                      </span>
                    </div>

                    <!-- 항목 사이 분리선 (마지막 제외) -->
                    <v-divider v-if="index < order.items.length - 1" class="my-3" />
                  </div>
                </div>
              </v-card-text>
              <v-btn
                color="green"
                dark
                block
                @click="markAsCompletedHandler(order.id)"
                :disabled="order.status === '완료'"
              >
                완료
              </v-btn>

            </v-card>
          </div>
        </template>

        <v-alert v-else type="info">주문 내역이 없습니다.</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder } from '@/composables/useOrder'

const route = useRoute()
const router = useRouter()

const companyId = route.query.companyId
const companyName = route.query.companyName

const { loading, error, orders, fetchOrdersRealtime, markAsCompleted } = useOrder()
let unsubscribe = null

const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId, companyName }
  })
}

onMounted(() => {
  if (companyId) {
    unsubscribe = fetchOrdersRealtime(companyId)
  } else {
    console.warn('companyId가 없습니다.')
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

function formatDate(timestamp) {
  if (!timestamp) return '-'
  return timestamp.toDate?.()?.toLocaleString() ?? (timestamp instanceof Date ? timestamp.toLocaleString() : '-')
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
  if (!companyId) {
    console.warn('companyId가 없습니다.')
    return
  }
  try {
    await markAsCompleted(companyId, orderId)
  } catch (e) {
    console.error('주문 완료 처리 중 오류 발생:', e)
  }
}
</script>
