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
          메뉴로 가기
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
          v-model="form.toppingIds"
          :items="toppings"
          item-title="name"
          item-value="id"
          label="선택 가능한 토핑"
          multiple
          chips
        />

        <!-- 옵션 선택 (다중) -->
        <v-select
          v-model="form.optionIds"
          :items="options"
          item-title="name"
          item-value="id"
          label="선택 가능한 옵션"
          multiple
          chips
        />

        <!-- 이미지 업로드 -->
        <v-file-input
          label="메뉴 이미지 선택"
          accept="image/*"
          @change="onImageChange"
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
              @end="() => onSort(category)"
            >
              <template #item="{ element: menu, index }">
                <div>
                  <v-list-item :data-id="menu.id">
                    <template #prepend>
                      <v-avatar size="90" rounded>
                        <v-img :src="menu.imageUrl" />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="font-weight-bold">{{ menu.name }}</v-list-item-title>

                    <div v-if="menu.description">설명: {{ menu.description }}</div>
                    <div>가격: {{ Number(menu.price).toLocaleString() }}원</div>
                    <div>
                      토핑:
                      <span v-if="menu.toppingIds?.length">
                        {{ getToppingNames(menu.toppingIds).join(', ') || '토핑 없음' }}
                      </span>
                      <span v-else>없음</span>
                    </div>
                    <div>
                      옵션:
                      <span v-if="menu.optionIds?.length">
                        {{ getOptionNames(menu.optionIds).join(', ') }}
                      </span>
                      <span v-else>없음</span>
                    </div>

                    <template #append>
                      <v-btn size="small" color="primary" class="mr-2" @click="onEdit(menu)">수정</v-btn>
                      <v-btn size="small" color="error" @click="onDelete(menu.id)">삭제</v-btn>
                    </template>
                  </v-list-item>

                  <v-divider v-if="index < menuList.length - 1" />
                </div>
              </template>
            </draggable>

          <v-divider class="my-4" />
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
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

const onSort = async (category) => {
  const sortedMenus = groupedMenus.value[category]
  // 메뉴 배열 menus.value도 순서에 맞게 재정렬 필요 (옵션)
  
  await updateMenuOrder(sortedMenus)  // composable 함수 호출
  await fetchMenus()  // 변경 반영 위해 다시 불러오기 (필요시)
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

onMounted(async () => {
  await Promise.all([getCategories(), getToppings(), getOptions(), fetchMenus()])
})
</script>
