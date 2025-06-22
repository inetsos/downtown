<!-- sr/views/MenuManager.vue -->
<template>
  <v-container>
    <v-card class="pa-4 mx-auto" style="max-width: 700px;">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6">
          {{ companyName }} - 메뉴 등록
        </span>
        <v-spacer />
        <!-- 메뉴로 이동 버튼 -->
        <v-btn variant="text" class="mt-4" color="primary" @click="goToMenu">
          메뉴
        </v-btn>
      </v-card-title>

      <v-form @submit.prevent="onSubmit" ref="formRef">
        <!-- 카테고리 선택 -->
        <v-select
          v-model="form.categoryId"
          :items="categories"
          item-title="name"
          item-value="id"
          label="카테고리 선택"
          required
        />

        <v-text-field v-model="form.name" label="메뉴 이름" required />
        <v-textarea v-model="form.description" rows="3" label="설명" />
        <v-text-field
          v-model.number="form.price"
          label="가격"
          type="number"
          min="0"
          required
        />

        <!-- 토핑 선택 (다중) -->
        <v-select
          ref="toppingSelectRef"
          v-model="form.toppingIds"
          :items="toppings"
          item-title="name"
          item-value="id"
          label="선택 가능한 토핑"
          multiple
          chips
        >
          <!-- 닫기 버튼 추가 -->
          <template #append-item>
            <v-divider class="mt-2" />
            <div class="d-flex justify-end pr-4 pb-2">
              <v-btn
                variant="text"
                size="small"
                class="d-flex align-center"
                @click="closeToppingMenu"
              >
                <v-icon icon="mdi-close" class="mr-1 mt-1" />
                닫기
              </v-btn>
            </div>
          </template>

        </v-select>

        <!-- 옵션 선택 (다중) -->
        <v-select
          v-model="form.optionIds"
          :items="options"
          item-title="name"
          item-value="id"
          label="선택 가능한 옵션"
          multiple
          chips
          ref="optionSelectRef"
        >
          <template #append-item>
            <v-divider class="mt-2" />
            <div class="d-flex justify-end pr-4 pb-2">
              <v-btn
                variant="text"
                size="small"
                class="d-flex align-center"
                @click="closeOptionMenu"
              >
                <v-icon icon="mdi-close" class="mr-1 mt-1" />
                닫기
              </v-btn>
            </div>
          </template>
        </v-select>


        <!-- 이미지 업로드 -->
        <v-file-input
          v-model="imageFile"
          label="메뉴 이미지 선택"
          accept="image/*"
          show-size
          clearable
        />

        <v-card-actions>
          <v-spacer />
          <v-btn type="submit" color="primary" :loading="loading">
            {{ isEditMode ? '수정' : '등록' }}
          </v-btn>

        </v-card-actions>
      </v-form>
    </v-card>

    <!-- 등록된 메뉴 리스트 -->
    <v-card class="pa-4 mx-auto mt-4" style="max-width: 700px;">
      <v-list lines="two" density="comfortable">
        <template v-for="(menuList, category) in groupedMenus" :key="category">
          <v-list-subheader class="text-h6 font-weight-bold">{{ category }}</v-list-subheader>

            <!-- 드래그 가능한 리스트 -->           
            <draggable
              v-model="groupedMenus[category]"
              item-key="id"
              :group="{ name: 'menus' }"
              handle=".drag-handle"
              @end="() => onSort(category)"
            >
              <template #item="{ element: menu, index }">
                <div>
                  <v-list-item :data-id="menu.id" class="d-flex flex-column align-center text-center pa-4">
                    <v-avatar size="160" rounded class="mb-3">
                      <v-img :src="menu.imageUrl" />
                    </v-avatar>                    

                    <div class="font-weight-bold mb-1">
                      {{ menu.name }}                      
                      <v-btn icon size="x-small" class="mb-1" variant="plain" @click="openInfo(menu)">
                        <v-icon icon="mdi-help-circle" />
                      </v-btn>
                      <v-icon class="drag-handle mb-1" icon="mdi-drag" size="24" />
                    </div>
                    <div v-if="menu.description" class="text-grey-darken-1 mb-1">
                      {{ menu.description }}
                    </div>
                    <div class="mb-1">가격: {{ Number(menu.price).toLocaleString() }}원</div>
                    <div class="mb-1">
                      토핑:
                      <span v-if="menu.toppingIds?.length">
                        {{ getToppingNames(menu.toppingIds).join(', ') || '토핑 없음' }}
                      </span>
                      <span v-else>없음</span>
                    </div>
                    <div class="mb-3">
                      옵션:
                      <span v-if="menu.optionIds?.length">
                        {{ getOptionNames(menu.optionIds).join(', ') }}
                      </span>
                      <span v-else>없음</span>
                    </div>

                    <!-- 수정/삭제 버튼 -->
                    <div class="d-flex justify-center align-center mt-2">
                      <v-btn size="small" color="primary" @click="onEdit(menu)">수정</v-btn>
                      <v-btn size="small" color="error" class="ml-2" @click="onDelete(menu.id)">삭제</v-btn>
                    </div>
                  </v-list-item>

                  <v-divider v-if="index < menuList.length - 1" />
                </div>
              </template>
            </draggable>

          <v-divider class="my-4" />
        </template>
      </v-list>
    </v-card>

    <v-dialog v-model="infoDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">드래그 핸들 </v-card-title>
        <v-card-text>
          <div>
            <v-icon icon="mdi-drag" />
            이 아이콘을 누른 채 드래그하면 메뉴의 위치를 바꿀 수 있습니다.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="infoDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-fab-transition>
      <v-btn
        v-if="showScrollTop"
        icon
        color="primary"
        class="position-fixed"
        style="bottom: 24px; right: 24px; z-index: 1000;"
        @click="scrollToTop"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
  
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenus } from '@/composables/useMenus'
import draggable from 'vuedraggable'

