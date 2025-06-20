<template>
  <v-container class="pa-2 pa-sm-4">
    <v-card class="pa-4 mx-auto" :style="{ maxWidth: '700px', width: '100%' }">
      <!-- 운영 대시보드로 돌아가기 버튼 -->
      <div class="text-end mb-4">
        <span
          class="text-primary text-subtitle-2 cursor-pointer"
          @click="goToDashboard"
        >
          운영 대시보드
        </span>
      </div>

      <v-card-title class="text-h6 d-flex flex-column">
      <div>{{ companyName }} - 메뉴</div>
      <div class="d-flex flex-wrap gap-2 justify-end mt-2">
        <v-btn class="mr-2" color="success" @click="goToCategoryManagement">카테고리</v-btn>
        <v-btn class="mr-2" color="secondary" @click="goToToppingManagement">토핑</v-btn>
        <v-btn class="mr-2" color="secondary" @click="goToIceHotManagement">옵션</v-btn>
        <v-btn class="mr-2" color="primary" @click="goToAddMenu">메뉴</v-btn>
      </div>
    </v-card-title>

      <v-divider class="my-4" />

      <v-list lines="two" density="comfortable">
        <template v-for="(menuList, category) in groupedMenus" :key="category">
          <v-list-subheader class="text-h6 font-weight-bold">{{ category }}</v-list-subheader>

          <template v-for="(menu, index) in menuList" :key="menu.id">
            <v-list-item class="flex-column align-center text-center">
              <v-avatar size="160" rounded class="mb-3">
                <v-img :src="menu.imageUrl" />
              </v-avatar>
              
              <div class="font-weight-bold mb-1">{{ menu.name }}</div>
              <div v-if="menu.description" class="text-grey-darken-1 mb-1">
                {{ menu.description }}
              </div>
              <div class="mb-1">가격: {{ Number(menu.price).toLocaleString() }}원</div>
              <div class="mb-1">
                토핑:
                <span v-if="menu.toppingIds?.length">
                  {{ getToppingNames(menu.toppingIds).join(', ') || '토핑 없음' }}
                </span>
                <span v-else>없음</span>
              </div>
              <div>
                옵션:
                <span v-if="menu.optionIds?.length">
                  {{ getOptionNames(menu.optionIds).join(', ') }}
                </span>
                <span v-else>없음</span>
              </div>
              
            </v-list-item>

            <v-divider v-if="index < menuList.length - 1" />
          </template>

          <v-divider class="my-4" />
        </template>
      </v-list>
    </v-card>

    <!-- 카테고리  테이블 -->
    <div class="overflow-x-auto">
      <v-card class="pa-4 mx-auto mt-4" :style="{ maxWidth: '700px', width: '100%' }">
        <v-card-title>카테고리</v-card-title>

        <v-data-table
          :headers="categoryHeaders"
          :items="categories"
          item-key="id"
          class="elevation-1"
          fixed-header
          :items-per-page="5"
          dense
        >
          <template #header.name>카테고리</template>
          <template #header.sortOrder>순서</template>
        </v-data-table>
      </v-card>
    </div>

    <!-- 토핑 테이블 -->
    <div class="overflow-x-auto">
      <v-card class="pa-4 mx-auto mt-4" :style="{ maxWidth: '700px', width: '100%' }">
        <v-card-title>토핑</v-card-title>

        <v-data-table
          :headers="toppingHeaders"
          :items="toppings"
          item-key="id"
          class="elevation-1"
          fixed-header
          :items-per-page="5"
          dense
        >
          <template #header.name>토핑</template>
          <template #header.price>가격</template>
          <template #header.sortOrder>순서</template>
          <template #item.price="{ item }">{{ Number(item.price).toLocaleString() }}원</template>
        </v-data-table>
      </v-card>
    </div>

    <!-- 옵션 테이블 -->
    <div class="overflow-x-auto">
      <v-card class="pa-4 mx-auto mt-4" :style="{ maxWidth: '700px', width: '100%' }">
        <v-card-title>옵션</v-card-title>

        <v-data-table
          :headers="optionHeaders"
          :items="options"
          item-key="id"
          class="elevation-1"
          fixed-header
          :items-per-page="5"
          dense
        >
          <template #header.name>옵션</template>
          <template #header.sortOrder>순서</template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
  <v-btn
    v-show="showScrollTop"
    icon="mdi-arrow-up"
    color="primary"
    class="scroll-top-btn"
    @click="scrollToTop"
  />
</template>

<script setup>
import { 
  ref, 
  computed, 
  onMounted, 
  onBeforeUnmount 
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenus } from '@/composables/useMenus'

const props = defineProps({
  companyId: String,
  companyName: String
})

const route = useRoute()
const router = useRouter()

const companyId = route.params.companyId
const companyName = route.query.companyName || ''

const {
  menus,
  categories,
  toppings,
  options,
  getCategories,
  getToppings,
  getOptions,
  fetchMenus
} = useMenus(companyId)

const groupedMenus = computed(() => {
  const result = {}
  menus.value.forEach(group => {
    result[group.categoryName] = group.menus
  })
  return result
})

const categoryHeaders = [
  { text: '카테고리', value: 'name', width: 300 },
  { text: '순서', value: 'sortOrder' },
]

const toppingHeaders = [
  { text: '토핑', value: 'name', width: 150 },
  { text: '가격', value: 'price', align: 'end', width: 150 },
  { text: '순서', value: 'sortOrder' },
]

const optionHeaders = [
  { text: '옵션', value: 'name', width: 300 },
  { text: '순서', value: 'sortOrder' },
]

const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId, companyName }
  })
}

const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id)
  return cat ? cat.name : '알 수 없음'
}

const getToppingNames = (ids) => {
  return toppings.value
    .filter(t => ids.includes(t.id))
    .map(t => t.name)
}

const getOptionNames = (ids) => {
  return options.value
    .filter(o => ids.includes(o.id))
    .map(o => o.name)
}

function goToCategoryManagement() {
  router.push({
    name: 'CategoryManagement',
    params: { companyId },
    query: { companyName },
  })
}

function goToToppingManagement() {
  router.push({
    name: 'ToppingManagement',
    params: { companyId },
    query: { companyName },
  })
}

function goToIceHotManagement() {
  router.push({
    name: 'IceHotManagement',
    params: { companyId },
    query: { companyName },
  })
}

function goToAddMenu() {
  router.push({
    name: 'MenuManager',
    params: { companyId },
    query: { companyName },
  })
}

onMounted(async () => {
  await Promise.all([getCategories(), getToppings(), getOptions(), fetchMenus()])
  window.addEventListener('scroll', handleScroll)
})

const showScrollTop = ref(false)

function handleScroll() {
  showScrollTop.value = window.scrollY > 200
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})


</script>

<style scoped>
.scroll-top-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
}
</style>