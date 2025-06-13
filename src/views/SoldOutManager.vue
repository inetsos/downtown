<!-- src/views/SoldOutManager.vue -->
<template>
  <v-container>
    <!-- 카테고리 탭 -->
    <div class="d-flex flex-wrap mb-4" style="gap: 12px;">
      <v-chip
        v-for="category in menus"
        :key="category.categoryId"
        color="primary"
        class="text-white cursor-pointer"
        @click="scrollToCategory(category.categoryId)"
      >
        {{ category.categoryName }}
      </v-chip>
    </div>

    <!-- 메뉴 카드 목록 -->
    <v-card>
      <v-card-title class="text-h6">메뉴 품절 상태 관리</v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col
            v-for="category in menus"
            :key="category.categoryId"
            cols="12"
          >
            <!-- 카테고리 구역 (스크롤 타겟) -->
            <div :ref="el => categoryRefs[category.categoryId] = el" />
            <div class="text-h6 mb-2">{{ category.categoryName }}</div>

            <v-row>
              <v-col
                v-for="menu in category.menus"
                :key="menu.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card class="pa-2 d-flex flex-column align-center text-center">
                  <v-img :src="menu.imageUrl" width="160" height="160" class="mb-2" cover />
                  <div class="text-subtitle-1 font-weight-bold">{{ menu.name }}</div>
                  <div class="text-body-2 mb-2">가격: {{ menu.price.toLocaleString() }}원</div>

                  <v-switch
                    v-model="menu.isSoldOut"
                    label="품절 상태"
                    color="red"
                    inset
                    @change="() => updateMenu(menu.id, menu)"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 맨 위로 버튼 (스크롤 시에만 보임) -->
    <v-btn
      v-if="showScrollTop"
      icon
      color="primary"
      class="position-fixed"
      style="bottom: 24px; right: 24px; z-index: 10"
      @click="scrollToTop"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>

  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenus } from '@/composables/useMenus'

const route = useRoute()
const companyId = route.query.companyId
const { menus, fetchMenus, updateMenu } = useMenus(companyId)

// 카테고리 DOM 참조 저장용
const categoryRefs = ref({})
const showScrollTop = ref(false)

// 특정 카테고리로 스크롤 이동
const scrollToCategory = (categoryId) => {
  const el = categoryRefs.value[categoryId]
  if (el?.scrollIntoView) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 맨 위로 이동
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 스크롤 감지하여 버튼 표시 토글
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 100
}

onMounted(() => {
  fetchMenus()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
