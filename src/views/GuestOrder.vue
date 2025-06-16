<!-- src/views/GuestOrder.vue -->
<template>
  <v-container>
    <v-card class="mx-auto pa-4" max-width="500">
      <v-card-title class="text-h6 d-flex align-center">
        비회원 주문 조회
        <v-spacer />
        <v-btn
          variant="plain"
          color="primary"
          class="pa-0 text-body-2 font-weight-regular"
          style="min-width: auto; text-decoration: underline; cursor: pointer;"
          @click="goToOrderPage"
        >
          메뉴 보기
        </v-btn>
      </v-card-title>

      <v-divider class="mb-4" />

      <v-text-field
        v-model="guestPhone"
        label="전화번호"
        placeholder="010-1234-5678"
        prepend-inner-icon="mdi-phone"
        required
        class="mb-3"
      />

      <v-btn
        color="primary"
        block
        :loading="loading"
        :disabled="!guestPhone"
        @click="handleSearch"
      >
        주문 조회
      </v-btn>

      <v-alert v-if="searched && !orders.length" type="info" class="mt-4">
        해당 전화번호로 조회된 주문이 없습니다.
      </v-alert>

      <v-alert v-if="orders.length" type="success" class="mt-4">
        {{ orders.length }}건의 주문이 조회되었습니다.
      </v-alert>

      <v-card
        v-for="order in orders"
        :key="order.id"
        class="mt-4"
        outlined
      >
        <v-card-title class="text-subtitle-1 font-weight-bold">
          주문번호: {{ order.orderNumber }}
        </v-card-title>

        <v-card-text>
          <div>상태: {{ order.status }}</div>
          <div>총 금액: {{ order.totalAmount?.toLocaleString() }}원</div>
          <div>주문 시간: {{ formatDate(order.createdAt?.toDate?.()) }}</div>

          <v-divider class="my-3" />
          <strong class="text-subtitle-2">주문 항목:</strong>

          <div class="mt-2">
            <div
              v-for="(item, index) in order.items"
              :key="item.menuId + (item.option?.name || '')"
              class="mb-4"
            >
              <div class="text-body-1 font-weight-medium">
                {{ item.name }} - {{ item.option?.name || '기본' }}
              </div>

              <div
                v-if="item.toppings?.length"
                class="ml-2 mt-1 text-body-1 font-weight-medium"
              >
                <span style="color: #0066cc;">
                  토핑: {{ item.toppings.map(t => t.name).join(', ') }}
                </span>
              </div>

              <div class="ml-2 mt-1 text-body-1 font-weight-medium">
                <span style="color: #CC5500;">
                  수량: {{ item.quantity }}
                </span>
              </div>

              <v-divider
                v-if="index < order.items.length - 1"
                class="my-3"
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useOrder } from '@/composables/useOrder'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companyId = route.query.companyId || ''
const companyName = route.query.companyName || ''

const { searchGuestOrder, loading } = useOrder()

const guestPhone = ref('')
const orders = ref([])
const searched = ref(false)

const goToOrderPage = () => {
  // 예: 운영자용 주문 관리 페이지로 이동
  router.push({ 
    name: 'OrderPage', 
    query: { companyId, companyName } 
  })
}


const handleSearch = async () => {
  if (!guestPhone.value) return
  try {
    const result = await searchGuestOrder(companyId, guestPhone.value)
    orders.value = result
    searched.value = true
  } catch (e) {
    console.error('주문 조회 오류:', e)
    alert('주문 조회 중 오류가 발생했습니다.')
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return date.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>
