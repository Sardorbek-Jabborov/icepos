<template>
  <div class="bg-gray-700  w-1/20" :class="{'!w-1/5 !p-5': sidebar}">
    <div class="" v-if="sidebar">
      <div class="mb-10 flex justify-between">
        <img src="/logo.svg" alt="logo" class="w-[150px]">
        <button @click="toggleSidebar" class="group">
          <IconsDoubleArrow
              class="h-6 w-6 text-[#000000] group-hover:text-[#3699ff] duration-300 transition-all ease-in-out"/>
        </button>
      </div>
      <div class="flex flex-col">
        <CommonTab
            class="mt-5 border-b border-white w-2/3 hover:w-full transition-all duration-300 ease-in-out text-white hover:text-blue-300"
            v-for="tab in tabs" :tab="tab" :key="tab"/>
      </div>
    </div>
    <div v-else>
      <button @click="toggleSidebar" class="rotate-180 h-[100vh] hovered p-5 flex flex-col-reverse group">
        <IconsDoubleArrow
            class="h-6 w-6 text-[#000000] group-hover:text-[#3699ff] duration-300 transition-all ease-in-out"/>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import CommonTab from "@/components/Common/Tab.vue";
import IconsDoubleArrow from "@/components/Icons/DoubleArrow.vue";
import {ref} from "vue";

const tabs = [
  {
    tab: 'Mijozlar',
    url: '/customers'
  },
  {
    tab: 'Kuryerlar',
    url: '/couriers'
  },
  {
    tab: 'Mahsulotlar',
    url: '/products'
  },
  {
    tab: 'Buyurtma yaratish',
    url: '/create'
  },
  {
    tab: 'Buyurtmalar',
    url: '/orders'
  },
  {
    tab: 'Statistika',
    url: '/stats'
  },
  {
    tab: 'Kirim',
    url: '/debts'
  },
  {
    tab: 'Statistika-Test',
    url: '/statistics'
  }
]

const sidebar = ref(true)

const toggleSidebar = () => {
  sidebar.value = !sidebar.value
}
</script>

<style scoped>
.hovered:hover path {
  transition: 0.3s all ease-in-out;
  fill: #3699ff;
}
</style>