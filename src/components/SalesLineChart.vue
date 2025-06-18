<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js'

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  Filler
)

const props = defineProps({
  labels: { type: Array, required: true },   // 날짜 혹은 기간 라벨
  sales: { type: Array, required: true },    // 매출 데이터
  labelText: { type: String, default: '매출' } // 차트 상단 라벨
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.labelText,
      data: props.sales,
      borderColor: '#42a5f5',
      backgroundColor: 'rgba(66,165,245,0.2)',
      tension: 0.3,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 7
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false }
  },
  scales: {
    y: {
      ticks: {
        callback: value => `${value.toLocaleString()}원`
      }
    }
  }
}
</script>
