<template>
  <v-container>
    <v-app-bar color="primary" dark dense>
      <v-btn icon @click="goBack" aria-label="뒤로가기">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>위치 선택</v-toolbar-title>
    </v-app-bar>

    <div ref="mapElement" style="width: 100%; height: 400px;"></div>

    <v-alert type="info" class="mt-4">
      지도를 클릭하면 위치가 표시됩니다. <br />
      위치를 선택한 후 아래 확인 버튼을 눌러주세요.
    </v-alert>

    <v-btn color="primary" class="mt-4" :disabled="!latitude || !longitude" @click="confirmLocation">
      선택한 위치 등록하기
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

const passedAddress = route.query.address || ''

const mapElement = ref(null)
const latitude = ref(null)
const longitude = ref(null)

let map = null
let marker = null
let infoWindow = null

const goBack = () => {
  router.back()
}

const confirmLocation = () => {
  if (latitude.value && longitude.value) {
    localStorage.setItem('pickedLatitude', latitude.value)
    localStorage.setItem('pickedLongitude', longitude.value)

    // 쿼리에서 from 값 읽기 (기본값은 'register-company')
    const from = route.query.from || 'register-company'

    if (from === 'edit-company') {
      const id = route.query.id
      // id가 있으면 edit-company 경로로 이동 (id 포함)
      if (id) {
        router.push({ name: 'EditCompany', params: { id } })
      } else {
        router.push('/my-companies') // id 없으면 목록으로
      }
    } else {
      router.push('/register-company')
    }
  } else {
    alert('지도를 클릭해 위치를 먼저 선택해주세요.')
  }
}

// 주소 → 좌표 변환 함수
const getCoordinates = (address) => {
  return new Promise((resolve, reject) => {
    naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK || !response.v2?.addresses?.length) {
        reject(new Error('주소를 찾을 수 없거나 오류가 발생했습니다.'))
      } else {
        const item = response.v2.addresses[0]
        resolve({
          latitude: parseFloat(item.y),
          longitude: parseFloat(item.x),
        })
      }
    })
  })
}

const initMap = async () => {
  await nextTick()
  if (!mapElement.value || !window.naver) return

  let center = new naver.maps.LatLng(37.5665, 126.9780) // 서울 시청 기본 좌표

  if (passedAddress) {
    try {
      const coords = await getCoordinates(passedAddress)
      center = new naver.maps.LatLng(coords.latitude, coords.longitude)
      latitude.value = coords.latitude
      longitude.value = coords.longitude
    } catch (e) {
      console.warn('주소 변환 실패, 기본 위치로 지도 초기화:', e.message)
    }
  }

  map = new naver.maps.Map(mapElement.value, {
    center,
    zoom: 14,
  })

  marker = new naver.maps.Marker({
    position: center,
    map,
  })

  infoWindow = new naver.maps.InfoWindow({
    content: `
      <div style="padding:10px;">
        선택한 위치<br/>
        위도: ${center.lat().toFixed(7)}<br/>
        경도: ${center.lng().toFixed(7)}
      </div>
    `,
  })

  infoWindow.open(map, marker)

  naver.maps.Event.addListener(map, 'click', (e) => {
    latitude.value = e.latlng.lat()
    longitude.value = e.latlng.lng()

    if (marker) {
      marker.setPosition(e.latlng)
    } else {
      marker = new naver.maps.Marker({
        position: e.latlng,
        map,
      })
    }

    infoWindow.setContent(`
      <div style="padding:10px;">
        선택한 위치<br/>
        위도: ${latitude.value.toFixed(7)}<br/>
        경도: ${longitude.value.toFixed(7)}
      </div>
    `)
    infoWindow.open(map, marker)
  })
}

onMounted(() => {
  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID
  if (!window.naver || !window.naver.maps) {
    const script = document.createElement('script')
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}&submodules=geocoder`
    script.async = true
    script.onload = initMap
    document.head.appendChild(script)
  } else {
    initMap()
  }
})
</script>
