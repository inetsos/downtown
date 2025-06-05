<!-- src/views/MyCompanies.vue-->
<template>
  <v-container> 
    <v-card class="pa-4 mx-auto" max-width="1200"> 
      <v-card-title class="pa-0 mb-4">내 업체 목록</v-card-title>

      <v-row dense>
        <v-col
          v-for="company in companyStore.companies"
          :key="company.id"
          cols="12"
          sm="6"
        >
          <v-card class="pa-3 h-100" outlined>
            <v-card-title class="font-weight-bold pa-0">
              {{ company.name }}
            </v-card-title>

            <v-card-subtitle class="pa-0 pt-1">
              <strong>업종:</strong> {{ company.category }}
            </v-card-subtitle>

            <v-card-subtitle class="pa-0 pt-1">
              <strong>영업시간:</strong>
              {{ company?.openTime || '--' }} ~ {{ company?.closeTime || '--' }}
            </v-card-subtitle>

            <v-card-subtitle class="pa-0 pt-1">
              <strong>주소:</strong> {{ company.address || '--' }}
            </v-card-subtitle>

            <v-card-subtitle class="pa-0 pt-1">
              <strong>상세주소:</strong> {{ company.detailAddress || '--' }}
            </v-card-subtitle>

            <v-card-text class="pa-0 pt-2 multiline-subtitle">
              <strong>소개:</strong> {{ company.description || '없음' }}
            </v-card-text>

            <v-card-actions class="pa-0 pt-3">
              <v-btn
                size="small"
                color="primary"
                @click="goToEdit(company.id)"
              >
                수정
              </v-btn>
              <v-spacer />
              <v-btn
                v-if="company.category === '서비스업'"
                size="small"
                color="secondary"
                class="mt-1"
                @click="goToRegisterService(company.id, company.name)"
              >
                서비스(메뉴) 관리
              </v-btn>
              <v-btn
                size="small"
                color="secondary"
                class="mt-1"
                @click="goToReservationManagement(company.id, company.name)"
              >
                예약 관리
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/companyStore'

const companyStore = useCompanyStore()
const router = useRouter()

const goToEdit = (id) => {
  router.push(`/edit-company/${id}`)
}

const goToRegisterService = (id, name) => {
  router.push({
    name: 'ServiceList',
    params: { companyId: id },
    query: { companyName: name }
  })
}

const goToReservationManagement = (companyId, companyName) => {
  router.push({
    path: `/company-reservations/${companyId}`,
    query: {
      companyName: companyName,
    },
  })
}

onMounted(() => {
  companyStore.fetchMyCompanies()
})
</script>

<style scoped>
.multiline-subtitle {
  white-space: pre-line;
}
</style>
