<!-- src/views/QrScanner.vue -->
<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ props }">
      <v-btn v-bind="props" class="mt-4" color="primary" prepend-icon="mdi-qrcode-scan">
        QR 스캔
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h6">QR 코드 스캔</v-card-title>
      <v-divider />

      <v-card-text>
        <qrcode-stream @decode="onDecode" @init="onInit" @detect="onDetect" />
        <div v-if="error" class="text-error mt-2">{{ error }}</div>

        <!-- 디버그 정보 -->
        <div v-if="debugInfo.length" class="mt-4">
          <h4 class="text-subtitle-2">🔍 디버그 정보:</h4>
          <ul class="text-body-2">
            <li v-for="(info, index) in debugInfo" :key="index">
              <strong>Raw Value:</strong> {{ info.rawValue }}<br />
              <strong>Bounding Box:</strong> {{ JSON.stringify(info.boundingBox) }}
            </li>
          </ul>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="secondary" text @click="dialog = false">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useRouter } from 'vue-router'

const dialog = ref(false)
const error = ref('')
const debugInfo = ref([])
const router = useRouter()

const onInit = (promise) => {
  promise.catch(err => {
    error.value = '카메라 접근 불가: ' + err.message
  })
}

const onDecode = (result) => {
  error.value = ''
  dialog.value = false
  alert(`QR 코드 내용: ${result}`)
  if (result.startsWith('http')) {
    window.location.href = result
  }
}

// rawValue에서 URL이 잘 읽혀온다면, 
// @detect 이벤트를 활용해 decode 실패 시에도 감지된 QR 코드를 처리할 수 있다는 뜻입니다.
// 이를 활용하면 @decode가 호출되지 않아도, 
// @detect의 rawValue를 통해 URL 등 유효한 정보를 수동으로 처리할 수 있습니다.

const onDetect = (detectedCodes) => {
  const validCode = detectedCodes.find(code => {
    const value = code.rawValue
    return value && value.startsWith('http')
  })

  if (validCode) {
    dialog.value = false
    window.location.href = validCode.rawValue
  } else {
    debugInfo.value = detectedCodes.map(code => ({
      rawValue: code.rawValue || '(없음)',
      boundingBox: code.boundingBox || null
    }))
  }
}

</script>

<style scoped>
qrcode-stream {
  width: 100%;
  aspect-ratio: 1/1;
}
</style>
