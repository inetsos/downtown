// src/composables/useCategoryManager.js
import { ref } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export function useCategoryManager(companyId) {
  const categories = ref([])
  const newCategoryName = ref('')

  const menusByCategory = ref({})
  const categoryNames = ref([])

  const fetchCategories = async () => {
    const snap = await getDocs(collection(db, 'companies', companyId, 'categories'))
    categories.value = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }

  const addCategory = async () => {
    if (!newCategoryName.value.trim()) return
    const maxSort = categories.value.reduce((max, c) => Math.max(max, c.sortOrder ?? 0), 0)
    await addDoc(collection(db, 'companies', companyId, 'categories'), {
      name: newCategoryName.value.trim(),
      sortOrder: maxSort + 1,
    })
    newCategoryName.value = ''
    await fetchCategories()
  }

  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, 'companies', companyId, 'categories', id))
    await fetchCategories()
  }

  const saveOrder = async () => {
    const batchUpdates = categories.value.map((cat, index) =>
      updateDoc(doc(db, 'companies', companyId, 'categories', cat.id), {
        sortOrder: index,
      })
    )
    await Promise.all(batchUpdates)
    await fetchCategories()
  }

  const groupMenusByCategory = (allMenus) => {
    const grouped = {}
    allMenus.forEach(menu => {
      const category = menu.category || '기타'
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(menu)
    })
    menusByCategory.value = grouped

    categoryNames.value = Object.keys(grouped).sort((a, b) => {
      const aOrder = categories.value.find(c => c.name === a)?.sortOrder ?? 9999
      const bOrder = categories.value.find(c => c.name === b)?.sortOrder ?? 9999
      return aOrder - bOrder
    })

    //console.log('categoryNames.value:', categoryNames.value)
  }

  return {
    categories,
    newCategoryName,
    categoryNames,
    menusByCategory,
    fetchCategories,
    addCategory,
    deleteCategory,
    saveOrder,
    groupMenusByCategory
  }
}
