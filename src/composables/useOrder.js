// src/composables/useOrder.js
import { ref } from 'vue'
import { db } from '@/firebase'
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query,
  orderBy,
  onSnapshot,
  doc,
  where,
  getDocs,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'

export function useOrder() {
  const loading = ref(false)
  const error = ref(null)
  const orders = ref([])

  /**
   * 회사(companyId) 하위 orders 서브컬렉션에 주문 저장 (자동 증가 주문번호 포함)
   * @param {string} companyId 
   * @param {object} orderData 
   */
  const createOrder = async (companyId, orderData) => {
    loading.value = true
    error.value = null
    try {
      const ordersColRef = collection(db, 'companies', companyId, 'orders')
      const counterDocRef = doc(db, 'companies', companyId, 'orderCounter', 'counter')

      let newOrderNumber = 0

      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterDocRef)
        if (!counterDoc.exists()) {
          transaction.set(counterDocRef, { lastOrderNumber: 1 })
          newOrderNumber = 1
        } else {
          const lastOrderNumber = counterDoc.data().lastOrderNumber || 0
          newOrderNumber = lastOrderNumber + 1
          transaction.update(counterDocRef, { lastOrderNumber: newOrderNumber })
        }

        const payload = {
          ...orderData,
          createdAt: serverTimestamp(),
          status: '대기',
          orderNumber: newOrderNumber,
        }
        const newOrderDocRef = doc(ordersColRef)
        transaction.set(newOrderDocRef, payload)
      })

      loading.value = false
      return newOrderNumber
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

  const fetchOrdersRealtimeToday = (companyId, startDate, endDate) => {
    loading.value = true
    error.value = null

    const ordersColRef = collection(db, 'companies', companyId, 'orders')

    const q = query(
      ordersColRef,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'asc')
    )

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

  /**
   * 주문 상태를 "완료"로 업데이트
   * @param {string} companyId 
   * @param {string} orderId 
   */
  const markAsCompleted = async (companyId, orderId) => {
    if (!companyId || !orderId) return

    try {
      const orderDocRef = doc(db, 'companies', companyId, 'orders', orderId)
      await updateDoc(orderDocRef, { status: '완료' })
    } catch (e) {
      error.value = e
      console.error('주문 완료 처리 실패:', e)
      throw e
    }
  }

  // markAsCompleted 사용 수정 필요.
  const updateOrderStatus = async (companyId, orderId, status) => {
    try {
      const orderDocRef = doc(db, 'companies', companyId, 'orders', orderId)
      await updateDoc(orderDocRef, { status })
    } catch (e) {
      error.value = e
      console.error('주문 상태 업데이트 실패:', e)
      throw e
    }
  }

  /**
   * 비회원 전화번호로 주문 검색
   * @param {string} companyId 
   * @param {string} guestPhone 
   * @returns {Promise<Array>} 주문 배열 반환
   */
  const searchGuestOrder = async (companyId, guestPhone) => {
    loading.value = true
    error.value = null

    console.log(companyId, guestPhone);
    try {
      const ordersColRef = collection(db, 'companies', companyId, 'orders')
      const q = query(
        ordersColRef,
        where('userPhone', '==', guestPhone),
        where('isGuest', '==', true),
        orderBy('createdAt', 'desc')
      )

      console.log(q);
      const snapshot = await getDocs(q)
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      loading.value = false
      return results
    } catch (e) {
      error.value = e
      loading.value = false
      console.error('비회원 주문 검색 실패:', e)
      throw e
    }
  }

  return {
    loading,
    error,
    orders,
    createOrder,
    fetchOrdersRealtime,
    fetchOrdersRealtimeToday,
    markAsCompleted,
    updateOrderStatus,
    searchGuestOrder 
  }
}
