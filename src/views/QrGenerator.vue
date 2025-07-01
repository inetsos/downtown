<!-- src/views/QrGenerator.vue -->
<template>
  <v-container class="py-4">
    <!-- 운영 대시보드로 돌아가기 버튼 -->
    <div class="text-end mb-4 mr-2">
      <span
        class="text-primary text-subtitle-2 cursor-pointer"
        @click="goToDashboard"
      >
        운영 대시보드
      </span>
    </div>

    <v-text-field v-model="text" label="QR에 넣을 텍스트" outlined />
    
    <v-btn color="primary" class="mt-2" @click="generate">QR 코드 생성</v-btn>
    <div v-if="textToGenerate" class="mt-4 d-flex flex-column align-center" ref="qrWrapper">
      <qrcode-vue :value="textToGenerate" :size="200" />
      <v-btn class="mt-2" color="secondary" @click="downloadQr">QR 다운로드</v-btn>
    </div>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const route = useRoute()

const companyId = route.query.companyId
const companyName = route.query.companyName

const text = ref('')
const textToGenerate = ref('')
const qrRef = ref(null)

const goToDashboard = () => {
  router.push({
    name: 'OperationsDashboard',
    query: { companyId, companyName }
  })
}

const generate = () => {
  textToGenerate.value = text.value
}

const downloadQr = () => {
  const canvas = qrRef.value?.$el?.querySelector('canvas') || document.querySelector('canvas')
  if (!(canvas instanceof HTMLCanvasElement)) {
    alert('QR 코드 캔버스를 찾을 수 없습니다.')
    return
  }

  const link = document.createElement('a')
  link.download = 'qr-code.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>
