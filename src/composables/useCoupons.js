// src/composables/useCoupons.js
import { ref } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
} from 'firebase/firestore'

export function useCoupons() {
  const loading = ref(false)
  const error = ref(null)

  // ✅ 누적 주문 금액 기준 쿠폰 발급
  const issueCouponsByTotalSpent = async (userId, companyId, companyName) => {
    loading.value = true
    error.value = null
    try {
      // 1. 해당 사용자의 누적 결제 금액 조회
      const ordersColRef = collection(db, 'companies', companyId, 'orders')
      const ordersSnap = await getDocs(query(ordersColRef, where('userId', '==', userId)))

      const totalSpent = ordersSnap.docs.reduce((sum, doc) => {
        return sum + (doc.data().finalAmount || 0)
      }, 0)

      // 2. 1만원당 1000원 쿠폰 1장 지급
      const expectedCouponCount = Math.floor(totalSpent / 10000)

      // 3. 이미 발급된 동일 조건 쿠폰 수 확인
      const couponsColRef = collection(db, 'companies', companyId, 'coupons')
      const issuedSnap = await getDocs(
        query(
          couponsColRef,
          where('userId', '==', userId),
          where('type', '==', 'fixed_discount'),
          where('value', '==', 1000)
        )
      )

      const alreadyIssued = issuedSnap.size
      const toIssue = expectedCouponCount - alreadyIssued

      // 4. 새로 발급해야 할 쿠폰 등록
      for (let i = 0; i < toIssue; i++) {
        await addDoc(couponsColRef, {
          userId,
          companyId,       // companyId 추가
          companyName,     // companyName 추가
          type: 'fixed_discount',
          value: 1000,
          issuedAt: new Date(),
          used: false,
        })
      }
    } catch (err) {
      error.value = err
      console.error('쿠폰 발급 오류:', err)
    } finally {
      loading.value = false
    }
  }

  // 모든 회사에 있는 해당 사용자의 쿠폰을 가져옴
  const fetchAllCoupons = async (userId) => {
    try {
      // 1. 모든 회사(company) 문서를 가져옴
      const companiesSnap = await getDocs(collection(db, 'companies'))

      // 2. 각 회사의 coupons 서브컬렉션에서 해당 유저의 쿠폰을 검색
      const couponPromises = companiesSnap.docs.map(async (companyDoc) => {
        const companyId = companyDoc.id
        const couponsColRef = collection(db, 'companies', companyId, 'coupons')
        const q = query(couponsColRef, where('userId', '==', userId))
        const snap = await getDocs(q)
        return snap.docs.map(doc => ({
          id: doc.id,
          companyId,
          ...doc.data(),
        }))
      })

      const results = await Promise.all(couponPromises)

      // 3. 2차원 배열을 평탄화
      return results.flat()
    } catch (err) {
      console.error('모든 쿠폰 조회 오류:', err)
      return []
    }
  }

  // ✅ 사용 가능한 쿠폰 조회
  const fetchAvailableCoupons = async (userId, companyId) => {
    try {
      const couponsColRef = collection(db, 'companies', companyId, 'coupons')
      const q = query(
        couponsColRef,
        where('userId', '==', userId),
        where('used', '==', false)
      )
      const snap = await getDocs(q)
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (err) {
      error.value = err
      console.error('쿠폰 조회 오류:', err)
      return []
    }
  }

  // ✅ 단일 쿠폰 사용
  const useCoupon = async (couponId, companyId) => {
    try {
      const couponRef = doc(db, 'companies', companyId, 'coupons', couponId)
      const couponSnap = await getDoc(couponRef)

      if (!couponSnap.exists()) throw new Error('쿠폰이 존재하지 않습니다.')

      const couponData = couponSnap.data()
      if (couponData.used) throw new Error('이미 사용된 쿠폰입니다.')

      await updateDoc(couponRef, {
        used: true,
        usedAt: new Date(),
      })
    } catch (err) {
      error.value = err
      console.error('쿠폰 사용 오류:', err)
      throw err
    }
  }

  // ✅ 복수 쿠폰 사용
  const useMultipleCoupons = async (couponIds = [], companyId) => {
    if (!Array.isArray(couponIds) || couponIds.length === 0) return

    try {
      const updatePromises = couponIds.map(async id => {
        const couponRef = doc(db, 'companies', companyId, 'coupons', id)
        const couponSnap = await getDoc(couponRef)

        if (!couponSnap.exists()) throw new Error(`쿠폰(${id})이 존재하지 않습니다.`)
        if (couponSnap.data().used) throw new Error(`쿠폰(${id})은 이미 사용됨.`)

        return updateDoc(couponRef, {
          used: true,
          usedAt: new Date(),
        })
      })

      await Promise.all(updatePromises)
    } catch (err) {
      error.value = err
      console.error('여러 쿠폰 사용 오류:', err)
      throw err
    }
  }

  return {
    loading,
    error,
    issueCouponsByTotalSpent,
    fetchAllCoupons,
    fetchAvailableCoupons,
    useCoupon,
    useMultipleCoupons,
  }
}
