import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useGuestId() {
  const authStore = useAuthStore()

  const getOrCreateGuestId = () => {
    let guestId = sessionStorage.getItem('guestId')
    if (!guestId) {
      guestId = `guest-${Date.now()}-${Math.floor(Math.random() * 100000)}`
      sessionStorage.setItem('guestId', guestId)
    }
    return guestId
  }

  const guestId = computed(() => {
    if (authStore.user?.isAnonymous) return `anon-${authStore.user.uid}`
    if (!authStore.user) return getOrCreateGuestId()
    return authStore.user.uid
  })

  const clearGuestId = () => {
    sessionStorage.removeItem('guestId')
  }

  return { guestId, clearGuestId }
}
