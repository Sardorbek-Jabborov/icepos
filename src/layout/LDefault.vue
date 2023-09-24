<template>
  <div class="flex w-full h-full min-h-[100vh] static">
    <SideBar class=""/>
    <div class="w-full">
      <Header/>
      <slot>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import SideBar from "@/components/Section/SideBar.vue";
import Header from "@/components/Layout/Header.vue";
</script>