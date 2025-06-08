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

export function useMenuManagement() {
  const route = useRoute()
  const router = useRouter()
  const companyId = route.params.companyId
  const menuId = route.params.menuId
  const isEditMode = !!menuId

  const formRef = ref()
  const form = reactive({
    category: '',
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
    toppingOptions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
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

  const goToList = () => {
    router.push({ name: 'MenuList', params: { companyId } })
  }

  onMounted(async () => {
    await loadToppings()
    await loadMenu()
  })

  return {
    formRef,
    form,
    categories,
    toppingOptions,
    loading,
    isEditMode,
    onSubmit,
    goToList,
  }
}
