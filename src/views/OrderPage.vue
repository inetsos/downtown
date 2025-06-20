<!-- src/views/OrderPage.vue -->
<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title
        class="text-h6 px-4 d-flex align-center justify-space-between"
        style="max-width: 600px; margin: 0 auto;"
      >
        <span>{{ companyName }} 메뉴</span>

        <!-- 익명 로그인 사용자일 때 -->
        <v-btn
          v-if="isAnonymous"
          variant="plain"
          color="primary"
          @click="goToGuestOrder"
          class="pa-0 text-body-2 font-weight-regular"
          style="min-width: auto; text-decoration: underline; cursor: pointer;"
        >
          비회원 주문 조회
        </v-btn>

        <!-- 일반 로그인 사용자일 때 -->
        <v-btn
          v-else
          variant="plain"
          color="primary"
          @click="goToMyOrders"
          class="pa-0 text-body-2 font-weight-regular"
          style="min-width: auto; text-decoration: underline; cursor: pointer;"
        >
          주문 내역
        </v-btn>

      </v-card-title>

      <!-- 카테고리 태그 선택 -->
      <div class="px-4 py-2 overflow-x-auto whitespace-nowrap" style="max-width: 600px; margin: 0 auto;">
        <v-chip-group
          v-model="selectedCategoryId"
          class="flex-nowrap"
          mandatory
          selected-class="bg-primary text-white"
        >
          <v-chip
            v-for="group in menus"
            :key="group.categoryId"
            :value="group.categoryId"
            variant="elevated"
            class="ma-1"
          >
            {{ group.categoryName }}
          </v-chip>
        </v-chip-group>
      </div>

      <v-divider class="my-2" />

      <!-- 로딩 중: 스켈레톤 카드 -->
      <v-row v-if="isLoading" dense class="px-2" justify="center">
        <v-col
          v-for="n in 3"
          :key="n"
          cols="12"
          class="d-flex justify-center"
        >
          <v-skeleton-loader
            type="image, text, text, text"
            max-width="600"
            height="420"
            class="mx-auto my-4"
            elevation="1"
          />
        </v-col>
      </v-row>

      <!-- 로딩 완료 후 메뉴 카드 렌더링 -->
      <v-row v-else dense class="px-2" justify="center">  
        <v-col
          v-for="menu in filteredMenus"
          :key="menu.id"
          cols="12"
          class="d-flex justify-center"
        >
          <v-card
            class="mt-4 pa-2 d-flex flex-column align-center"
            max-width="600"
            style="width: 100%;"
            elevation="1"
            rounded="lg"
            :class="{ 'sold-out': menu.isSoldOut }"
            @click="!menu.isSoldOut && selectMenu(menu)"
          >
            <v-img
              :src="menu.imageUrl"
              cover
              width="220"
              height="220"
              class="rounded-lg mb-2"
            />
            <div class="font-weight-bold text-subtitle-1 text-center">
              {{ menu.name }}
            </div>
            <div class="text-body-2 text-grey-darken-1 text-center">
              {{ menu.description }}
            </div>
            <div class="mt-1 text-body-1 text-primary text-center">
              {{ (menu.price ?? 0).toLocaleString() }}원
            </div>

            <div v-if="menu.isSoldOut" class="sold-out-label text-center text-red">
              품절
            </div>

            <!-- 토핑/옵션 선택 UI: 항상 열려 있음 -->
            <div class="mt-6 px-2 text-center">
              <div class="mb-2">
                <strong>토핑 선택</strong>
                <v-checkbox
                  v-for="t in filteredToppings(menu)"
                  :key="t.id"
                  :label="`${t.name} (+${Number(t.price).toLocaleString()}원)`"
                  :value="t.id"
                  v-model="selectedToppings[menu.id]"
                  density="compact"
                  hide-details
                  :disabled="menu.isSoldOut"
                />
              </div>

              <div>
                <strong>옵션 선택</strong>
                <v-radio-group v-model="selectedOption[menu.id]" density="compact">
                  <v-radio
                    v-for="o in filteredOptions(menu)"
                    :key="o.id"
                    :label="o.name"
                    :value="o.id"
                    :disabled="menu.isSoldOut"
                  />
                </v-radio-group>
              </div>

              <v-row class="mt-2 mb-4" dense justify="center" style="gap: 10px;">
                <v-col cols="auto">
                  <v-btn
                    color="primary"
                    style="min-width: 120px;"
                    @click.stop="addToCart(menu)"
                    :disabled="menu.isSoldOut"
                  >
                    담기
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="secondary" style="min-width: 120px;" @click="goToCart">
                    장바구니
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-alert
        v-if="!filteredMenus.length  && !isLoading"
        type="info"
        class="ma-4 mx-auto"
        max-width="600"
      >
        해당 카테고리에 메뉴가 없습니다.
      </v-alert>

    </v-card>
    <!-- <v-btn
      color="primary"
      @click="generateFakeOrdersWithStringToppingPrices(100)"
      class="mx-auto my-4 d-block"
    >
      페이크 데이터
    </v-btn> -->

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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenus } from '@/composables/useMenus'
import { useToppingManagement } from '@/composables/useToppingManagement'
import { useIceHotManager } from '@/composables/useIceHotManager'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()

