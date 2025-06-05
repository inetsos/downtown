<!-- src/views/MapView.vue -->
<template>
  <v-container>
    <h3>{{ name }} 위치</h3>
    <v-btn color="primary" class="mt-2 mb-2" @click="search">
      상호로 위치 검색
    </v-btn> 주소로 상점 위치를 찾는 경우 실제 위치와 차이가 나는 경우가 있습니다.
    <div ref="mapElement" style="width: 100%; height: 400px;"></div> 
    <v-icon
      @click="goBack"
      style="cursor: pointer;"
      aria-label="뒤로가기"
    >
      mdi-arrow-left
    </v-icon>

    <ul v-if="results.length" class="mt-4">
      <li
        v-for="(item, index) in results"
        :key="index"
        class="border-b py-2 cursor-pointer"
        @click="moveToLocation(item)"
      >
        <strong v-html="item.title"></strong><br />
        주소: {{ item.roadAddress || item.address }}<br />
        전화번호: {{ item.telephone || '없음' }}
      </li>
    </ul>

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

const dong = ref('')
const results = ref([])

let map = null
let marker = null
let infoWindow = null

const search = async () => {
  const encoded = encodeURIComponent(dong.value + ' ' + name)
  const res = await fetch(`/naver-api/search/local.json?query=${encoded}&display=15`, {
    headers: {
      'X-Naver-Client-Id': import.meta.env.VITE_NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': import.meta.env.VITE_NAVER_CLIENT_SECRET,
    }
  })

  const data = await res.json() 
  results.value = data.items || []
}

// 주소 → 좌표 변환 함수
const getCoordinates = (address) => {
  return new Promise((resolve, reject) => {
    naver.maps.Service.geocode({ query: address }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK || !response.v2?.addresses?.length) {
        return reject(new Error('주소를 찾을 수 없거나 오류가 발생했습니다.'))
      }
      const item = response.v2.addresses[0]
      resolve({
        latitude: parseFloat(item.y),
        longitude: parseFloat(item.x),
        roadAddress: item.roadAddress,
        jibunAddress: item.jibunAddress,
        dongName:item.addressElements[2].longName
      })
    })
  })
}

// 지도 초기화
const initMap = async () => {
  await nextTick()
  if (!mapElement.value || !window.naver) {
    console.error('naver 객체 또는 mapElement가 존재하지 않음')
    return
  }

  try {
    const { latitude, longitude, roadAddress, jibunAddress, dongName } = await getCoordinates(address)

    dong.value = dongName;

    map = new naver.maps.Map(mapElement.value, {
      center: new naver.maps.LatLng(latitude, longitude),
      zoom: 15
    })

    marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(latitude, longitude),
      map,
      title: name
    })

    infoWindow = new naver.maps.InfoWindow({
      content: `
        <div id="infoWindowContent" style="padding:10px;min-width:200px;line-height:150%;cursor:pointer;">
          <strong>${name}</strong><br/>
          [도로명 주소] ${roadAddress || '없음'}<br/>
          [지번 주소] ${jibunAddress || '없음'}<br/>
          <small>(클릭하면 닫힘)</small>
        </div>
      `
    })

    infoWindow.open(map, marker)

    // infoWindow 내용 클릭 시 닫기
    setTimeout(() => {
      const el = document.getElementById('infoWindowContent')
      if (el) {
        el.addEventListener('click', () => {
          infoWindow.close()
        })
      }
    }, 0)

  } catch (error) {
    alert(error.message)
  }
}

// 검색 결과 클릭 시 지도 이동 및 마커 표시
const moveToLocation = (item) => {
  if (!map) return

  const lat = parseFloat(item.mapy/10000000)
  const lng = parseFloat(item.mapx/10000000)

  const position = new naver.maps.LatLng(lat, lng)
  map.setCenter(position)
  map.setZoom(15)

  if (marker) {
    marker.setPosition(position)
    marker.setTitle(item.title)
  } else {
    marker = new naver.maps.Marker({
      position,
      map,
      title: item.title
    })
  }

  if (infoWindow) {
    infoWindow.setContent(`
      <div id="infoWindowContent" style="padding:10px;min-width:200px;line-height:150%;cursor:pointer;">
        <strong>${item.title}</strong><br/>
        주소: ${item.roadAddress || item.address}<br/>
        전화번호: ${item.telephone || '없음'}<br/>
        <small>(클릭하면 닫힘)</small>
      </div>
    `)
    infoWindow.open(map, marker)

    // infoWindow 내용 클릭 시 닫기
    setTimeout(() => {
      const el = document.getElementById('infoWindowContent')
      if (el) {
        el.addEventListener('click', () => {
          infoWindow.close()
        })
      }
    }, 0)
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
</script>
