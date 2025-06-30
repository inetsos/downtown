<!-- src/views/Home.vue -->
<template>
  <v-container fluid>
    <div class="text-center">
      <strong>Vue3 + Firebase 사이드 프로젝트 웹 서비스<br/> 테스트용으로 실제 서비스는 되지 않습니다.</strong>
    </div>
    <br/>
    <div class="my-3 px-2">
      <div class="mb-1 text-subtitle-2 font-weight-medium">업종 선택</div>
      <v-chip-group
        v-model="selectedCategory"
        column
        mandatory
        class="d-flex flex-wrap"
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

    <v-row dense v-if="isLoading">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          type="card"
          class="mb-3"
          elevation="2"
        />
      </v-col>
    </v-row>

    <v-row dense v-else>
      <v-col
        v-for="company in filteredCompanies"
        :key="company.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="d-flex flex-column justify-space-between h-100 pa-3 mb-3">
          <div>
            <v-card-title class="d-flex align-center pa-0 mb-2">
              <v-icon color="primary" class="mr-2">mdi-storefront</v-icon>
              <div>
                <b @click="goToDetail(company.id)" style="cursor: pointer;">
                  {{ company.name }}
                </b>
                <span class="text-grey text-caption">({{ company.category }})</span>
              </div>
            </v-card-title>

            <v-card-text class="pa-0">
              <div class="mb-2 text-body-2">
                {{ company.description || '소개글 없음' }}
              </div>

              <div
                v-if="company.openTime && company.closeTime"
                class="mb-2 text-grey text-caption"
              >
                영업시간: {{ company.openTime }} ~ {{ company.closeTime }}
                <v-chip
                  :color="isOpenNow(company) ? 'green' : 'red'"
                  size="x-small"
                  class="ml-2"
                >
                  {{ isOpenNow(company) ? '영업 중' : '영업 종료' }}
                </v-chip>
              </div>

              <div class="mb-1 text-body-2">
                <strong>주소:</strong> {{ company.address || '--' }}
                <v-btn
                  size="x-small"
                  class="ml-1"
                  variant="text"
                  color="blue"
                  @click.stop="goToMap(company)"
                >
                  지도 보기
                </v-btn>
              </div>

              <div class="mb-2 text-body-2">
                <strong>상세주소:</strong> {{ company.detailAddress || '--' }}
              </div>
            </v-card-text>
          </div>

          <!-- 하단 버튼: 항상 아래에 고정 -->
          <div class="d-flex flex-column gap-2 mt-2">
            <v-btn
              v-if="company.category === '카페'"
              color="primary"
              size="small"
              @click.stop="handleOrder(company)"
              :disabled="!isOpenNow(company)"
            >
              온라인 주문
            </v-btn>

            <v-btn
              v-if="company.category === '카페' && !isLoggedIn"
              color="secondary"
              size="small"
              class="mt-2"
              @click.stop="handleGuestOrder(company)"
              :disabled="!isOpenNow(company)"
            >
              비회원 주문
            </v-btn>

            <v-btn
              v-if="company.category !== '카페'"
              color="primary"
              size="small"
              @click.stop="handleReservation(company)"
              :disabled="!isOpenNow(company)"
            >
              예약하기
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-fab-transition>
      <v-btn
        v-show="showScrollTop"
        color="primary"
        icon
        class="scroll-top-btn"
        @click="scrollToTop"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/companyStore'
import { useAuthStore } from '@/stores/authStore'

const companyStore = useCompanyStore()
const authStore = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => authStore.isLoggedIn)

const selectedCategory = ref('전체')
const categories = ['배달음식', '카페', '소매업', '서비스업', '교육', '병원', '기타']

const isLoading = computed(() => companyStore.isLoading)

const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

onMounted(() => {
  companyStore.fetchAllCompanies()
  window.addEventListener('scroll', handleScroll)
})

const goToMap = (company) => {
  router.push({
    path: '/map',
    query: {
      name: encodeURIComponent(company.name),
      address: encodeURIComponent(company.address),
      latitude: company.latitude,
      longitude: company.longitude,
    }
  })
}

const goToDetail = (id) => {
  router.push(`/company/${id}`)
}

const goToReservation = (companyId, companyName) => { 
  router.push({
    path: '/reservation',
    query: {
      companyId,
      companyName,
    }
  })
}

const handleReservation = (company) => {
  if (!isOpenNow(company)) return;

  // 회원이 로그인 하지 않은 상태에서 온라인 주문을 클릭한 경우
  if (!isLoggedIn.value) {
    // 로그인 페이지로 이동하면서 리다이렉트 경로를 쿼리로 전달
    router.push({
      path: '/login',
      query: {
        redirect: '/reservation',
        companyId: company.id,
        companyName: company.name
      }
    });
    return;
  }

  goToReservation(company.id, company.name);
};

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

<style scoped>
  .scroll-top-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
  }
</style>


