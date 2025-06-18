<template>
  <v-container>
    <v-card class="pa-4 mx-auto" style="max-width: 600px;">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-subtitle-1 font-weight-medium">
          {{ companyName }} - 옵션 관리
        </span>
        <v-btn variant="text" class="mt-2" color="primary" @click="goToMenu">
          메뉴
        </v-btn>
      </v-card-title>

      <v-form @submit.prevent="addOption">
        <v-row class="align-center">
          <v-col cols="12" md="6">
            <v-text-field v-model="newOptionName" label="옵션 이름 (예: Ice, Hot)" />
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-start">
            <!-- 등록 버튼 -->
            <v-btn
              color="primary"
              type="submit"
              class="mt-md-0"
              :block="isMobile"
            >
              등록
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-divider class="my-4" />

      <!-- 데스크탑용 테이블 -->
      <v-table v-show="!isMobile">
        <thead>
          <tr>
            <th style="width: 40px;"></th>
            <th>옵션명</th>
            <th class="text-end" style="width: 80px;">순서</th>
            <th style="width: 40px;"></th>
          </tr>
        </thead>
        <draggable
          tag="tbody"
          v-model="options"
          item-key="id"
          handle=".drag-handle"
          @end="saveOrder"
        >
          <template #item="{ element }">
            <tr>
              <td><v-icon class="drag-handle" color="grey" size="20">mdi-drag</v-icon></td>
              <td>{{ element.name }}</td>
              <td class="text-end">{{ element.sortOrder }}</td>
              <td>
                <v-icon color="error" class="cursor-pointer" @click="confirmDelete(element.id)">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
        </draggable>
      </v-table>

      <!-- 모바일용 리스트 -->
      <v-list v-show="isMobile" density="compact">
        <draggable
          tag="div"
          v-model="options"
          item-key="id"
          handle=".drag-handle"
          @end="saveOrder"
        >
          <template #item="{ element }">
            <v-list-item class="mb-2 rounded border" style="border-color: #eee;">
              <template #prepend>
                <v-icon class="drag-handle" color="grey" size="20">mdi-drag</v-icon>
              </template>
              <v-list-item-title class="text-body-1">{{ element.name }}</v-list-item-title>
              <template #append>
                <v-btn icon color="error" @click="confirmDelete(element.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <v-list-item-subtitle>순서: {{ element.sortOrder }}</v-list-item-subtitle>
            </v-list-item>
          </template>
        </draggable>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import { useDisplay } from 'vuetify'
import { useIceHotManager } from '@/composables/useIceHotManager'

const route = useRoute()
const router = useRouter()
const companyId = route.params.companyId
const companyName = route.query.companyName || ''

const {
  options,
  newOptionName,
  fetchOptions,
  addOption,
  deleteOption,
  saveOrder,
} = useIceHotManager(companyId)

const goToMenu = () => {
  router.push({ name: 'MenuList', params: { companyId }, query: { companyName } })
}

onMounted(fetchOptions)

function confirmDelete(id) {
  if (window.confirm('정말 삭제하시겠습니까?')) {
    deleteOption(id)
  }
}

// 반응형 디스플레이 감지
const { mdAndDown } = useDisplay()
const isMobile = computed(() => mdAndDown.value)
</script>

<style scoped>
.drag-handle {
  cursor: grab;
}
</style>
