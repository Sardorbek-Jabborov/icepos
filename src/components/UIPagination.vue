<template>
  <div
      class="grid md:grid-cols-1-2max max-w-[1200px] mx-auto md:grid-rows-1 grid-cols-1-max grid-rows-2 justify-between text-black font-rubik text-15 items-center mt-6 gap-4"
  >
    <div class="flex items-center gap-3 col-start-2 row-start-1">
      <label for="p_show">Ko'rsatish</label>
      <select id="p_show" v-model="size" class="ui-input h-8 rounded-xl border" @change="setSize">
        <option :value="i * 10" v-for="i in 10" :key="i">{{ i * 10 }}</option>
      </select>
    </div>

    <div
        class="flex gap-2 row-start-2 col-start-1 col-span-2 justify-center md:row-start-1 md:col-start-3"
    >
      <button
          @click="setPage('prev')"
          :disabled="page === 1"
          :class="page === 1 ? 'disabled !bg-gray-blue !text-dark-silver' : ''"
          class="ui-input pagination__item middle w-8 h-8 flex items-center justify-center"
      >
        <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M7.87762 1.12747C8.03371 1.28355 8.03385 1.53658 7.87793 1.69284L3.86207 5.71747C3.70628 5.87361 3.70628 6.1264 3.86207 6.28253L7.87793 10.3072C8.03385 10.4634 8.03371 10.7164 7.87762 10.8725L7.033 11.7172C6.87679 11.8734 6.62352 11.8734 6.46731 11.7172L1.033 6.28284C0.876789 6.12663 0.87679 5.87337 1.033 5.71716L6.46731 0.282842C6.62352 0.126632 6.87679 0.126633 7.033 0.282843L7.87762 1.12747Z"
              fill="#979797"
          />
        </svg>
      </button>
      <button
          v-for="p in pages - 2 > page ? 2 : 4"
          :key="p"
          @click="setPage(page + p - 1)"
          :class="page + p - 1 === page ? 'active' : ''"
          class="ui-input pagination__item middle"
      >
        {{ page + p - 1 }}
      </button>
      <div v-if="pages - 2 > page" class="ui-input pagination__item middle">...</div>
      <button
          v-if="pages - 2 > page"
          @click="setPage(pages)"
          :class="pages === page ? 'active' : ''"
          class="ui-input pagination__item middle"
      >
        {{ pages }}
      </button>
      <button
          @click="setPage('next')"
          :disabled="page === pages"
          :class="page === pages ? 'disabled !bg-gray-blue !text-dark-silver' : ''"
          class="ui-input pagination__item middle flex items-center justify-center"
      >
        <svg
            width="8"
            height="12"
            viewBox="0 0 8 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M0.122378 1.12747C-0.0337111 1.28355 -0.0338491 1.53658 0.12207 1.69284L4.13793 5.71747C4.29372 5.87361 4.29372 6.1264 4.13793 6.28253L0.12207 10.3072C-0.0338493 10.4634 -0.0337111 10.7164 0.122378 10.8725L0.967001 11.7172C1.12321 11.8734 1.37648 11.8734 1.53269 11.7172L6.967 6.28284C7.12321 6.12663 7.12321 5.87337 6.967 5.71716L1.53269 0.282842C1.37648 0.126632 1.12321 0.126633 0.967001 0.282843L0.122378 1.12747Z"
              fill="#C4CDD5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from '@vue/reactivity'
import {computed} from '@vue/runtime-core'
import {useRoute, useRouter} from 'vue-router'

const props = defineProps<{ total: number }>()
const route = useRoute()
const router = useRouter()

const size = ref(+route.query.size! || 10)
const page = ref(+route.query.page! || 1)

const setSize = () => {
  router.push({...route, query: {...route.query, size: size.value}})
}

const setPage = (p: number | 'next' | 'prev') => {
  if (typeof p === 'number') page.value = p
  if (p === 'prev') page.value--
  if (p === 'next') page.value++
  router.push({...route, query: {...route.query, page: page.value}})
}

const pages = computed(() => {
  return Math.ceil(props.total / size.value)
})
</script>

<style scoped>
.pagination__item {
  @apply w-8 h-8 font-medium text-sm transition-colors duration-100;
}

.pagination__item:hover,
.pagination__item.active {
}
</style>