// MenuSoldOutManager.js (또는 원하는 이름의 .js 파일)
import { ref, onMounted } from 'vue'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore'

const db = getFirestore()
const menus = ref([])

// 메뉴 불러오기
const fetchMenus = async () => {
  const snapshot = await getDocs(collection(db, 'menus'))
  menus.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// 매진 상태 업데이트
const updateSoldOut = async (menu) => {
  try {
    const refDoc = doc(db, 'menus', menu.id)
    await updateDoc(refDoc, { isSoldOut: menu.isSoldOut })
  } catch (e) {
    alert('업데이트 중 오류가 발생했습니다.')
  }
}

onMounted(fetchMenus)

export {
  menus,
  updateSoldOut,
}
