<!-- src/views/OrderPage.vue -->
<template>
  <v-container fluid>
    <v-card flat>
      <v-card-title class="text-h6 px-4">{{ companyName }} 메뉴</v-card-title>

      <!-- 카테고리 태그 선택 -->
      <div class="px-4 py-2 overflow-x-auto whitespace-nowrap">
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

      <!-- 메뉴 카드 리스트 -->
      <v-row dense class="px-2" justify="center">
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
            @click="selectMenu(menu)"
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
                  />
                </v-radio-group>
              </div>

              <v-row class="mt-2 mb-4" dense justify="center" style="gap: 10px;">
                <v-col cols="auto">
                  <v-btn color="primary" style="min-width: 120px;" @click.stop="addToCart(menu)">담기</v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="secondary" style="min-width: 120px;" @click="goToCart">장바구니</v-btn>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-alert v-if="!filteredMenus.length" type="info" class="ma-4">
        해당 카테고리에 메뉴가 없습니다.
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenus } from '@/composables/useMenus'
import { useToppingManagement } from '@/composables/useToppingManagement'
import { useIceHotManager } from '@/composables/useIceHotManager'

const route = useRoute()
const router = useRouter()

const companyId = route.query.companyId ?? ''
const companyName = route.query.companyName || ''

// 메뉴 관리
const { menus, fetchMenus } = useMenus(companyId)
const selectedCategoryId = ref(null)
const selectedMenuId = ref(null)

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

// 필터링된 메뉴
const filteredMenus = computed(() => {
  const group = menus.value.find(g => g.categoryId === selectedCategoryId.value)
  return group?.menus || []
})

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
  const toppingsSelectedIds = selectedToppings.value[menu.id] || []
  const optionSelectedId = selectedOption.value[menu.id]

  // 옵션이 2개 이상인데 선택하지 않은 경우
  const optionsForMenu = filteredOptions(menu)
  if (optionsForMenu.length >= 2 && !optionSelectedId) {
    alert('옵션을 선택해주세요.')
    return
  }

  const selectedData = {
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
})
</script>
