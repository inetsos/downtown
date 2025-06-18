<template>
  <v-container class="pa-2" fluid>
    <v-card class="mx-auto" max-width="600" style="width: 100%;">
      <v-card-title class="d-flex flex-wrap justify-space-between align-center gap-2">
        <span class="text-h6">{{ companyName }} - 카테고리 관리</span>
        <v-btn variant="text" color="primary" @click="goToMenu">
          메뉴
        </v-btn>
      </v-card-title>

      <v-form @submit.prevent="addCategory" class="mb-4">
        <v-row class="align-center" dense>
          <v-col cols="12" md="7">
            <v-text-field
              v-model="newCategoryName"
              label="카테고리 이름"
              dense
              outlined
              clearable
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="2" class="d-flex justify-end">
            <v-btn
              color="primary"
              type="submit"
              class="mt-2 mt-md-0"
              block
              md-block="false"
            >
              등록
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-divider />

      <div class="table-wrapper">
        <v-table dense>
          <thead>
            <tr>
              <th style="width: 40px; padding: 8px;"> </th>
              <th style="padding: 8px;">카테고리명</th>
              <th class="text-end" style="width: 80px; padding: 8px;">순서</th>
              <th style="width: 40px; padding: 8px;"> </th>
            </tr>
          </thead>

          <draggable
            tag="tbody"
            v-model="categories"
            item-key="id"
            handle=".drag-handle"
            @end="saveOrder"
          >
            <template #item="{ element }">
              <tr>
                <td style="padding: 8px;">
                  <v-icon
                    class="drag-handle"
                    color="grey darken-1"
                    size="24"
                    style="cursor: grab;"
                  >
                    mdi-drag
                  </v-icon>
                </td>
                <td style="padding: 8px;">{{ element.name }}</td>
                <td class="text-end" style="padding: 8px;">{{ element.sortOrder }}</td>
                <td style="padding: 8px;">
                  <v-icon
                    color="error"
                    class="cursor-pointer"
                    size="24"
                    @click="confirmDelete(element.id)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </template>
          </draggable>
        </v-table>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryManager } from '@/composables/useCategoryManager'
import draggable from 'vuedraggable'

const router = useRouter()
const route = useRoute()

const companyId = route.params.companyId
const companyName = route.query.companyName || ''

const {
  categories,
  newCategoryName,
  fetchCategories,
  addCategory,
  deleteCategory,
  saveOrder,
} = useCategoryManager(companyId)

const goToMenu = () => {
  router.push({ name: 'MenuList', params: { companyId }, query: { companyName } })
}

onMounted(fetchCategories)

function confirmDelete(id) {
  if (window.confirm('정말 삭제하시겠습니까?')) {
    deleteCategory(id)
  }
}
</script>

<style scoped>
.drag-handle {
  cursor: grab;
}

/* 모바일에서 테이블 가로 스크롤 가능하게 */
.table-wrapper {
  overflow-x: auto;
}

/* 테이블 글자 크기 및 패딩 조절 */
.v-table th,
.v-table td {
  font-size: 14px;
  padding: 8px 12px;
  white-space: nowrap;
}

/* 아이콘 터치 영역 키우기 */
.v-icon.cursor-pointer {
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}
.v-icon.cursor-pointer:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

/* 폼 내부 버튼 블록 스타일: 모바일에서 넓게, 데스크탑은 자동 */
@media (max-width: 960px) {
  .v-btn[type='submit'] {
    width: 100% !important;
  }
}
</style>
