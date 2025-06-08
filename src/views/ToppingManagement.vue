<!-- src/views/ToppingManagement -->
<template>
  <v-container>
    <!-- 토핑 등록/수정 카드 -->
    <v-card class="pa-4 max-w-600 mx-auto">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">
          {{ isEditMode ? '토핑 수정' : '토핑 등록' }}
        </span>
        <v-spacer />
        <!-- 메뉴로 이동 버튼 -->
        <v-btn variant="text" class="mt-4" color="primary" @click="goToMenu">
          메뉴로 가기
        </v-btn>
      </v-card-title>

      <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-text-field v-model="form.name" label="토핑명" required />
        <v-text-field
          v-model="form.price"
          label="가격"
          type="number"
          min="0"
          required
        />

        <v-card-actions>
          <v-spacer />
          <v-btn type="submit" :loading="loading" color="primary">
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

    <!-- 드래그 가능한 토핑 리스트 -->
    <v-card class="pa-4 max-w-600 mx-auto mt-6">
      <v-table>
        <thead>
          <tr>
            <th style="width: 40px;"></th>
            <th>토핑명</th>
            <th class="text-end">가격</th>
            <th class="text-end">순서</th>
            <th style="width: 40px;"></th>            
          </tr>
        </thead>
        <draggable
          tag="tbody"
          v-model="toppings"
          item-key="id"
          @end="saveOrder"
          handle=".drag-handle"
        >
          <template #item="{ element }">
            <tr>
              <td>
                <v-icon class="drag-handle" color="grey darken-1" size="20" style="cursor: grab;">
                  mdi-drag
                </v-icon>
              </td>
              <td>{{ element.name }}</td>
              <td class="text-end">{{ Number(element.price).toLocaleString() }}원</td>
              <td class="text-end">{{ element.sortOrder }}</td>
              <td>
                <v-icon
                  color="error"
                  class="cursor-pointer"
                  @click="deleteTopping(element.id)"
                >
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
        </draggable>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { useToppingManagement } from '@/composables/useToppingManagement'

const route = useRoute()
const router = useRouter()

const companyId = route.params.companyId
const toppingId = route.params.toppingId || null
const companyName = route.query.companyName || ''

const {
  form,
  formRef,
  isEditMode,
  loading,
  submit,
  remove,
  loadTopping,
  fetchAllToppings,
  updateToppingOrder,
} = useToppingManagement(companyId, toppingId)

const toppings = ref([])
const savingOrder = ref(false)

const onSubmit = async () => {
  const success = await submit()
  if (success) {
    alert(isEditMode.value ? '토핑이 수정되었습니다.' : '토핑이 등록되었습니다.')
    if (!isEditMode.value) {
      form.name = ''
      form.price = 0
      loadToppingsList()
    }
  } else {
    alert('오류가 발생했습니다.')
  }
}

const onDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  const success = await remove(toppingId)
  if (success) {
    alert('삭제 완료')
    goToMenu()
  } else {
    alert('삭제 중 오류 발생')
  }
}

const deleteTopping = async (id) => {
  if (!confirm('이 토핑을 삭제하시겠습니까?')) return
  const success = await remove(id)
  if (success) {
    alert('삭제되었습니다.')
    loadToppingsList()
  } else {
    alert('삭제 실패')
  }
}

const loadToppingsList = async () => {
  toppings.value = await fetchAllToppings() 
}

const saveOrder = async () => {
  savingOrder.value = true
  const success = await updateToppingOrder(toppings.value)
  savingOrder.value = false
  if (success) {
    loadToppingsList() 
  } else {
    alert('순서 저장 실패')
  }
}

const goToMenu = () => {
  router.push({ name: 'MenuList', params: { companyId }, query: { companyName } })
}

onMounted(() => {
  if (isEditMode.value) {
    loadTopping()
  }
  loadToppingsList()
})
</script>

<style scoped>
.max-w-600 {
  max-width: 600px;
}

.no-bg-btn {
  background: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin-left: 0 !important;
}
/* 드래그 핸들에 grab 커서 강제 적용 */
.drag-handle {
  cursor: grab;
}
</style>
