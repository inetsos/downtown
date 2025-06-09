// src/composables/useIceHotManager.js
import { ref } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export function useIceHotManager(companyId) {
  const options = ref([])
  const newOptionName = ref('')

  // 옵션 목록 불러오기
  const fetchOptions = async () => {
    const snap = await getDocs(collection(db, 'companies', companyId, 'icehotOptions'))
    options.value = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }

  // 옵션 추가
  const addOption = async () => {
    if (!newOptionName.value.trim()) return
    const maxSort = options.value.reduce((max, o) => Math.max(max, o.sortOrder ?? 0), 0)
    await addDoc(collection(db, 'companies', companyId, 'icehotOptions'), {
      name: newOptionName.value.trim(),
      sortOrder: maxSort + 1,
    })
    newOptionName.value = ''
    await fetchOptions()
  }

  // 옵션 삭제
  const deleteOption = async (id) => {
    await deleteDoc(doc(db, 'companies', companyId, 'icehotOptions', id))
    await fetchOptions()
  }

  // 순서 저장
  const saveOrder = async () => {
    const batchUpdates = options.value.map((opt, index) =>
      updateDoc(doc(db, 'companies', companyId, 'icehotOptions', opt.id), {
        sortOrder: index,
      })
    )
    await Promise.all(batchUpdates)
    await fetchOptions()
  }

  return {
    options,
    newOptionName,
    fetchOptions,
    addOption,
    deleteOption,
    saveOrder,
  }
}
