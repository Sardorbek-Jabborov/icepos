<template>
  <div class="bg-red rounded-md py-5 px-2">
    <div class="flex justify-between">
      <pre>{{ sponsors?.data }}</pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useApi} from "@/helpers/axios";
import {reactive} from "vue";


const sponsors = reactive({
  data: [],
  total: 0,
});
const fetchData = async () => {
  try {
    const response = await useApi.get(`/orders/?search=${''}&page=${1}&page_size=${10}`);
    console.log(response.results)
    sponsors.data = response.results;
    sponsors.total = response.count;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}
fetchData()
</script>