<!-- src/views/AdminLogs.vue -->
<template>
  <v-container>
    <v-card>
      <!-- 운영 대시보드로 돌아가기 버튼 -->
      <div class="text-end mb-4 mr-2">
        <span
          class="text-primary text-subtitle-2 cursor-pointer"
          @click="goToDashboard"
        >
          운영 대시보드
        </span>
      </div>

      <v-card-title class="text-h6">📋 {{ companyName }} 시스템 로그</v-card-title>

      <v-card-text>
        <!-- 날짜 선택 -->
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="startDate"
              label="시작일"
              type="date"
              density="compact"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="endDate"
              label="종료일"
              type="date"
              density="compact"
            />
          </v-col>
        </v-row>

        <!-- 검색 조건 및 버튼 -->
        <v-row dense class="mt-1">
          <v-col cols="12" md="3">
            <v-select
              v-model="level"
              label="레벨"
              :items="['info', 'warn', 'error']"
              clearable
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="keyword"
              label="메시지 포함"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              v-model="userId"
              label="사용자 ID"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="3" class="d-flex align-end">
            <v-btn
              class="mb-6"
              color="primary"
              @click="loadLogs"
              prepend-icon="mdi-magnify"
            >
              조회
            </v-btn>
            <v-btn
              color="success"
              class="ml-2 mb-6"
              @click="exportToExcel"
              prepend-icon="mdi-download"
            >
              엑셀
            </v-btn>
          </v-col>
        </v-row>

        <!-- 로딩 및 에러 상태 -->
        <v-alert v-if="loading" type="info" class="mt-4">로그 불러오는 중...</v-alert>
        <v-alert v-if="error" type="error" class="mt-2">{{ error }}</v-alert>

        <!-- 로그 테이블 -->
        <v-table v-if="filteredLogs.length" class="mt-4">
          <thead>
            <tr>
              <th>시간</th>
              <th>레벨</th>
              <th>매장</th>
              <th>메시지</th>
              <th>사용자</th>
              <th>추가 정보</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in filteredLogs" :key="index">
              <td>{{ formatDate(log.createdAt) }}</td>
              <td>{{ log.level }}</td>
              <td>{{ log.data?.companyName }}</td>
              <td>{{ log.message }}</td>
              <td>{{ log.data?.userId }}</td>
              <td>
                <v-tooltip text="자세히 보기">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon
                      size="small"
                      @click="viewLog(log)"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- 상세 로그 다이얼로그 -->
        <v-dialog v-model="dialog" max-width="700">
          <v-card>
            <v-card-title class="text-h6">🔍 상세 로그</v-card-title>
            <v-card-text>
              <json-pretty :data="selectedLog" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" text @click="dialog = false">닫기</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'

import JsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companyId = route.query.companyId ?? ''
const companyName = route.query.companyName || ''

const logs = ref([])
const loading = ref(false)
const error = ref(null)

const dialog = ref(false)
const selectedLog = ref({})

// 검색 조건
const startDate = ref('')
const endDate = ref('')
const level = ref('')
const keyword = ref('')
const userId = ref('')

const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId, companyName }
  })
}

// 날짜 포맷 함수
const formatDate = (ts) => {
  if (!ts) return ''
  const date = ts.toDate?.() || new Date(ts)
  return date.toLocaleString()
}

// 로그 상세 보기
const viewLog = (log) => {
  selectedLog.value = log
  dialog.value = true
}

// 로그 불러오기
const loadLogs = async () => {
  loading.value = true
  error.value = null

  try {
    const logsRef = collection(db, 'logs')
    const conditions = []

    if (startDate.value) {
      const from = new Date(startDate.value)
      from.setHours(0, 0, 0, 0)
      conditions.push(where('createdAt', '>=', Timestamp.fromDate(from)))
    }

    if (endDate.value) {
      const to = new Date(endDate.value)
      to.setHours(23, 59, 59, 999)
      conditions.push(where('createdAt', '<=', Timestamp.fromDate(to)))
    }

    const q = query(logsRef, ...conditions, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    logs.value = snapshot.docs
      .map(doc => doc.data())
      .filter(log => {
        const company = log.data?.companyName || ''
        return company === '' || company === companyName
      })
  } catch (e) {
    error.value = '로그를 불러오는 중 오류가 발생했습니다.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 클라이언트에서 추가 필터링
const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchLevel = level.value ? log.level === level.value : true
    const matchKeyword = keyword.value
      ? log.message?.toLowerCase().includes(keyword.value.toLowerCase())
      : true
    const matchUser = userId.value
      ? log.data?.userId?.toLowerCase().includes(userId.value.toLowerCase())
      : true
    return matchLevel && matchKeyword && matchUser
  })
})

// 엑셀로 내보내기
const exportToExcel = async () => {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Logs')

  sheet.columns = [
    { header: '시간', key: 'createdAt', width: 20 },
    { header: '레벨', key: 'level', width: 10 },
    { header: '매장', key: 'companyName', width: 20 },
    { header: '메시지', key: 'message', width: 50 },
    { header: '사용자', key: 'userId', width: 20 },
    { header: '추가 정보', key: 'extra', width: 50 }
  ]

  filteredLogs.value.forEach(log => {
    sheet.addRow({
      createdAt: formatDate(log.createdAt),
      level: log.level,
      company: log.data?.companyName || '',
      message: log.message,
      userId: log.data?.userId || '',
      extra: JSON.stringify(log.data || {}, null, 2)
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), 'logs.xlsx')
}

onMounted(() => {
  const today = new Date()
  const yesterday = new Date()  
  const weekAgo = new Date()
  
  weekAgo.setDate(today.getDate() - 7)
  yesterday.setDate(today.getDate() - 1)

  //startDate.value = weekAgo.toISOString().split('T')[0]
  startDate.value = yesterday.toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]

  loadLogs()
})
</script>
