<template>
  <div class="relative" @click="toggleSelect">
    <div class="border border-gray-600 rounded-md p-2 flex items-center" @click="openSelect">
      <div v-if="isOpen">
        <input
            v-model="searchTerm"
            @input="filterOptions"
            @blur="isOpen = false"
            class="rounded-md p-2 outline-0"
            placeholder="Qidirish..."
        />
        <div
            v-for="option in filteredOptions"
            :key="option.id"
            :value="option.id"
        >{{ option.fio }}
        </div>
      </div>
      <ArrowDown class="text-[#C4CDD5] w-6 h-6 rotate-90 ml-auto"/>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, defineProps, defineEmits, watch} from "vue";
import ArrowDown from "@/components/Icons/Arrow-down.vue";

const {modelValue, options} = defineProps(["modelValue", "options"]);

const selectedOption = ref(modelValue);
const searchTerm = ref("");
const isOpen = ref(false);

const emit = defineEmits();

const toggleSelect = () => {
  isOpen.value = true;
};

const filterOptions = () => {
  isOpen.value = true;
};

const filteredOptions = computed(() => {
  const lowerSearchTerm = searchTerm.value.toLowerCase();
  return options.filter((option) =>
      option.fio.toLowerCase().includes(lowerSearchTerm)
  );
});

watch(selectedOption, (newVal) => {
  if (newVal !== modelValue) {
    emit("update:modelValue", newVal);
  }
});
</script>