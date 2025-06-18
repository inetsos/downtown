// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously // 비회원 로그인
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const profile = ref(null)

  const register = async (email, password, name, aboutMe) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    user.value = userCredential.user

    const profileData = {
      uid: user.value.uid,
      name,
      aboutMe,
      email: user.value.email,
      createdAt: new Date(),
    }

    await setDoc(doc(db, 'profiles', user.value.uid), profileData)
    profile.value = profileData
  }

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    user.value = userCredential.user
    const profileDoc = await getDoc(doc(db, 'profiles', user.value.uid))
    profile.value = profileDoc.exists() ? profileDoc.data() : null
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
    profile.value = null
  }

  const isLoggedIn = computed(() => !!user.value && !user.value.isAnonymous)

  const loginAnonymously = async () => {
    const result = await signInAnonymously(auth)
    user.value = result.user

    // 익명 사용자는 Firestore에 저장하지 않아도 됨
    profile.value = {
      uid: result.user.uid,
      name: '비회원 사용자',
      aboutMe: '',
      isAnonymous: true,
      createdAt: new Date(),
    }
  }

  const initAuth = () => {
    onAuthStateChanged(auth, async (currentUser) => {
      user.value = currentUser

      if (currentUser) {
        if (currentUser.isAnonymous) {
          profile.value = {
            uid: currentUser.uid,
            name: '비회원 사용자',
            aboutMe: '',
            isAnonymous: true,
            createdAt: new Date(),
          }          
        } else {
          const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid))
          profile.value = profileDoc.exists() ? profileDoc.data() : null          
        }
      } else {
        profile.value = null
      }
    })
  }

  const changePassword = async (currentPassword, newPassword) => {
    const currentUser = auth.currentUser
    if (!currentUser || !currentUser.email) {
      throw new Error('사용자 정보가 없습니다.')
    }

    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
    await reauthenticateWithCredential(currentUser, credential)
    await updatePassword(currentUser, newPassword)
  }

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email)
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      user.value = result.user

      const profileRef = doc(db, 'profiles', user.value.uid)
      const profileDoc = await getDoc(profileRef)

      if (!profileDoc.exists()) {
        const profileData = {
          uid: user.value.uid,
          name: user.value.displayName || '',
          aboutMe: '',
          email: user.value.email || '',
          createdAt: new Date(),
        }
        await setDoc(profileRef, profileData)
        profile.value = profileData
        return { isNewUser: true }
      } else {
        profile.value = profileDoc.data()
        return { isNewUser: false }
      }
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    profile,
    isLoggedIn,
    register,
    login,
    logout,
    loginAnonymously,
    initAuth,
    changePassword,
    resetPassword,
    loginWithGoogle,
  }
})
