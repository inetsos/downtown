// src/composables/useMenus.js
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore'
import { ref } from 'vue'

export function useMenus(companyId) {
  const menus = ref([])
  const categories = ref([])
  const toppings = ref([])
  const options = ref([])
  const loading = ref(false)

  const fetchMenus = async () => {
    loading.value = true

    // 1. 카테고리 가져오기
    const categorySnapshot = await getDocs(
      query(
        collection(db, 'companies', companyId, 'categories'),
        orderBy('sortOrder', 'asc')
      )
    )

    const categoryList = categorySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // 2. 메뉴 전체 가져오기
    const menuSnapshot = await getDocs(
      collection(db, 'companies', companyId, 'menus')
    )

    const menuList = menuSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // 3. 메뉴 그룹핑
    const grouped = categoryList.map(category => {
      return {
        categoryId: category.id,
        categoryName: category.name,
        sortOrder: category.sortOrder,
        menus: menuList
          .filter(menu => menu.categoryId === category.id)
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      }
    })

    menus.value = grouped
    loading.value = false
  }

  const uploadImage = async (file) => {
    const fileName = file.name || 'image.png'
    const encodedName = encodeURIComponent(fileName)
    const storageReference = storageRef(storage,
      `menus/${companyId}/${Date.now()}_${encodedName}`
    )
    await uploadBytes(storageReference, file)
    return await getDownloadURL(storageReference)
  }

  const addMenu = async (menu, imageFile) => {
    loading.value = true
    const imageUrl = await uploadImage(imageFile)

    // 현재 카테고리 내 최대 sortOrder 계산
    const q = query(
      collection(db, 'companies', companyId, 'menus'),
      where('categoryId', '==', menu.categoryId)
    )
    const snapshot = await getDocs(q)
    const sortOrders = snapshot.docs.map(doc => doc.data().sortOrder || 0)
    const maxSortOrder = sortOrders.length > 0 ? Math.max(...sortOrders) : -1

    const payload = {
      ...menu,
      imageUrl: imageUrl || '',
      sortOrder: maxSortOrder + 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await addDoc(collection(db, 'companies', companyId, 'menus'), payload)
    await fetchMenus()
    loading.value = false
  }

  const updateMenu = async (menuId, menu, imageFile) => {
    loading.value = true
    let imageUrl = menu.imageUrl || ''
    if (imageFile) {
      imageUrl = await uploadImage(imageFile)
    }

    const payload = {
      ...menu,
      imageUrl,
      updatedAt: serverTimestamp()
    }

    delete payload.id
    await updateDoc(doc(db, 'companies', companyId, 'menus', menuId), payload)
    await fetchMenus()
    loading.value = false
  }

  const updateMenuOrder = async (sortedMenus) => {
    loading.value = true
    try {
      const batch = writeBatch(db)
      sortedMenus.forEach((menu, index) => {
        const menuRef = doc(db, 'companies', companyId, 'menus', menu.id)
        batch.update(menuRef, { sortOrder: index })
      })
      await batch.commit()
    } catch (error) {
      console.error('메뉴 순서 저장 실패:', error)
    }
    loading.value = false
  }

  const deleteMenu = async (menuId) => {
    loading.value = true
    await deleteDoc(doc(db, 'companies', companyId, 'menus', menuId))
    await fetchMenus()
    loading.value = false
  }

  const getCategories = async () => {
    const q = query(
      collection(db, 'companies', companyId, 'categories'),
      orderBy('sortOrder', 'asc')
    )
    const snapshot = await getDocs(q)
    categories.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const getToppings = async () => {
    const q = query(
      collection(db, 'companies', companyId, 'toppings'),
      orderBy('sortOrder', 'asc')
    )
    const snapshot = await getDocs(q)
    toppings.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const getOptions = async () => {
    const q = query(
      collection(db, 'companies', companyId, 'icehotOptions'),
      orderBy('sortOrder', 'asc')
    )
    const snapshot = await getDocs(q)
    options.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  return {
    menus,
    categories,
    toppings,
    options,
    loading,
    fetchMenus,
    addMenu,
    updateMenu,
    updateMenuOrder,
    deleteMenu,
    getCategories,
    getToppings,
    getOptions
  }
}
