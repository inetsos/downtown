<!-- src/views/EditCompany.vue-->
<template>
  <v-container>
    <v-card class="pa-4 mx-auto" max-width="800" >
      <v-card-title>업체 수정</v-card-title>

      <v-text-field v-model="name" label="업체명" required />

      <div class="my-0">
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

      <!-- 영업시간 필드 -->
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

      <v-card-actions class="justify-space-between mt-4">
        <v-btn color="red" @click="confirmDialog = true">삭제</v-btn>
        <div>
          <v-btn color="primary" @click="submit">수정</v-btn>
          <v-btn color="grey" @click="cancel">취소</v-btn>
        </div>
      </v-card-actions>

      <!-- 삭제 확인 다이얼로그 -->
      <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">정말 삭제하시겠습니까?</v-card-title>
          <v-card-actions class="justify-end">
            <v-btn color="grey" text @click="confirmDialog = false">취소</v-btn>
            <v-btn color="red" text @click="deleteCompany">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCompanyStore } from '@/stores/companyStore'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()

const id = route.params.id
const name = ref('')
const description = ref('')
const category = ref('')
const openTime = ref('')
const closeTime = ref('')

const categories = ['배달음식', '카페', '소매업', '서비스업', '교육', '병원', '기타']
const confirmDialog = ref(false)

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

onMounted(() => {
  const company = companyStore.companies.find(c => c.id === id)
  if (company) {
    name.value = company.name
    description.value = company.description
    category.value = company.category
    openTime.value = company.openTime || ''
    closeTime.value = company.closeTime || ''
    zipcode.value = company.zipcode || ''
    address.value = company.address || ''
    detailAddress.value = company.detailAddress || ''
  }
})

const cancel = () => {
  router.push('/my-companies')
}

const submit = async () => {
  if (!name.value || !category.value) {
    alert('업체명과 업종을 입력해주세요.')
    return
  }

  try {
    await companyStore.updateCompany(id, {
      name: name.value,
      description: description.value,
      category: category.value,
      openTime: openTime.value,
      closeTime: closeTime.value,
      zipcode: zipcode.value,
      address: address.value,
      detailAddress: detailAddress.value,
    })
    alert('수정 완료되었습니다.')
    router.push('/my-companies')
  } catch (e) {
    alert('수정 실패: ' + (e?.message || '알 수 없는 오류'))
  }
}

const deleteCompany = async () => {
  try {
    await companyStore.deleteCompany(id)
    alert('삭제 하였습니다.')
    router.push('/my-companies')
  } catch (e) {
    alert('삭제 실패: ' + (e?.message || '알 수 없는 오류'))
    console.error(e)
  }
}
</script>
