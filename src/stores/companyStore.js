// src/stores/companyStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase'
import {
  collection,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore' 
import { useAuthStore } from './authStore'

export const useCompanyStore = defineStore('company', () => {
  const companies = ref([])
  const company = ref(null)

  // 🔹 업체 등록
  const addCompany = async (company) => {
    //console.log(openTime, closeTime);
    const authStore = useAuthStore()
    const user = authStore.user
    if (!user?.uid) 
      throw new Error('로그인이 필요합니다.')

    company.ownerId = user.uid,
    company.createdAt = serverTimestamp()
    console.log(company)
    await addDoc(collection(db, 'companies'), company)
  }

  // 🔹 companyId로로 등록 업체 조회
  const fetchCompany = async (companyId) => {
    try {
      const docRef = doc(db, 'companies', companyId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        company.value = docSnap.data() 
      } else {
        console.error('업체 정보를 찾을 수 없습니다.')
      }
    } catch (err) {
      console.error('업체 정보 조회 실패:', err)
    }
  }

  // 🔹 회원별 등록 업체 조회
  const fetchMyCompanies = async () => {
    const authStore = useAuthStore()
    const user = authStore.user
    if (!user?.uid) return

    const q = query(
      collection(db, 'companies'),
      where('ownerId', '==', user.uid)
    )

    const snapshot = await getDocs(q)
    companies.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) 
  }
 
  // 🔹 업체 수정
  const updateCompany = async (id, updatedData) => {
    const ref = doc(db, 'companies', id)
    await updateDoc(ref, {
        ...updatedData,
        updatedAt: serverTimestamp()
    })
  }

  // 🔹 업체 목록
  const fetchAllCompanies = async () => {
    const snapshot = await getDocs(collection(db, 'companies'))
    companies.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
  }

  // 🔹 업체 삭제
  const deleteCompany = async (id) => {
    await deleteDoc(doc(db, 'companies', id))

    if (Array.isArray(companies.value)) {
        companies.value = companies.value.filter(c => c.id !== id)
    } else {
        companies.value = []
    }
  }

  return {
    companies,
    company,
    addCompany,
    fetchCompany,    
    fetchMyCompanies,
    updateCompany,
    fetchAllCompanies,
    deleteCompany
  }
})
