// stores/reservationStore.js
import { defineStore } from 'pinia'
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  setDoc,
  runTransaction
} from 'firebase/firestore'
import { useAuthStore } from './authStore'

export const useReservationStore = defineStore('reservation', () => {
  const authStore = useAuthStore()

  // Firestore에서는 자동 증가 숫자 필드를 기본 제공하지 않음
  // 예약번호 카운터를 별도의 문서로 관리해서, 
  // 예약 생성 시 이 문서의 값을 원자적으로 증가시키고 그 값을 예약번호로 할당합니다.

  // 카운터 문서 없으면 만들어야 한다.
  const ensureCounterDocExists = async () => {
    const counterRef = doc(db, 'counters', 'reservationCounter')
    const docSnap = await getDoc(counterRef)
    if (!docSnap.exists()) {
      await setDoc(counterRef, { current: 0 })
    }
  }

  // 다음 예약번호 생성
  const getNextReservationNumber = async () => {
    const counterRef = doc(db, 'counters', 'reservationCounter')
    await ensureCounterDocExists()

    const newNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef)
      const current = counterDoc.data().current || 0
      const next = current + 1
      transaction.update(counterRef, { current: next })
      return next
    })

    return newNumber
  }

  // 예약 등록
  const submitReservation = async (form) => {
    if (!authStore.user) throw new Error('로그인이 필요합니다.')

    const reservationNumber = await getNextReservationNumber()

    form.userId = authStore.user.uid;
    form.userName =  authStore.profile.name;
    form.status = '대기중';
    form.createdAt = serverTimestamp();
    form.reservationNumber = reservationNumber; // 자동 증가 예약번호

    const docRef = await addDoc(collection(db, 'reservations'), form)
    // const data = {
    //   userId: authStore.user.uid,
    //   userName: authStore.profile.name,
    //   companyId: form.companyId,
    //   companyName: form.companyName,
    //   serviceId: form.serviceId,
    //   serviceName: form.serviceName,
    //   date: form.date,
    //   timeSlots: form.timeSlots,
    //   memo: form.memo,
    //   status: '대기중',
    //   createdAt: serverTimestamp(),
    //   reservationNumber // 자동 증가 예약번호
    // }

    // const docRef = await addDoc(collection(db, 'reservations'), data)

    return {
      id: docRef.id,
      ...form,
      createdAt: new Date(), // 클라이언트용 임시값
    }
  }

  // 회원별 예약 목록 조회
  const fetchReservationsByUser = async (userId) => {
    const q = query(
      collection(db, 'reservations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')  // 생성일 기준 역순 정렬
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

    // 예약 취소
  const cancelReservation = async (reservationId) => {
    const resRef = doc(db, 'reservations', reservationId)
    await updateDoc(resRef, {
      status: '취소',
      canceledAt: new Date().toISOString(),
    })
  }

  // Fetch reservations for a specific store
  async function fetchReservationsByCompany(companyId) {
    const q = query(
      collection(db, 'reservations'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')  // 생성일 기준 역순 정렬
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // 예약 승인
  const approveReservation = async (reservationId) => {
    const resRef = doc(db, 'reservations', reservationId)
    await updateDoc(resRef, {
      status: '승인',
      approvedAt: new Date().toISOString(),
    })
  }

  // 예약 거절
  const rejectReservation = async (reservationId) => {
    const resRef = doc(db, 'reservations', reservationId)
    await updateDoc(resRef, {
      status: '거절',
      rejectedAt: new Date().toISOString(),
    })
  }

  return {
    submitReservation,
    fetchReservationsByUser,
    cancelReservation,
    fetchReservationsByCompany,
    approveReservation,
    rejectReservation,
  }

})