const companyId = route.query.companyId ?? ''
const companyName = route.query.companyName || ''

// 메뉴 관리
const { menus, fetchMenus } = useMenus(companyId)
const selectedCategoryId = ref(null)
const selectedCategoryName = ref('')

const selectedMenuId = ref(null)

watch(selectedCategoryId, (newId) => {
  const category = menus.value.find(group => group.categoryId === newId)
  selectedCategoryName.value = category?.categoryName || ''
})

const isLoading = ref(true)

// 토핑 관리 (Firestore에서 불러옴)
const {
  toppings,
  loadToppings,
} = useToppingManagement(companyId)

// 옵션 관리 (Firestore에서 불러옴)
const {
  options,
  fetchOptions: fetchIceHotOptions,
} = useIceHotManager(companyId)

// 메뉴별 선택 상태 (객체: key = menu.id)
const selectedToppings = ref({})
const selectedOption = ref({})

const showScrollTop = ref(false)

const isAnonymous = computed(() => authStore.user?.isAnonymous === true)

// 필터링된 메뉴
const filteredMenus = computed(() => {
  const group = menus.value.find(g => g.categoryId === selectedCategoryId.value)
  return group?.menus || []
})

const goToGuestOrder = () => {
  router.push({
    path: '/guest-order',
    query: {
      companyId: companyId,
      companyName: companyName,
    }
  })
}

const goToMyOrders = () => {
  router.push({ 
    path: '/my-orders', 
    query: {
      companyId: companyId,
      companyName: companyName,
    }
  })
}

watch(filteredMenus, (newMenus) => {
  newMenus.forEach(menu => {
    // 토핑 초기화
    if (!selectedToppings.value[menu.id]) {
      selectedToppings.value[menu.id] = []
    }

    // 옵션 자동 선택 로직
    const validOptions = filteredOptions(menu)
    if (validOptions.length === 1) {
      selectedOption.value[menu.id] = validOptions[0].id
    } else if (!selectedOption.value[menu.id]) {
      selectedOption.value[menu.id] = null // 명시적으로 비움
    }
  })
}, { immediate: true })

// 메뉴별 허용 토핑 필터링 함수
const filteredToppings = (menu) => {
  if (!menu.toppingIds?.length) return []
  const result = toppings.value.filter(t => menu.toppingIds.includes(t.id))
  return result;
}

// 메뉴별 허용 옵션 필터링 함수
const filteredOptions = (menu) => {
  if (!menu.optionIds?.length) return []
  return options.value.filter(o => menu.optionIds.includes(o.id))
}

// 메뉴 클릭 토글 (선택/해제)
const selectMenu = (menu) => {
  if (selectedMenuId.value === menu.id) {
    selectedMenuId.value = null
  } else {
    selectedMenuId.value = menu.id
  }
}

