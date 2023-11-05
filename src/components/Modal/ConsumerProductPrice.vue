<template>
  <div class="p-7 bg-white rounded-xl max-w-[586px]">
    <div class="flex justify-between pb-7 border-b border-gray-100">
      <p class="text-2xl font-bold text-blue-700"> Naxsulot narxlari </p>
      <button @click='close'>
        <IconsClose class="text-[#B2B7C1] w-6 h-6 hover:text-red duration-300"/>
      </button>
    </div>
    <form @submit.prevent="submitForm">
      <div class="md:mt-5 sm:mt-4 mt-2 flex flex-col md:gap-6 sm:gap-4 gap-2" style="max-height: 500px; overflow-y: scroll !important;">
        <Input 
            v-for="(product, index) in props.object.product_prices"
            :label="product.title"
            placeholder="Narx"
            type="number"
            v-model="product.price"
        />
      </div>
      <div class="mt-3 flex justify-end">
        <ButtonVButton class="flex gap-2 group">
          <IconsSave class="w-6 h-6 text-[white] group-hover:text-blue-300 duration-300"/>
          Saqlash
        </ButtonVButton>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import {useApi} from "@/helpers/axios";
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'

import {onBeforeUnmount, reactive, ref, watch} from 'vue'
import ButtonVButton from "@/components/Button/VButton.vue";
import Input from "@/components/Input/Input.vue";
import IconsSave from "@/components/Icons/Save.vue";
import IconsClose from "@/components/Icons/Close.vue";
import {useToast} from "vue-toastification";
const toast = useToast()
const props = defineProps<Props>()

interface Props {
  show: boolean
  object: any
}


const emit = defineEmits(['open', 'close', 'submitted3'])
const submitForm = async () => {
    const url = `/cp-price-update/${props.object.id}/`
    const method = 'post'
    let data = {
      "data": props.object.product_prices
    }
    console.log(data)
    const response = await useApi[method](url, data)
    toast.success('Muvaffaqiyatli saqlandi')
    emit('submitted3')
}


function close() {
  emit('close')
  document.body.style.overflow = 'auto'
}

const watchShow = () => {
  const body = document.body;

  if (body) {
    if (props.show) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }
};

const stopWatchingShow = watch(() => props.show, watchShow, {immediate: true});

onBeforeUnmount(() => {
  stopWatchingShow();
});
</script>

<style>
input {
  transition: 300ms ease-in-out;
}

input:focus::selection {
  background-color: #3490dc; /* Background color */
  color: white; /* Text color */
}

/* Style the caret when the input is focused and the cursor is at the beginning */
input:focus::selection,
input:focus::selection {
  background-color: #3490dc; /* Background color */
  color: white; /* Text color */
}
</style>
