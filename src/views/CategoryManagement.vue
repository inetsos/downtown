<!-- src/views/CategoryManagement -->
<template>
  <v-container>
    <v-card class="pa-4 mx-auto" style="max-width: 600px;">
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ companyName }} - 카테고리 관리 (드래그로 순서 변경)</span>
        <v-spacer />
        <v-btn variant="text" class="mt-4" color="primary" @click="goToMenu">
          메뉴로 가기
        </v-btn>        
      </v-card-title>

      <v-form @submit.prevent="addCategory">
        <v-row class="align-center">
          <v-col cols="12" md="6">
            <v-text-field v-model="newCategoryName" label="카테고리 이름" />
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-end">
            <v-btn color="primary" type="submit" class="mt-2 mt-md-0">
              등록
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-divider class="my-4" />

      <!-- v-table with draggable rows -->
      <v-table>
        <thead>
          <tr>
            <th style="width: 40px;"></th>
            <th>카테고리명</th>
            <th class="text-end" style="width: 80px;">순서</th>
            <th style="width: 40px;"></th>
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
              <td>
                <v-icon class="drag-handle" color="grey darken-1" size="20" style="cursor: grab;">
                  mdi-drag
                </v-icon>
              </td>
              <td>{{ element.name }}</td>
              <td class="text-end">{{ element.sortOrder }}</td>
              <td>
                <v-icon
                  color="error"
                  class="cursor-pointer"
                  @click="confirmDelete(element.id)"
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
</style>
