<!-- src/components/CompanyMap.vue -->
<template>
  <div id="map" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useGeocoder } from '@/composables/useGeocoder'

const props = defineProps({
  address: String, // "서울특별시 강남구 테헤란로 123"
})

onMounted(async () => {
  if (props.address) {
    showMapForAddress(props.address)
  }
})

watch(() => props.address, (newAddress) => {
  if (newAddress) {
    showMapForAddress(newAddress)
  }
})

const showMapForAddress = async (address) => {
  const { getCoordsFromAddress } = useGeocoder()
  const coords = await getCoordsFromAddress(address)

  if (!coords) return

  const map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(coords.lat, coords.lng),
    zoom: 16,
  })

  new naver.maps.Marker({
    position: new naver.maps.LatLng(coords.lat, coords.lng),
    map: map,
  })
}
</script>
