<!-- src/components/HourlySalesChart.vue -->
<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
// chart.js 플러그인 및 구성 요소 수동 등록
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler 
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  Filler 
);

const props = defineProps({
  labels: Array,
  totalAmounts: Array,
  orderCounts: Array,
});

const chartData = computed(() => ({
  labels: Array.isArray(props.labels) ? props.labels : [],
  datasets: [
    {
      label: "매출액 (원)",
      data: Array.isArray(props.totalAmounts) ? props.totalAmounts : [],
      borderColor: "#42a5f5",
      backgroundColor: "rgba(66,165,245,0.2)",
      yAxisID: "y",
      tension: 0.3,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    {
      label: "주문 건수",
      data: Array.isArray(props.orderCounts) ? props.orderCounts : [],
      borderColor: "#f44336",
      backgroundColor: "rgba(244,67,54,0.2)",
      yAxisID: "y1",
      tension: 0.3,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      ticks: {
        callback: (value) => `${value.toLocaleString()}원`,
      },
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: { drawOnChartArea: false },
      ticks: {
        callback: (value) => `${value}건`,
      },
    },
  },
};
</script>
