// src/composables/useMyOrders.js
// src/composables/useMyOrders.js
import { ref } from 'vue'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  collectionGroup
} from 'firebase/firestore'
import { db } from '@/firebase'

export function useMyOrders() {
  const orders = ref([])

  // 전체 업체의 주문 가져오기
  const fetchAllOrders = async (userId) => {
    if (!userId) return

    const companiesSnap = await getDocs(collection(db, 'companies'))
    const allOrders = []

    for (const companyDoc of companiesSnap.docs) {
      const companyId = companyDoc.id
      const ordersRef = collection(db, 'companies', companyId, 'orders')
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )

      const ordersSnap = await getDocs(q)
      ordersSnap.forEach(doc => {
        allOrders.push({
          id: doc.id,
          ...doc.data(),
          companyId,
          companyName: companyDoc.data().name || '',
        })
      })
    }

    orders.value = allOrders.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
  }

  // 특정 업체의 주문만 가져오기
  const fetchOrders = async (userId, companyId) => {
    if (!userId || !companyId) return

    const ordersRef = collection(db, 'companies', companyId, 'orders')
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const ordersSnap = await getDocs(q)
    const filtered = []
    ordersSnap.forEach(doc => {
      filtered.push({
        id: doc.id,
        ...doc.data(),
        companyId,
      })
    })

    orders.value = filtered
  }

  return { orders, fetchAllOrders, fetchOrders }
}

// import { ref } from 'vue'
// import { collectionGroup, query, where, orderBy, getDocs } from 'firebase/firestore'
// import { db } from '@/firebase'

// export function useMyOrders(userId) {
//   const orders = ref([])

//   const fetchOrders = async () => {
//     const q = query(
//       collectionGroup(db, 'orders'), // 모든 companies/*/orders
//       where('userId', '==', userId),
//       orderBy('createdAt', 'desc')
//     )

//     const snapshot = await getDocs(q)
//     orders.value = snapshot.docs.map(doc => {
//       const data = doc.data()
//       const companyId = doc.ref.parent.parent?.id // 부모 컬렉션(companies/{companyId})의 ID 추출      
//       return {
//         id: doc.id,
//         ...data,
//         companyId, // 컴퍼니 ID 포함
//       }
//     })
//   }

//   return { orders, fetchOrders }
// }
