<template>
  <div class="flex flex-col gap-2">
    <label class="font-medium leading-130 text-[#596066]">{{ label }}</label>
    <div
        :class="(inputClass, error ? '!border-red' : '')"
        class="bg-[#F9FAFF] rounded-lg transition transition-300 flex sm:p-3 p-1.5 h-full border border-transparent focus-within:border-gray-600"
    >
      <img class="mr-2" :src="src" alt="" v-if="src"/>
      <span
          class="text-sm mr-1 text-black-100 leading-130 font-normal flex items-center shrink-0"
      >
        <slot/>
      </span>
      <input
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :type="type"
          class="outline-0 text-sm text-black-100 leading-130 bg-[#F9FAFF] w-full caret-gray placeholder:text-sm"
          :maxlength="maxlength"
          :placeholder="placeholder"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  label: string
  placeholder: string
  src: string
  type: string
  maxlength: number
  modelValue: any
  error: boolean
  inputClass: string
}

defineProps<Props>()
</script>
