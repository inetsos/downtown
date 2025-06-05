<!-- src/views/RegisterCompany.vue-->
<template>
  <v-container>
    <v-card class="pa-2 mx-auto" max-width="800">
      <v-card-title>업체 등록</v-card-title>

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

      <v-btn color="primary" @click="submit">등록</v-btn>
    </v-card>
  </v-container>
</template>


<script setup>
import { ref } from 'vue'
import { useCompanyStore } from '@/stores/companyStore'
import { useRouter } from 'vue-router'

const companyStore = useCompanyStore()
const router = useRouter()

const name = ref('')
const description = ref('')
const category = ref('')
const categories = ['배달음식', '카페', '소매업', '서비스업', '교육', '병원', '기타']

const openTime = ref('')
const closeTime = ref('')

const address = ref('')
const zipcode = ref('')
const detailAddress = ref('')

const openPostcode = () => {
  new window.daum.Postcode({
    oncomplete: function (data) {
      address.value = data.address 
      zipcode.value = data.zonecode
    },
  }).open()
}

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
    })

    alert('업체가 등록되었습니다.')
    router.push('/my-companies')
  } catch (e) {
    console.error('등록 에러:', e)
    alert(`등록에 실패했습니다: ${e.message}`)
  }
}
</script>

