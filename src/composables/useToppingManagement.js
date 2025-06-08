// src/composables/useToppingManagement.js
import { ref, reactive } from 'vue'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch,
  limit,
} from 'firebase/firestore'
import { db } from '@/firebase'

export function useToppingManagement(companyId, toppingId = null) {
  const isEditMode = ref(!!toppingId)
  const formRef = ref()
  const loading = ref(false)

  const form = reactive({
    name: '',
    price: 0
  })

  const toppings = ref([])

  const loadToppings = async () => {
    const q = query(
      collection(db, 'companies', companyId, 'toppings'),
      orderBy('sortOrder', 'asc')
    )
    const snap = await getDocs(q)
    toppings.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const loadTopping = async () => {
    if (!toppingId) return
    const docSnap = await getDoc(doc(db, 'companies', companyId, 'toppings', toppingId))
    if (docSnap.exists()) {
      const data = docSnap.data()
      form.name = data.name
      form.price = data.price
    }
  }

  const submit = async () => {
    loading.value = true
    try {
      const toppingRef = collection(db, 'companies', companyId, 'toppings')

      // 신규 등록일 때 가장 마지막 순서 구하기
      let newSortOrder = 0
      if (!isEditMode.value) {
        // 가장 높은 sortOrder 찾기
        const q = query(toppingRef, orderBy('sortOrder', 'desc'), limit(1))
        const snap = await getDocs(q)
        if (!snap.empty) {
          newSortOrder = snap.docs[0].data().sortOrder + 1
        }
      }

      const payload = {
        name: form.name,
        price: form.price,
        updatedAt: new Date(),
        ...(isEditMode.value ? {} : { createdAt: new Date(), sortOrder: newSortOrder }),
      }

      if (isEditMode.value) {
        await updateDoc(doc(toppingRef, toppingId), payload)
      } else {
        await addDoc(toppingRef, payload)
      }

      return true
    } catch (e) {
      console.error('토핑 저장 오류:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const remove = async (id) => {
    const docRef = doc(db, `companies/${companyId}/toppings/${id}`)
    await deleteDoc(docRef)
    return true
  }


  const fetchAllToppings = async () => {
    const q = query(
      collection(db, 'companies', companyId, 'toppings'),
      orderBy('sortOrder', 'asc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const updateToppingOrder = async (newOrderList) => {
    try {
      const batch = writeBatch(db)
      newOrderList.forEach((topping, index) => {
        const ref = doc(db, 'companies', companyId, 'toppings', topping.id)
        batch.update(ref, { sortOrder: index })
      })
      await batch.commit()
      return true
    } catch (error) {
      console.error('순서 저장 실패', error)
      return false
    }
  }

  return {
    form,
    formRef,
    toppings,
    isEditMode,
    loading,
    loadToppings,
    loadTopping,
    submit,
    remove,
    fetchAllToppings,
    updateToppingOrder
  }
}
