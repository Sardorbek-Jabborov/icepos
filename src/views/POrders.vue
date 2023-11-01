<template>
  <div class="container">
    <div>
      <div v-if="loading" class="absolute animate-ping top-1/3 left-1/2 bg-gray-800 rounded-full h-20 w-20"></div>
      <div class="mt-5 flex gap-4">
        <datepicker v-model="state.from_date"></datepicker>
        <datepicker v-model="state.to_date"></datepicker>
        <div class="flex flex-col gap-2">
          <select class="border border-gray-600 rounded- md p-2 h-[50px] rounded-md" v-model="status">
            <option selected value="">Tanlang:</option>
            <option value="in_process">Jarayonda</option>
            <option value="delivery">Yetkazib berish</option>
            <option value="completed">Yakunlandi</option>
            <option value="canceled">Bekor qilindi</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <select class="border border-gray-600 rounded- md p-2 h-[50px] rounded-md" v-model="consumer">
            <option selected value="">Tanlang:</option>
            <option v-for="consumer in consumers_list" :value="consumer.id">{{ consumer.fio }}</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <select class="border border-gray-600 rounded- md p-2 h-[50px] rounded-md" v-model="courier">
            <option selected value="">Tanlang:</option>
            <option v-for="courier in couriers_list" :value="courier.id">{{ courier.fio }}</option>
          </select>
        </div>
        <VButton class="flex group items-center gap-2" @click="fetchData()">
          <IconsFilter class="text-white group-hover:text-blue-300 w-4 h-4 duration-300"/>
          <span>Filter</span>
        </VButton>
      </div>
    </div>
    <Table class="pt-5" v-if="!loading">
      <template #thead>
        <td data-orded>#</td>
        <td class="">Mijoz</td>
        <td>Kuryer</td>
        <td>To'langan summa</td>
        <td>Umumiy summa</td>
        <td>Status</td>
        <td>Yaratilgan sana</td>
        <td>Optom sotish?</td>
        <td>Amallar</td>
      </template>
      <template #tbody v-if="!loading">
        <tr v-for="(sponsor, index) in sponsors.data" :key="index">
          <td class="px-6" scope="row">
            {{ calculateOrder(index) }}
          </td>
          <td class="!w-max " data-primary :title="sponsor?.full_name">
            <span class="line-clamp-2 font-medium text-15p">
              {{ sponsor?.consumer?.fio }} <p>{{ sponsor?.consumer?.phone_number }} </p>
            </span>
          </td>
          <td class="!w-max">
            <span class="line-clamp-2 font-medium text-15p">
              {{ sponsor?.courier?.fio }} <p>{{ sponsor?.courier?.phone_number }} </p>
            </span>
          </td>
          <td class="!w-max">{{ sponsor?.paid_price }}</td>
          <td class="!w-max">{{ sponsor?.total_price }}</td>
          <td class="!w-max">{{ sponsor?.status }}</td>
          <td class="!w-max">{{ sponsor?.created_at }}</td>
          <td class="!w-max" v-if="sponsor?.bulk_sell">Ha</td> 
          <td class="!w-max" v-if="!sponsor?.bulk_sell">Yo'q</td> 
          <td>
            <div class="flex items-center justify-center gap-2">
              <button class="text-xl text-primary" @click="order_action(sponsor, 'cancel')">
                <IconsClose class="text-[#B2B7C1] w-6 h-6 hover:text-red duration-300"/>
              </button>
              <button class="text-xl text-primary" @click="order_action(sponsor, 'complete')">
                <IconsAccept class="text-[#B2B7C1] w-5 h-5 hover:text-green-400 duration-300"/>
              </button>
              <button class="text-xl text-primary" @click="toggleModal(sponsor)">
                ↩️
              </button>
              <button class="text-xl text-primary" @click="get_chek(sponsor)">
                🔄
              </button>
            </div>
          </td>
        </tr>
      </template>
    </Table>
    <div class="" v-if="!loading">
      <div class="page-size flex items-center justify-between">
        <div>
          <label for="pageSize">Ko‘rsatish:</label>
          <select v-model="pageSize" id="pageSize" @change="updatePageSize" class="rounded-xl border">
            <option v-for="option in pageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <vue-awesome-paginate
            :total-items="sponsors.total"
            :items-per-page="pageSize"
            :max-pages-shown="3"
            v-model="currentPage"
        />
      </div>
    </div>
    <Transition name="fade">
      <div
          v-if="showModal"
          class="fixed top-0 left-0 w-full h-full z-50 bg-modal hidden opacity-0"
          :class="{ '!block opacity-100 overflow-hidden ': showModal }"
          @click="onClickOutside"
      >
        <ModalBulkSell
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 sm:max-w-[587px] w-[70%] sm:w-full modal-content"
            @close="toggleModal"
            @submitted="submitted"
            :show="showModal"
            :object="sponsor"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {useApi, baseURL} from "@/helpers/axios";
