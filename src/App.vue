<template>
  <RouterView v-slot=" {Component}">
    <Component :is="detectLayout">
      <Component :is="Component"/>
    </Component>
  </RouterView>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import LError from "@/layout/LError.vue";
import {computed, onMounted} from "vue";
import LAuth from "@/layout/LAuth.vue";
import LDefault from "@/layout/LDefault.vue";
import {useApi} from "@/helpers/axios";
import useAuthStore from "@/stores/authStore";

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const layouts: { [key: string]: any } = {
  default: LDefault,
  auth: LAuth,
  error: LError
}

const detectLayout = computed(() => {
  return layouts[route.meta.layout as string]
})

onMounted(() => {
  if (auth.isAuthenticated) {
    useApi.get('/user-detail/')
        .then((res) => {
        })
        .catch((error) => {
          auth.logOut()
        })
  }
})

</script>