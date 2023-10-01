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
            <option v-for="consumer in consumers_list"  :value="consumer.id">{{ consumer.fio }}</option>
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
        <td class="!text-left">Mijoz</td>
        <td>Tel. raqami</td>
        <td>Kuryer</td>
        <td>Tel. raqami</td>
        <td>To'langan summa</td>
        <td>Umumiy summa</td>
        <td>Status</td>
        <td>Yaratilgan sana</td>
        <td>Amallar</td>
      </template>
      <template #tbody v-if="!loading">
        <tr v-for="(sponsor, index) in sponsors.data" :key="index">
          <td class="px-6" scope="row">
            {{ calculateOrder(index) }}
          </td>
          <td class="!text-left " data-primary :title="sponsor?.full_name">
            <span class="line-clamp-2 font-medium text-15p">
              {{ sponsor?.consumer?.fio }}
            </span>
          </td>
          <td class="!w-max">{{ sponsor?.consumer?.phone_number }}</td>
          <td class="!w-max">{{ sponsor?.courier?.fio }}</td>
          <td class="!w-max">{{ sponsor?.courier?.phone_number }}</td>
          <td class="!w-max">{{ sponsor?.paid_price }}</td>
          <td class="!w-max">{{ sponsor?.total_price }}</td>
          <td class="!w-max">{{ sponsor?.status }}</td>
          <td class="!w-max">{{ sponsor?.created_at }}</td>
          <td>
            <button class="text-xl text-primary" @click="order_action(sponsor, 'cancel')">
              <i class="fas fa-edit">A</i>
            </button>

            <button class="text-xl text-primary" @click="order_action(sponsor, 'complete')">
              <i class="fas fa-edit">B</i>
            </button>
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
  </div>
</template>

<script setup>
import {useApi} from "@/helpers/axios";
import {onMounted, ref, reactive, watch} from 'vue';
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import Table from '@/components/CTable.vue'
import VButton from "@/components/Button/VButton.vue";
import IconsFilter from "@/components/Icons/Filter.vue";
import Datepicker from 'vuejs3-datepicker';
import {useToast} from "vue-toastification";

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
const loading = ref(false)
const pageSizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const pageSize = ref(10);
const currentPage = ref(1);
const search = ref('');

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
  const response = await useApi.post(`/orders/${order.id}/${action}/`);
  if (response.success) {
    fetchData()
    toast.success('Buyurtma muvaffaqiyatli o\'zgartirildi!')
  } else {
    console.log(response)
    toast.error('Buyurtma o\'zgartirishda xatolik yuz berdi!: ' + response)
  }
}


const fetchData = async () => {
  loading.value = true
  const date = formatDates()
  try {
    console.log(consumer)
    const response = await useApi.get(`/orders/?created_at__date__gte=${date.fromDateFormatted}&created_at__date__lte=${date.toDateFormatted}&status=${status.value}&search=${search.value}&consumer=${consumer.value}&page=${currentPage.value}&page_size=${pageSize.value}`)
    sponsors.data = response.results;
    sponsors.total = response.count;
    console.log(sponsors.data)
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false
  }
}

const load_filter_data = async () => {
  consumer.value = route.query.consumer || ''
  console.log(consumer.value)
  try {
    const response = await useApi.get(`/consumers/`)
    consumers_list.value = response.results;
  } catch (error) {
    console.error('Error fetching consumers:', error);
  }
}

onMounted(() => {
  load_filter_data();
  fetchData()
})



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
