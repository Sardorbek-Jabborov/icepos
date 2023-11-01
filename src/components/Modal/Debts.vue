<template>
  <div class="p-7 bg-white rounded-xl max-w-[586px]">
    <div class="flex justify-between pb-7 border-b border-gray-100">
      <p class="text-2xl font-bold text-blue-700">{{ props.consumer?.fio }} |  "Qo'shish"</p>
      <button @click='close'>
        <IconsClose class="text-[#B2B7C1] w-6 h-6 hover:text-red duration-300"/>
      </button>
    </div>
    <form @submit.prevent="submitForm">
      <div class="md:mt-5 sm:mt-4 mt-2 flex flex-col md:gap-6 sm:gap-4 gap-2">
        <Input
            label="Summa"
            type="number"
            :error="$v.price.$error"
            v-model="form.price"
        />
      </div>
      <div class="mt-3 flex justify-end">
        <VButton class="flex gap-2 group">
          <IconsSave class="w-6 h-6 text-[white] group-hover:text-blue-300 duration-300"/>
          Saqlash
        </VButton>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import {useApi} from "@/helpers/axios";
import {useVuelidate} from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {onBeforeUnmount, reactive, ref, watch} from 'vue'
import VButton from "@/components/Button/VButton.vue";
import Input from "@/components/Input/Input.vue";
import IconsClose from "@/components/Icons/Close.vue"
import IconsSave from "@/components/Icons/Save.vue";
import {useToast} from "vue-toastification";
const toast = useToast()
const props = defineProps<Props>()

interface Props {
  show: boolean
  consumer: any
}

interface IContactForm {
  price?: number
}

const form = reactive<IContactForm>({
  price: 0
})

const rules = {
  price: {
    required,
  },
}

const $v = useVuelidate<IContactForm>(rules, form)
const emit = defineEmits(['open', 'close', 'submitted2'])
const submitForm = async () => {
  $v.value.$touch()
  if ($v.value.$invalid) {
  } else {
    const url = `/debts/`
    const method = 'post'
    let data = {
      price: form.price,
      consumer: props.consumer.id,
    }
    const response = await useApi[method](url, data)
    props.consumer.value = response
    toast.success('Muvaffaqiyatli qo\'shildi')
    emit('submitted2')
  }
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
