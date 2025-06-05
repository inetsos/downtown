<!-- src/views/MapView.vue -->
<template>
  <v-container>
    <h3>{{ name }} 위치</h3>
    <div ref="mapElement" style="width: 100%; height: 500px;"></div> 
    <v-icon
      @click="goBack"
      style="cursor: pointer;"
      aria-label="뒤로가기"
    >
      mdi-arrow-left
    </v-icon>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const mapElement = ref(null)
const name = decodeURIComponent(route.query.name || '')
const address = decodeURIComponent(route.query.address || '')

// 주소 → 좌표 변환 함수
const getCoordinates = (address) =>
  new Promise((resolve, reject) => {
    naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK || !response.v2?.addresses?.length) {
        return reject(new Error('주소를 찾을 수 없거나 오류가 발생했습니다.'))
      }
      const item = response.v2.addresses[0]
      resolve({
        latitude: parseFloat(item.y),
        longitude: parseFloat(item.x),
        roadAddress: item.roadAddress,
        jibunAddress: item.jibunAddress
      })
    })
  })

// 지도 초기화
const initMap = async () => {
  await nextTick()
  if (!mapElement.value || !window.naver) {
    console.error('naver 객체 또는 mapElement가 존재하지 않음')
    return
  }

  try {
    const { latitude, longitude, roadAddress, jibunAddress } = await getCoordinates(address)

    const map = new naver.maps.Map(mapElement.value, {
      center: new naver.maps.LatLng(latitude, longitude),
      zoom: 15
    })

    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map,
      title: name
    })

    const infoWindow = new naver.maps.InfoWindow({
      content: `
        <div style="padding:10px;min-width:200px;line-height:150%;">
          <strong>${name}</strong><br/>
          [도로명 주소] ${roadAddress || '없음'}<br/>
          [지번 주소] ${jibunAddress || '없음'}
        </div>
      `
    })

    infoWindow.open(map, marker)
  } catch (error) {
    alert(error.message)
  }
}

function goBack() {
  router.back()
}

onMounted(() => {
  if (!window.naver || !window.naver.maps) {
    const script = document.createElement('script')
    script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=s781heidm9&submodules=geocoder'
    script.async = true
    script.onload = initMap
    document.head.appendChild(script)
  } else {
    initMap()
  }
})

// 지도의 내용을 개선하력 합니다.
</script>
