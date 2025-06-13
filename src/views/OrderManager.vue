<!-- src/views/OrderManager.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5 font-weight-bold">주문 관리</v-card-title>
      <v-divider class="mb-4" />

      <v-card-text>
        <v-alert v-if="error" type="error" dense>
          오류: {{ error.message || error }}
        </v-alert>

        <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-3" />

        <template v-if="orders.length">
          <v-list>
            <v-list-item v-for="order in orders" :key="order.id" class="mb-6 pa-4">
              <v-list-item-title class="text-h6 font-weight-bold mb-4">
                주문 ID: {{ order.id }}
              </v-list-item-title>

              <p class="mb-2"><strong>사용자:</strong> {{ order.userName }} (ID: {{ order.userId }})</p>
              <p class="mb-2"><strong>회사명:</strong> {{ order.companyName }}</p>
              <p class="mb-2"><strong>총 금액:</strong> {{ order.totalAmount.toLocaleString() }}원</p>
              <p class="mb-2"><strong>상태:</strong> {{ order.status }}</p>
              <p class="mb-4"><strong>주문 일시:</strong> {{ formatDate(order.createdAt) }}</p>

              <v-divider class="mb-4" />

              <strong class="text-subtitle-1">주문 항목:</strong>
              <v-list dense>
                <v-list-item v-for="item in order.items" :key="item.menuId + (item.option?.name || '')" class="pl-4">
                  <v-list-item-content>
                    <p class="mb-1">
                      <strong>{{ item.name }}</strong>
                      <template v-if="item.option"> - 옵션: {{ item.option.name }}</template>
                      <template v-if="item.toppings?.length">
                        - 토핑: {{ item.toppings.map(t => t.name).join(', ') }}
                      </template>
                      / 수량: {{ item.quantity }}
                    </p>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-list-item>
          </v-list>
        </template>

        <v-alert v-else type="info">주문 내역이 없습니다.</v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrder } from '@/composables/useOrder'

const route = useRoute()
const companyId = route.query.companyId
const { loading, error, orders, fetchOrdersRealtime } = useOrder()
let unsubscribe = null

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
</script>