<!-- src/views/MyOrderPage.vue -->
<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title class="text-h6 font-weight-bold">내 주문 내역</v-card-title>
      <v-divider />

      <v-alert
        v-if="!groupedOrders || Object.keys(groupedOrders).length === 0"
        type="info"
        class="ma-4"
      >
        주문 내역이 없습니다.
      </v-alert>

      <div v-for="(orders, companyId) in groupedOrders" :key="companyId" class="mb-8">
        <v-card class="mb-4" elevation="2" outlined>
          <v-card-title class="text-subtitle-1 font-weight-bold">
            <v-icon left color="primary">mdi-store</v-icon>
            {{ getCompanyName(orders[0]) }}
          </v-card-title>
        </v-card>

        <v-row dense>
          <v-col
            v-for="order in orders"
            :key="order.id"
            cols="12" sm="6" md="4"
          >
            <v-card class="order-card" elevation="4" outlined>
              <v-card-text>
                
                <div color="primary" text-color="white">
                  주문 번호: {{ order.orderNumber }} 
                </div>
                <div color="primary" text-color="white">
                  주문 ID: {{ order.id }}
                </div>
                <!-- <v-chip :color="getStatusColor(order.status)" dark>{{ order.status }}</v-chip> -->
                <div class="order-header  mb-3">
                  상태:
                  <strong  :style="{ color: getStatusColor(order.status) }">
                    {{ order.status }}
                  </strong > 
                </div>
                <div class="order-header d-flex justify-space-between align-center mb-3">
                  <div class="order-date grey--text text--darken-1">
                    주문일: {{ formatDate(order.createdAt) }}
                  </div>
                </div>                

                <div class="order-items">
                  <div
                    v-for="(item, index) in order.items"
                    :key="index"
                    class="order-item mb-3"
                  >
                    <div class="d-flex justify-space-between align-center font-weight-medium">
                      <div>{{ item.name }} × {{ item.quantity }}</div>
                      <div class="order-item-price">{{ (item.price * item.quantity).toLocaleString() }}원</div>
                    </div>
                    <div v-if="item.toppings?.length" class="order-subinfo">
                      토핑: {{ item.toppings.map(t => t.name).join(', ') }}
                    </div>
                    <div v-if="item.option" class="order-subinfo">
                      옵션: {{ item.option.name }}
                    </div>
                  </div>
                </div>

                <v-divider class="my-3" />

                <div class="order-footer d-flex justify-end font-weight-bold primary--text text--darken-2">
                  총 합계: {{ order.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString() }}원
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useMyOrders } from '@/composables/useMyOrders'
import { useAuthStore } from '@/stores/authStore'
import { format } from 'date-fns'

const authStore = useAuthStore()
const userId = authStore.user?.uid

const { orders, fetchOrders } = useMyOrders(userId)

onMounted(fetchOrders)

const groupedOrders = computed(() => {
  return orders.value.reduce((acc, order) => {
    const cid = order.companyId ?? 'unknown'
    if (!acc[cid]) acc[cid] = []
    acc[cid].push(order)
    return acc
  }, {})
})

const getCompanyName = (order) => {
  return order.companyName || `업체 (${order.companyId ?? '알 수 없음'})`
}

const getStatusColor = (status) => {
  switch (status) {
    case '완료': return 'green'
    case '대기': return 'orange'
    case '취소': return 'red'
    default: return 'grey'
  }
}

const formatDate = (ts) => {
  try {
    const date = ts?.toDate?.() || new Date(ts)
    return format(date, 'yyyy-MM-dd HH:mm')
  } catch {
    return '-'
  }
}
</script>

<style scoped>
.order-card {
  cursor: default;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
  min-height: 320px; /* 원하는 높이로 조정 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 헤더-내용-푸터 간 균등 배분 */
}

.order-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.order-header {
  font-size: 0.875rem;
}

.order-items {
  font-size: 0.95rem;
  flex-grow: 1; /* 상세 내용이 카드 높이 안에서 늘어나도록 */
  margin-top: 8px;
  overflow-y: auto; /* 내용이 너무 많을 때 스크롤 가능 */
}

.order-item {
  padding-left: 8px;
}

.order-item-price {
  font-weight: 600;
  color: #1e88e5; /* Vuetify primary blue */
}

.order-subinfo {
  font-size: 0.8rem;
  color: #6b7280;
  padding-left: 12px;
  margin-top: 2px;
}

.order-footer {
  font-size: 1rem;
  margin-top: 12px;
  text-align: right;
  font-weight: 700;
  color: #1e88e5;
}
</style>

