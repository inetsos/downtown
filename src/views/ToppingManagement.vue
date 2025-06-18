<template>
  <v-container>
    <!-- 토핑 등록/수정 카드 -->
    <v-card class="pa-4 max-w-600 mx-auto">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">
          {{ isEditMode ? '토핑 수정' : '토핑 등록' }}
        </span>
        <v-spacer />
        <v-btn variant="text" class="mt-4" color="primary" @click="goToMenu">
          메뉴
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
      <h3 class="text-subtitle-1 mb-2">토핑 목록</h3>

      <!-- 데스크탑용 테이블 -->
      <v-data-table
        v-show="!isMobile"
        :headers="headers"
        :items="toppings"
        item-value="id"
        disable-sort
        hide-default-footer
        class="elevation-1"
      >
        <v-list lines="one" density="compact">
          <draggable
            v-model="toppings"
            item-key="id"
            tag="div"
            @end="saveOrder"
            handle=".drag-handle"
          >
            <template #item="{ element, index }">
              <v-card-text
                class="d-flex align-center justify-space-between border rounded-lg mb-2 px-3 py-2"
                style="gap: 12px;"
              >
                <!-- 드래그 핸들 -->
                <v-btn
                  icon
                  variant="text"
                  class="drag-handle"
                  aria-label="순서 변경"
                >
                  <v-icon color="grey-darken-1" size="20">mdi-drag</v-icon>
                </v-btn>

                <!-- 이름 및 가격 -->
                <div class="flex-grow-1">
                  <div class="text-body-1 font-weight-medium">{{ element.name }}</div>
                  <div class="text-caption text-grey">
                    {{ new Intl.NumberFormat('ko-KR').format(element.price) }}원
                  </div>
                </div>

                <!-- 순서 -->
                <div class="text-caption text-grey">
                  #{{ index + 1 }}
                </div>

                <!-- 삭제 버튼 -->
                <v-btn
                  icon
                  variant="text"
                  color="error"
                  @click="deleteTopping(element.id)"
                  aria-label="삭제"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-text>
            </template>
          </draggable>
        </v-list>

      </v-data-table>

      <!-- 모바일용 카드 UI -->
      <div v-show="isMobile">
        <draggable v-model="toppings" item-key="id" @end="saveOrder" handle=".drag-handle">
          <template #item="{ element, index }">
            <v-card class="mb-3" elevation="1">
              <v-card-text class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <v-icon class="drag-handle mr-2" color="grey-darken-1" size="20" style="cursor: grab">mdi-drag</v-icon>
                  <div>
                    <div class="font-weight-medium">{{ element.name }}</div>
                    <div class="text-grey text-caption">{{ Number(element.price).toLocaleString() }}원 • {{ index + 1 }}번째</div>
                  </div>
                </div>
                <v-btn icon size="small" color="error" @click="deleteTopping(element.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </template>
        </draggable>
      </div>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { useToppingManagement } from '@/composables/useToppingManagement'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()
const isMobile = smAndDown

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

const headers = [
  { title: '', key: 'drag', sortable: false},
  { title: '토핑명', key: 'name' },
  { title: '가격', key: 'price', align: 'end' },
  { title: '순서', key: 'order', align: 'end' },
  { title: '', key: 'actions', sortable: false },
]

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

/* 드래그 핸들에 grab 커서 강제 적용 */
.drag-handle {
  cursor: grab;
}
</style>
