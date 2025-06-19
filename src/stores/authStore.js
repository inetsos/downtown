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
  signInWithCustomToken,
  signInAnonymously // 비회원 로그인
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import axios from 'axios'

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

  const loginWithKakao = async (authCode) => {
    
    const isLocal = window.location.hostname === 'localhost';
    const KAKAO_REDIRECT_URI = isLocal
      ? 'http://localhost:5173/kakao-callback'
      : 'https://my-project-bd617.web.app/kakao-callback';

    try {
      // 1. 카카오 토큰 요청
      const tokenRes = await axios.post('https://kauth.kakao.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
          redirect_uri: KAKAO_REDIRECT_URI,
          code: authCode,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = tokenRes.data

      // 2. 사용자 정보 요청
      const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const kakaoUser = userRes.data
      const kakaoUid = `kakao:${kakaoUser.id}`

      // 3. Firebase Functions에 카카오 AccessToken 보내서 커스텀 토큰 받기
      const customTokenRes = await axios.post('https://asia-northeast3-my-project-bd617.cloudfunctions.net/kakaoLogin', {
        accessToken: access_token,
      });

      const customToken = customTokenRes.data.token;

      // 4. Firebase 커스텀 토큰으로 로그인
      const userCredential = await signInWithCustomToken(auth, customToken);
      user.value = userCredential.user;

      // 5. Firestore에서 프로필 확인
      const profileRef = doc(db, 'profiles', kakaoUid);
      const profileDoc = await getDoc(profileRef);

      if (!profileDoc.exists()) {
        // 신규 사용자일 경우에만 프로필 저장
        const profileData = {
          uid: kakaoUid,
          name: kakaoUser.properties?.nickname || '카카오 사용자',
          email: kakaoUser.kakao_account?.email || '',
          aboutMe: '',
          provider: 'kakao',
          createdAt: new Date(),
        };
        await setDoc(profileRef, profileData);
        profile.value = profileData;
      } else {
        // 기존 사용자라면 기존 프로필 유지
        profile.value = profileDoc.data();
      }

      return { isNewUser: !profileDoc.exists() };
      
    } catch (error) {
      console.error('카카오 로그인 실패:', error)
      throw error
    }
  }

  const loginWithNaver = async (authCode, state) => {
    try {
      // Firebase Functions로 code, state 전송
      const customTokenRes = await axios.post(
        'https://asia-northeast3-my-project-bd617.cloudfunctions.net/naverLogin',
        { code: authCode, state }
      );

      const { token: customToken, profile: profileData } = customTokenRes.data;

      const userCredential = await signInWithCustomToken(auth, customToken);
      user.value = userCredential.user;

      // Firestore 저장 (필요시)
      const profileRef = doc(db, 'profiles', user.value.uid);
      const profileDoc = await getDoc(profileRef);

      if (!profileDoc.exists()) {
        await setDoc(profileRef, profileData);
        profile.value = profileData;
        return { isNewUser: true };
      } else {
        profile.value = profileDoc.data();
        return { isNewUser: false };
      }

    } catch (error) {
      console.error('네이버 로그인 실패:', error);
      throw error;
    }
  };

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
    loginWithKakao,
    loginWithNaver,
  }
})
