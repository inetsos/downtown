<!-- src/views/CartPage.vue -->
<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h6">
        장바구니
        <span v-if="isAnonymous" class="ml-1"> - 비회원 주문</span>
      </v-card-title>
      <v-divider />

      <v-card-text v-if="cartItems.length">
        <v-row>
          <v-col v-for="(item, index) in cartItems" :key="index" cols="12">
            <v-card class="pa-2 d-flex flex-column align-center" elevation="1" rounded="lg">
              <v-img :src="item.imageUrl" cover width="220" height="220" class="rounded-lg mb-2" />
              <div class="font-weight-bold text-subtitle-1 mb-1">{{ item.name }}</div>
              <div class="text-body-2 text-grey-darken-1 mb-1">옵션: {{ item.option?.name || '없음' }}</div>
              <div class="text-body-2 mb-2">토핑: {{ item.toppings?.length ? item.toppings.map(t => t.name).join(', ') : '없음' }}</div>

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

              <v-btn size="small" color="error" @click="removeItem(index)">삭제</v-btn>
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

      <!-- 비회원 입력 영역 -->
      <v-card-text v-if="isAnonymous && cartItems.length">
        <v-text-field
          v-model="guestName"
          label="이름"
          prepend-inner-icon="mdi-account"
          required
          class="mb-2"
        />
        <v-text-field
          v-model="guestPhone"
          label="전화번호"
          prepend-inner-icon="mdi-phone"
          required
        />
      </v-card-text>

      <v-row class="mt-2 mb-4" dense justify="center" style="gap: 10px;">
        <v-col cols="auto">
          <v-btn color="success" :loading="loading" :disabled="loading" style="min-width: 120px;" @click="proceedToOrder">
            주문하기
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn color="primary" style="min-width: 120px;" @click="goToMenu">메뉴 보기</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <!-- 스크롤 상단 버튼 -->
  <v-btn
    v-show="showScrollTop"
    icon
    color="primary"
    class="scroll-top-btn"
    @click="scrollToTop"
  >
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useOrder } from '@/composables/useOrder'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const cartItems = ref([])
const guestName = ref('')
const guestPhone = ref('')
const isGuest = ref(false)

const isAnonymous = computed(() => authStore.user?.isAnonymous === true)

const { loading, createOrder } = useOrder()

const totalAmount = computed(() =>
  cartItems.value.reduce((total, item) => total + calcItemPrice(item), 0)
)

const proceedToOrder = async () => {
  if (!cartItems.value.length) {
    alert('장바구니가 비어있습니다.')
    return
  }

  const companyId = route.query.companyId
  if (!companyId) {
    alert('회사 ID가 없습니다.')
    return
  }

  if (isAnonymous.value && (!guestName.value || !guestPhone.value)) {
    alert('비회원 주문 시 이름과 전화번호를 입력해주세요.')
    return
  }

  //console.log(guestPhone.value || null)
  if(isAnonymous)
    isGuest.value = true;

  const orderData = {
    userId: authStore.user?.uid || 'guest',
    userName: authStore.profile?.name || guestName.value || 'guest',
    userPhone: guestPhone.value || null,
    isGuest: isGuest.value,
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
    createdAt: new Date()
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

const removeItem = (index) => {
  cartItems.value.splice(index, 1)
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const calcItemPrice = (item) => {
  const base = item.price || 0
  const toppingSum = item.toppings?.reduce((sum, t) => sum + Number(t.price), 0) || 0
  return (base + toppingSum) * (item.quantity || 1)
}

const showScrollTop = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('cart')
  cartItems.value = saved ? JSON.parse(saved).map(item => ({
    ...item,
    quantity: item.quantity || 1
  })) : []

  window.addEventListener('scroll', scrollHandler)
})

const scrollHandler = () => {
  showScrollTop.value = window.scrollY > 200
}
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onUnmounted(() => window.removeEventListener('scroll', scrollHandler))

</script>

<style scoped>
.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}
</style>
