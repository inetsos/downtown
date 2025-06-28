<!-- src/views/MyCoupons.vue -->
<template>
  <v-container class="py-6">
    <v-card>
      <v-card-title class="text-h6">🎟️ 보유 쿠폰</v-card-title>
      <v-divider />

      <v-card-text>
        <v-alert type="info" v-if="loading">쿠폰을 불러오는 중입니다...</v-alert>
        <v-alert type="info" v-else-if="coupons.length === 0">발급된 쿠폰이 없습니다.</v-alert>

        <!-- ✅ 회사명 기준으로 그룹화 렌더링 -->
        <div v-else>
          <div v-for="(group, companyName) in groupedCoupons" :key="companyName" class="mb-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">{{ companyName }}</h4>
            <v-list density="compact">
              <v-list-item v-for="coupon in group" :key="coupon.id">
                <v-list-item-title class="font-weight-bold">
                  <v-icon color="primary" size="small">mdi-ticket-percent</v-icon>
                  {{ coupon.value.toLocaleString() }}원 할인 쿠폰
                </v-list-item-title>

                <v-list-item-subtitle>
                  발급일: {{ formatDate(coupon.issuedAt) }}
                  <template v-if="coupon.used && coupon.usedAt">
                    ・ 사용일: {{ formatDate(coupon.usedAt) }}
                  </template>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  상태: 
                  <span :class="coupon.used ? 'text-grey' : 'text-success'">
                    <strong>{{ coupon.used ? '사용 완료' : '사용 가능' }}</strong>
                  </span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useCoupons } from '@/composables/useCoupons'

const authStore = useAuthStore()
const coupons = ref([])
const loading = ref(true)

const { fetchAllCoupons } = useCoupons()

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  if (timestamp.toDate) return timestamp.toDate().toLocaleDateString()
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString()
  return new Date(timestamp).toLocaleDateString()
}

// ✅ 회사명 기준으로 그룹화된 쿠폰 목록 계산
const groupedCoupons = computed(() => {
  const groups = {}
  for (const coupon of coupons.value) {
    const name = coupon.companyName || '알 수 없는 상점'
    if (!groups[name]) groups[name] = []
    groups[name].push(coupon)
  }
  return groups
})

onMounted(async () => {
  try {
    if (authStore.user?.uid) {
      coupons.value = await fetchAllCoupons(authStore.user.uid)
    }
  } catch (err) {
    console.error('쿠폰 불러오기 실패:', err)
  } finally {
    loading.value = false
  }
})
</script>

