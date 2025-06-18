<!-- src/views/SalesAnalysis.vue -->
<template>
  <v-container>
    <!-- 운영 대시보드로 돌아가기 버튼 -->
    <div class="d-flex justify-end mt-4 mb-4 mr-2">
      <v-btn
        text
        color="primary"
        class="text-subtitle-2"
        @click="goToDashboard"
        elevation="0"
      >
        <v-icon left>mdi-arrow-left</v-icon>
          대시보드
      </v-btn>
    </div>

    <v-card-title class="headline font-weight-bold">매출 분석</v-card-title>

    <v-card-text>
      <!-- 날짜 & 조회 -->
      <v-row class="align-center mb-4">
        <v-col cols="12" md="3" class="py-1">
          <v-text-field
            v-model="baseDate"
            type="date"
            label="기준 날짜"
            dense
            hide-details
          />
        </v-col>
        <v-col cols="12" md="3" class="py-1">
          <v-btn
            color="primary"
            @click="loadSummaryByDate"
            class="mt-1 mt-md-0 btn-responsive"
          >
            조회
          </v-btn>

        </v-col>
      </v-row>

      <!-- 일 매출 -->
      <v-row v-if="salesSummary.day.count >= 0" class="mb-6">
        <v-col cols="12" md="6">
          <v-card outlined>
            <v-card-title class="headline">일 매출</v-card-title>
            <v-card-text>
              <p>총 매출: <strong>{{ salesSummary.day.total.toLocaleString() }}원</strong></p>
              <p>주문 수: <strong>{{ salesSummary.day.count }}건</strong></p>
              <p>평균 주문 금액: <strong>{{ Math.round(salesSummary.day.avg).toLocaleString() }}원</strong></p>
              <p>성장률 (전일 대비): 
                <strong v-if="salesSummary.day.growth !== null" :class="{'text-success': salesSummary.day.growth >= 0, 'text-error': salesSummary.day.growth < 0}">
                  {{ salesSummary.day.growth.toFixed(2) }}%
                </strong>
                <span v-else>N/A</span>
              </p>
              <div class="mt-4" style="width: 90%">
                <SalesLineChart :labels="dayLabels" :sales="daySales" label-text="일 매출" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 주 매출 -->
        <v-col cols="12" md="6" v-if="salesSummary.week.count >= 0">
          <v-card outlined>
            <v-card-title class="headline">주 매출</v-card-title>
            <v-card-text>
              <p>총 매출: <strong>{{ salesSummary.week.total.toLocaleString() }}원</strong></p>
              <p>주문 수: <strong>{{ salesSummary.week.count }}건</strong></p>
              <p>평균 주문 금액: <strong>{{ Math.round(salesSummary.week.avg).toLocaleString() }}원</strong></p>
              <p>성장률 (전주 대비): 
                <strong v-if="salesSummary.week.growth !== null" :class="{'text-success': salesSummary.week.growth >= 0, 'text-error': salesSummary.week.growth < 0}">
                  {{ salesSummary.week.growth.toFixed(2) }}%
                </strong>
                <span v-else>N/A</span>
              </p>
              <div class="mt-4" style="width: 90%">
                <SalesLineChart :labels="weekLabels" :sales="weekSales" label-text="주 매출"/>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 월 매출 -->
        <v-col cols="12" md="6" v-if="salesSummary.month.count >= 0">
          <v-card outlined>
            <v-card-title class="headline">월 매출</v-card-title>
            <v-card-text>
              <p>총 매출: <strong>{{ salesSummary.month.total.toLocaleString() }}원</strong></p>
              <p>주문 수: <strong>{{ salesSummary.month.count.toLocaleString() }}건</strong></p>
              <p>평균 주문 금액: <strong>{{ Math.round(salesSummary.month.avg).toLocaleString() }}원</strong></p>
              <p>성장률 (전월 대비): 
                <strong v-if="salesSummary.month.growth !== null" :class="{'text-success': salesSummary.month.growth >= 0, 'text-error': salesSummary.month.growth < 0}">
                  {{ salesSummary.month.growth.toFixed(2) }}%
                </strong>
                <span v-else>N/A</span>
              </p>
              <div class="mt-4" style="width: 90%">
                <SalesLineChart :labels="monthLabels" :sales="monthSales" label-text="월 매출"/>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 연 매출 -->
        <v-col cols="12" md="6" v-if="salesSummary.year.count >= 0">
          <v-card outlined>
            <v-card-title class="headline">연 매출</v-card-title>
            <v-card-text>
              <p>총 매출: <strong>{{ salesSummary.year.total.toLocaleString() }}원</strong></p>
              <p>주문 수: <strong>{{ salesSummary.year.count.toLocaleString() }}건</strong></p>
              <p>평균 주문 금액: <strong>{{ Math.round(salesSummary.year.avg).toLocaleString() }}원</strong></p>
              <p>성장률 (전년 대비): 
                <strong v-if="salesSummary.year.growth !== null" :class="{'text-success': salesSummary.year.growth >= 0, 'text-error': salesSummary.year.growth < 0}">
                  {{ salesSummary.year.growth.toFixed(2) }}%
                </strong>
                <span v-else>N/A</span>
              </p>
              <div class="mt-4" style="width: 90%">
                <SalesLineChart :labels="yearLabels" :sales="yearSales" label-text="년 매출" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSalesSummary } from '@/composables/useSalesSummary'
import SalesLineChart from '@/components/SalesLineChart.vue'

const router = useRouter()
const route = useRoute()

const companyId = route.query.companyId
const companyName = route.query.companyName

const {
  salesSummary,
  loadSummary,
  dayLabels, daySales,
  weekLabels, weekSales,
  monthLabels, monthSales,
  yearLabels, yearSales
} = useSalesSummary(companyId)

const baseDate = ref('')
//const baseDate = ref(new Date().toISOString().split('T')[0])

// 기본 날짜 없이도 초기 데이터를 로드할 수 있게 하려면 초기값 세팅 가능
baseDate.value = new Date().toISOString().split('T')[0]  // 오늘 날짜

const loadSummaryByDate = () => {
  if (!baseDate.value) {
    alert('기준 날짜를 선택해주세요.')
    return
  }

  loadSummary(baseDate.value)
}

watch(baseDate, (newDate) => {
  if (newDate) {
    loadSummary(newDate)
  }
})


const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId, companyName }
  })
}
</script>

<style scoped>
.text-success {
  color: #4caf50;
}
.text-error {
  color: #f44336;
}

.btn-responsive {
  width: 100%; /* 모바일용 - 꽉 차게 */
  height: 40px;
  font-size: 16px;
}

@media (min-width: 960px) {
  .btn-responsive {
    width: auto;  /* 데스크탑에서는 내용 크기만큼 */
    height: 30px !important;
    font-size: 14px !important;
  }
}

</style>