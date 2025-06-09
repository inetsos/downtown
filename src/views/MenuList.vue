<template>
  <v-app>
    <v-main>
  <v-container>
    <v-card class="pa-4 mx-auto" style="max-width: 800px;">
      <v-card-title class="text-h6 d-flex justify-space-between align-center">
        <span>{{ companyName }} - 메뉴</span>
        <div>
          <v-btn class="mr-2" color="success" @click="goToCategoryManagement">
            카테고리 관리
          </v-btn>
          <v-btn class="mr-2" color="secondary" @click="goToToppingManagement">
            토핑 관리
          </v-btn>
          <v-btn class="mr-2" color="secondary" @click="goToIceHotManagement">
            옵션 관리
          </v-btn>
          <v-btn color="primary" @click="goToAddMenu">
            메뉴 등록
          </v-btn>
        </div>
      </v-card-title>

      <v-divider class="my-4" />

      <!-- 카테고리별 메뉴 테이블 -->
      <v-card class="mb-6">
        <v-card-title>메뉴</v-card-title>
        <v-expansion-panels multiple>
          <v-expansion-panel
            v-for="category in categoryNames"
            :key="category"
          >
            <v-expansion-panel-title>{{ category }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-data-table
                :headers="menuHeaders"
                :items="menusByCategory[category]"
                item-key="id"
                dense
                class="elevation-1"
                fixed-header
                :items-per-page="5"
                style="table-layout: fixed"
              >
                <template #header.name>
                  메뉴
                </template>
                <template #header.price>
                  가격
                </template>
                <template #header.description>
                  설명
                </template>
                <template #header.toppingIds>
                  토핑
                </template>

                <template #item.price="{ item }">
                  {{ Number(item.price).toLocaleString() }}원
                </template>
                <template #item.toppingIds="{ item }">
                  <v-chip
                    v-for="toppingId in item.toppingIds"
                    :key="toppingId"
                    class="ma-1"
                    small
                    color="teal lighten-3"
                  >
                    {{ getToppingName(toppingId) }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>

      <!-- 토핑 테이블 -->
      <v-card>
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
          <template #header.name>
            토핑이름
          </template>
          <template #header.price>
            가격
          </template>
          <template #header.sortOrder>
            순서
          </template>
          <template #item.price="{ item }">
            {{ Number(item.price).toLocaleString() }}원
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </v-container>
  </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { useCategoryManager } from '@/composables/useCategoryManager'

const route = useRoute()
const router = useRouter()
const companyId = route.params.companyId
const companyName = route.query.companyName || ''

const {
  categories,
  menusByCategory,
  categoryNames,
  fetchCategories,
  groupMenusByCategory,
} = useCategoryManager(companyId)

const allMenus = ref([])
const toppings = ref([])
//const menusByCategory = ref({})
//const categoryNames = ref([])

const menuHeaders = [
  { text: '메뉴 이름', value: 'name', width: 150},
  //{ text: '분류', value: 'category' },
  { text: '가격', value: 'price', width: 100, align: 'end'},
  { text: '설명', value: 'description', width: 200 },
  { text: '선택 가능한 토핑', value: 'toppingIds'},
]

const toppingHeaders = [
  { text: '토핑 이름', value: 'name', width: 150 },
  { text: '가격', value: 'price', align: 'end', width: 150 },
  { text: '순서', value: 'sortOrder' },
]

const getToppingName = (id) =>
  toppings.value.find((t) => t.id === id)?.name || '삭제됨'

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
    name: 'MenuManagement',
    params: { companyId },
    query: { companyName },
  })
}

onMounted(async () => {
  // 1. 카테고리 먼저 불러오기
  await fetchCategories()

  // 2. 메뉴 불러오기
  const menusSnap = await getDocs(collection(db, 'companies', companyId, 'menus'))
  allMenus.value = menusSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // 3. 토핑 불러오기
  const toppingsSnap = await getDocs(collection(db, 'companies', companyId, 'toppings'))
  toppings.value = toppingsSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => a.sortOrder - b.sortOrder)

  // 4. 메뉴 그룹화 및 카테고리 정렬
  groupMenusByCategory(allMenus.value)
})
</script>
