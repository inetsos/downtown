<!-- src/views/RegisterCompany.vue -->
<template>
  <v-container>
    <v-card class="pa-2 mx-auto" max-width="800">
      <v-card-title>상점 등록</v-card-title>

      <v-text-field v-model="name" label="업체명" required />

      <!-- 업종 태그 선택 -->
      <div class="my-1">
        <div class="mb-1">업종 선택</div>
        <v-chip-group v-model="category" column mandatory>
          <v-chip
            v-for="item in categories"
            :key="item"
            :value="item"
            class="ma-1"
            color="primary"
            variant="outlined"
            filter
          >
            {{ item }}
          </v-chip>
        </v-chip-group>
      </div>

      <v-textarea v-model="description" label="소개글" rows="3" />

      <v-text-field
        v-model="openTime"
        label="영업 시작 시간"
        type="time"
        required
        class="mt-0"
      />

      <v-text-field
        v-model="closeTime"
        label="영업 종료 시간"
        type="time"
        required
      />

      <v-text-field
        v-model="zipcode"
        label="우편번호"
        readonly
        @click="openPostcode"
        class="mb-0"
      />

      <v-text-field
        v-model="address"
        label="주소"
        readonly
        class="mt-0"
      />

      <v-text-field
        v-model="detailAddress"
        label="상세주소"
      />

      <!-- 위도/경도 및 지도 위치 선택 버튼 한 줄 묶음 -->
      <v-row align="center" class="mb-3" dense>
        <v-col cols="5">
          <v-text-field v-model="latitude" label="위도" readonly dense />
        </v-col>
        <v-col cols="5">
          <v-text-field v-model="longitude" label="경도" readonly dense />
        </v-col>
        <v-col cols="2" class="d-flex">
          <v-btn color="secondary" @click="goToMap" block dense class="mb-2">
            지도
          </v-btn>
        </v-col>
      </v-row>

      <v-btn color="primary" @click="submit">등록</v-btn>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCompanyStore } from '@/stores/companyStore'
import { useRouter } from 'vue-router'

const companyStore = useCompanyStore()
const router = useRouter()

const {
  tempForm,
  clearTempForm
} = companyStore

const categories = ['배달음식', '카페', '소매업', '서비스업', '교육', '병원', '기타']

// 폼 데이터
const name = ref(tempForm.name)
const description = ref(tempForm.description)
const category = ref(tempForm.category)
const openTime = ref(tempForm.openTime)
const closeTime = ref(tempForm.closeTime)
const address = ref(tempForm.address)
const zipcode = ref(tempForm.zipcode)
const detailAddress = ref(tempForm.detailAddress)
const latitude = ref(tempForm.latitude)
const longitude = ref(tempForm.longitude)

// 입력값 변경 시 상태에 반영
watch([
  name, description, category, openTime, closeTime,
  address, zipcode, detailAddress, latitude, longitude
], () => {
  tempForm.name = name.value
  tempForm.description = description.value
  tempForm.category = category.value
  tempForm.openTime = openTime.value
  tempForm.closeTime = closeTime.value
  tempForm.address = address.value
  tempForm.zipcode = zipcode.value
  tempForm.detailAddress = detailAddress.value
  tempForm.latitude = latitude.value
  tempForm.longitude = longitude.value
})

const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      address.value = data.address
      zipcode.value = data.zonecode
    },
  }).open()
}

const goToMap = () => {
  router.push({
    name: 'MapPickLocation',
    query: {
      from: 'register-company',
      address: address.value || '',
    },
  })
}

onMounted(() => {
  const lat = localStorage.getItem('pickedLatitude')
  const lng = localStorage.getItem('pickedLongitude')
  if (lat && lng) {
    latitude.value = parseFloat(lat)
    longitude.value = parseFloat(lng)
    localStorage.removeItem('pickedLatitude')
    localStorage.removeItem('pickedLongitude')
  }
})

const submit = async () => {
  if (!name.value || !category.value) {
    alert('업체명과 업종을 입력해주세요.')
    return
  }
  try {
    await companyStore.addCompany({
      name: name.value,
      description: description.value,
      category: category.value,
      openTime: openTime.value,
      closeTime: closeTime.value,
      zipcode: zipcode.value,
      address: address.value,
      detailAddress: detailAddress.value,
      latitude: latitude.value,
      longitude: longitude.value,
    })

    clearTempForm()
    alert('업체가 등록되었습니다.')
    router.push('/my-companies')
  } catch (e) {
    console.error('등록 에러:', e)
    alert(`등록에 실패했습니다: ${e.message}`)
  }
}
</script>
