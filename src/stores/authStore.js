// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
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

  const initAuth = () => {
    onAuthStateChanged(auth, async (currentUser) => {
      user.value = currentUser
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, 'profiles', currentUser.uid))
        profile.value = profileDoc.exists() ? profileDoc.data() : null
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
    register,
    login,
    logout,
    initAuth,
    changePassword,
    resetPassword,
    loginWithGoogle,
  }
})
