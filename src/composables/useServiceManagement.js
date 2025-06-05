// src/composables/userServiceManagement.js 
import { ref, computed, watch, onUnmounted } from 'vue'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '@/firebase'

export function useServiceManagement(companyId, serviceId = null) {
  const formRef = ref(null)
  const loading = ref(false)

  const form = ref({
    category: '',
    name: '',
    description: '',
    price: null,
  })

  const categories = ['커트', '염색', '펌', '클리닉', '스타일링']
  const isEditMode = computed(() => !!serviceId)

  // 서비스 단일 문서 데이터 로딩 (수정모드)
  watch(
    () => serviceId,
    async (newId) => {
      if (!newId) return
      const docRef = doc(db, `companies/${companyId}/services/${newId}`)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        form.value = { ...docSnap.data() }
      }
    },
    { immediate: true }
  )

  // 서비스 목록 관리
  const services = ref([])
  const loadingServices = ref(true)

  const servicesRef = collection(db, `companies/${companyId}/services`)
  const q = query(servicesRef, orderBy('createdAt', 'asc'))

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      services.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      loadingServices.value = false
    },
    (error) => {
      console.error('서비스 목록 불러오기 실패:', error)
      loadingServices.value = false
    }
  )

  onUnmounted(() => {
    unsubscribe()
  })

  const submit = async () => {
    if (!formRef.value?.validate()) return false
    loading.value = true
    try {
      if (isEditMode.value) {
        const docRef = doc(db, `companies/${companyId}/services/${serviceId}`)
        await updateDoc(docRef, {
          ...form.value,
          updatedAt: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, `companies/${companyId}/services`), {
          ...form.value,
          createdAt: serverTimestamp(),
        })
      }
      return true
    } catch (e) {
      console.error('제출 실패:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const remove = async () => {
    if (!isEditMode.value || !serviceId) return false
    try {
      const docRef = doc(db, `companies/${companyId}/services/${serviceId}`)
      await deleteDoc(docRef)
      return true
    } catch (e) {
      console.error('삭제 실패:', e)
      return false
    }
  }

  return {
    formRef,
    form,
    categories,
    submit,
    remove,
    loading,
    isEditMode,
    services,
    loadingServices,
  }
}
