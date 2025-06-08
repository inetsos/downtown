<!-- src/views/MenuManagement.vue -->
<template>
  <v-container>
    <v-card class="pa-4 mx-auto" style="max-width: 600px;">
      <v-card-title class="d-flex justify-space-between">
        <span>{{ companyName }} - {{ isEditMode ? '메뉴 수정' : '메뉴 등록' }}</span>
        <v-spacer />
        <!-- 메뉴로 이동 버튼 -->
        <v-btn variant="text" class="mt-4" color="primary" @click="goToMenu">
          메뉴로 가기
        </v-btn>    

      </v-card-title>

      <v-form ref="formRef" @submit.prevent="onSubmit">
        <!-- 분류 선택 -->
        <div class="mb-4">
          <label class="mb-2 font-weight-medium">분류</label>
          <v-chip-group
            v-model="form.category"
            mandatory
            column
            :max="1"
            active-class="primary--text"
          >
            <v-chip
              v-for="cat in categories"
              :key="cat"
              :value="cat"
              outlined
              class="ma-1"
            >
              {{ cat }}
            </v-chip>
          </v-chip-group>
        </div>

        <v-text-field v-model="form.name" label="메뉴 이름" required />
        <v-textarea v-model="form.description" label="설명" />
        <v-text-field v-model="form.price" label="가격" type="number" required />

        <!-- 선택 가능한 토핑들 -->
        <v-select
          v-model="form.toppingIds"
          :items="toppingOptions"
          item-title="name"
          item-value="id"
          label="선택 가능한 토핑"
          multiple
          chips
        />

        <v-card-actions>
          <v-spacer />
          <v-btn type="submit" color="primary" :loading="loading">
            {{ isEditMode ? '수정 완료' : '등록' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  doc,
} from 'firebase/firestore'
import { db } from '@/firebase'

const route = useRoute()
const router = useRouter()

const companyId = route.params.companyId
const companyName = route.query.companyName || ''
const menuId = route.params.menuId
const isEditMode = !!menuId

const formRef = ref(null)
const form = reactive({
  category: '',           // 분류
  name: '',
  description: '',
  price: 0,
  toppingIds: [],
})

const categories = [
    '커피', '시그니처', '라떼 & 우유', '스무디 & 쉐이크', 
    '에이드 & 주스', '버블티', '티 & 기타 음료', 
    '보틀 (1.1L 대용량)', '디저트 & 베이커리']
    
const toppingOptions = ref([])
const loading = ref(false)

const loadToppings = async () => {
  const snapshot = await getDocs(collection(db, 'companies', companyId, 'toppings'))
  toppingOptions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const loadMenu = async () => {
  if (!menuId) return
  const docSnap = await getDoc(doc(db, 'companies', companyId, 'menus', menuId))
  if (docSnap.exists()) {
    const data = docSnap.data()
    form.category = data.category || ''
    form.name = data.name
    form.description = data.description
    form.price = data.price
    form.toppingIds = data.toppingIds || []
  }
}

const onSubmit = async () => {
  loading.value = true
  const menuRef = collection(db, 'companies', companyId, 'menus')

  const payload = {
    category: form.category,
    name: form.name,
    description: form.description,
    price: form.price,
    toppingIds: form.toppingIds,
    updatedAt: new Date(),
  }

  if (isEditMode) {
    await updateDoc(doc(menuRef, menuId), payload)
  } else {
    await addDoc(menuRef, {
      ...payload,
      createdAt: new Date(),
    })
  }

  alert(isEditMode ? '수정 완료' : '등록 완료')
  router.push({ name: 'MenuList', params: { companyId } })
}

const goToMenu = () => {
  router.push({ name: 'MenuList', params: { companyId }, query: { companyName } })
}


onMounted(async () => {
  await loadToppings()
  await loadMenu()
})
</script>
