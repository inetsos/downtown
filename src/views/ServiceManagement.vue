<!-- src/views/ServiceManagement.vue -->
<template>
  <v-container>
    <v-card class="pa-4 max-w-600 mx-auto">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="text-h6">
          {{ isEditMode ? '서비스 수정' : companyName + ' - 서비스 등록' }}
        </div>
        <v-btn text @click="goToList">서비스 목록</v-btn>
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="onSubmit">
        <!-- v-chip-group으로 분류 선택 -->
        <div class="mb-4">
          <label class="mb-2" style="font-weight: 500;">분류</label>
          <v-chip-group
            v-model="form.category"
            mandatory
            active-class="primary--text"
            column
            :max="1"
          >
            <v-chip
              v-for="item in categories"
              :key="item"
              :value="item"
              outlined
              class="ma-1"
            >
              {{ item }}
            </v-chip>
          </v-chip-group>
        </div>

        <v-text-field
          v-model="form.name"
          label="서비스명"
          required
        />
        <v-textarea
          v-model="form.description"
          label="설명"
        />
        <v-text-field
          v-model="form.price"
          label="가격"
          type="number"
        />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
          >
            {{ isEditMode ? '수정 완료' : '등록' }}
          </v-btn>

          <v-btn
            v-if="isEditMode"
            color="error"
            @click="onDelete"
            :loading="loading"
          >
            삭제
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useServiceManagement } from '@/composables/useServiceManagement'

const route = useRoute()
const router = useRouter()

const companyId = route.params.companyId
const serviceId = route.params.serviceId || null
const companyName = route.query.companyName || ''

const {
  form,
  formRef,
  categories,
  submit,
  remove,
  loading,
  isEditMode,
} = useServiceManagement(companyId, serviceId)

const onSubmit = async () => {
  const success = await submit()
  if (success) {
    alert(isEditMode.value ? '서비스가 수정되었습니다.' : '서비스가 등록되었습니다.')
    goToList()
  } else {
    alert('오류가 발생했습니다.')
  }
}

const onDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  const success = await remove()
  if (success) {
    alert('서비스가 삭제되었습니다.')
    goToList()
  } else {
    alert('삭제 중 오류가 발생했습니다.')
  }
}

function goToList() {
  router.push({
    name: 'ServiceList', // 서비스 목록 페이지 라우트 이름 (확인 필요)
    params: { companyId },
    query: { companyName },
  })
}
</script>

