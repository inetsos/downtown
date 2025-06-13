// src/composables/useOrder.js
import { ref } from 'vue'
import { db } from '@/firebase'
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'

export function useOrder() {
  const loading = ref(false)
  const error = ref(null)
  const orders = ref([])

  /**
   * 회사(companyId) 하위 orders 서브컬렉션에 주문 저장
   * @param {string} companyId 
   * @param {object} orderData 
   */
  const createOrder = async (companyId, orderData) => {
    loading.value = true
    error.value = null
    try {
      const ordersColRef = collection(db, 'companies', companyId, 'orders')
      const payload = {
        ...orderData,
        createdAt: serverTimestamp(),
        status: 'pending',
      }
      const docRef = await addDoc(ordersColRef, payload)
      loading.value = false
      return docRef.id
    } catch (e) {
      error.value = e
      loading.value = false
      throw e
    }
  }

  /** 
   * companyId의 orders 서브컬렉션 실시간 조회
   * @param {string} companyId 
   */
  const fetchOrdersRealtime = (companyId) => {
    loading.value = true
    error.value = null

    const ordersColRef = collection(db, 'companies', companyId, 'orders')
    const q = query(ordersColRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, (e) => {
      error.value = e
      loading.value = false
    })

    return unsubscribe
  }

  return {
    loading,
    error,
    orders,
    createOrder,
    fetchOrdersRealtime,
  }
}
