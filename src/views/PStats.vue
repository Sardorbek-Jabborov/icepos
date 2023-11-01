<template>
  <div class="container py-5">
    <div class="mt-5 flex gap-4">
      <datepicker v-model="state.from_date"></datepicker>
      <datepicker v-model="state.to_date"></datepicker>
      <VButton class="flex group items-center gap-2" @click="getStats()">
        <IconsFilter class="text-white group-hover:text-blue-300 w-4 h-4 duration-300"/>
        <span>Filter</span>
      </VButton>
      <VButton @click="showChart">
        ShowChart
      </VButton>
    </div>
    <VueApexCharts
        type="bar"
        height="400"
        :options="chartOptions"
        :series="chartSeries"
    ></VueApexCharts>
  </div>
</template>
<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import {useApi} from "@/helpers/axios";
import {computed, onMounted, reactive} from "vue";
import Datepicker from 'vuejs3-datepicker';
import VButton from "@/components/Button/VButton.vue";
import IconsFilter from "@/components/Icons/Filter.vue";

const stats = reactive({
  data: {
    results: []
  },
});

const state = reactive({
  from_date: new Date(2023, 8, 1),
  to_date: new Date(),
});

const chartSeries = computed(() => {
  const resultData = stats.data?.results;
  if (!Array.isArray(resultData)) {
    return [];
  }
  const data = resultData.map((item) => ({
    x: item.title,
    y: item.total_orders,
  }));

  return [
    {
      name: 'Total Orders', // Legend label (item title)
      data: data,
    },
  ];
});

const chartOptions = {
  chart: {
    type: "bar",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
    },
  },
  legend: {
    show: true, // Show the legend
    position: 'bottom', // Position the legend at the bottom
    horizontalAlign: 'center', // Center align the legend items
  },
  xaxis: {
    categories: stats.data?.results?.map((item) => item.title) || [],
  },
  yaxis: {
    labels: {
      show: true,
    },
  },

};

function showChart() {
}


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDates = () => {
  const fromDateFormatted = formatDate(state?.from_date);
  const toDateFormatted = formatDate(state?.to_date);
  return {fromDateFormatted, toDateFormatted}
};


const getStats = async () => {
  const date = formatDates()
  try {
    const response = await useApi.get(`/most-sold-products/?from_date=${date.fromDateFormatted}&to_date=${date.toDateFormatted}&products_count=10`);
    stats.data.results = response.results;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  getStats();
});
</script>
