<!-- src/views/MapView.vue -->
<template>
  <v-container>
    <v-app-bar color="primary" dark dense>
      <v-btn icon @click="goBack" aria-label="뒤로가기">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ name }} 위치</v-toolbar-title>
    </v-app-bar>

    <v-alert type="info" class="mt-4 mb-2" dense>
      주소로 상점 위치를 찾는 경우 실제 위치와 차이가 날 수 있습니다.
    </v-alert>

    <v-btn color="primary" class="mb-3" block @click="search">
      상호로 위치 검색
    </v-btn>

    <div ref="mapElement" style="width: 100%; height: 400px;"></div>

    <v-divider class="my-4" />

    <div v-if="results.length">
      <h4 class="mb-2">검색 결과 ({{ results.length }}건)</h4>
      <v-list lines="two" density="comfortable">
        <v-list-item
          v-for="(item, index) in results"
          :key="index"
          @click="moveToLocation(item)"
          class="rounded-lg mb-2 border"
        >
          <v-list-item-title v-html="item.title" class="text-primary font-weight-medium" />
          <v-list-item-subtitle>
            <div>주소: {{ item.roadAddress || item.address }}</div>
            <div>전화: {{ item.telephone || '없음' }}</div>
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </div>
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
  // functions 기능 있음 -> firebase.json 참고.
  // localhost에서는 동작하지 않음, 20250619
  const encoded = encodeURIComponent(dong.value + ' ' + name)
  const res = await fetch(`/naver-api/search/local.json?query=${encoded}`)
  const data = await res.json()
  console.log(data)

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
        <div 
          id="infoWindowContent" 
          style="
            padding:10px;
            min-width:200px;
            max-width:90vw;
            box-sizing:border-box;
            word-break:break-word;
            line-height:150%;
            cursor:pointer;
          "
        >
          <strong>${name}</strong><br/>
          ${roadAddress || '없음'}<br/>
          ${jibunAddress || '없음'}<br/>
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
      <div 
          id="infoWindowContent" 
          style="
            padding:10px;
            min-width:200px;
            max-width:90vw;
            box-sizing:border-box;
            word-break:break-word;
            line-height:150%;
            cursor:pointer;
          "
        >
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
