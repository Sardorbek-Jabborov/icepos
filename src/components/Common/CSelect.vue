<template>
  <div class="relative">
    <div class="border border-gray-600 rounded-md">
      <div @click="toggleSelect" class="flex justify-between p-2 pb-1 w-full">
        <div class="flex gap-2">
          <div v-if="selectedOption">
            {{ selectedOption.fio }}
          </div>
          <input v-model="searchTerm" @input="filterOptions" class="w-full outline-0" placeholder="Qidirish..."/>
        </div>
        <ArrowDown class="text-[#C4CDD5] w-6 h-6 rotate-90 ml-auto"/>
      </div>
      <div v-if="isOpen" class="p-2 pt-1 border-t border-gray-700">
        <div
            v-for="option in filteredOptions"
            :key="option.id"
            class="hover:cursor-pointer border-b last:border-0 border-gray-300 py-1"
            @click="selectOption(option)"
            :class="{ 'selected-option': option?.id === selectedOption?.id }"
        >
          {{ option.fio }}
        </div>
      </div>
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
  isOpen.value = !isOpen.value; // Toggle the isOpen value
};

const filterOptions = () => {
  isOpen.value = true;
  filteredOptions.value = options.filter((option) =>
      option.fio.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
};

const closeSelect = () => {
  isOpen.value = false;
};

const selectOption = (option) => {
  searchTerm.value = ''
  selectedOption.value = option;
  isOpen.value = false;
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

<style scoped>
.selected-option {
  background-color: #f0f0f0; /* Highlight selected option */
}
</style>