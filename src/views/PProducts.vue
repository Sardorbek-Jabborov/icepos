<template>
  <div class="container">
    <div class="">
      <div v-if="loading" class="absolute animate-ping top-1/3 left-1/2 bg-gray-800 rounded-full h-20 w-20">
      </div>
      <div class="mt-5 flex justify-between">
        <div
            class="inline-flex gap-2 items-center bg-white py-2 px-3 rounded-xl border focus-within:border-gray-800 transition-all duration-300 ease-in-out">
          <IconsSearch class="w-5 h-5 text-[#B1B1B8]"/>
          <input type="text" class="bg-transparent outline-0" placeholder="Izlash..." @keyup="fetchData"
                 v-model="search">
        </div>
        <VButton class="flex group gap-2" @click="toggleModal({})">
          <IconsPlus class="w-6 h-6 text-white group-hover:text-blue-300 duration-300"/>
          <span>Qo'shish</span>
        </VButton>
      </div>
    </div>
    <Table class="pt-5" v-if="!loading">
      <template #thead>
        <td data-orded>#</td>
        <td class="w-1/4 !text-left">Nomi</td>
        <td>Karobka</td>
        <td>Narx</td>
        <td>Qoldiq</td>
        <td>Amallar</td>
      </template>
      <template #tbody v-if="!loading">
        <tr v-for="(object, index) in objects.data" :key="index">
          <td class="px-6" scope="row">
            {{ calculateOrder(index) }}
          </td>
          <td class="!text-left" data-primary :title="object?.title">
            <span class="line-clamp-2 font-medium text-15p">
              {{ object?.title }}
            </span>
          </td>
          <td class="!w-max">{{ object?.count_in_box }}</td>
          <td class="!w-max">{{ object?.price }}</td>
          <td class="!w-max">{{ object?.stock_quantity }}</td>

          <td>
            <button class="text-xl text-primary" @click="toggleModal(object)">
              <IconsEdit class="w-6 h-6 text-[#3365FC] hover:text-black-100 duration-300"/>
            </button>
          </td>
        </tr>
      </template>
    </Table>
    <Transition name="fade">
      <div
          v-if="showModal"
          class="fixed top-0 left-0 w-full h-full z-50 bg-modal hidden opacity-0"
          :class="{ '!block opacity-100 overflow-hidden ': showModal }"
          @click="onClickOutside"
      >
        <ModalProducts
            class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 sm:max-w-[587px] w-[70%] sm:w-full modal-content"
            @close="toggleModal"
            @submitted="submitted"
            :show="showModal"
            :object="currentObject"
        />
      </div>
    </Transition>
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
        <div>
          <vue-awesome-paginate
              :total-items="objects.total"
              :items-per-page="pageSize"
              :max-pages-shown="5"
              v-model="currentPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useApi} from "@/helpers/axios";
import {onMounted, ref, reactive, watch, computed} from 'vue';
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import Table from '@/components/CTable.vue'
import {useToast} from "vue-toastification"
import {useProductStore} from "@/stores/product";
import ModalProducts from "@/components/Modal/Products.vue"
import VButton from "@/components/Button/VButton.vue";
import IconsSearch from "@/components/Icons/Search.vue";
import IconsPlus from "@/components/Icons/Plus.vue";
import IconsEdit from "@/components/Icons/Edit.vue";
import UIPagination from "@/components/UIPagination.vue";
import {VueAwesomePaginate} from "vue-awesome-paginate";

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useProductStore()

const showModal = ref(false)
const loading = ref(false)
const pageSizeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const pageSize = ref(10);
const currentPage = ref(1);
const search = ref('');

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

const toggleModal = (object: any) => {
  currentObject.value = object
  showModal.value = !showModal.value
}

const submitted = () => {
  toggleModal()
  fetchData()
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await store.getProductAll(search.value, currentPage.value, pageSize.value)
    objects.data = response.results;
    objects.total = response.count;
  } catch (error) {
    toast.error("Error fetching objects")
    console.error('Error fetching objects:', error);
  } finally {
    loading.value = false
  }
}
onMounted(() => {
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
  // fetchData();
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