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
  const nearCompanies = ref([])
  const company = ref(null)
  const adminMap = ref({})
  const isLoading = ref(false)

  // ✅ 등록 페이지 임시 데이터
  const tempForm = ref({
    name: '',
    description: '',
    category: '',
    openTime: '',
    closeTime: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    latitude: null,
    longitude: null,
  })

  const setTempForm = (partialData) => {
    tempForm.value = {
      ...tempForm.value,
      ...partialData
    }
  }

  const clearTempForm = () => {
    tempForm.value = {
      name: '',
      description: '',
      category: '',
      openTime: '',
      closeTime: '',
      zipcode: '',
      address: '',
      detailAddress: '',
      latitude: null,
      longitude: null,
    }
  }

  // ✅ 수정 페이지 임시 데이터
  const editForm = ref({
    name: '',
    description: '',
    category: '',
    openTime: '',
    closeTime: '',
    zipcode: '',
    address: '',
    detailAddress: '',
    latitude: null,
    longitude: null,
  })

  const setEditForm = (partialData) => {
    editForm.value = {
      ...editForm.value,
      ...partialData
    }
  }

  const clearEditForm = () => {
    editForm.value = {
      name: '',
      description: '',
      category: '',
      openTime: '',
      closeTime: '',
      zipcode: '',
      address: '',
      detailAddress: '',
      latitude: null,
      longitude: null,
    }
  }

  const addCompany = async (company) => {
    const authStore = useAuthStore()
    const user = authStore.user
    if (!user?.uid) throw new Error('로그인이 필요합니다.')

    company.ownerId = user.uid
    company.createdAt = serverTimestamp()
    await addDoc(collection(db, 'companies'), company)
  }

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

  const fetchAllCompanies = async () => {
    isLoading.value = true
    try {
      const snapshot = await getDocs(collection(db, 'companies'))
      companies.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } finally {
      isLoading.value = false
    }
  }

  const updateCompany = async (id, updatedData) => {
    const ref = doc(db, 'companies', id)
    await updateDoc(ref, {
      ...updatedData,
      updatedAt: serverTimestamp()
    })
  }

  const deleteCompany = async (id) => {
    await deleteDoc(doc(db, 'companies', id))
    companies.value = companies.value.filter(c => c.id !== id)
  }

  const checkAdmin = async (companyId) => {
    const authStore = useAuthStore()
    const user = authStore.user
    if (!user?.uid || !companyId) return false

    if (adminMap.value[companyId] !== undefined) {
      return adminMap.value[companyId]
    }

    const companyRef = doc(db, 'companies', companyId)
    const snapshot = await getDoc(companyRef)
    const isAdmin = snapshot.exists() && snapshot.data().ownerId === user.uid

    adminMap.value[companyId] = isAdmin
    return isAdmin
  }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // km 단위
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) *
              Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const fetchNearbyCompanies = async (lat, lng) => {
    const snapshot = await getDocs(collection(db, 'companies'))
    const results = snapshot.docs.map(doc => {
      const data = doc.data()
      if (data.latitude == null || data.longitude == null) 
        return null
      const distance = haversineDistance(lat, lng, data.latitude, data.longitude)
      return { id: doc.id, ...data, distance }
    }).filter(Boolean).sort((a, b) => a.distance - b.distance)

    nearCompanies.value = [...results]
  }

  return {
    companies,
    nearCompanies,
    company,
    isLoading,
    adminMap,
    addCompany,
    fetchCompany,
    fetchMyCompanies,
    fetchAllCompanies,
    updateCompany,
    deleteCompany,
    checkAdmin,

    // ✅ 등록용 임시 상태
    tempForm,
    setTempForm,
    clearTempForm,

    // ✅ 수정용 임시 상태
    editForm,
    setEditForm,
    clearEditForm,

    fetchNearbyCompanies
  }
})