import {onMounted, ref, reactive, watch} from 'vue';
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import Table from '@/components/CTable.vue'
import ModalBulkSell from "@/components/Modal/BulkSell.vue"
import VButton from "@/components/Button/VButton.vue";
import IconsFilter from "@/components/Icons/Filter.vue";
import Datepicker from 'vuejs3-datepicker';
import {useToast} from "vue-toastification";
import IconsClose from "@/components/Icons/Close.vue";
import IconsAccept from "@/components/Icons/Accept.vue";

const toast = useToast()
const route = useRoute()
const router = useRouter()

const state = reactive({
  from_date: new Date(2023, 8, 1),
  to_date: new Date(),
});

const status = ref('')
const consumer = ref('')
const consumers_list = ref([])
const courier = ref('')
const couriers_list = ref([])
const loading = ref(false)
const pageSizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const pageSize = ref(10);
const currentPage = ref(1);
const search = ref('');

const showModal = ref(false)

const objects = reactive({
  data: [],
  total: 0,
});
const currentObject = ref({})

function onClickOutside(event) {
  const modalContent = document.querySelector('.modal-content');
  if (modalContent && !modalContent.contains(event.target)) {
    document.body.style.overflow = 'auto';
    showModal.value = false;
    currentObject.value = {}
  }
}

const toggleModal = (object) => {
  currentObject.value = object
  showModal.value = !showModal.value
}

const submitted = () => {
  toggleModal({})
  fetchData()
}
const sponsors = reactive({
  data: [],
  total: 0,
});

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDates = () => {
  const fromDateFormatted = formatDate(state?.from_date);
  const toDateFormatted = formatDate(state?.to_date);
  return {fromDateFormatted, toDateFormatted}
};


const order_action = async (order, action) => {
  try {
    const response = await useApi.post(`/orders/${order.id}/${action}/`);
    if (response.success) {
      fetchData()
      toast.success('Buyurtma muvaffaqiyatli o\'zgartirildi!')
    } else {
      toast.error('Buyurtma o\'zgartirishda xatolik yuz berdi!: ' + response)
    }
  } catch (error) {
    toast.error(error.response.data.error || error.response.data.detail)
  }
}


const fetchData = async () => {
  loading.value = true
  const date = formatDates()
  try {
    const response = await useApi.get(`/orders/?created_at__date__gte=${date.fromDateFormatted}&created_at__date__lte=${date.toDateFormatted}&status=${status.value}&search=${search.value}&consumer=${consumer.value}&courier=${courier.value}&page=${currentPage.value}&page_size=${pageSize.value}`)
    sponsors.data = response.results;
    sponsors.total = response.count;
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false
  }
}

const load_filter_data = async () => {
  consumer.value = route.query.consumer || ''
  courier.value = route.query.courier || ''

  try {
    const response = await useApi.get(`/consumers/?page_size=1000`)
    consumers_list.value = response.results;
  } catch (error) {
    console.error('Error fetching consumers:', error);
  }

  try {
    const response = await useApi.get(`/couriers/?page_size=1000`)
    couriers_list.value = response.results;
  } catch (error) {
    console.error('Error fetching courier:', error);
  }
}

onMounted(() => {
  load_filter_data();
  fetchData()
})


const get_chek = (order) => {
  var url = `${baseURL}/chek/${order.id}/`
  window.open(url, '_blank');
}

watch([pageSize, currentPage], () => {
  fetchData();
});


const calculateOrder = (index) => {
  return (currentPage.value - 1) * pageSize.value + index + 1;
};

const updatePageSize = () => {
  currentPage.value = 1;
  fetchData();
  const query = {...route.query, page_size: pageSize.value};
  router.push({query});
};


</script>

<style>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem;
  margin: 0 0.2rem;
  border: none;
  background-color: transparent;
  color: #000;
  cursor: pointer;
}

.pagination button.active {
  font-weight: bold;
}

.page-size {
  margin-bottom: 1rem;
}

.page-size label {
  margin-right: 0.5rem;
}

.page-size select {
  padding: 0.5rem;
}

.pagination-container {
  display: flex;
  column-gap: 10px;
}

.paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 10px;
  cursor: pointer;
  background-color: #FFFFFF;
  border: 1px solid rgb(217, 217, 217);
  color: black;
  transition: all 0.3s ease-in-out;
}

.paginate-buttons:hover {
  background-color: #d8d8d8;
}

.active-page {
  background-color: #3365FC;
  border: 1px solid #3498db;
  color: white;
  transition: all 0.3s ease-in-out;
}

.active-page:hover {
  background-color: #2988c8;
}
</style>
