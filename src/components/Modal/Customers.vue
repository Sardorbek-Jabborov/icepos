<template>
  <div class="p-7 bg-white rounded-xl max-w-[586px]">
    <div class="flex justify-between pb-7 border-b border-gray-100">
      <p class="text-2xl font-bold text-blue-700">{{ props.consumer?.id ? "Tahrirlash" : "Qo'shish" }}</p>
      <button @click='close'>
        <IconsClose class="text-[#B2B7C1] w-6 h-6 hover:text-red duration-300"/>
      </button>
    </div>
    <form @submit.prevent="submitForm">
      <div class="md:mt-5 sm:mt-4 mt-2 flex flex-col md:gap-6 sm:gap-4 gap-2">
        <Input
            label="F.I.Sh. (Familiya Ism Sharifingiz)"
            placeholder="Ism ..."
            type="text"
            :error="$v.fio.$error"
            v-model="form.fio"
            required
        />
        <Input
            label="Telefon raqami"
            type="phone"
            placeholder=""
            v-model="form.phone_number"
            v-maska="'## ### ## ##'"
            :error="$v.phone_number.$error"
        >+998</Input>
        <Input
            label="Qo'shimcha telefon raqami"
            type="phone"
            placeholder=""
            v-model="form.phone_number2"
            v-maska="'## ### ## ##'"
            :error="$v.phone_number2.$error"
        >+998</Input
        >
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

const props = defineProps<Props>()

interface Props {
  show: boolean
  consumer: any
}

interface IContactForm {
  fio?: string
  phone_number?: string
  phone_number2?: string
}

const form = reactive<IContactForm>({
  fio: props.consumer?.fio,
  phone_number: props.consumer?.phone_number?.slice(4, 13),
  phone_number2: props.consumer?.phone_number2?.slice(4, 13),
})


const rules = {
  phone_number: {
    required,
  },
  fio: {
    required,
  },
  phone_number2: {
  },
}

const $v = useVuelidate<IContactForm>(rules, form)
const emit = defineEmits(['open', 'close'])
const submitForm = async () => {
  $v.value.$touch()
  if ($v.value.$invalid) {
    console.log($v.value.$error)
  } else {
    const url = props.consumer?.id ? `/consumers/${props.consumer.id}/` : '/consumers/'
    const method = props.consumer?.id ? 'put' : 'post'
    const data = {
      fio: form.fio,
      phone_number: `+998${form.phone_number}`,
      phone_number2: `+998${form.phone_number2}`,
    }
    const response = await useApi[method](url, data)
    props.consumer.value = response
  }
  emit('close')
  // window.location.reload()
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