const addToCart = (menu) => {
  if (menu.isSoldOut) {
    alert('해당 메뉴는 매진되어 주문할 수 없습니다.')
    return
  }

  const toppingsSelectedIds = selectedToppings.value[menu.id] || []
  const optionSelectedId = selectedOption.value[menu.id]

  // 옵션이 2개 이상인데 선택하지 않은 경우
  const optionsForMenu = filteredOptions(menu)
  if (optionsForMenu.length >= 2 && !optionSelectedId) {
    alert('옵션을 선택해주세요.')
    return
  }

  const selectedData = {
    categoryId: selectedCategoryId.value,
    categoryName: selectedCategoryName.value,
    menuId: menu.id,
    name: menu.name,
    price: menu.price,
    toppings: toppings.value.filter(t => toppingsSelectedIds.includes(t.id)),
    option: options.value.find(o => o.id === optionSelectedId) || null,
    imageUrl: menu.imageUrl,
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cart.push(selectedData)
  localStorage.setItem('cart', JSON.stringify(cart))
}

const goToCart = () => {
  router.push({
    path: '/cart',
    query: {
      companyId: route.query.companyId,
      companyName: route.query.companyName
    }
  })
}

onMounted(async () => {
  await fetchMenus()
  await loadToppings()
  await fetchIceHotOptions()
  selectedCategoryId.value = menus.value[0]?.categoryId ?? null
  isLoading.value = false;
})

const onScroll = () => {
  showScrollTop.value = window.scrollY > 100
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { faker } from '@faker-js/faker';

async function generateFakeOrdersWithStringToppingPrices(count = 100) {
  // 메뉴, 토핑, 옵션, 카테고리 불러오기
  const menusSnap = await getDocs(collection(db, 'companies', companyId, 'menus'));
  const toppingsSnap = await getDocs(collection(db, 'companies', companyId, 'toppings'));
  const optionsSnap = await getDocs(collection(db, 'companies', companyId, 'icehotOptions'));
  const categoriesSnap = await getDocs(collection(db, 'companies', companyId, 'categories'));

  const menus = menusSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const toppingsMap = Object.fromEntries(toppingsSnap.docs.map(doc => [doc.id, doc.data()]));
  const optionsMap = Object.fromEntries(optionsSnap.docs.map(doc => [doc.id, doc.data()]));
  const categoryMap = Object.fromEntries(categoriesSnap.docs.map(doc => [doc.id, doc.data().name]));

  if (menus.length === 0) {
    console.error('메뉴 데이터가 없습니다.');
    return;
  }

  const ordersRef = collection(db, 'companies', companyId, 'orders');

  for (let i = 0; i < count; i++) {
    const isGuest = Math.random() < 0.3;
    const name = isGuest ? faker.person.fullName() : `user${i}`;
    const phone = isGuest ? faker.phone.number('010-####-####') : null;

    const itemCount = faker.number.int({ min: 1, max: 3 });
    const selectedItems = faker.helpers.arrayElements(menus, itemCount);

    const cartItems = selectedItems.map(menu => {
      const selectedToppings = menu.toppingIds
        ? faker.helpers.arrayElements(menu.toppingIds, faker.number.int({ min: 0, max: menu.toppingIds.length }))
        : [];

      const selectedOption = menu.optionIds?.length
        ? faker.helpers.arrayElement(menu.optionIds)
        : null;

      const quantity = faker.number.int({ min: 1, max: 3 });

      const toppingTotal = selectedToppings.reduce((sum, toppingId) => {
        const topping = toppingsMap[toppingId];
        const price = parseInt(topping?.price || '0', 10);
        return sum + price;
      }, 0);

      const optionPrice = 0;

      const unitTotal = menu.price + toppingTotal + optionPrice;
      const total = unitTotal * quantity;

      return {
        menuId: menu.id,
        name: menu.name,
        price: menu.price,
        quantity,
        toppings: selectedToppings,
        option: selectedOption,
        imageUrl: menu.imageUrl || null,
        categoryId: menu.categoryId || null,
        categoryName: categoryMap[menu.categoryId] || '기타',
        _calculatedPrice: total
      };
    });

    const totalAmount = cartItems.reduce((sum, item) => sum + item._calculatedPrice, 0);
    const itemsForSave = cartItems.map(({ _calculatedPrice, ...item }) => item);

    const order = {
      userId: isGuest ? 'guest' : `user${i}`,
      userName: name,
      userPhone: phone,
      isGuest,
      companyName: null,
      items: itemsForSave,
      totalAmount,
      createdAt: faker.date.between({ from: new Date('2025-06-16'), to: new Date() }),
    };

    await addDoc(ordersRef, order);
    console.log(`주문 ${i + 1} 저장 완료`);
  }

  console.log('모든 주문 저장 완료!');
}
</script>

<style scoped>
.sold-out {
  filter: grayscale(80%);
  pointer-events: none;
  opacity: 0.6;
  user-select: none;
}

.sold-out-label {
  font-weight: bold;
  margin-top: 8px;
  font-size: 1.5rem;
}

.scroll-to-top-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
}
</style>
