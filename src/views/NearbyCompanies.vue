<!-- src/views/NearbyCompanies.vue -->
<template>
  <v-container class="py-4">
    <!-- ✅ 상단 프로그레스 바 -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      height="4"
      absolute
      top
    />

    <v-card class="mt-6">
      <v-card-title class="d-flex align-center">
        📍 가까운 매장
        <v-spacer />
        <v-btn color="primary" :loading="loading" @click="getNearbyCompanies">갱신</v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-alert v-if="loading" type="info">위치 기반으로 상점을 불러오는 중입니다...</v-alert>

        <v-alert v-if="!loading && nearCompanies.length === 0" type="warning">
          가까운 상점이 없습니다.
        </v-alert>

        <v-list v-if="!loading && nearCompanies.length > 0" lines="two" class="mt-2">
          <v-list-item
            v-for="(c, idx) in nearCompanies"
            :key="c.id"
            class="mb-2"
          >
            <v-list-item-title class="font-weight-medium">
              {{ idx + 1 }}. {{ c.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              거리:
              <span v-if="typeof c.distance === 'number'">
                {{ c.distance < 1 ? (c.distance * 1000).toFixed(0) + ' m' : c.distance.toFixed(2) + ' km' }}
              </span>
              <span v-else>??</span>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCompanyStore } from '@/stores/companyStore'

const companyStore = useCompanyStore()
const { nearCompanies, isLoading } = storeToRefs(companyStore)
const { fetchNearbyCompanies } = companyStore

const loading = isLoading

const getNearbyCompanies = () => {
  if (!navigator.geolocation) {
    alert('브라우저가 위치 정보를 지원하지 않습니다.')
    return
  }

  loading.value = true

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        await fetchNearbyCompanies(lat, lng)
      } catch (e) {
        console.error('상점 불러오기 실패:', e)
      } finally {
        loading.value = false
      }
    },
    (err) => {
      alert('위치 정보를 가져오지 못했습니다.')
      console.error(err)
      loading.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    }
  )
}

onMounted(() => {
  getNearbyCompanies()
})
</script>
