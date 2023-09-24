<template>
  <router-link :to="tab.url" class="py-3">
    {{ tab.tab }}
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  tab: {
    tab: string,
    url: string
  }
}

defineProps<Props>()
</script>