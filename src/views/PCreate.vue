<template>
  <div class="container flex gap-5 py-5">
    <div class="basis-2/3 bg-white rounded-xl p-4">
      <Input placeholder="Izlash..." type="text" @input="fetchData" v-model="search"/>
      <div class="mt-3 flex justify-between border-b last:border-b-0 border-gray-600 pb-1"
           v-for="product in products.data"
           :key="product.id">
        <div>
          <p>Nomi: <span class="font-bold">{{ product?.title }}</span></p>
          <p>Qutidagi miqdori: <span class="font-bold">{{ product?.count_in_box }} dona</span></p>
          <p>Skladdagi soni: <span class="font-bold">{{ product?.stock_quantity }} dona</span></p>
        </div>
        <div class="flex flex-col gap-2">
          <p>Narxi: <span class="font-bold">{{ product?.price }} UZS</span></p>
          <VButton class="py-1" @click="addToBasket(product)">
            Savatga qo'shish
          </VButton>
        </div>
      </div>
    </div>
    <div class="basis-1/3 bg-white rounded-xl p-4">
      <div v-if="!checkAvailable">
        <h3 class="text-2xl text-black-100 font-medium">Savatcha</h3>
        <div v-if="basket.basket.products.length > 0" class="mt-2">
          <p>Savatchadagi mahsulotlar soni: <span class="text-lg font-bold">{{ basket.basket?.products?.length }}</span>
          </p>
          <div class="flex items-center gap-2 mt-2">
            <p>Savatchani tozalash</p>
            <button @click="clearBasket">
              <IconsClear class="w-6 h-6 text-[#3366FF]"/>
            </button>
          </div>
          <!-- Item -->
          <div
              class="mt-3 flex justify-between border-b border-gray-600 pb-1"
              v-for="basketItem in basket.basket.products"
              :key="basketItem?.id"
          >
            <div class="w-full">
              <p>Nomi: <span class="font-bold">{{ basketItem?.product?.title }}</span></p>
              <p>Qutidagi miqdori: <span class="font-bold">{{ basketItem?.product?.count_in_box }} dona</span></p>
              <p>Narxi: <span class="font-bold">{{ basketItem?.product.price }} UZS</span></p>
              <p>Savatdagi miqdori: <span class="font-bold">{{ basketItem?.quantity }} dona</span></p>
              <div class="flex items-center gap-5 p-2 w-auto">
                <div class="rounded-lg border border-gray-700 flex gap-2 w-auto">
                  <button @click="basketItem.quantity > 1 ? basketItem.quantity-- : null"
                          class="px-4 py-2 bg-gray-200 rounded-l-lg border-r border-gray-700">-
                  </button>
                  <input type="number" v-model="basketItem.quantity" @input="updateQuantity(basketItem)"
                         class="outline-0 max-w-[50px]"
                         min="0" max="99999">
                  <button @click="basketItem.quantity++"
                          class="px-4 py-2 bg-gray-200 rounded-r-lg border-l border-gray-700">+
                  </button>
                </div>
                <button @click="deleteItem(basketItem.product.id)">
                  <IconsBasket class="w-6 h-6 text-[#FF4945]"/>
                </button>
              </div>
            </div>
          </div>
          <div class="py-2 border-b border-gray-700">
            Umumiy narxi: {{ totalPrice }} UZS
          </div>
          <div class="flex flex-col gap-2">
            <label for="customers">Mijoz:</label>
            <CSelect :options="consumers?.data" v-model="selectedConsumer"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="couriers">Kuryer:</label>
            <CSelect :options="couriers?.data" v-model="selectedCourier"/>
          </div>
          <div class="flex gap-3 mt-5">
            <label for="full_paid">To'liq to'landi?</label>
            <input type="checkbox" name="full_paid" v-model="fullPaid"/>
          </div>
          <div class="w-auto" v-if="!fullPaid">
            <label for="price_paid">To'langan summa:</label>
            <div class="bg-gray-200 p-3 rounded-md w-auto">
              <input type="number" name="price_paid" class="outline-0 bg-transparent" v-model="paidPrice">
              <span>UZS</span>
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-5">
            <VButton class="py-1" @click="createOrder">
              Buyurtma yaratish
            </VButton>
          </div>
        </div>
        <div v-else>
          <p>Savatchada hech narsa yo'q.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useApi} from "@/helpers/axios";
import {computed, onMounted, reactive, ref} from 'vue';
import VButton from "@/components/Button/VButton.vue";
import {useProductStore} from "@/stores/product";
import {useBasketStore} from "@/stores/basket";
import {useToast} from "vue-toastification";
import Input from "@/components/Input/Input.vue";
import IconsBasket from "@/components/Icons/Basket.vue"
import IconsClear from "@/components/Icons/Clear.vue"
import CSelect from "@/components/Common/CSelect.vue";

const store = useProductStore()
const basket = useBasketStore()
const toast = useToast()

const consumers = reactive({"data": []})
const couriers = reactive({"data": []})

const check = ref()

const products = reactive({
  "data": []
})
const search = ref('')
const selectedConsumer = ref()
const selectedCourier = ref()
const paidPrice = ref(0)
const fullPaid = ref(false)
const checkAvailable = ref(false)


const fetchData = async () => {
  try {
    const response = await store.getProductAll(search.value, 1, 5)
    products.data = response.results;
  } catch (error) {
    toast.error("Error fetching objects")
    console.error('Error fetching objects:', error);
  }
}

const updateQuantity = (item: any) => {
  let newValue = Math.max(0, parseInt(item.quantity, 10) || 0);
  item.quantity = newValue.toString().slice(0, 5);
  for (let i = 0; i < basket.basket.productId.length; i++) {
    if (basket.basket.productId[i].product === item.product.id) {
      basket.basket.productId[i].quantity = newValue;
    }
  }
};

const createOrder = async () => {
  let products = []
  for (let i = 0; i < basket.basket.products.length; i++) {
    products.push({
      "product": basket.basket.products[i].product.id,
      "quantity": basket.basket.products[i].quantity
    })
  }
  console.log(products)
  check.value = await basket.createOrder(selectedCourier.value, selectedConsumer.value, products, fullPaid.value, paidPrice.value)
  checkAvailable.value = true
  console.log(check.value)
}

async function load_page() {
  try {
    const response = await useApi.get('/consumers/?page_size=1000');
    consumers.data = response.results;
  } catch (error) {
    console.log(error)
    console.error('Error fetching objects:', error);
  }

  try {
    const response = await useApi.get('/couriers/?page_size=1000');
    couriers.data = response.results;
  } catch (error) {
    console.error('Error fetching objects:', error);
  }
}

const clearBasket = () => {
  basket.basket.products = []
}

const deleteItem = (id: number) => {
  basket.removeItem(id)
};

const totalPrice = computed(() => {
  return basket.basket.products.reduce((total, basketItem) => {
    return total + (basketItem.product.price * basketItem.quantity);
  }, 0);
});
const addToBasket = (item) => {
  basket.addToBasket(item);
};

onMounted(() => {
  load_page()
  fetchData()
})
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>