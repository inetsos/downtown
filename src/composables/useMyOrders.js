// src/composables/useMyOrders.js
import { ref } from 'vue'
import { collectionGroup, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

export function useMyOrders(userId) {
  const orders = ref([])

  const fetchOrders = async () => {
    const q = query(
      collectionGroup(db, 'orders'), // 모든 companies/*/orders
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    orders.value = snapshot.docs.map(doc => {
      const data = doc.data()
      const companyId = doc.ref.parent.parent?.id // 부모 컬렉션(companies/{companyId})의 ID 추출
      return {
        id: doc.id,
        ...data,
        companyId, // 컴퍼니 ID 포함
      }
    })
  }

  return { orders, fetchOrders }
}