const route = useRoute()
const router = useRouter()

const companyId = route.params.companyId
const companyName = route.query.companyName || ''

const {
  menus,
  categories,
  toppings,
  options,
  loading,
  fetchMenus,
  addMenu,
  deleteMenu,
  updateMenu,
  updateMenuOrder,
  getCategories,
  getToppings,
  getOptions
} = useMenus(companyId)

const formRef = ref(null)
const form = reactive({
  categoryId: '',
  name: '',
  description: '',
  price: 0,
  toppingIds: [],
  optionIds: []
})

const imageFile = ref(null)

const isEditMode = ref(false)
const editingMenuId = ref(null)

const toppingSelectRef = ref(null)

const closeToppingMenu = () => {
  toppingSelectRef.value?.blur()
}

const optionSelectRef = ref(null)

const closeOptionMenu = () => {
  optionSelectRef.value?.blur()
}

const onSort = async (category) => {
  const sortedMenus = groupedMenus.value[category]
  // 메뉴 배열 menus.value도 순서에 맞게 재정렬 필요 (옵션)
  
  await updateMenuOrder(sortedMenus)  // composable 함수 호출
  await fetchMenus()  // 변경 반영 위해 다시 불러오기 (필요시)
}

const infoDialog = ref(false)
const selectedMenu = ref(null)

const openInfo = (menu) => {
  selectedMenu.value = menu
  infoDialog.value = true
}


const onImageChange = (event) => {
  const files = event.target.files;
  imageFile.value = files && files.length > 0 ? files[0] : null;
}

const groupedMenus = computed(() => {
  const result = {}
  menus.value.forEach(group => {
    result[group.categoryName] = group.menus
  })
  return result
})


const onSubmit = async () => {
  if (!form.categoryId || !form.name || form.price <= 0) {
    alert('카테고리, 이름, 가격은 필수입니다.')
    return
  }

  const menuData = {
    categoryId: form.categoryId,
    name: form.name,
    description: form.description,
    price: form.price,
    toppingIds: form.toppingIds,
    optionIds: form.optionIds,
    ...(isEditMode.value && form.imageUrl ? { imageUrl: form.imageUrl } : {})
  }

  if (isEditMode.value && editingMenuId.value) {
    await updateMenu(editingMenuId.value, menuData, imageFile.value)
    alert('메뉴가 수정되었습니다.')
  } else {
    menuData.sortOrder = 0;
    await addMenu(menuData, imageFile.value)
    alert('메뉴가 등록되었습니다.')
  }

  // 폼 초기화
  resetForm()
}

const resetForm = () => {
  form.categoryId = ''
  form.name = ''
  form.description = ''
  form.price = 0
  form.toppingIds = []
  form.optionIds = []
  form.imageUrl = ''

  imageFile.value = null
  isEditMode.value = false
  editingMenuId.value = null

  if (formRef.value) formRef.value.resetValidation()
}


const onEdit = (menu) => {
  form.categoryId = menu.categoryId
  form.name = menu.name
  form.description = menu.description
  form.price = menu.price
  form.toppingIds = [...(menu.toppingIds || [])]
  form.optionIds = [...(menu.optionIds || [])]
  form.imageUrl = menu.imageUrl || ''
  imageFile.value = null

  editingMenuId.value = menu.id
  isEditMode.value = true
}

const onDelete = async (id) => {
  if (confirm('정말 삭제하시겠습니까?')) {
    await deleteMenu(id)
    alert('삭제되었습니다.')
  }
}

const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id)
  return cat ? cat.name : '알 수 없음'
}

const getToppingNames = (ids) => {
  const result = toppings.value
    .filter(t => ids.includes(t.id))
    .map(t => t.name)

    return result;
}

const getOptionNames = (ids) => {
  const result = options.value
    .filter(o => ids.includes(o.id))
    .map(o => o.name)

    return result;
}

const goToMenu = () => {
  router.push({ name: 'MenuList', params: { companyId }, query: { companyName } })
}

const showScrollTop = ref(false)

const onScroll = () => {
  showScrollTop.value = window.scrollY > 200
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

onMounted(async () => {
  await Promise.all([getCategories(), getToppings(), getOptions(), fetchMenus()])
  window.addEventListener('scroll', onScroll)
})
</script>
