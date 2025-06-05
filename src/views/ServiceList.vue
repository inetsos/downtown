<!-- src/views/ServiceList.vue -->
<template>
  <v-container>
    <v-icon
      @click="goBack"
      style="cursor: pointer;"
      aria-label="뒤로가기"
    >
      mdi-arrow-left
    </v-icon>

    <v-card class="pa-4 max-w-800 mx-auto">
      <v-card-title>
        {{ companyName }} - 서비스 목록
        <v-spacer />
        <v-btn
          v-if="isAdmin"
          color="primary"
          class="mt-2"
          @click="goToAddService"
        >
          + 서비스 등록
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="services"
        :loading="loadingServices"
        class="elevation-1"
        @click:row="(event, item) => goToEditService(item)"
        item-key="id"
      >
        <template #item.price="{ item }">
          {{ formatPrice(item.price) }}
        </template>

        <template #no-data>
          등록된 서비스가 없습니다.
        </template>

        <template #loading>
          로딩 중...
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useServiceManagement } from '@/composables/useServiceManagement'
import { useCompanyStore } from '@/stores/companyStore'
import { ref, onMounted } from 'vue'

const companyStore = useCompanyStore()
const isAdmin = ref(false)

onMounted(async () => {
  isAdmin.value = await companyStore.checkAdmin(companyId)
})

const route = useRoute()
const router = useRouter()

const companyId = route.params.companyId
const companyName = route.query.companyName || '회사'

// Vuetify 3 에 맞게 헤더는 title, key로 설정
const headers = [
  { title: '분류', key: 'category' },
  { title: '서비스명', key: 'name' },
  { title: '설명', key: 'description' },
  { title: '가격', key: 'price' },
]

const { services, loadingServices } = useServiceManagement(companyId)

function formatPrice(price) {
  if (price == null || price === '') return '가격 미정'

  const num = Number(price)
  if (isNaN(num)) return '가격 미정'

  return num.toLocaleString() + ' 원'
}

function goToAddService() {
  router.push({
    name: 'ServiceManagement',
    params: { companyId },
    query: { companyName },
  })
}

function goToEditService({item}) {
  router.push({
    name: 'ServiceManagement',
    params: { companyId, serviceId: item.id },
    query: { companyName },
  })
}

function goBack() {
  router.back()
}
</script>

<style scoped>
/* 클릭 가능한 행에 커서 표시 */
.v-data-table tbody tr {
  cursor: pointer;
}
</style>
