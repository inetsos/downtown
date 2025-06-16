<!-- src/views/Home.vue -->
<template>
  <v-container>
    <v-card-title>우리 동네 '예약 포털' 입니다.</v-card-title>

    <div class="my-3">
      <div class="ma-1 mb-1">업종 선택</div>
      <v-chip-group
        v-model="selectedCategory"
        column
        mandatory
      >
        <v-chip
          v-for="item in ['전체', ...categories]"
          :key="item"
          :value="item"
          class="ma-1"
          color="primary"
          variant="outlined"
          filter
        >
          {{ item }}
        </v-chip>
      </v-chip-group>
    </div>

    <v-row>
      <v-col
        v-for="company in filteredCompanies"
        :key="company.id"
        cols="12"
        md="4"
        sm="6"
      >
        <v-card class="pa-2 mb-2" style="height: 100%;">
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-storefront</v-icon>
            <div>
              <b 
                style="cursor: pointer;" 
                @click="goToDetail(company.id)"
              >
                {{ company.name }}
              </b>
              <span class="text-grey"> ({{ company.category }})</span>
            </div>
          </v-card-title>


          <v-card-text>
            <div class="mb-2">
              {{ company.description || '소개글 없음' }}
            </div>

            <div v-if="company.openTime && company.closeTime" class="mb-2 text-grey">
              영업시간: {{ company.openTime }} ~ {{ company.closeTime }}
              <v-chip
                :color="isOpenNow(company) ? 'green' : 'red'"
                size="x-small"
                class="ml-2"
              >
                {{ isOpenNow(company) ? '영업 중' : '영업 종료' }}
              </v-chip>
            </div>

            <div class="mb-1">
              <strong>주소:</strong> {{ company.address || '--' }}
              <v-btn
                size="small"
                class="ml-2"
                variant="text"
                color="blue"
                @click.stop="goToMap(company)"
              >
                지도 보기
              </v-btn>
            </div>

            <div class="mb-2">
              <strong>상세주소:</strong> {{ company.detailAddress || '--' }}
            </div>

            <div class="d-flex flex-wrap gap-2">

              <!-- 업종이 카페인 경우 -->
              <span v-if="company.category === '카페'">
                <v-btn
                  class="mr-2"
                  color="primary"
                  size="small"
                  @click.stop="handleOrder(company)"
                  :disabled="!isOpenNow(company)"
                  :style="{ pointerEvents: isOpenNow(company) ? 'auto' : 'none' }"
                >
                  온라인 주문
                </v-btn>

                <!-- 비로그인(비회원)인 경우 -->
                <v-btn
                  v-if = "!isLoggedIn"               
                  color="secondary"
                  size="small"
                  @click.stop="handleGuestOrder(company)"
                  :disabled="!isOpenNow(company)"
                  :style="{ pointerEvents: isOpenNow(company) ? 'auto' : 'none' }"
                >
                  비회원 주문
                </v-btn>
              </span>
              <span v-else>
                <!-- 그 외 업종은 '예약하기' -->
                <v-btn
                  color="primary"
                  size="small"
                  @click.stop="handleReservation(company)"
                  :disabled="!isOpenNow(company)"
                  :style="{ pointerEvents: isOpenNow(company) ? 'auto' : 'none' }"
                >
                  예약하기
                </v-btn>
              </span>     
            </div>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/companyStore'
import { useAuthStore } from '@/stores/authStore'

const companyStore = useCompanyStore()
const authStore = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => authStore.isLoggedIn)

const selectedCategory = ref('전체')
const categories = ['배달음식', '카페', '소매업', '서비스업', '교육', '병원', '기타']

onMounted(() => {
  companyStore.fetchAllCompanies()
})

const goToMap = (company) => {
  router.push({
    path: '/map',
    query: {
      address: company.address,
      name: company.name,
    },
  })
}

const goToDetail = (id) => {
  router.push(`/company/${id}`)
}

const goToReservation = (companyId) => { 
  router.push({
    path: '/reservation',
    query: {
      companyId,
      username: authStore.profile.name
    }
  })
}

const goToOrder = (companyId, companyName) => { 
  router.push({
    path: '/order',
    query: {
      companyId,
      companyName
    }
  })
}

const handleOrder = (company) => {
  if (!isOpenNow(company)) return;

  // 회원이 로그인 하지 않은 상태에서 온라인 주문을 클릭한 경우
  if (!isLoggedIn.value) {
    // 로그인 페이지로 이동하면서 리다이렉트 경로를 쿼리로 전달
    router.push({
      path: '/login',
      query: {
        redirect: '/order',
        companyId: company.id,
        companyName: company.name
      }
    });
    return;
  }

  goToOrder(company.id, company.name);
};

const handleGuestOrder = async (company) => {
  if (!isOpenNow(company)) return;

  // 익명 로그인한 후 온라인 주문으로 간다.
  // 익명 사용자 자동 로그인 처리
  if (!authStore.user) {
    try {
      await authStore.loginAnonymously()
    } catch (err) {
      console.error(err)
      alert('비회원 로그인 중 오류가 발생했습니다.')
      return
    }
  }
  
  goToOrder(company.id, company.name);
};


const handleReservation = (company) => {;
  if (!isOpenNow(company)) return;
  goToReservation(company.id);
};

// 카테고리 필터링된 목록
const filteredCompanies = computed(() => {
  let result = []

  if (selectedCategory.value === '전체' || !selectedCategory.value) {
    result = [...companyStore.companies]
  } else {
    result = companyStore.companies.filter(
      (c) => c.category === selectedCategory.value
    )
  }

  // 업종 이름(한글 기준)으로 정렬
  return result.sort((a, b) => a.category.localeCompare(b.category, 'ko'))
})


function isOpenNow(company) {
  if (!company.openTime || !company.closeTime) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMinute] = company.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = company.closeTime.split(':').map(Number);

  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  if (openMinutes < closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // 자정 넘기는 경우
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
}


</script>


