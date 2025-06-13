<!-- src/views/CartPage.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h6">장바구니</v-card-title>
      <v-divider />

      <v-card-text v-if="cartItems.length">
        <v-row>
          <v-col
            v-for="(item, index) in cartItems"
            :key="index"
            cols="12"
          >
            <v-card 
              class="pa-2 d-flex flex-column align-center" 
              elevation="1"
              rounded="lg"
            >
              <v-img 
                :src="item.imageUrl" 
                cover
                width="220"
                height="220"
                class="rounded-lg mb-2"
              />
              <div class="font-weight-bold text-subtitle-1 mb-1">{{ item.name }}</div>

              <div class="text-body-2 text-grey-darken-1 mb-1">
                옵션: {{ item.option?.name || '없음' }}
              </div>

              <div class="text-body-2 mb-2">
                토핑: {{ item.toppings?.length ? item.toppings.map(t => t.name).join(', ') : '없음' }}
              </div>

              <!-- 수량 조절 UI -->
              <div class="d-flex align-center mb-2" style="gap: 10px;">
                <v-btn icon size="x-small" @click="updateQuantity(index, -1)">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <span>{{ item.quantity }}</span>
                <v-btn icon size="x-small" @click="updateQuantity(index, 1)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <div class="text-body-1 text-primary font-weight-bold mb-3">
                {{ calcItemPrice(item).toLocaleString() }}원
              </div>

              <v-btn size="small" color="error" @click="removeItem(index)">
                삭제
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-4" />

        <div class="text-right font-weight-bold text-h6">
          총 합계: {{ totalAmount.toLocaleString() }}원
        </div>        
      </v-card-text>

      <v-card-text v-else>
        <v-alert type="info">장바구니에 담긴 항목이 없습니다.</v-alert>
      </v-card-text>

      <v-row class="mt-2 mb-4" dense justify="center" style="gap: 10px;">
        <v-col cols="auto">
          <v-btn color="success" style="min-width: 120px;" @click="proceedToOrder">주문하기</v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" style="min-width: 120px;" @click="goToMenu">메뉴 보기</v-btn>
        </v-col>
      </v-row>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useOrder } from '@/composables/useOrder'  // composable import

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const cartItems = ref([])

const totalAmount = computed(() =>
  cartItems.value.reduce((total, item) => total + calcItemPrice(item), 0)
)

const { loading, error, createOrder } = useOrder()

const proceedToOrder = async () => {
  if (!cartItems.value.length) {
    alert('장바구니가 비어있습니다.')
    return
  }
  const companyId = route.query.companyId
  if (!companyId) {
    alert('잘못된 접근입니다. 회사 ID가 없습니다.')
    return
  }

  const orderData = {
    userId: authStore.user?.uid || 'guest',
    userName: authStore.profile?.name || 'guest',
    companyName: route.query.companyName || null,
    items: cartItems.value.map(item => ({
      menuId: item.menuId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      toppings: item.toppings || [],
      option: item.option || null,
      imageUrl: item.imageUrl || null,
    })),
    totalAmount: totalAmount.value,
  }

  try {
    const orderId = await createOrder(companyId, orderData)
    alert(`주문이 접수되었습니다! 주문 ID: ${orderId}`)

    localStorage.removeItem('cart')
    cartItems.value = []

    router.push('/')
  } catch (e) {
    console.error(e)
    alert('주문 처리 중 오류가 발생했습니다.')
  }
}

const goToMenu = () => {
  router.push({
    path: '/order',
    query: {
      companyId: route.query.companyId,
      companyName: route.query.companyName,
      username: authStore.profile?.name || 'guest',
      returnToCart: true
    }
  })
}

const updateQuantity = (index, delta) => {
  const item = cartItems.value[index]
  item.quantity = Math.max(1, item.quantity + delta)
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const calcItemPrice = (item) => {
  const base = item.price || 0
  const toppingSum = item.toppings?.reduce((sum, t) => sum + Number(t.price), 0) || 0
  return (base + toppingSum) * (item.quantity || 1)
}

onMounted(() => {
  const saved = localStorage.getItem('cart')
  const items = saved ? JSON.parse(saved) : []
  cartItems.value = items.map(item => ({
    ...item,
    quantity: item.quantity || 1
  }))
})
</script>

