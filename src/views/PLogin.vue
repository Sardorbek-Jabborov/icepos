<template>
  <div class="container flex flex-col h-full items-center justify-center pt-[80px]">
    <div class="max-w-[400px]">
      <img src="/logo1.svg" alt="">
    </div>
    <form @submit.prevent="onSubmit" class="p-8 bg-white rounded-xl w-[315px] mt-2">
      <p class="font-bold text-blue-300 text-2xl">Kirish</p>

      <p class="text-red" v-if="error?.show">{{ error?.message }}</p>
      <div class="mt-11"
           :class="{'!mt-2': error?.show}"
      >
        <div class="flex flex-col">
          <label for="login" class="uppercase font-bold text-xs mb-2">Login</label>
          <input
              v-model="login"
              name="login"
              type="text"
              minlength="5"
              required
              placeholder="admin"
              class="bg-gray-200/20 text-[15px] rounded-md border-2 border-blue-400 outline-0 p-2 ring-0 focus:border-blue-300 duration-300"
              :class="{'border-[red]' :error?.show}"
          />
        </div>
        <div class="flex flex-col mt-4">
          <label for="password" class="uppercase font-bold text-xs mb-2">Parol</label>
          <div
              class="flex justify-between items-center bg-gray-200/20 rounded-md border-2 border-blue-400 p-2 max-h-[42px] focus-within:border-blue-300 duration-300"
              :class="{'border-[red]' :error?.show}"
          >
            <input
                name="password"
                id="password"
                type="password"
                v-model="password"
                ref="inputPass"
                placeholder="********"
                minlength="8"
                required
                class="password-input text-[15px] w-full !bg-transparent outline-0"
            />
            <div class="hover:cursor-pointer" v-if="password" @click="togglePassword">
              <div v-if="!isVisible" class="flex">
                <i class="icon icon-eye text-2xl text-black"></i>
              </div>
              <div v-else class="flex">
                <i class="icon icon-eye-closed text-2xl text-black"></i>
              </div>
            </div>
          </div>
        </div>
        <VButton
            @click="submit()"
            class="w-full flex items-center justify-center hover:cursor-pointer h-[50px] mt-5"
        >
          <template #default>
            <div v-if="loading" class="spinner py-3"></div>
          </template>
          <template #label>
            {{ loading ? '' : 'Kirish' }}
          </template>
        </VButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import VButton from "@/components/Button/VButton.vue";
import {reactive, ref} from 'vue';
import {useRouter} from "vue-router";
import {useApi} from '@/helpers/axios';
import {getItem, setItem} from "@/service/localstorage";
import {useUserStore} from "@/stores/user";
import {useToast} from "vue-toastification";
import {useAuthStore} from '@/stores/authStore';

const store = useAuthStore();

const router = useRouter()
const user = useUserStore()
const toast = useToast()


const inputPass = ref();
const loading = ref(false);
const login = ref('');
const password = ref('');
const isVisible = ref(false);
const error = reactive({
  show: false,
  message: ''
});


async function submit() {
  if (login.value && password.value) {
    loading.value = true
    try {
      const response = await useApi.post(`/token/`, {
        username: login.value,
        password: password.value
      });
      store.login({
        accessToken: response.access,
        refreshToken: response.refresh,
        username: login.value
      })
      await router.push('/customers')
      toast.success("Tizimga kirdingiz!")
    } catch (error) {
      toast.error("Login yoki parol xato!")
      console.error('Error fetching sponsors:', error);
    }
    window.location.reload()
    router.push('/')
    loading.value = false
  }
}


// async function onSubmit() {
//   if (recaptchaToken.value !== '') {
//     error.show = false;
//     loading.value = true;
//     try {
//       const res: any = await useApi.post('/auth/login/', {
//         username: login.value,
//         password: password.value
//       });
//       store.login({
//         accessToken: res.access,
//         refreshToken: res.refresh
//       });
//       window.location.reload();
//     } catch (err: any) {
//       error.show = true;
//       error.message = err?.response?.data?.detail;
//     } finally {
//       loading.value = false;
//     }
//   }
// }


function togglePassword() {
  isVisible.value = !isVisible.value;
  const inputType = inputPass.value?.type;
  const changer: any = {
    password: 'text',
    text: 'password'
  };
  if (inputType) {
    inputPass.value.type = changer[inputType];
  }
}

</script>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
  -webkit-text-fill-color: #000 !important;
}

.spinner {
  position: absolute;
  backdrop-filter: blur(10px);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(farthest-side, #1f203b 94%, #0000) top/3.8px 3.8px no-repeat,
  conic-gradient(#0000 30%, #0d0d1a);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 3.8px), #000 0);
  animation: spinner-c7wet2 0.6s infinite linear;
}

@keyframes spinner-c7wet2 {
  100% {
    transform: rotate(1turn);
  }
}

.disabled {
  border: 1px solid transparent;
  cursor: not-allowed;
  background-color: #555555;
  color: white;
}
</style>
