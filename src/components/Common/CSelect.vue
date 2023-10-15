<template>
  <div class="relative" @click="toggleSelect">
    <div class="border border-gray-600 rounded-md p-2 flex items-center">
      <div>
        <input
            v-model="searchTerm"
            @input="filterOptions"
            @blur="closeSelect"
            class="rounded-md outline-0"
            placeholder="Qidirish..."
        />
        <div v-if="isOpen">
          <div
              v-for="option in filteredOptions"
              :key="option?.id"
              @click="selectOption(option)"
              :class="{ 'selected-option': option?.id === selectedOption?.id }"
          >
            {{ option.fio }}
          </div>
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
  isOpen.value = !isOpen.value; // Toggle the isOpen value
};

const filterOptions = () => {
  isOpen.value = true;
};

const closeSelect = () => {
  isOpen.value = false;
};

const selectOption = (option) => {
  selectedOption.value = option;
  isOpen.value = false; // Close the select
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